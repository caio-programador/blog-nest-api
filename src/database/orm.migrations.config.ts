import 'dotenv/config';

import { CreateTableUser1729791377109 } from 'src/migrations/1729791377109-CreateTableUser';
import { CreateTableRole1729791892442 } from 'src/migrations/1729791892442-CreateTableRole';
import { AddRoleIdToUser1729792102591 } from 'src/migrations/1729792102591-AddRoleIdToUser';
import { InsertRolesAdminAndUser1729795064496 } from 'src/migrations/1729795064496-InsertRolesAdminAndUser';
import { CreateTablePosts1729862832861 } from 'src/migrations/1729862832861-CreateTablePosts';
import { CreateTableCategory1730138268393 } from 'src/migrations/1730138268393-CreateTableCategory';
import { CreateTablePostsCategoriesCategories1730138790698 } from 'src/migrations/1730138790698-CreateTablePostsCategoriesCategories';
import { AddForeingKeysToPostCateogories1730139049046 } from 'src/migrations/1730139049046-AddForeingKeysToPostCateogories';
import { Category } from 'src/posts/entities/category.entity';
import { PostEntity } from 'src/posts/entities/post.entity';
import { Role } from 'src/users/entities/role.entity';
import { User } from 'src/users/entities/user.entity';
import { DataSource, DataSourceOptions } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: String(process.env.DB_PASS),
  database: process.env.DB_NAME,
  entities: [User, Role, PostEntity, Category],
  synchronize: false,
};

console.log(dataSourceOptions.username);

export const dataSource = new DataSource({
  ...dataSourceOptions,
  migrations: [
    CreateTableUser1729791377109,
    CreateTableRole1729791892442,
    AddRoleIdToUser1729792102591,
    InsertRolesAdminAndUser1729795064496,
    CreateTablePosts1729862832861,
    CreateTableCategory1730138268393,
    CreateTablePostsCategoriesCategories1730138790698,
    AddForeingKeysToPostCateogories1730139049046,
  ],
});
