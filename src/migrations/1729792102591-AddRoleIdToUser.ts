import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

export class AddRoleIdToUser1729792102591 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createForeignKey(
      'users',
      new TableForeignKey({
        name: 'user_role_fk_role_id',
        columnNames: ['role_id'],
        referencedTableName: 'roles',
        referencedColumnNames: ['id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('user_role_fk_role_id', 'users');
  }
}
