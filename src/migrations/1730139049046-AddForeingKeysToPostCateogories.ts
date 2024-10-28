import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

export class AddForeingKeysToPostCateogories1730139049046
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createForeignKey(
      'posts_categories_categories',
      new TableForeignKey({
        columnNames: ['postId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'posts',
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createForeignKey(
      'posts_categories_categories',
      new TableForeignKey({
        columnNames: ['categoryId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'categories',
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('posts_categories_categories', 'postId');
    await queryRunner.dropForeignKey(
      'posts_categories_categories',
      'categoryId',
    );
  }
}
