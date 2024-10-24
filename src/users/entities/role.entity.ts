import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { User } from "./user.entity"

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn('increment')
  id: number
  @Column()
  role: string

  @OneToMany(() => User, (user) => user.role)
  users: User[]
}