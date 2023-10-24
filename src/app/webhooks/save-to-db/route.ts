'use server';

/// Uses Data365 to retrieve the latest posts from LinkedIn and update the posts in the database
/// This script is intended to be run on a schedule (e.g. daily) to keep the posts up to date

import data365 from '@/lib/data365';
import { ResponseSchema } from '@/models/posts';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
    const res = await request.json()
    try {
        await parsePosts(res);
    } catch (error) {
        console.error(error);
        return new Response('Error - ❌ Failed to parse posts');
    }

    return new Response('OK - ✅ Processed');
}

async function parsePosts(response: any) {
    try {
        // Parse the posts data using the ResponseSchema
        const parsedData = ResponseSchema.parse(response);

        // Iterate over the parsed posts and create or update the corresponding Prisma models
        for (const post of parsedData.data.items) {
            await prisma.posts.upsert({
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
        }

        console.log('Posts parsed and saved successfully!');
    } catch (error) {
        throw new Error(`Error parsing posts: ${error}`);
    } finally {
        await prisma.$disconnect();
    }
}