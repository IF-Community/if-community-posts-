import { MigrationInterface, QueryRunner } from "typeorm";

export class FkUserVotesPosts1715519359211 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users_votes"  
            ADD CONSTRAINT "fk_users_votes_posts"
            FOREIGN KEY ("post_id") REFERENCES "posts" ("id") ON DELETE CASCADE;
        `); 
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users_votes"
            DROP FOREIGN KEY "fk_users_votes_posts";
        `);
    }

}
