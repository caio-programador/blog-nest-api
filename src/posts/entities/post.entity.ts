import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('posts')
export class PostEntity { 
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column()
  title: string

  @Column()
  description: string

  @CreateDateColumn({type: 'timestamp'})
  createdAt: Date

  @UpdateDateColumn({type: 'timestamp'})
  updatedAt: Date
  
  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({name: 'user_id'})
  user: User

}
