const SESSION_COOKIE = 'rtd_session';
const encoder = new TextEncoder();

const json = (data, status = 200, headers = {}) => new Response(JSON.stringify(data), {
  status,
  headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...headers }
});

const hex = bytes => Array.from(new Uint8Array(bytes), value => value.toString(16).padStart(2, '0')).join('');
const randomToken = (size = 32) => hex(crypto.getRandomValues(new Uint8Array(size)));
const sha256 = async value => hex(await crypto.subtle.digest('SHA-256', encoder.encode(value)));
const passwordHash = async (password, salt) => {
  const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
  return hex(await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: encoder.encode(salt), iterations: 100000, hash: 'SHA-256' }, key, 256));
};
const clean = (value, max) => String(value || '').trim().slice(0, max);
const parseCookies = request => Object.fromEntries((request.headers.get('cookie') || '').split(';').map(v => v.trim()).filter(Boolean).map(v => { const at = v.indexOf('='); return [decodeURIComponent(v.slice(0, at)), decodeURIComponent(v.slice(at + 1))]; }));
const sessionCookie = (token, maxAge = 60 * 60 * 24 * 7) => `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAge}`;
const clearSessionCookie = () => `${SESSION_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`;
const body = async request => {
  const type = request.headers.get('content-type') || '';
  if (!type.includes('application/json')) throw new Error('Formato della richiesta non valido.');
  return request.json();
};
const mutationAllowed = request => {
  const origin = request.headers.get('origin');
  return !origin || origin === new URL(request.url).origin;
};
const visitorHash = async (request, env, scope = '') => {
  const ip = request.headers.get('cf-connecting-ip') || 'unknown';
  const ua = request.headers.get('user-agent') || 'unknown';
  const salt = env.ANALYTICS_SALT || 'retro-di-testa';
  return sha256(`${salt}|${scope}|${ip}|${ua}`);
};
const countryName = request => {
  const code = request.cf?.country || 'XX';
  const names = { IT: 'Italia', DE: 'Germania', FR: 'Francia', AT: 'Austria', CH: 'Svizzera', ES: 'Spagna', NL: 'Paesi Bassi', BE: 'Belgio' };
  return names[code] || (code === 'XX' ? 'Non disponibile' : code);
};

async function getSession(request, env) {
  const token = parseCookies(request)[SESSION_COOKIE];
  if (!token) return null;
  const tokenHash = await sha256(token);
  const session = await env.DB.prepare(`
    SELECT s.token_hash, s.csrf_token, s.expires_at,
           u.id, u.name, u.email, u.username, u.role, u.active, u.must_change
      FROM sessions s JOIN users u ON u.id = s.user_id
     WHERE s.token_hash = ? AND s.expires_at > CURRENT_TIMESTAMP AND u.active = 1
  `).bind(tokenHash).first();
  return session || null;
}

async function requireSession(request, env, roles) {
  const session = await getSession(request, env);
  if (!session) return { error: json({ error: 'Accesso richiesto.' }, 401) };
  const pathname = new URL(request.url).pathname;
  if (session.must_change && !['/api/auth/change-password', '/api/auth/logout'].includes(pathname)) {
    return { error: json({ error: 'Prima cambia la password provvisoria.' }, 403) };
  }
  if (roles && !roles.includes(session.role)) return { error: json({ error: 'Permesso non disponibile.' }, 403) };
  if (!['GET', 'HEAD'].includes(request.method)) {
    const csrf = request.headers.get('x-csrf-token');
    if (!csrf || csrf !== session.csrf_token) return { error: json({ error: 'Verifica della sessione non valida.' }, 403) };
  }
  return { session };
}

const userPublic = row => ({ id: row.id, name: row.name, email: row.email, username: row.username, role: row.role, active: Boolean(row.active), mustChange: Boolean(row.must_change) });

