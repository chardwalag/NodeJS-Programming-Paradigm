import { Injectable } from '@nestjs/common';
import { Item } from './entities/item.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository( Item )
    private readonly itemRepository: Repository<Item>
  ) {}


  create(title: string, category:string) {
    const item = this.itemRepository.create({ title, category });
    return this.itemRepository.save( item )
  }

  async findAll(): Promise<Item[]> {
    return await this.itemRepository.find();
  }

  async findOne(Id: number): Promise<Item> {
    const item = await this.itemRepository.findOne({ where: { Id }});
    if (!item) {
      throw new Error(`Item with ID ${Id} not found`);
    }    
    return item
  }

  async update(Id: number, data: Partial<Item>) {
    const item = await this.itemRepository.findOne({ where: { Id }});
    if (!item) {
      throw new NotFoundException(`Item with ID ${Id} not found`);
    }
    if ( data.title ) item.title = data.title;
    if ( data.category ) item.category = data.category;
    return this.itemRepository.save(item);
  }

  async remove(Id: number): Promise<string> {
    const result: DeleteResult = await this.itemRepository.delete(Id);
    return `Deleted ${ result.affected } item(s)`
  }
}
