import { MigrationInterface, QueryRunner } from "typeorm";

export class UserVotes1715512650189 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS users_votes (
                id SERIAL PRIMARY KEY,
                upvote boolean,
                user_id int8,
                post_id int8,
                created_at timestamp DEFAULT NOW()::TIMESTAMP,
                updated_at timestamp,
                deleted_at timestamp
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE IF EXISTS users_votes
        `);
    }

}