async function login(request, env) {
  if (!mutationAllowed(request)) return json({ error: 'Origine della richiesta non valida.' }, 403);
  const data = await body(request);
  const username = clean(data.username, 60);
  const password = String(data.password || '');
  const user = await env.DB.prepare('SELECT * FROM users WHERE username = ? AND active = 1').bind(username).first();
  if (!user || await passwordHash(password, user.password_salt) !== user.password_hash) return json({ error: 'Nome utente o password non corretti.' }, 401);
  const token = randomToken(32), tokenHash = await sha256(token), csrf = randomToken(24);
  await env.DB.prepare("DELETE FROM sessions WHERE expires_at <= CURRENT_TIMESTAMP").run();
  await env.DB.prepare("INSERT INTO sessions (token_hash,user_id,csrf_token,expires_at) VALUES (?,?,?,datetime('now','+7 days'))").bind(tokenHash, user.id, csrf).run();
  return json({ user: userPublic(user), csrf }, 200, { 'set-cookie': sessionCookie(token) });
}

async function logout(request, env) {
  const auth = await requireSession(request, env); if (auth.error) return auth.error;
  if (!mutationAllowed(request)) return json({ error: 'Origine della richiesta non valida.' }, 403);
  const token = parseCookies(request)[SESSION_COOKIE];
  if (token) await env.DB.prepare('DELETE FROM sessions WHERE token_hash = ?').bind(await sha256(token)).run();
  return json({ ok: true }, 200, { 'set-cookie': clearSessionCookie() });
}

async function changeOwnerPassword(request, env) {
  const auth = await requireSession(request, env, ['owner']); if (auth.error) return auth.error;
  const data = await body(request), current = String(data.currentPassword || ''), next = String(data.newPassword || '');
  if (next.length < 12) return json({ error: 'La nuova password deve contenere almeno 12 caratteri.' }, 400);
  const user = await env.DB.prepare('SELECT * FROM users WHERE id = ?').bind(auth.session.id).first();
  if (await passwordHash(current, user.password_salt) !== user.password_hash) return json({ error: 'La password attuale non è corretta.' }, 400);
  const salt = randomToken(24), hash = await passwordHash(next, salt);
  await env.DB.prepare("UPDATE users SET password_salt=?,password_hash=?,must_change=0,updated_at=CURRENT_TIMESTAMP WHERE id=?").bind(salt, hash, user.id).run();
  return json({ ok: true });
}

async function requestReset(request, env) {
  if (!mutationAllowed(request)) return json({ ok: true });
  const data = await body(request), lookup = clean(data.account, 160).toLowerCase();
  const user = await env.DB.prepare('SELECT * FROM users WHERE (lower(username)=? OR lower(email)=?) AND active=1').bind(lookup, lookup).first();
  if (user?.role === 'owner') {
    if (!env.MAILER || !env.MAILER_TOKEN) return json({ error: 'Il recupero tramite email non è ancora configurato.' }, 503);
    const token = randomToken(32), tokenHash = await sha256(token);
    await env.DB.prepare("INSERT INTO password_resets (token_hash,user_id,expires_at) VALUES (?,?,datetime('now','+30 minutes'))").bind(tokenHash, user.id).run();
    const base = new URL(request.url).origin;
    const link = `${base}/staff/?reset=${encodeURIComponent(token)}`;
    const mailResponse = await env.MAILER.fetch('https://mailer.internal/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.MAILER_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        to: user.email,
        subject: 'Recupero accesso — Retro di testa',
        text: `Apri questo collegamento entro 30 minuti per scegliere una nuova password: ${link}`,
        html: `<p>Apri questo collegamento entro 30 minuti per scegliere una nuova password:</p><p><a href="${link}">${link}</a></p>`
      })
    });
    if (!mailResponse.ok) throw new Error(`Invio email non riuscito: ${mailResponse.status}`);
  }
  return json({ ok: true });
}

