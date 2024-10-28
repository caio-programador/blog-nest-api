import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateTablePostsCategoriesCategories1730138790698 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'posts_categories_categories',
            columns: [
                {
                    name: 'postId',
                    type: 'int',
                    isPrimary: true
                },
                {
                    name: 'categoryId',
                    type: 'int',
                    isPrimary: true
                }
            ],
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('posts_categories_categories')
    }

}
