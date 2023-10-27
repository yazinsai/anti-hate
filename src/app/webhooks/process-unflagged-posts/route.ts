'use server';

/// Uses Data365 to retrieve the latest posts from LinkedIn and update the posts in the database
/// This script is intended to be run on a schedule (e.g. daily) to keep the posts up to date

import data365 from '@/lib/data365';
import mistral from '@/lib/mistral';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
    const res = await request.json()
    try {
        await processUnflaggedPosts();
    } catch (error) {
        return new Response(JSON.stringify({ input: res, error }), {
            headers: { 'Content-Type': 'application/json' },
        });
    }

    return new Response('OK - ✅ Processed');
}

async function processUnflaggedPosts() {
    await prisma.$connect();

    try {
        // Fetch unprocessed posts
        const posts = await prisma.posts.findMany({
            where: {
                isProcessed: false,
            },
        });

        // Iterate over the posts and flag them
        for (const post of posts) {
            await mistral.start();
            const flag = await mistral.isFlagged(post.text);

            // Save it
            await prisma.posts.update({
                where: {
                    id: post.id,
                },
                data: {
                    isFlagged: flag,
                    isProcessed: true,
                },
            });
        }

        console.log(`${posts.length} posts flagged and updated successfully!`);
    } catch (error) {
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}