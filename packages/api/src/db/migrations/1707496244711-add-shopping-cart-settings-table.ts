import { MigrationInterface, QueryRunner } from "typeorm";

export class addShoppingCartSettingsTable1707496244711
  implements MigrationInterface
{
  name = "addShoppingCartSettingsTable1707496244711";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "shopping_cart_settings" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "minimum_order_amount" integer NOT NULL, CONSTRAINT "PK_cd884a5eafaa12995f6392bfd56" PRIMARY KEY ("uuid"))`
    );

    await queryRunner.query(
      `INSERT INTO "shopping_cart_settings" ("minimum_order_amount") VALUES (1000)`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "shopping_cart_settings"`);
  }
}
