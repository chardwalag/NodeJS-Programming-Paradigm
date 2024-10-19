import { BooksService } from './books.service';
import { Book } from '@prisma/client';
export declare class BooksController {
    private readonly booksService;
    constructor(booksService: BooksService);
    create(createBookDto: {
        title: string;
        author: string;
    }): Promise<Book>;
    findAll(): Promise<Book[]>;
    findOne(id: string): Promise<Book>;
    update(id: string, updateBookDto: {
        title?: string;
        author?: string;
    }): Promise<Book>;
    remove(id: string): Promise<Book>;
}
