import { PrismaService } from '../prisma/prisma.service';
import { Book } from '@prisma/client';
export declare class BooksService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: {
        title: string;
        author: string;
    }): Promise<Book>;
    findAll(): Promise<Book[]>;
    findOne(id: number): Promise<Book>;
    update(id: number, data: {
        title?: string;
        author?: string;
    }): Promise<Book>;
    remove(id: number): Promise<Book>;
}
