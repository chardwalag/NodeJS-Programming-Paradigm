import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Book } from '@prisma/client';

@Injectable()
export class SeederService implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    await this.seedBooks();
  }

  private async seedBooks() {
    const books = [
      { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald' },
      { title: '1984', author: 'George Orwell' },
      { title: 'To Kill a Mockingbird', author: 'Harper Lee' },
      { title: 'Moby Dick', author: 'Herman Melville' },
      { title: 'Pride and Prejudice', author: 'Jane Austen' },
    ];

    for (const book of books) {
      await this.prisma.book.upsert({
        where: { title: book.title }, // Now this works because title is unique
        update: {}, // No updates needed if it doesn't exist
        create: {
          title: book.title,
          author: book.author,
        },
      });
    }
  }
}
