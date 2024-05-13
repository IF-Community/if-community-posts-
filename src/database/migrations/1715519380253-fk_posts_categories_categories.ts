import { MigrationInterface, QueryRunner } from "typeorm";

export class FkPostsCategoriesCategories1715519380253 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "posts_categories"  
            ADD CONSTRAINT "fk_posts_categories_categories"
            FOREIGN KEY ("category_id") REFERENCES "categories" ("id")  ON DELETE CASCADE;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "post_categories"
            DROP FOREIGN KEY "fk_posts_categories_categories";
        `);
    }


}
