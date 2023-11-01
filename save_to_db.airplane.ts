import airplane from "airplane";
import data365 from '@/lib/data365';
import { PageInfo, Post, ResponseSchema } from '@/models/posts';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default airplane.task(
  {
    slug: "save_to_db",
    name: "save-to-db",
    description: "Saves the incoming webhook, and all remaining pages, to MongoDB",
    parameters: {
      webhook_payload: {
        name: "Webhook payload",
        type: "json",
        default: {
          body: {},
          headers: {}
        }
      }
    },
    envVars: {
      DATA365_API_KEY: {
        value: process.env.DATA365_API_KEY!
      },
      DATABASE_URL: {
        value: process.env.DATABASE_URL!
      },
      FIREWORKS_API_KEY: {
        value: process.env.FIREWORKS_API_KEY!
      },
      OPENAI_API_KEY: {
        value: process.env.OPENAI_API_KEY!
      }
    },
    webhooks: ["my_webhook"]
  },
  // This is your task's entrypoint. When your task is executed, this
  // function will be called.
  async (params) => {
    // @ts-ignore
    const { body } = params.webhook_payload;
    const { data } = ResponseSchema.parse(body);

    try {
      const numPosts = await parsePosts(data.posts.items, data.search, data.posts.page_info);
      return new Response(`OK - ✅ Processed ${numPosts} posts`);
    } catch (error) {
      return new Response(JSON.stringify({ input: body, error }), {
        headers: { 'Content-Type': 'application/json' },
        status: 500,
      });
    }
  }
);

async function parsePosts(posts: Post[], search: any, pageInfo: PageInfo) {
  try {
    let numPosts = 0

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
    numPosts += posts.length;


    // Handle pagination
    if (pageInfo.has_next_page) {
      // Fetch next page and parse posts
      console.log('🫧 Fetching more');
      const { data } = await data365.getPosts(search, pageInfo.cursor);
      numPosts += await parsePosts(data.items, search, data.page_info);
    }

    console.log('Posts parsed and saved successfully!');
    return numPosts;
  } catch (error) {
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}