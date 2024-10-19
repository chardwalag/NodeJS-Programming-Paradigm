import { Injectable, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Book } from '@prisma/client';

@Injectable()
export class BooksService {
  constructor(private prisma: PrismaService) {}

  async create(data: { title: string; author: string }): Promise<Book> {
    try {
      return await this.prisma.book.create({
        data,
      });
    } catch (error) {
      throw new HttpException('Failed to create book', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll(): Promise<Book[]> {
    return this.prisma.book.findMany();
  }

  async findOne(id: number): Promise<Book> {
    return this.prisma.book.findUnique({ where: { id } });
  }

  async update(id: number, data: { title?: string; author?: string }): Promise<Book> {
    return this.prisma.book.update({ where: { id }, data });
  }

  async remove(id: number): Promise<Book> {
    return this.prisma.book.delete({ where: { id } });
  }
}
