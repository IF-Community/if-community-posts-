import {MigrationInterface, QueryRunner} from "typeorm";

export class Categories1715512588660 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS categories (
                id SERIAL PRIMARY KEY,
                name VARCHAR(200),
                created_at timestamp DEFAULT NOW()::TIMESTAMP,
                updated_at timestamp,
                deleted_at timestamp
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE IF EXISTS categories
        `);
    }

}