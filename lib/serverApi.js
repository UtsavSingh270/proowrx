import { cache } from 'react';
import mongoose from 'mongoose';
import connectDB from '@/server/config/db';
import Post from '@/server/models/Post';
import Job from '@/server/models/Job';
import TeamMember from '@/server/models/TeamMember';
import WorkLifeItem from '@/server/models/WorkLifeItem';
import Resource from '@/server/models/Resource';
import CaseStudy from '@/server/models/CaseStudy';
import { publicPostFilter } from '@/server/utils/posts';

const serialize = value => JSON.parse(JSON.stringify(value));
async function query(run, fallback = []) {
  if (!process.env.MONGODB_URI) return fallback;
  try { await connectDB(); return serialize(await run()); }
  catch (error) { console.error('Content query failed:', error.message); return fallback; }
}

export const serverPosts = {
  getAll: cache(() => query(() => Post.find(publicPostFilter()).sort({ scheduledAt: -1, createdAt: -1 }).select('-htmlContent'))),
  getLatest: cache((limit = 3) => query(() => Post.aggregate([
    { $match: publicPostFilter() },
    { $addFields: { publishedAt: { $ifNull: ['$scheduledAt', '$createdAt'] } } },
    { $sort: { publishedAt: -1 } },
    { $limit: Math.min(12, Math.max(1, Number(limit) || 3)) },
    { $project: { htmlContent: 0, publishedAt: 0 } },
  ]))),
  getForPage: cache(path => query(() => Post.find({ ...publicPostFilter(), displayPages: path }).sort({ scheduledAt: -1, createdAt: -1 }).select('-htmlContent'))),
  getOne: cache(id => query(async () => {
    const post = await Post.findOne({ ...publicPostFilter(), slug: id });
    if (post) return post;
    return mongoose.Types.ObjectId.isValid(id) ? Post.findOne({ ...publicPostFilter(), _id: id }) : null;
  }, null)),
  getByAuthor: cache((id, page = 1, limit = 6) => query(async () => {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    const author = await TeamMember.findById(id);
    if (!author) return null;
    page = Math.max(1, Number(page) || 1);
    limit = Math.min(12, Math.max(1, Number(limit) || 6));
    const skip = (page - 1) * limit;
    const filter = { ...publicPostFilter(), authorId: id };
    const [posts, total] = await Promise.all([
      Post.find(filter).sort({ scheduledAt: -1, createdAt: -1 }).skip(skip).limit(limit).select('-htmlContent'),
      Post.countDocuments(filter),
    ]);
    return { author, posts, pagination: { page, limit, total, hasMore: skip + posts.length < total } };
  }, null)),
};
export const serverJobs = { getActive: cache(() => query(() => Job.find({ status: 'active' }).sort({ createdAt: -1 }))) };
export const serverTeamMembers = { getAll: cache(() => query(() => TeamMember.find({ category: 'featured' }).sort({ order: 1, createdAt: 1 }))) };
export const serverWorkLife = { getAll: cache(() => query(() => WorkLifeItem.find({ active: true }).sort({ order: 1, createdAt: 1 }))) };
export const serverResources = {
  getAll: cache(() => query(() => Resource.find({ active: true }).sort({ createdAt: -1 }).select('title slug topic desc image seo createdAt'))),
  getOne: cache(slug => query(() => Resource.findOne({ slug, active: true }).select('-pdfUrl'), null)),
};
export const serverCaseStudies = {
  getAll: cache(() => query(() => CaseStudy.find({ status: 'published' }).sort({ createdAt: -1 }))),
  getForPage: cache(path => query(() => CaseStudy.find({ status: 'published', displayPages: path }).sort({ createdAt: -1 }))),
  getOne: cache(slug => query(() => CaseStudy.findOne({ slug, status: 'published' }), null)),
};
