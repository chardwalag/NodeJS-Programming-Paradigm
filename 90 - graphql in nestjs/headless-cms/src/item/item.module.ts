import { Module } from '@nestjs/common';
import { ItemService } from './item.service';
import { ItemResolver } from './item.resolver';
import { Item } from './entities/item.entity';
import { TypeOrmModule } from '@nestjs/typeorm';


@Module({ 
  imports: [ TypeOrmModule.forFeature([ Item ])],
  providers: [ItemResolver, ItemService],
})
export class ItemModule {}
