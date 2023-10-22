'use server';

/// Uses Data365 to retrieve the latest posts from LinkedIn and update the posts in the database
/// This script is intended to be run on a schedule (e.g. daily) to keep the posts up to date

import data365 from '@/lib/data365';
import { ResponseSchema } from '@/models/posts';
import { PrismaClient } from '@prisma/client';
import posts from "./responses.json";

const prisma = new PrismaClient();
const DEFAULT_LANG = 'en'

async function parsePosts() {
    try {
        // Parse the posts data using the ResponseSchema
        const parsedData = ResponseSchema.parse(posts);

        // Iterate over the parsed posts and create or update the corresponding Prisma models
        for (const post of parsedData.data.items) {
            await prisma.posts.upsert({
                where: { id: post.id },
                update: {
                    lang: post.lang ?? DEFAULT_LANG,
                    authorId: post.author_id,
                    text: post.text ?? post.article?.title,
                    url: post.url,
                    isProcessed: false,
                    isFlagged: false,
                },
                create: {
                    id: post.id,
                    lang: post.lang ?? DEFAULT_LANG,
                    authorId: post.author_id,
                    text: post.text ?? post.article?.title ?? '',
                    url: post.url,
                    isProcessed: false,
                    isFlagged: false,
                },
            });
        }

        console.log('Posts parsed and saved successfully!');
    } catch (error) {
        console.error('Error parsing and saving posts:', error);
    } finally {
        await prisma.$disconnect();
    }
}

parsePosts();