import 'dotenv/config'

import { CreateTableUser1729791377109 } from "src/migrations/1729791377109-CreateTableUser";
import { CreateTableRole1729791892442 } from "src/migrations/1729791892442-CreateTableRole";
import { AddRoleIdToUser1729792102591 } from "src/migrations/1729792102591-AddRoleIdToUser";
import { InsertRolesAdminAndUser1729795064496 } from 'src/migrations/1729795064496-InsertRolesAdminAndUser';
import { Role } from "src/users/entities/role.entity";
import { User } from "src/users/entities/user.entity";
import { DataSource, DataSourceOptions } from "typeorm";

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: String(process.env.DB_PASS),
  database: process.env.DB_NAME,
  entities: [User, Role],
  synchronize: false,
}

console.log(dataSourceOptions.username)

export const dataSource = new DataSource({
  ...dataSourceOptions,
  migrations: [
    CreateTableUser1729791377109,
    CreateTableRole1729791892442,
    AddRoleIdToUser1729792102591,
    InsertRolesAdminAndUser1729795064496
  ],
})