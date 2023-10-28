import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import authors from './authors.json';
import posts from './posts.json';

const prisma = new PrismaClient();

async function importData() {
  console.log('Importing data...');
  await prisma.$connect();

  try {
    const createPostPromises = [];
    for (let i = 0; i < posts.length; i++) {
      const post = posts[i];
      process.stdout.write('.');
      const author = authors.find((author) => author.id === post.authorId)!;

      createPostPromises.push(
        prisma.posts.create({
          data: {
            id: post.id,
            lang: post.lang,
            createdAt: new Date(post.createdAt),
            text: post.text,
            url: post.url,
            authorId: author.id,
            authorName: author.name,
            authorUsername: author.username,
          },
        })
      );

      // If we've collected 100 promises or we're at the end of the posts array, execute them in a transaction
      if (createPostPromises.length === 100 || i === posts.length - 1) {
        await prisma.$transaction(createPostPromises);
        createPostPromises.length = 0; // Clear the array
      }
    }

    console.log('Data imported successfully!');
  } catch (error) {
    console.error('Error importing data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

importData();