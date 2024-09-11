import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateItemInput {
  @Field(() => String, { description: 'Category field (placeholder)' })
  category: string;
}
