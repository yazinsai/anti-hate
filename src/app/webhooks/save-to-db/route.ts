/// Uses Data365 to retrieve the latest posts from LinkedIn and update the posts in the database
/// This script is intended to be run on a schedule (e.g. daily) to keep the posts up to date

import data365 from '@/lib/data365';
import { PageInfo, Post, ResponseSchema } from '@/models/posts';
import { PrismaClient } from '@prisma/client';

export const dynamic = 'force-dynamic'
export const maxDuration = 300 // seconds
const prisma = new PrismaClient();

export async function POST(request: Request) {
    const res = await request.json()
    try {
        const { data } = ResponseSchema.parse(res);
        const numPosts = await parsePosts(data.posts.items, data.search, data.posts.page_info);
        return new Response(`OK - ✅ Processed ${numPosts} posts`);
    } catch (error) {
        return new Response(JSON.stringify({ input: res, error }), {
            headers: { 'Content-Type': 'application/json' },
            status: 500,
        });
    }
}

async function parsePosts(posts: Post[], search: any, pageInfo: PageInfo) {
    try {
        let numPosts = 0
        let startTime = performance.now();

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
        numPosts += posts.length;


        // Handle pagination
        if (pageInfo.has_next_page) {
            // Fetch next page and parse posts
            const { data } = await data365.getPosts(search, pageInfo.cursor);

            // Check if 4 minutes have passed
            const elapsed = (performance.now() - startTime) / 1000;
            if (elapsed >= maxDuration - 60) {
                // Trigger a fetch request to the same endpoint with the response from the last request
                fetch('/webhooks/save-to-db', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ search, pageInfo }),
                });
            } else {
                numPosts += await parsePosts(data.items, search, data.page_info);
            }
        }

        console.log('Posts parsed and saved successfully!');
        return numPosts;
    } catch (error) {
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}