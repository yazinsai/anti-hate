import mistral from '@/lib/mistral';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
    try {
        await processUnflaggedPosts();
    } catch (error) {
        return new Response('Error - ❌ Failed to process posts');
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