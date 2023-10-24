'use server';

/// Uses Data365 to retrieve the latest posts from LinkedIn and update the posts in the database
/// This script is intended to be run on a schedule (e.g. daily) to keep the posts up to date

import data365 from '@/lib/data365';
import { PageInfo, Post, ResponseSchema } from '@/models/posts';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
    const res = await request.json()
    try {
        const {data} = ResponseSchema.parse(res);
        await parsePosts(data.posts.items, data.search, data.posts.page_info);
    } catch (error) {
        return new Response(JSON.stringify({ input: res, error }), {
            headers: { 'Content-Type': 'application/json' },
        });
    }

    return new Response('OK - ✅ Processed');
}

async function parsePosts(posts: Post[], search: any, pageInfo: PageInfo) {
    try {
        // Iterate over the parsed posts and create or update the corresponding Prisma models
        const operations = posts.map((post) => {
            return prisma.posts.upsert({
                where: { id: post.id },
                update: {
                    lang: post.lang ?? '',
                    authorId: post.author_id,
                    text: post.text ?? post.article?.title,
                    url: post.url,
                    isProcessed: false,
                    isFlagged: false,
                    createdAt: new Date(post.timestamp * 1000),
                },
                create: {
                    id: post.id,
                    lang: post.lang ?? '',
                    author: {
                        connectOrCreate: {
                            where: { id: post.author_id },
                            create: {
                                id: post.author_id,
                                name: post.author.name,
                                username: post.author.username,
                            }
                        }
                    },
                    text: post.text ?? post.article?.title ?? '',
                    url: post.url,
                    isProcessed: false,
                    isFlagged: false,
                    createdAt: new Date(post.timestamp * 1000),
                },
            });
        })

        // Execute the operations as a single transaction
        await prisma.$transaction(operations);

        // Handle pagination
        if (pageInfo.has_next_page) {
            // Fetch next page and parse posts
            const {data} = await data365.getPosts(search, pageInfo.cursor);
            await parsePosts(data.items, search, data.page_info);
        }

        console.log('Posts parsed and saved successfully!');
    } catch (error) {
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}