import { Module } from '@nestjs/common';
import { BooksModule } from './books/books.module';
import { PrismaModule } from './prisma/prisma.module';
import { SeederService } from './seeder/seeder.service'; // Adjust path as necessary

@Module({
  imports: [BooksModule, PrismaModule],
  providers: [SeederService],
})
export class AppModule {}
