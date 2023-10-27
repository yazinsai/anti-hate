import mistral from '@/lib/mistral';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
    try {
        await processUnflaggedPosts();
    } catch (error: any) {
        return new Response(`Error - ❌ Failed to process posts: ${error.message}`, {
            status: 500,
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

        await mistral.start();

        for (const post of posts) {
            // Flag it
            const postWithoutHashtags = removeHashtags(post.text)
            try {
                const flag = await mistral.isFlagged(postWithoutHashtags);
                await prisma.posts.update({
                    where: {
                        id: post.id,
                    },
                    data: {
                        isFlagged: flag,
                        isProcessed: true,
                    },
                });
            } catch (error: any) {
                console.error(`Error - ❌ Failed to flag post: ${error.message}`);
            }
        }

        console.log(`${posts.length} posts flagged and updated successfully!`);
    } catch (error) {
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

function removeHashtags(post: string) {
    return post.replace(/#\w+/g, '')
}