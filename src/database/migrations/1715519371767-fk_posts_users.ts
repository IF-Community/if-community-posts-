import { MigrationInterface, QueryRunner } from "typeorm";

export class FkPostsUsers1715519371767 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "posts"  
            ADD CONSTRAINT "fk_posts_users"
            FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "posts"
            DROP FOREIGN KEY "fk_posts_users";
        `);
    }
}
