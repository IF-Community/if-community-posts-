import {MigrationInterface, QueryRunner} from "typeorm";

export class Users1715512522558 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                communit_id INT UNIQUE,
                name VARCHAR(200),
                created_at timestamp DEFAULT NOW()::TIMESTAMP,
                updated_at timestamp,
                deleted_at timestamp
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE IF EXISTS users
        `);
    }

}