async function completeReset(request, env) {
  if (!mutationAllowed(request)) return json({ error: 'Richiesta non valida.' }, 403);
  const data = await body(request), token = String(data.token || ''), next = String(data.newPassword || '');
  if (next.length < 12) return json({ error: 'La nuova password deve contenere almeno 12 caratteri.' }, 400);
  const tokenHash = await sha256(token);
  const reset = await env.DB.prepare("SELECT * FROM password_resets WHERE token_hash=? AND used_at IS NULL AND expires_at>CURRENT_TIMESTAMP").bind(tokenHash).first();
  if (!reset) return json({ error: 'Collegamento scaduto o non valido.' }, 400);
  const salt = randomToken(24), hash = await passwordHash(next, salt);
  await env.DB.batch([
    env.DB.prepare("UPDATE users SET password_salt=?,password_hash=?,must_change=0,updated_at=CURRENT_TIMESTAMP WHERE id=?").bind(salt, hash, reset.user_id),
    env.DB.prepare("UPDATE password_resets SET used_at=CURRENT_TIMESTAMP WHERE token_hash=?").bind(tokenHash),
    env.DB.prepare('DELETE FROM sessions WHERE user_id=?').bind(reset.user_id)
  ]);
  return json({ ok: true });
}

async function staffList(request, env) {
  const auth = await requireSession(request, env, ['owner']); if (auth.error) return auth.error;
  const result = await env.DB.prepare('SELECT id,name,email,username,role,active,must_change,created_at FROM users ORDER BY CASE role WHEN \'owner\' THEN 0 WHEN \'admin\' THEN 1 ELSE 2 END,name').all();
  return json({ users: result.results.map(userPublic) });
}

async function createStaff(request, env) {
  const auth = await requireSession(request, env, ['owner']); if (auth.error) return auth.error;
  const data = await body(request), name = clean(data.name, 100), email = clean(data.email, 160).toLowerCase(), username = clean(data.username, 60), role = data.role;
  if (!name || !email || !username || !['admin', 'moderator'].includes(role)) return json({ error: 'Dati dell’account incompleti.' }, 400);
  const password = randomToken(10) + '!Aa', salt = randomToken(24), hash = await passwordHash(password, salt), id = crypto.randomUUID();
  try { await env.DB.prepare('INSERT INTO users (id,name,email,username,role,password_salt,password_hash,active,must_change) VALUES (?,?,?,?,?,?,?,1,0)').bind(id, name, email, username, role, salt, hash).run(); }
  catch { return json({ error: 'Email o nome utente già utilizzati.' }, 409); }
  return json({ user: { id, name, email, username, role, active: true }, temporaryPassword: password }, 201);
}

async function updateStaff(request, env, id) {
  const auth = await requireSession(request, env, ['owner']); if (auth.error) return auth.error;
  const target = await env.DB.prepare('SELECT * FROM users WHERE id=?').bind(id).first();
  if (!target) return json({ error: 'Account non trovato.' }, 404);
  const data = await body(request), action = data.action;
  if (action === 'update') {
    const role = target.role === 'owner' ? 'owner' : data.role;
    if (!['owner', 'admin', 'moderator'].includes(role)) return json({ error: 'Ruolo non valido.' }, 400);
    await env.DB.prepare('UPDATE users SET name=?,email=?,username=?,role=?,updated_at=CURRENT_TIMESTAMP WHERE id=?').bind(clean(data.name,100), clean(data.email,160).toLowerCase(), clean(data.username,60), role, id).run();
  } else if (action === 'toggle' && target.role !== 'owner') {
    await env.DB.prepare('UPDATE users SET active=CASE active WHEN 1 THEN 0 ELSE 1 END,updated_at=CURRENT_TIMESTAMP WHERE id=?').bind(id).run();
    await env.DB.prepare('DELETE FROM sessions WHERE user_id=?').bind(id).run();
  } else if (action === 'password' && target.role !== 'owner') {
    const next = String(data.newPassword || ''); if (next.length < 12) return json({ error: 'La password deve contenere almeno 12 caratteri.' }, 400);
    const salt = randomToken(24), hash = await passwordHash(next, salt);
    await env.DB.prepare('UPDATE users SET password_salt=?,password_hash=?,updated_at=CURRENT_TIMESTAMP WHERE id=?').bind(salt, hash, id).run();
    await env.DB.prepare('DELETE FROM sessions WHERE user_id=?').bind(id).run();
  } else return json({ error: 'Operazione non disponibile.' }, 400);
  return json({ ok: true });
}

