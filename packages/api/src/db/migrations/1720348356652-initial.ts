import { MigrationInterface, QueryRunner } from "typeorm";

export class initial1720348356652 implements MigrationInterface {
  name = "initial1720348356652";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "deliveries" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "article_number" integer NOT NULL, "type" character varying NOT NULL, "condition" jsonb NOT NULL, "value" real NOT NULL, CONSTRAINT "UQ_69f5d9e2ce3ae06c8df7b7f2ea3" UNIQUE ("name"), CONSTRAINT "UQ_9129b57e91d37f9b9629dd6bb81" UNIQUE ("article_number"), CONSTRAINT "PK_ff55105614d685fe85e2c8eb1cd" PRIMARY KEY ("uuid"))`
    );
    await queryRunner.query(
      `CREATE TABLE "modifier_categories" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "image_url" character varying, "choice_option" character varying NOT NULL, "display" boolean NOT NULL, "display_name" character varying, "display_variant" character varying NOT NULL, "display_position" integer, CONSTRAINT "UQ_4f75f7e2fc25dca7925936cd139" UNIQUE ("name"), CONSTRAINT "UQ_e2a0a9058f70e461d3f7d73643b" UNIQUE ("display_name"), CONSTRAINT "PK_ba093fea1f3bd5762fbe31e8d3f" PRIMARY KEY ("uuid"))`
    );
    await queryRunner.query(
      `CREATE TABLE "modifiers" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "desc" character varying, "article_number" integer NOT NULL, "image_url" character varying, "price" real NOT NULL, "display" boolean NOT NULL, "display_position" integer, "category_uuid" uuid NOT NULL, CONSTRAINT "UQ_b8d32d4e89c94302715190fd89c" UNIQUE ("article_number"), CONSTRAINT "PK_7b21ffa12113eb91624e9761694" PRIMARY KEY ("uuid"))`
    );
    await queryRunner.query(
      `CREATE TABLE "product_categories" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "image_url" character varying, "display" boolean NOT NULL, "display_position" integer, "parent_uuid" uuid, CONSTRAINT "UQ_a75bfadcd8291a0538ab7abfdcf" UNIQUE ("name"), CONSTRAINT "PK_9da897b4b067fca0ceb55f33244" PRIMARY KEY ("uuid"))`
    );
    await queryRunner.query(
      `CREATE TABLE "products" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "desc" character varying, "article_number" integer NOT NULL, "image_url" character varying NOT NULL, "price" real NOT NULL, "weight" jsonb, "volume" jsonb, "display" boolean NOT NULL, CONSTRAINT "UQ_e5c2185abb85fad82c0b42ee76a" UNIQUE ("article_number"), CONSTRAINT "PK_98086f14e190574534d5129cd7c" PRIMARY KEY ("uuid"))`
    );
    await queryRunner.query(
      `CREATE TABLE "discount_strategies" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "discount_uuid" uuid NOT NULL, "condition" jsonb NOT NULL, CONSTRAINT "PK_f2efee98b216791d57c3a8d0844" PRIMARY KEY ("uuid"))`
    );
    await queryRunner.query(
      `CREATE TABLE "discounts" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "type" character varying NOT NULL, "value" real NOT NULL, CONSTRAINT "UQ_3c74d020d5ba37d5a01274010c0" UNIQUE ("name"), CONSTRAINT "PK_37a6d68689398082aa3698d7bd4" PRIMARY KEY ("uuid"))`
    );
    await queryRunner.query(
      `CREATE TABLE "payments" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "code" integer NOT NULL, CONSTRAINT "UQ_0709f8e16a95417c3b805e8581e" UNIQUE ("name"), CONSTRAINT "UQ_2b3c754ea3bf83cab000b8ed3d4" UNIQUE ("code"), CONSTRAINT "PK_2c540326a039a91fa7e942caed7" PRIMARY KEY ("uuid"))`
    );
    await queryRunner.query(
      `CREATE TABLE "promotions" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "image_url" character varying NOT NULL, "display" boolean NOT NULL, "display_position" integer NOT NULL, CONSTRAINT "UQ_c1860010d8ccb782e747f0947e8" UNIQUE ("name"), CONSTRAINT "UQ_93f66f823fb02fa527b3c6c7865" UNIQUE ("image_url"), CONSTRAINT "PK_d155814d79dbe9c19a51393f94b" PRIMARY KEY ("uuid"))`
    );
    await queryRunner.query(
      `CREATE TABLE "shopping_cart_settings" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "minimum_order_amount" integer NOT NULL, CONSTRAINT "PK_cd884a5eafaa12995f6392bfd56" PRIMARY KEY ("uuid"))`
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "password_hash" character varying NOT NULL, "salt" character varying NOT NULL, CONSTRAINT "UQ_51b8b26ac168fbe7d6f5653e6cf" UNIQUE ("name"), CONSTRAINT "PK_951b8f1dfc94ac1d0301a14b7e1" PRIMARY KEY ("uuid"))`
    );
    await queryRunner.query(
      `CREATE TABLE "products_categories" ("product" uuid NOT NULL, "category" uuid NOT NULL, CONSTRAINT "PK_f93b173fa35df26da388cbc852f" PRIMARY KEY ("product", "category"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_97239818a1206ab8825a710060" ON "products_categories" ("product") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_bba9d5d0abe32da9062cc6bd14" ON "products_categories" ("category") `
    );
    await queryRunner.query(
      `CREATE TABLE "products_modifiers" ("product" uuid NOT NULL, "modifier" uuid NOT NULL, CONSTRAINT "PK_157182211c6cfa2d61bfc5c34f5" PRIMARY KEY ("product", "modifier"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_caa1ddf58f78c91208ae80e225" ON "products_modifiers" ("product") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c6e560057e67e86d072cd66403" ON "products_modifiers" ("modifier") `
    );
    await queryRunner.query(
      `CREATE TABLE "discount_strategy_products" ("discount_strategy" uuid NOT NULL, "modifier" uuid NOT NULL, CONSTRAINT "PK_ec7797574f5cea9589caaef29c0" PRIMARY KEY ("discount_strategy", "modifier"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_39c07d95fc7fdb38a93c4b5136" ON "discount_strategy_products" ("discount_strategy") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_388dd5bfc6d44e3f1b9bfd37f4" ON "discount_strategy_products" ("modifier") `
    );
    await queryRunner.query(
      `CREATE TABLE "discount_strategy_product_categories" ("discount_strategy" uuid NOT NULL, "modifier" uuid NOT NULL, CONSTRAINT "PK_939bec379b2ab1db2238ecac03b" PRIMARY KEY ("discount_strategy", "modifier"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_50ff9144ec336c4ae9a9d89fbc" ON "discount_strategy_product_categories" ("discount_strategy") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_77324b3cc3a9e5a527f42eab8c" ON "discount_strategy_product_categories" ("modifier") `
    );
    await queryRunner.query(
      `CREATE TABLE "discount_strategy_modifiers" ("discount_strategy" uuid NOT NULL, "modifier" uuid NOT NULL, CONSTRAINT "PK_c30bffb3eb76e58818b0f0a1a24" PRIMARY KEY ("discount_strategy", "modifier"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_cef5c649dfccb48a857a18b5af" ON "discount_strategy_modifiers" ("discount_strategy") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4697db9602f3e36cb86b9f2cc2" ON "discount_strategy_modifiers" ("modifier") `
    );
    await queryRunner.query(
      `ALTER TABLE "modifiers" ADD CONSTRAINT "fk_modifiers_category_uuid" FOREIGN KEY ("category_uuid") REFERENCES "modifier_categories"("uuid") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "product_categories" ADD CONSTRAINT "fk_product_categories_parent_uuid" FOREIGN KEY ("parent_uuid") REFERENCES "product_categories"("uuid") ON DELETE SET NULL ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "discount_strategies" ADD CONSTRAINT "fk_discount_uuid" FOREIGN KEY ("discount_uuid") REFERENCES "discounts"("uuid") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "products_categories" ADD CONSTRAINT "fk_products_categories_product_uuid" FOREIGN KEY ("product") REFERENCES "products"("uuid") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "products_categories" ADD CONSTRAINT "fk_products_categories_category_uuid" FOREIGN KEY ("category") REFERENCES "product_categories"("uuid") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "products_modifiers" ADD CONSTRAINT "fk_products_modifiers_product_uuid" FOREIGN KEY ("product") REFERENCES "products"("uuid") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "products_modifiers" ADD CONSTRAINT "fk_products_modifiers_modifier_uuid" FOREIGN KEY ("modifier") REFERENCES "modifiers"("uuid") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "discount_strategy_products" ADD CONSTRAINT "fk_discount_strategy_products_discount_strategy_uuid" FOREIGN KEY ("discount_strategy") REFERENCES "discount_strategies"("uuid") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "discount_strategy_products" ADD CONSTRAINT "fk_discount_strategy_products_modifier_uuid" FOREIGN KEY ("modifier") REFERENCES "products"("uuid") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "discount_strategy_product_categories" ADD CONSTRAINT "fk_discount_strategy_product_categories_discount_strategy_uuid" FOREIGN KEY ("discount_strategy") REFERENCES "discount_strategies"("uuid") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "discount_strategy_product_categories" ADD CONSTRAINT "fk_discount_strategy_product_categories_modifier_uuid" FOREIGN KEY ("modifier") REFERENCES "product_categories"("uuid") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "discount_strategy_modifiers" ADD CONSTRAINT "fk_discount_strategy_modifiers_discount_strategy_uuid" FOREIGN KEY ("discount_strategy") REFERENCES "discount_strategies"("uuid") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "discount_strategy_modifiers" ADD CONSTRAINT "fk_discount_strategy_modifiers_modifier_uuid" FOREIGN KEY ("modifier") REFERENCES "modifiers"("uuid") ON DELETE CASCADE ON UPDATE CASCADE`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "discount_strategy_modifiers" DROP CONSTRAINT "fk_discount_strategy_modifiers_modifier_uuid"`
    );
    await queryRunner.query(
      `ALTER TABLE "discount_strategy_modifiers" DROP CONSTRAINT "fk_discount_strategy_modifiers_discount_strategy_uuid"`
    );
    await queryRunner.query(
      `ALTER TABLE "discount_strategy_product_categories" DROP CONSTRAINT "fk_discount_strategy_product_categories_modifier_uuid"`
    );
    await queryRunner.query(
      `ALTER TABLE "discount_strategy_product_categories" DROP CONSTRAINT "fk_discount_strategy_product_categories_discount_strategy_uuid"`
    );
    await queryRunner.query(
      `ALTER TABLE "discount_strategy_products" DROP CONSTRAINT "fk_discount_strategy_products_modifier_uuid"`
    );
    await queryRunner.query(
      `ALTER TABLE "discount_strategy_products" DROP CONSTRAINT "fk_discount_strategy_products_discount_strategy_uuid"`
    );
    await queryRunner.query(
      `ALTER TABLE "products_modifiers" DROP CONSTRAINT "fk_products_modifiers_modifier_uuid"`
    );
    await queryRunner.query(
      `ALTER TABLE "products_modifiers" DROP CONSTRAINT "fk_products_modifiers_product_uuid"`
    );
    await queryRunner.query(
      `ALTER TABLE "products_categories" DROP CONSTRAINT "fk_products_categories_category_uuid"`
    );
    await queryRunner.query(
      `ALTER TABLE "products_categories" DROP CONSTRAINT "fk_products_categories_product_uuid"`
    );
    await queryRunner.query(
      `ALTER TABLE "discount_strategies" DROP CONSTRAINT "fk_discount_uuid"`
    );
    await queryRunner.query(
      `ALTER TABLE "product_categories" DROP CONSTRAINT "fk_product_categories_parent_uuid"`
    );
    await queryRunner.query(
      `ALTER TABLE "modifiers" DROP CONSTRAINT "fk_modifiers_category_uuid"`
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4697db9602f3e36cb86b9f2cc2"`
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_cef5c649dfccb48a857a18b5af"`
    );
    await queryRunner.query(`DROP TABLE "discount_strategy_modifiers"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_77324b3cc3a9e5a527f42eab8c"`
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_50ff9144ec336c4ae9a9d89fbc"`
    );
    await queryRunner.query(
      `DROP TABLE "discount_strategy_product_categories"`
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_388dd5bfc6d44e3f1b9bfd37f4"`
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_39c07d95fc7fdb38a93c4b5136"`
    );
    await queryRunner.query(`DROP TABLE "discount_strategy_products"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_c6e560057e67e86d072cd66403"`
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_caa1ddf58f78c91208ae80e225"`
    );
    await queryRunner.query(`DROP TABLE "products_modifiers"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_bba9d5d0abe32da9062cc6bd14"`
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_97239818a1206ab8825a710060"`
    );
    await queryRunner.query(`DROP TABLE "products_categories"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "shopping_cart_settings"`);
    await queryRunner.query(`DROP TABLE "promotions"`);
    await queryRunner.query(`DROP TABLE "payments"`);
    await queryRunner.query(`DROP TABLE "discounts"`);
    await queryRunner.query(`DROP TABLE "discount_strategies"`);
    await queryRunner.query(`DROP TABLE "products"`);
    await queryRunner.query(`DROP TABLE "product_categories"`);
    await queryRunner.query(`DROP TABLE "modifiers"`);
    await queryRunner.query(`DROP TABLE "modifier_categories"`);
    await queryRunner.query(`DROP TABLE "deliveries"`);
  }
}
