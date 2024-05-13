import { MigrationInterface, QueryRunner } from "typeorm";

export class PostCategories1715512710708 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS posts_categories (
                id SERIAL PRIMARY KEY,
                post_id int8,
                category_id int8,
                created_at timestamp DEFAULT NOW()::TIMESTAMP,
                updated_at timestamp,
                deleted_at timestamp
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE IF EXISTS posts_categories
        `);
    }

}