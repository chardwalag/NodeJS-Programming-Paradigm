import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { Item } from './entities/item.entity';
import { UpdateItemInput } from './dto/update-item.input';
import { ItemService } from './item.service'

@Resolver(() => Item)
export class ItemResolver {
  constructor(
    private readonly itemService: ItemService
  ) {}

  @Mutation(() => Item)
  createItem(
    @Args('title') title: string,
    @Args('category') category: string,
  ) {
console.log('Mutation createItem')
    return this.itemService.create( title, category )
  }

  @Query(() => [Item], { name: 'items' })
  async findAll(): Promise<Item[]> {
console.log('Query findAll')
    return await this.itemService.findAll();
  }

  @Query(() => Item, { name: 'item' })
  async findOne(@Args('Id', { type: () => Int }) Id: number): Promise<Item> {
console.log('Query findOne')
    return await this.itemService.findOne( Id );
  }

  @Mutation(() => Item)
  async updateItem(
    @Args('Id') Id: number,
    @Args('data') data: UpdateItemInput,
  ): Promise<Item> {
console.log('Mutation updateItem')
    return await this.itemService.update( Id, data );
  }

  @Mutation(() => String)
  async removeItem(@Args('Id') Id: number): Promise<string> {
console.log('Mutation removeItem')
    return await this.itemService.remove( Id );
  }
}
