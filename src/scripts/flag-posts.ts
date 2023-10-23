'use server';

import mistral from '@/lib/mistral';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function flagPosts() {
    try {
        // Fetch all unprocessed posts
        const posts = await prisma.posts.findMany({
            where: { isProcessed: false },
        });

        if (!posts.length) return;

        await mistral.start();

        // Iterate over the unprocessed posts and flag them if necessary
        for (const post of posts) {
            const isFlagged = await mistral.isFlagged(post.text);

            // Update the post in the database
            await prisma.posts.update({
                where: { id: post.id },
                data: {
                    isFlagged,
                    isProcessed: true,
                },
            });
        }

        console.log('Posts flagged and updated successfully!');
    } catch (error) {
        console.error('Error flagging and updating posts:', error);
    } finally {
        await prisma.$disconnect();
    }
}

flagPosts();
