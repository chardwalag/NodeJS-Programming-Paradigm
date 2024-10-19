import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { BooksService } from './books.service';
import { Book } from '@prisma/client';

@Controller('books') // This should match your request URL
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  async create(@Body() createBookDto: { title: string; author: string }): Promise<Book> {
    return this.booksService.create(createBookDto);
  }

  @Get() // This handles GET requests to /books
  async findAll(): Promise<Book[]> {
    return this.booksService.findAll();
  }

  @Get(':id') // This handles GET requests to /books/:id
  async findOne(@Param('id') id: string): Promise<Book> {
    return this.booksService.findOne(+id);
  }

  @Patch(':id') // This handles PATCH requests to /books/:id
  async update(@Param('id') id: string, @Body() updateBookDto: { title?: string; author?: string }): Promise<Book> {
    return this.booksService.update(+id, updateBookDto);
  }

  @Delete(':id') // This handles DELETE requests to /books/:id
  async remove(@Param('id') id: string): Promise<Book> {
    return this.booksService.remove(+id);
  }
}