async function deleteStaff(request, env, id) {
  const auth = await requireSession(request, env, ['owner']); if (auth.error) return auth.error;
  const target = await env.DB.prepare('SELECT role FROM users WHERE id=?').bind(id).first();
  if (!target || target.role === 'owner') return json({ error: 'Questo account non può essere cancellato.' }, 400);
  await env.DB.prepare('DELETE FROM users WHERE id=?').bind(id).run();
  return json({ ok: true });
}

async function publicComments(request, env) {
  const url = new URL(request.url), contentId = clean(url.searchParams.get('contentId'), 140), hash = await visitorHash(request, env, 'comment-reaction');
  const result = await env.DB.prepare("SELECT c.id,c.author,c.body,c.country,c.featured,c.likes,c.dislikes,c.created_at,COALESCE(r.value,0) mine FROM comments c LEFT JOIN comment_reactions r ON r.comment_id=c.id AND r.visitor_hash=? WHERE c.content_id=? AND c.status='published' ORDER BY c.featured DESC,c.created_at DESC LIMIT 100").bind(hash,contentId).all();
  return json({ comments: result.results });
}

async function createComment(request, env) {
  if (!mutationAllowed(request)) return json({ error: 'Origine non valida.' }, 403);
  const data = await body(request), contentId = clean(data.contentId, 140), title = clean(data.contentTitle, 180), type = data.contentType === 'Progetto' ? 'Progetto' : 'Articolo', author = clean(data.author, 60), message = clean(data.body, 1500);
  if (!contentId || !title || author.length < 2 || message.length < 3) return json({ error: 'Compila nome e commento.' }, 400);
  if (data.website) return json({ ok: true }, 201);
  if (env.TURNSTILE_SECRET) {
    const verify = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method:'POST', body:new URLSearchParams({ secret:env.TURNSTILE_SECRET, response:String(data.turnstileToken||''), remoteip:request.headers.get('cf-connecting-ip')||'' }) });
    const verdict = await verify.json(); if (!verdict.success) return json({ error: 'Verifica antispam non riuscita.' }, 400);
  }
  const hash = await visitorHash(request, env, 'comment');
  const recent = await env.DB.prepare("SELECT COUNT(*) count FROM comments WHERE visitor_hash=? AND created_at>datetime('now','-1 minute')").bind(hash).first();
  if (recent.count > 0) return json({ error: 'Attendi un minuto prima di inviare un altro commento.' }, 429);
  const id = crypto.randomUUID();
  await env.DB.prepare('INSERT INTO comments (id,content_id,content_title,content_type,author,body,country,visitor_hash) VALUES (?,?,?,?,?,?,?,?)').bind(id, contentId, title, type, author, message, countryName(request), hash).run();
  return json({ ok: true, id }, 201);
}

async function staffComments(request, env) {
  const auth = await requireSession(request, env, ['owner','admin','moderator']); if (auth.error) return auth.error;
  const status = new URL(request.url).searchParams.get('status') === 'trash' ? 'trash' : 'published';
  const result = await env.DB.prepare('SELECT * FROM comments WHERE status=? ORDER BY created_at DESC LIMIT 500').bind(status).all();
  return json({ comments: result.results });
}

