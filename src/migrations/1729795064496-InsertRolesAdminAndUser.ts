import { MigrationInterface, QueryRunner } from "typeorm";

export class InsertRolesAdminAndUser1729795064496 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO "roles"(role) VALUES ('ADMIN')`)
        await queryRunner.query(`
            INSERT INTO "roles"(role) VALUES ('USER')`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DELETE FROM roles')
    }

}
