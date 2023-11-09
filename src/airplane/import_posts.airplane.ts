import airplane from "airplane";
import data365 from '@/lib/data365';
import { PageInfo, Post, WebhookSchema } from '@/models/posts';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default airplane.task(
  {
    slug: "import_posts",
    name: "import-posts",
    description: "Saves the incoming webhook, and all remaining pages, to Postgres",
    parameters: {
      webhook_payload: {
        name: "Webhook payload",
        type: "json"
      }
    },
    webhooks: { my_webhook: { requireAirplaneToken: false } },
  },
  // This is your task's entrypoint. When your task is executed, this
  // function will be called.
  async (params: any) => {
    const { body } = params.webhook_payload;
    console.log('📡 Incoming webhook payload', body);
    const { data } = WebhookSchema.parse(body);

    try {
      const numPosts = await parsePosts(data.posts.items, data.search, data.posts.page_info);
      return new Response(`OK - ✅ Processed ${numPosts} posts`);
    } catch (error) {
      return error;
    }

    return {}
  }
);

async function parsePosts(posts: Post[], search: any, pageInfo: PageInfo) {
  try {
    // Iterate over the parsed posts and create or update the corresponding Prisma models
    const operations = posts.map((post) => {
      const data = {
        lang: post.lang ?? '',
        authorId: post.author_id,
        authorName: post.author.name,
        authorUsername: post.author.username,
        text: post.text ?? post.article?.title ?? '',
        url: post.url,
        createdAt: new Date(post.timestamp * 1000),
      }

      return prisma.posts.upsert({
        where: { id: post.id },
        update: data,
        create: {
          id: post.id,
          ...data
        },
      });
    })

    // Execute the operations as a single transaction
    await prisma.$transaction(operations);
    console.log(`📀 Saved ${posts.length}`)

    // Handle pagination
    if (pageInfo.has_next_page) {
      // Fetch next page and parse posts
      console.log('🫧 Fetching next page');
      const { data } = await data365.getPosts(search, pageInfo.cursor);
      await parsePosts(data.items, search, data.page_info);
    }

    console.log('Posts parsed and saved successfully!');
  } catch (error) {
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}