async function updateComment(request, env, id) {
  const auth = await requireSession(request, env, ['owner','admin','moderator']); if (auth.error) return auth.error;
  const data = await body(request), action = data.action;
  const sql = action === 'delete' ? "UPDATE comments SET status='trash',updated_at=CURRENT_TIMESTAMP WHERE id=?" : action === 'restore' ? "UPDATE comments SET status='published',updated_at=CURRENT_TIMESTAMP WHERE id=?" : action === 'feature' ? "UPDATE comments SET featured=CASE featured WHEN 1 THEN 0 ELSE 1 END,updated_at=CURRENT_TIMESTAMP WHERE id=?" : null;
  if (!sql) return json({ error: 'Operazione non valida.' }, 400);
  await env.DB.prepare(sql).bind(id).run(); return json({ ok: true });
}

async function recordStat(request, env) {
  if (!mutationAllowed(request)) return json({ ok: true });
  const data = await body(request), contentId = clean(data.contentId,140), title = clean(data.contentTitle,180), type = data.contentType === 'Progetto' ? 'Progetto' : 'Articolo', event = data.event;
  if (!contentId || !['view','completion'].includes(event)) return json({ error: 'Evento non valido.' }, 400);
  const now = new Date(), day = now.toISOString().slice(0,10), hour = now.toISOString().slice(0,13) + ':00:00', hash = await visitorHash(request, env, day), hourlyHash = await visitorHash(request, env, hour), country = countryName(request);
  if (event === 'view') {
    await env.DB.prepare("DELETE FROM daily_visitors WHERE day<date('now','-31 days')").run();
    const inserted = await env.DB.prepare('INSERT OR IGNORE INTO daily_visitors (content_id,day,visitor_hash) VALUES (?,?,?)').bind(contentId,day,hash).run();
    const hourlyInserted = await env.DB.prepare('INSERT OR IGNORE INTO hourly_visitors (content_id,hour,visitor_hash) VALUES (?,?,?)').bind(contentId,hour,hourlyHash).run();
    const visitor = inserted.meta.changes ? 1 : 0;
    const hourlyVisitor = hourlyInserted.meta.changes ? 1 : 0;
    await env.DB.batch([
      env.DB.prepare('INSERT INTO content_stats (content_id,content_title,content_type,day,views,visitors) VALUES (?,?,?,?,1,?) ON CONFLICT(content_id,day) DO UPDATE SET views=views+1,visitors=visitors+excluded.visitors,content_title=excluded.content_title').bind(contentId,title,type,day,visitor),
      env.DB.prepare('INSERT INTO country_stats (country,day,views) VALUES (?,?,1) ON CONFLICT(country,day) DO UPDATE SET views=views+1').bind(country,day),
      env.DB.prepare('INSERT INTO hourly_stats (content_id,content_title,content_type,hour,country,views,visitors) VALUES (?,?,?,?,?,1,?) ON CONFLICT(content_id,hour,country) DO UPDATE SET views=views+1,visitors=visitors+excluded.visitors,content_title=excluded.content_title').bind(contentId,title,type,hour,country,hourlyVisitor),
      env.DB.prepare("DELETE FROM hourly_visitors WHERE hour<datetime('now','-31 days')")
    ]);
  } else {
    const percent = Math.max(0,Math.min(100,Number(data.percent)||0));
    await env.DB.prepare('INSERT INTO content_stats (content_id,content_title,content_type,day,completion_sum,completion_count) VALUES (?,?,?,?,?,1) ON CONFLICT(content_id,day) DO UPDATE SET completion_sum=completion_sum+excluded.completion_sum,completion_count=completion_count+1').bind(contentId,title,type,day,percent).run();
  }
  return json({ ok: true });
}

