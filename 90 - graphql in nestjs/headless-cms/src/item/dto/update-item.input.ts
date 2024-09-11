import { CreateItemInput } from './create-item.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateItemInput extends PartialType(CreateItemInput) {
  @Field(() => String, { description: 'Category field' })
  category: string;

  @Field(() => String, { description: 'Title field' })
  title: string;
}
