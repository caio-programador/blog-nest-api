import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PostEntity } from './post.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;
  @ManyToMany(() => PostEntity, (post) => post.categories)
  posts: PostEntity[];
}