async function statsSummary(request, env) {
  const auth = await requireSession(request, env, ['owner','admin']); if (auth.error) return auth.error;
  const requested = Number(new URL(request.url).searchParams.get('days')) || 30;
  const days = [7,30,90,365].includes(requested) ? requested : 30;
  const since = `-${days - 1} days`, chartSince = `-${Math.min(days, 30) - 1} days`;
  const totals = await env.DB.prepare("SELECT COALESCE(SUM(views),0) views,COALESCE(SUM(visitors),0) visitors,CASE WHEN SUM(completion_count)>0 THEN ROUND(1.0*SUM(completion_sum)/SUM(completion_count)) ELSE 0 END completion FROM content_stats WHERE day>=date('now',?)").bind(since).first();
  const daily = await env.DB.prepare("SELECT day,SUM(views) views,SUM(visitors) visitors FROM content_stats WHERE day>=date('now',?) GROUP BY day ORDER BY day").bind(chartSince).all();
  const content = await env.DB.prepare("SELECT content_id,MAX(content_title) title,MAX(content_type) type,SUM(views) views,SUM(visitors) visitors,CASE WHEN SUM(completion_count)>0 THEN ROUND(1.0*SUM(completion_sum)/SUM(completion_count)) ELSE 0 END completion FROM content_stats WHERE day>=date('now',?) GROUP BY content_id ORDER BY views DESC").bind(since).all();
  const countries = await env.DB.prepare("SELECT country,SUM(views) views FROM country_stats WHERE day>=date('now',?) GROUP BY country ORDER BY views DESC").bind(since).all();
  const published = await env.DB.prepare("SELECT COUNT(*) count FROM comments WHERE status='published'").first();
  const reactions = await env.DB.prepare("SELECT COALESCE(SUM(CASE WHEN value=1 THEN 1 ELSE 0 END),0) likes,COALESCE(SUM(CASE WHEN value=-1 THEN 1 ELSE 0 END),0) dislikes FROM reactions").first();
  const timeline = await env.DB.prepare("SELECT hour,MAX(content_title) title,MAX(content_type) type,country,SUM(views) views,SUM(visitors) visitors FROM hourly_stats WHERE hour>=datetime('now',?) GROUP BY hour,content_id,country ORDER BY hour DESC LIMIT 500").bind(since).all();
  return json({ days, totals, daily:daily.results, content:content.results, countries:countries.results, comments:published.count, reactions, timeline:timeline.results });
}

async function reaction(request, env) {
  const url = new URL(request.url), contentId = clean(url.searchParams.get('contentId'),140), hash = await visitorHash(request,env,'reaction');
  if (request.method === 'GET') {
    const mine = await env.DB.prepare('SELECT value FROM reactions WHERE content_id=? AND visitor_hash=?').bind(contentId,hash).first();
    const totals = await env.DB.prepare('SELECT SUM(CASE WHEN value=1 THEN 1 ELSE 0 END) likes,SUM(CASE WHEN value=-1 THEN 1 ELSE 0 END) dislikes FROM reactions WHERE content_id=?').bind(contentId).first();
    return json({ mine:mine?.value||0,likes:totals.likes||0,dislikes:totals.dislikes||0 });
  }
  if (!mutationAllowed(request)) return json({ error:'Origine non valida.' },403);
  const data=await body(request),value=[-1,0,1].includes(Number(data.value))?Number(data.value):0;
  if(value===0)await env.DB.prepare('DELETE FROM reactions WHERE content_id=? AND visitor_hash=?').bind(contentId,hash).run();
  else await env.DB.prepare('INSERT INTO reactions (content_id,visitor_hash,value) VALUES (?,?,?) ON CONFLICT(content_id,visitor_hash) DO UPDATE SET value=excluded.value,updated_at=CURRENT_TIMESTAMP').bind(contentId,hash,value).run();
  const totals = await env.DB.prepare('SELECT SUM(CASE WHEN value=1 THEN 1 ELSE 0 END) likes,SUM(CASE WHEN value=-1 THEN 1 ELSE 0 END) dislikes FROM reactions WHERE content_id=?').bind(contentId).first();
  return json({ mine:value,likes:totals.likes||0,dislikes:totals.dislikes||0 });
}

