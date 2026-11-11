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
const validPassword = value => String(value || '').length >= 14 && /[a-z]/.test(value) && /[A-Z]/.test(value) && /\d/.test(value) && /[^A-Za-z0-9]/.test(value);
const parseCookies = request => Object.fromEntries((request.headers.get('cookie') || '').split(';').map(v => v.trim()).filter(Boolean).map(v => { const at = v.indexOf('='); return [decodeURIComponent(v.slice(0, at)), decodeURIComponent(v.slice(at + 1))]; }));
const sessionCookie = (token, maxAge = 60 * 60 * 24 * 7) => `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAge}`;
const clearSessionCookie = () => `${SESSION_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`;
const body = async request => {
  const type = request.headers.get('content-type') || '';
  if (!type.includes('application/json')) throw new Error('Formato della richiesta non valido.');
  if (Number(request.headers.get('content-length') || 0) > 1024 * 1024) throw new Error('Richiesta troppo grande.');
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

const base32Alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
const base32Encode = bytes => {
  let bits = 0, value = 0, output = '';
  for (const byte of bytes) {
    value = (value << 8) | byte; bits += 8;
    while (bits >= 5) { output += base32Alphabet[(value >>> (bits - 5)) & 31]; bits -= 5; }
  }
  if (bits > 0) output += base32Alphabet[(value << (5 - bits)) & 31];
  return output;
};
const base32Decode = input => {
  let bits = 0, value = 0; const bytes = [];
  for (const char of String(input || '').toUpperCase().replace(/=|\s/g, '')) {
    const index = base32Alphabet.indexOf(char); if (index < 0) continue;
    value = (value << 5) | index; bits += 5;
    if (bits >= 8) { bytes.push((value >>> (bits - 8)) & 255); bits -= 8; }
  }
  return new Uint8Array(bytes);
};
const totpCode = async (secret, counter) => {
  const key = await crypto.subtle.importKey('raw', base32Decode(secret), { name:'HMAC', hash:'SHA-1' }, false, ['sign']);
  const data = new ArrayBuffer(8), view = new DataView(data); view.setUint32(4, counter, false);
  const signature = new Uint8Array(await crypto.subtle.sign('HMAC', key, data));
  const offset = signature[signature.length - 1] & 15;
  const number = ((signature[offset] & 127) << 24 | signature[offset + 1] << 16 | signature[offset + 2] << 8 | signature[offset + 3]) % 1000000;
  return String(number).padStart(6, '0');
};
const verifyTotp = async (secret, code) => {
  if (!/^\d{6}$/.test(String(code || ''))) return false;
  const counter = Math.floor(Date.now() / 30000);
  for (const delta of [-1,0,1]) if (await totpCode(secret, counter + delta) === String(code)) return true;
  return false;
};
const normalizeRecoveryCode = value => String(value || '').toUpperCase().replace(/[^A-Z0-9]/g,'');
const consumeRecoveryCode = async (env,userId,value) => {
  const normalized=normalizeRecoveryCode(value); if(normalized.length!==12)return false;
  const hash=await sha256(normalized),row=await env.DB.prepare('SELECT code_hash FROM recovery_codes WHERE code_hash=? AND user_id=? AND used_at IS NULL').bind(hash,userId).first();
  if(!row)return false;
  await env.DB.prepare('UPDATE recovery_codes SET used_at=CURRENT_TIMESTAMP WHERE code_hash=?').bind(hash).run();
  return true;
};
const requestIpHash = async (request, env) => sha256(`${env.ANALYTICS_SALT || 'retro-di-testa'}|security|${request.headers.get('cf-connecting-ip') || 'unknown'}`);
const securityEvent = async (env, request, userId, eventType, detail = '') => {
  await env.DB.prepare('INSERT INTO security_events (id,user_id,event_type,detail,ip_hash) VALUES (?,?,?,?,?)').bind(crypto.randomUUID(), userId || null, eventType, clean(detail,500), await requestIpHash(request,env)).run();
};
const notifyOwner = async (env, subject, text) => {
  if (!env.MAILER || !env.MAILER_TOKEN) return;
  const owner = await env.DB.prepare("SELECT email FROM users WHERE role='owner' AND active=1 LIMIT 1").first();
  if (!owner?.email) return;
  await env.MAILER.fetch('https://mailer.internal/send',{method:'POST',headers:{'Authorization':`Bearer ${env.MAILER_TOKEN}`,'Content-Type':'application/json'},body:JSON.stringify({to:owner.email,subject,text,html:`<p>${text.replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]))}</p>`})});
};
const recentAuth = session => session.reauth_until && new Date(`${session.reauth_until}Z`).getTime() > Date.now();
const requireRecentAuth = session => recentAuth(session) ? null : json({ error:'Per questa operazione conferma nuovamente password e secondo fattore.', reauthRequired:true },403);

async function getSession(request, env) {
  const token = parseCookies(request)[SESSION_COOKIE];
  if (!token) return null;
  const tokenHash = await sha256(token);
  const session = await env.DB.prepare(`
    SELECT s.token_hash, s.csrf_token, s.expires_at,
           s.reauth_until, s.last_seen_at, s.user_agent, s.ip_hash,
           u.id, u.name, u.email, u.username, u.role, u.active, u.must_change, u.totp_enabled
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

const userPublic = row => ({ id: row.id, name: row.name, email: row.email, username: row.username, role: row.role, active: Boolean(row.active), mustChange: Boolean(row.must_change), totpEnabled:Boolean(row.totp_enabled) });

async function login(request, env) {
  if (!mutationAllowed(request)) return json({ error: 'Origine della richiesta non valida.' }, 403);
  const data = await body(request);
  const username = clean(data.username, 60);
  const password = String(data.password || '');
  const attemptKey = await sha256(`${await requestIpHash(request,env)}|${username.toLowerCase()}`);
  await env.DB.prepare("DELETE FROM login_attempts WHERE created_at<datetime('now','-1 day')").run();
  const attempts = await env.DB.prepare("SELECT COUNT(*) count FROM login_attempts WHERE attempt_key=? AND created_at>datetime('now','-30 minutes')").bind(attemptKey).first();
  if (Number(attempts?.count || 0) >= 5) return json({ error:'Troppi tentativi. Riprova tra 30 minuti.' },429);
  const user = await env.DB.prepare('SELECT * FROM users WHERE username = ? AND active = 1').bind(username).first();
  if (!user || await passwordHash(password, user.password_salt) !== user.password_hash) {
    await env.DB.prepare('INSERT INTO login_attempts (attempt_key) VALUES (?)').bind(attemptKey).run();
    await securityEvent(env,request,user?.id,'login_failed',username);
    return json({ error: 'Nome utente o password non corretti.' }, 401);
  }
  if (user.totp_enabled && !await verifyTotp(user.totp_secret,data.totp) && !await consumeRecoveryCode(env,user.id,data.totp)) {
    if (!data.totp) return json({ requiresTotp:true, error:'Inserisci il codice di sicurezza a 6 cifre.' },202);
    await env.DB.prepare('INSERT INTO login_attempts (attempt_key) VALUES (?)').bind(attemptKey).run();
    await securityEvent(env,request,user.id,'totp_failed');
    return json({ requiresTotp:true, error:'Codice di sicurezza non corretto.' },401);
  }
  const token = randomToken(32), tokenHash = await sha256(token), csrf = randomToken(24);
  await env.DB.prepare("DELETE FROM sessions WHERE expires_at <= CURRENT_TIMESTAMP").run();
  await env.DB.prepare('DELETE FROM login_attempts WHERE attempt_key=?').bind(attemptKey).run();
  await env.DB.prepare("INSERT INTO sessions (token_hash,user_id,csrf_token,expires_at,reauth_until,user_agent,ip_hash) VALUES (?,?,?,datetime('now','+7 days'),datetime('now','+10 minutes'),?,?)").bind(tokenHash, user.id, csrf, clean(request.headers.get('user-agent'),300), await requestIpHash(request,env)).run();
  await securityEvent(env,request,user.id,'login_success');
  await notifyOwner(env,'Nuovo accesso — Retro di testa',`È stato eseguito un nuovo accesso all’area Staff per l’account ${user.username}. Se non sei stato tu, cambia subito la password e chiudi le sessioni attive.`).catch(()=>{});
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
  const auth = await requireSession(request, env, ['owner','admin','moderator']); if (auth.error) return auth.error;
  const data = await body(request), current = String(data.currentPassword || ''), next = String(data.newPassword || '');
  if (!validPassword(next)) return json({ error: 'Usa almeno 14 caratteri con maiuscola, minuscola, numero e simbolo.' }, 400);
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
  if (!validPassword(next)) return json({ error: 'Usa almeno 14 caratteri con maiuscola, minuscola, numero e simbolo.' }, 400);
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

async function reauthenticate(request, env) {
  const auth = await requireSession(request,env,['owner','admin','moderator']); if (auth.error) return auth.error;
  const data = await body(request), password = String(data.password || '');
  const user = await env.DB.prepare('SELECT * FROM users WHERE id=?').bind(auth.session.id).first();
  if (!user || await passwordHash(password,user.password_salt) !== user.password_hash) return json({ error:'Password non corretta.' },401);
  if (user.totp_enabled && !await verifyTotp(user.totp_secret,data.totp) && !await consumeRecoveryCode(env,user.id,data.totp)) return json({ error:'Codice di sicurezza non corretto.' },401);
  const token = parseCookies(request)[SESSION_COOKIE];
  await env.DB.prepare("UPDATE sessions SET reauth_until=datetime('now','+10 minutes'),last_seen_at=CURRENT_TIMESTAMP WHERE token_hash=?").bind(await sha256(token)).run();
  await securityEvent(env,request,user.id,'reauth_success');
  return json({ok:true,validForMinutes:10});
}

async function setupTotp(request, env) {
  const auth = await requireSession(request,env,['owner']); if (auth.error) return auth.error;
  const gate = requireRecentAuth(auth.session); if (gate) return gate;
  const secret = base32Encode(crypto.getRandomValues(new Uint8Array(20)));
  await env.DB.prepare('UPDATE users SET totp_pending_secret=? WHERE id=?').bind(secret,auth.session.id).run();
  const issuer = encodeURIComponent('Retro di testa');
  const account = encodeURIComponent(auth.session.email);
  return json({secret,uri:`otpauth://totp/${issuer}:${account}?secret=${secret}&issuer=${issuer}&digits=6&period=30`});
}

async function confirmTotp(request, env) {
  const auth = await requireSession(request,env,['owner']); if (auth.error) return auth.error;
  const data = await body(request);
  const user = await env.DB.prepare('SELECT totp_pending_secret FROM users WHERE id=?').bind(auth.session.id).first();
  if (!user?.totp_pending_secret || !await verifyTotp(user.totp_pending_secret,data.code)) return json({error:'Codice non corretto. Controlla l’orario del telefono e riprova.'},400);
  const recoveryCodes=Array.from({length:10},()=>`${randomToken(3).toUpperCase()}-${randomToken(3).toUpperCase()}`);
  const recoveryStatements=await Promise.all(recoveryCodes.map(async code=>env.DB.prepare('INSERT INTO recovery_codes (code_hash,user_id) VALUES (?,?)').bind(await sha256(normalizeRecoveryCode(code)),auth.session.id)));
  await env.DB.batch([
    env.DB.prepare('UPDATE users SET totp_secret=totp_pending_secret,totp_pending_secret=NULL,totp_enabled=1,updated_at=CURRENT_TIMESTAMP WHERE id=?').bind(auth.session.id),
    env.DB.prepare('DELETE FROM recovery_codes WHERE user_id=?').bind(auth.session.id),
    ...recoveryStatements
  ]);
  await securityEvent(env,request,auth.session.id,'totp_enabled');
  await notifyOwner(env,'Secondo fattore attivato — Retro di testa','È stata attivata la verifica in due passaggi per l’account proprietario.').catch(()=>{});
  return json({ok:true,recoveryCodes});
}

async function securityOverview(request, env) {
  const auth = await requireSession(request,env,['owner']); if (auth.error) return auth.error;
  const tokenHash = await sha256(parseCookies(request)[SESSION_COOKIE] || '');
  const sessions = await env.DB.prepare("SELECT token_hash,created_at,last_seen_at,expires_at,user_agent,ip_hash FROM sessions WHERE user_id=? AND expires_at>CURRENT_TIMESTAMP ORDER BY created_at DESC").bind(auth.session.id).all();
  const events = await env.DB.prepare('SELECT event_type,detail,created_at FROM security_events WHERE user_id=? ORDER BY created_at DESC LIMIT 100').bind(auth.session.id).all();
  return json({totpEnabled:Boolean(auth.session.totp_enabled),sessions:sessions.results.map(s=>({id:s.token_hash,current:s.token_hash===tokenHash,createdAt:s.created_at,lastSeenAt:s.last_seen_at,expiresAt:s.expires_at,userAgent:s.user_agent})),events:events.results});
}

async function revokeSession(request, env, id) {
  const auth = await requireSession(request,env,['owner']); if (auth.error) return auth.error;
  const gate = requireRecentAuth(auth.session); if (gate) return gate;
  const current = await sha256(parseCookies(request)[SESSION_COOKIE] || '');
  if (id === current) return json({error:'Per chiudere la sessione attuale usa Esci.'},400);
  await env.DB.prepare('DELETE FROM sessions WHERE token_hash=? AND user_id=?').bind(id,auth.session.id).run();
  await securityEvent(env,request,auth.session.id,'session_revoked');
  return json({ok:true});
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
  try { await env.DB.prepare('INSERT INTO users (id,name,email,username,role,password_salt,password_hash,active,must_change) VALUES (?,?,?,?,?,?,?,1,1)').bind(id, name, email, username, role, salt, hash).run(); }
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
    const next = String(data.newPassword || ''); if (!validPassword(next)) return json({ error: 'Usa almeno 14 caratteri con maiuscola, minuscola, numero e simbolo.' }, 400);
    const salt = randomToken(24), hash = await passwordHash(next, salt);
    await env.DB.prepare('UPDATE users SET password_salt=?,password_hash=?,must_change=1,updated_at=CURRENT_TIMESTAMP WHERE id=?').bind(salt, hash, id).run();
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

const cmsKinds = ['articolo','guida','recensione'];
const cmsCategories = ['guide','soluzioni','test','recensioni'];
const slugify = value => clean(value,180).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,140);
const safeMarkdown = value => {
  const text = String(value || '').replace(/\0/g,'').slice(0,250000);
  if (/<\s*(script|style|object|embed|iframe|form|input|button|meta|link)\b/i.test(text) || /\bon\w+\s*=|javascript\s*:/i.test(text)) throw new Error('Il testo contiene codice non consentito. Incolla soltanto testo, titoli, elenchi e collegamenti sicuri.');
  return text;
};
const cmsPayload = data => {
  const title = clean(data.title,180), description = clean(data.description,320), kind = cmsKinds.includes(data.kind) ? data.kind : 'articolo', category = cmsCategories.includes(data.category) ? data.category : 'soluzioni';
  const slug = slugify(data.slug || title), tags = Array.isArray(data.tags) ? data.tags.map(x=>clean(x,50)).filter(Boolean).slice(0,20) : [];
  if (!title || !description || !slug) throw new Error('Titolo, descrizione e indirizzo sono obbligatori.');
  return {title,description,kind,category,slug,body:safeMarkdown(data.body),tags,image:clean(data.image,300)||null,imageAlt:clean(data.imageAlt,240)||null};
};
const cmsRow = row => ({id:row.id,slug:row.slug,kind:row.kind,title:row.title,description:row.description,category:row.category,body:row.body,tags:JSON.parse(row.tags_json||'[]'),image:row.image,imageAlt:row.image_alt,status:row.status,publishedAt:row.published_at,createdAt:row.created_at,updatedAt:row.updated_at});
const saveRevision = async (env,row,userId,action) => env.DB.prepare('INSERT INTO cms_revisions (id,content_id,snapshot_json,action,created_by) VALUES (?,?,?,?,?)').bind(crypto.randomUUID(),row.id,JSON.stringify(cmsRow(row)),action,userId).run();
const markdownFile = (item,draft) => {
  const section = item.kind === 'progetto' ? 'progetto' : 'articolo';
  const front = {section,title:item.title,description:item.description,category:item.category,date:new Date().toISOString().slice(0,10),draft,tags:item.tags,image:item.image||undefined,imageAlt:item.imageAlt||undefined};
  return `---\n${Object.entries(front).filter(([,v])=>v!==undefined).map(([k,v])=>`${k}: ${JSON.stringify(v)}`).join('\n')}\n---\n\n${item.body.trim()}\n`;
};
const utf8Base64 = value => { const bytes = encoder.encode(value); let binary=''; for(let i=0;i<bytes.length;i+=0x8000)binary+=String.fromCharCode(...bytes.subarray(i,i+0x8000)); return btoa(binary); };
const bytesBase64 = bytes => { let binary=''; for(let i=0;i<bytes.length;i+=0x8000)binary+=String.fromCharCode(...bytes.subarray(i,i+0x8000)); return btoa(binary); };
const githubConfig = env => ({token:env.GITHUB_CONTENT_TOKEN,repo:env.GITHUB_REPOSITORY || 'dangermark86/retro-di-testa',branch:env.GITHUB_BRANCH || 'main'});
async function githubFile(env,path) {
  const cfg=githubConfig(env); if(!cfg.token) throw new Error('Pubblicazione non configurata: manca l’autorizzazione limitata a GitHub.');
  const response=await fetch(`https://api.github.com/repos/${cfg.repo}/contents/${path}?ref=${encodeURIComponent(cfg.branch)}`,{headers:{Authorization:`Bearer ${cfg.token}`,Accept:'application/vnd.github+json','User-Agent':'retro-di-testa-cms'}});
  if(response.status===404)return null; if(!response.ok)throw new Error('Impossibile leggere il file pubblicato.'); return response.json();
}
async function githubWrite(env,path,content,message,sha,preEncoded=false) {
  const cfg=githubConfig(env); if(!cfg.token) throw new Error('Pubblicazione non configurata: manca l’autorizzazione limitata a GitHub.');
  const response=await fetch(`https://api.github.com/repos/${cfg.repo}/contents/${path}`,{method:'PUT',headers:{Authorization:`Bearer ${cfg.token}`,Accept:'application/vnd.github+json','Content-Type':'application/json','User-Agent':'retro-di-testa-cms'},body:JSON.stringify({message,content:preEncoded?content:utf8Base64(content),branch:cfg.branch,...(sha?{sha}:{})})});
  if(!response.ok)throw new Error('GitHub non ha accettato la pubblicazione. Nessuna copia locale è stata persa.'); return response.json();
}
async function cmsList(request,env) {
  const auth=await requireSession(request,env,['owner','admin']); if(auth.error)return auth.error;
  const rows=await env.DB.prepare('SELECT * FROM cms_contents ORDER BY updated_at DESC LIMIT 500').all(); return json({contents:rows.results.map(cmsRow)});
}
async function cmsGet(request,env,id) {
  const auth=await requireSession(request,env,['owner','admin']); if(auth.error)return auth.error;
  const row=await env.DB.prepare('SELECT * FROM cms_contents WHERE id=?').bind(id).first(); if(!row)return json({error:'Contenuto non trovato.'},404);
  const revisions=await env.DB.prepare('SELECT id,action,created_at,created_by FROM cms_revisions WHERE content_id=? ORDER BY created_at DESC LIMIT 50').bind(id).all(); return json({content:cmsRow(row),revisions:revisions.results});
}
async function cmsCreate(request,env) {
  const auth=await requireSession(request,env,['owner','admin']); if(auth.error)return auth.error;
  const item=cmsPayload(await body(request)),id=crypto.randomUUID();
  try{await env.DB.prepare('INSERT INTO cms_contents (id,slug,kind,title,description,category,body,tags_json,image,image_alt,created_by,updated_by) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)').bind(id,item.slug,item.kind,item.title,item.description,item.category,item.body,JSON.stringify(item.tags),item.image,item.imageAlt,auth.session.id,auth.session.id).run();}
  catch{return json({error:'Esiste già un contenuto con questo indirizzo.'},409);}
  const row=await env.DB.prepare('SELECT * FROM cms_contents WHERE id=?').bind(id).first(); await saveRevision(env,row,auth.session.id,'created'); await securityEvent(env,request,auth.session.id,'cms_created',item.slug); return json({content:cmsRow(row)},201);
}
async function cmsUpdate(request,env,id) {
  const auth=await requireSession(request,env,['owner','admin']); if(auth.error)return auth.error;
  const existing=await env.DB.prepare('SELECT * FROM cms_contents WHERE id=?').bind(id).first(); if(!existing)return json({error:'Contenuto non trovato.'},404);
  const item=cmsPayload(await body(request));
  if(existing.repository_sha && existing.slug!==item.slug)return json({error:'Dopo la prima pubblicazione l’indirizzo non può essere cambiato dal CMS. Crea una nuova bozza per evitare collegamenti rotti.'},409);
  try{await env.DB.prepare('UPDATE cms_contents SET slug=?,kind=?,title=?,description=?,category=?,body=?,tags_json=?,image=?,image_alt=?,updated_by=?,updated_at=CURRENT_TIMESTAMP WHERE id=?').bind(item.slug,item.kind,item.title,item.description,item.category,item.body,JSON.stringify(item.tags),item.image,item.imageAlt,auth.session.id,id).run();}
  catch{return json({error:'Esiste già un contenuto con questo indirizzo.'},409);}
  const row=await env.DB.prepare('SELECT * FROM cms_contents WHERE id=?').bind(id).first(); await saveRevision(env,row,auth.session.id,'updated'); return json({content:cmsRow(row)});
}
async function cmsAsset(request,env) {
  const auth=await requireSession(request,env,['owner']); if(auth.error)return auth.error;
  if(!auth.session.totp_enabled)return json({error:'Prima attiva la verifica in due passaggi nella sezione Sicurezza.'},403);
  const gate=requireRecentAuth(auth.session); if(gate)return gate;
  const type=(request.headers.get('content-type')||'').split(';')[0].toLowerCase(),extensions={'image/jpeg':'jpg','image/png':'png','image/webp':'webp','image/gif':'gif'};
  if(!extensions[type])return json({error:'Formato immagine non supportato. Usa JPG, PNG, WebP o GIF.'},415);
  if(Number(request.headers.get('content-length')||0)>5*1024*1024)return json({error:'La foto supera 5 MB.'},413);
  const bytes=new Uint8Array(await request.arrayBuffer()); if(!bytes.length||bytes.length>5*1024*1024)return json({error:'Foto vuota o troppo grande.'},413);
  const valid=type==='image/jpeg'&&bytes[0]===0xff&&bytes[1]===0xd8||type==='image/png'&&bytes[0]===0x89&&bytes[1]===0x50&&bytes[2]===0x4e&&bytes[3]===0x47||type==='image/webp'&&String.fromCharCode(...bytes.slice(0,4))==='RIFF'&&String.fromCharCode(...bytes.slice(8,12))==='WEBP'||type==='image/gif'&&String.fromCharCode(...bytes.slice(0,3))==='GIF';
  if(!valid)return json({error:'Il contenuto del file non corrisponde a una foto valida.'},400);
  const original=clean(decodeURIComponent(request.headers.get('x-file-name')||'immagine'),120).replace(/\.[^.]+$/,''),name=slugify(original)||'immagine',folder=new Date().toISOString().slice(0,7),path=`public/immagini/cms/${folder}/${name}-${randomToken(5)}.${extensions[type]}`;
  await githubWrite(env,path,bytesBase64(bytes),`Aggiunge immagine CMS ${name}`,null,true);
  await securityEvent(env,request,auth.session.id,'cms_asset_uploaded',path);
  return json({path:`/${path.slice(7)}`},201);
}
async function cmsAction(request,env,id) {
  const auth=await requireSession(request,env,['owner']); if(auth.error)return auth.error;
  if(!auth.session.totp_enabled)return json({error:'Prima attiva la verifica in due passaggi nella sezione Sicurezza.'},403);
  const gate=requireRecentAuth(auth.session); if(gate)return gate;
  const row=await env.DB.prepare('SELECT * FROM cms_contents WHERE id=?').bind(id).first(); if(!row)return json({error:'Contenuto non trovato.'},404);
  const data=await body(request),action=data.action,item=cmsRow(row),filePath=`src/content/articoli/${item.slug}.md`;
  if(action==='publish'||action==='hide'||action==='draft'||action==='trash'){
    const target=action==='publish'?'published':action==='hide'?'hidden':action==='trash'?'trash':'draft',draft=target!=='published',remote=await githubFile(env,filePath);
    if(remote&&!row.repository_sha)return json({error:'Esiste già un file del sito con questo indirizzo. Cambia l’indirizzo della bozza: il CMS non sovrascriverà contenuti esistenti.'},409);
    if(remote&&row.repository_sha&&remote.sha!==row.repository_sha)return json({error:'Il file online è stato modificato fuori dal CMS. Pubblicazione fermata per non sovrascrivere il lavoro: controlla la versione su GitHub.'},409);
    const result=await githubWrite(env,filePath,markdownFile(item,draft),`${target==='published'?'Pubblica':'Aggiorna'} ${item.title}`,remote?.sha);
    await env.DB.prepare("UPDATE cms_contents SET status=?,repository_sha=?,published_at=CASE WHEN ?='published' THEN CURRENT_TIMESTAMP ELSE published_at END,deleted_at=CASE WHEN ?='trash' THEN CURRENT_TIMESTAMP ELSE NULL END,updated_by=?,updated_at=CURRENT_TIMESTAMP WHERE id=?").bind(target,result.content?.sha||null,target,target,auth.session.id,id).run();
    const updated=await env.DB.prepare('SELECT * FROM cms_contents WHERE id=?').bind(id).first(); await saveRevision(env,updated,auth.session.id,action); await securityEvent(env,request,auth.session.id,`cms_${action}`,item.slug); await notifyOwner(env,`Contenuto ${target} — Retro di testa`,`${item.title} è stato impostato come ${target}.`).catch(()=>{}); return json({content:cmsRow(updated)});
  }
  if(action==='restore'){await env.DB.prepare("UPDATE cms_contents SET status='draft',deleted_at=NULL,updated_by=?,updated_at=CURRENT_TIMESTAMP WHERE id=?").bind(auth.session.id,id).run();const updated=await env.DB.prepare('SELECT * FROM cms_contents WHERE id=?').bind(id).first();await saveRevision(env,updated,auth.session.id,'restored');return json({content:cmsRow(updated)});}
  return json({error:'Operazione non disponibile.'},400);
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
    if (path === 'auth/reauth' && request.method === 'POST') return reauthenticate(request,env);
    if (path === 'auth/totp/setup' && request.method === 'POST') return setupTotp(request,env);
    if (path === 'auth/totp/confirm' && request.method === 'POST') return confirmTotp(request,env);
    if (path === 'auth/security' && request.method === 'GET') return securityOverview(request,env);
    if (path.startsWith('auth/sessions/') && request.method === 'DELETE') return revokeSession(request,env,path.slice(14));
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
    if (path === 'cms' && request.method === 'GET') return cmsList(request,env);
    if (path === 'cms' && request.method === 'POST') return cmsCreate(request,env);
    if (path === 'cms/assets' && request.method === 'POST') return cmsAsset(request,env);
    if (path.startsWith('cms/') && path.endsWith('/action') && request.method === 'POST') return cmsAction(request,env,path.slice(4,-7));
    if (path.startsWith('cms/') && request.method === 'GET') return cmsGet(request,env,path.slice(4));
    if (path.startsWith('cms/') && request.method === 'PATCH') return cmsUpdate(request,env,path.slice(4));
    return json({ error:'Percorso non trovato.' },404);
  } catch (error) {
    console.error(error);
    return json({ error:'Operazione non riuscita.' },500);
  }
}
