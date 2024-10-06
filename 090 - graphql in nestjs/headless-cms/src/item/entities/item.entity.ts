import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@ObjectType()
@Entity()
export class Item {
  @Field(() => Int, { description: 'Id field' })
  @PrimaryGeneratedColumn()
  Id: number;

  @Field(() => String, { description: 'Category field' })
  @Column()
  category: string;

  @Field(() => String, { description: 'Title field' })
  @Column()
  title: string;
}