async function commentReaction(request, env, id) {
  if (!mutationAllowed(request)) return json({ error:'Origine non valida.' },403);
  const exists = await env.DB.prepare("SELECT id FROM comments WHERE id=? AND status='published'").bind(id).first();
  if (!exists) return json({ error:'Commento non trovato.' },404);
  const data=await body(request), value=[-1,0,1].includes(Number(data.value))?Number(data.value):0, hash=await visitorHash(request,env,'comment-reaction');
  if(value===0) await env.DB.prepare('DELETE FROM comment_reactions WHERE comment_id=? AND visitor_hash=?').bind(id,hash).run();
  else await env.DB.prepare('INSERT INTO comment_reactions (comment_id,visitor_hash,value) VALUES (?,?,?) ON CONFLICT(comment_id,visitor_hash) DO UPDATE SET value=excluded.value,updated_at=CURRENT_TIMESTAMP').bind(id,hash,value).run();
  const totals=await env.DB.prepare('SELECT SUM(CASE WHEN value=1 THEN 1 ELSE 0 END) likes,SUM(CASE WHEN value=-1 THEN 1 ELSE 0 END) dislikes FROM comment_reactions WHERE comment_id=?').bind(id).first();
  await env.DB.prepare('UPDATE comments SET likes=?,dislikes=?,updated_at=CURRENT_TIMESTAMP WHERE id=?').bind(totals.likes||0,totals.dislikes||0,id).run();
  return json({mine:value,likes:totals.likes||0,dislikes:totals.dislikes||0});
}

export async function onRequest(context) {
  const { request, env, params } = context;
  if (!env.DB) return json({ error: 'Database non configurato.' }, 503);
  const path = Array.isArray(params.path) ? params.path.join('/') : String(params.path || '');
  try {
    if (path === 'health' && request.method === 'GET') return json({ ok:true });
    if (path === 'auth/login' && request.method === 'POST') return login(request,env);
    if (path === 'auth/logout' && request.method === 'POST') return logout(request,env);
    if (path === 'auth/me' && request.method === 'GET') { const session=await getSession(request,env); return session?json({user:userPublic(session),csrf:session.csrf_token}):json({error:'Accesso richiesto.'},401); }
    if (path === 'auth/change-password' && request.method === 'POST') return changeOwnerPassword(request,env);
    if (path === 'auth/reset-request' && request.method === 'POST') return requestReset(request,env);
    if (path === 'auth/reset' && request.method === 'POST') return completeReset(request,env);
    if (path === 'staff' && request.method === 'GET') return staffList(request,env);
    if (path === 'staff' && request.method === 'POST') return createStaff(request,env);
    if (path.startsWith('staff/') && request.method === 'PATCH') return updateStaff(request,env,path.slice(6));
    if (path.startsWith('staff/') && request.method === 'DELETE') return deleteStaff(request,env,path.slice(6));
    if (path === 'comments' && request.method === 'GET') return publicComments(request,env);
    if (path === 'comments' && request.method === 'POST') return createComment(request,env);
    if (path === 'staff-comments' && request.method === 'GET') return staffComments(request,env);
    if (path.startsWith('comments/') && path.endsWith('/reaction') && request.method === 'POST') return commentReaction(request,env,path.slice(9,-9));
    if (path.startsWith('comments/') && request.method === 'PATCH') return updateComment(request,env,path.slice(9));
    if (path === 'stats' && request.method === 'POST') return recordStat(request,env);
    if (path === 'stats/summary' && request.method === 'GET') return statsSummary(request,env);
    if (path === 'reactions' && ['GET','POST'].includes(request.method)) return reaction(request,env);
    return json({ error:'Percorso non trovato.' },404);
  } catch (error) {
    console.error(error);
    return json({ error:'Operazione non riuscita.' },500);
  }
}
