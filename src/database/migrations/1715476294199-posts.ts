import {MigrationInterface, QueryRunner} from "typeorm";

export class Posts1715476294199 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS posts (
                id SERIAL PRIMARY KEY,
                title VARCHAR(200),
                user_id int8,
                content TEXT,
                total_upvotes int8 DEFAULT 0,
                created_at timestamp DEFAULT NOW()::TIMESTAMP,
                updated_at timestamp,
                deleted_at timestamp
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE IF EXISTS posts
        `);
    }

}

