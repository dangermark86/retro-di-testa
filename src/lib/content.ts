import { getCollection } from 'astro:content';
export const categories = { guide: 'Guide', soluzioni: 'Soluzioni', test: 'Test', recensioni: 'Recensioni' };
export async function articles() { return (await getCollection('articoli', ({data}) => data.section !== 'progetto' && (import.meta.env.DEV || !data.draft))).sort((a,b) => b.data.date.valueOf()-a.data.date.valueOf()); }
