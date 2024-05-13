import { MigrationInterface, QueryRunner } from "typeorm";

export class FkUserVotesUsers1715519350328 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users_votes"  
            ADD CONSTRAINT "fk_users_votes_users"
            FOREIGN KEY ("user_id") REFERENCES "users" ("id");
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users_votes"
            DROP FOREIGN KEY "fk_users_votes_users";
        `);
    }


}
