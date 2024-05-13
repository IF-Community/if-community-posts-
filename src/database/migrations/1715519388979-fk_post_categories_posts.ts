import { MigrationInterface, QueryRunner } from "typeorm";

export class FkPostCategoriesPosts1715519388979 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "posts_categories"  
            ADD CONSTRAINT "fk_posts_categories_posts"
            FOREIGN KEY ("post_id") REFERENCES "posts" ("id")  ON DELETE CASCADE;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "post_categories"
            DROP FOREIGN KEY "fk_posts_categories_posts";
        `);
    }

}
