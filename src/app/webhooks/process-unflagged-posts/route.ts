import mistral from '@/lib/mistral';
import { PrismaClient } from '@prisma/client';

export const dynamic = 'force-dynamic'
export const maxDuration = 300 // seconds

const MIN_POST_LENGTH = 10; // in chars

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
                sentiment: false,
            },
        });

        for (const post of posts) {
            try {
                const content = removeHashtags(post.text);
                if (content.length < MIN_POST_LENGTH) continue;

                const { violence, side, snippet } = await mistral.getSentiment(content);
                await prisma.posts.update({
                    where: {
                        id: post.id,
                    },
                    data: {
                        sentiment: true,
                        sentimentViolence: violence,
                        sentimentSide: side,
                        sentimentSnippet: snippet,
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