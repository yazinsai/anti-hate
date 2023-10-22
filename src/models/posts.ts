import { z } from 'zod';

const PageInfoSchema = z.object({
  cursor: z.string(),
  has_next_page: z.boolean(),
});

const AuthorSchema = z.object({
  id: z.string(),
  name: z.string(),
  profile_type: z.string(),
  username: z.string(),
});

const ArticleSchema = z.object({
  description: z.string().nullable(),
  image_url: z.string().nullable(),
  title: z.string(),
  url: z.string(),
});

const SharedPostSchema = z.object({
  author_id: z.string(),
  author_username: z.string(),
  id: z.string(),
  url: z.string(),
});

const PostSchema = z.object({
  appreciation_count: z.null(),
  article: ArticleSchema.nullable(),
  author: AuthorSchema,
  author_id: z.string(),
  author_username: z.string(),
  carousel: z.null(),
  comments_count: z.number(),
  created_time: z.string(),
  document: z.null(),
  empathy_count: z.null(),
  entertainment_count: z.null(),
  hashtags: z.array(z.string()).nullable(),
  id: z.string(),
  image_urls: z.array(z.string()).nullable(),
  interest_count: z.null(),
  lang: z.string().nullable(),
  like_count: z.null(),
  links: z.array(z.string()).nullable(),
  maybe_count: z.null(),
  mentioned_profiles: z.null(),
  praise_count: z.null(),
  reactions_count: z.number(),
  share_urn: z.string(),
  shared_post: SharedPostSchema.nullable(),
  shares_count: z.number(),
  text: z.string().nullable(),
  timestamp: z.number(),
  url: z.string(),
  video: z.null(),
  views_count: z.null(),
});

const ResponseSchema = z.object({
  data: z.object({
    posts: z.array(PostSchema),
    page_info: PageInfoSchema,
  }),
  error: z.null(),
  status: z.string(),
});