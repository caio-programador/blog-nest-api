import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Role } from "./role.entity";

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number
  @Column()
  name: string
  @Column()
  email: string
  @Column()
  password: string
  @ManyToOne(() => Role, (role) => role.users, { eager: true })
  @JoinColumn({name: 'role_id'})
  role: Role
  @CreateDateColumn({type: 'timestamp'})
  createdAt: Date
  @UpdateDateColumn({type: 'timestamp'})
  updatedAt: Date
}
