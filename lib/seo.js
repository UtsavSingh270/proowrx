import { cache } from 'react';
import connectDB from '@/server/config/db';
import PageSeo from '@/server/models/PageSeo';
import { buildSeoMetadata } from './seoMetadata';
import defaultsByPage from '@/data/pageMetadata.json';

export const getPageSeo = cache(async (path) => {
  if (!process.env.MONGODB_URI) return null;
  try {
    await connectDB();
    return await PageSeo.findOne({ path }).lean();
  } catch (error) {
    console.error('Unable to load page SEO:', error.message);
    return null;
  }
});

export async function pageMetadata(path, defaults) {
  const entry = await getPageSeo(path);
  return buildSeoMetadata(entry?.seo, defaultsByPage[path] || defaults, path);
}
