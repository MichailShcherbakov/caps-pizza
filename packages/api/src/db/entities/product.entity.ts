import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
} from "typeorm";
import ProductCategoryEntity from "./product-category.entity";
import IEntity from "./entity.inteface";
import ModifierEntity from "./modifier.entity";
import { IsEnum, IsNotEmpty, IsNumber } from "class-validator";
import {
  IProduct,
  IProductVolume,
  IProductWeight,
  ProductVolumeTypeEnum,
  ProductWeightTypeEnum,
} from "@monorepo/common";

export { ProductVolumeTypeEnum, ProductWeightTypeEnum };

export class ProductWeight implements IProductWeight {
  @IsEnum(ProductWeightTypeEnum)
  @IsNotEmpty()
  type: ProductWeightTypeEnum;

  @IsNumber()
  @IsNotEmpty()
  value: number;
}
export class ProductVolume implements IProductVolume {
  @IsEnum(ProductVolumeTypeEnum)
  @IsNotEmpty()
  type: ProductVolumeTypeEnum;

  @IsNumber()
  @IsNotEmpty()
  value: number;
}

@Entity("products")
export class ProductEntity extends IEntity implements IProduct {
  @Column()
  name: string;

  @Column({ nullable: true })
  desc?: string;

  @Column({ type: "int4", unique: true })
  article_number: number;

  @Column()
  image_url: string;

  @Column({ type: "float4" })
  price: number;

  @Column({ type: "jsonb", nullable: true })
  weight?: ProductWeight;

  @Column({ type: "jsonb", nullable: true })
  volume?: ProductVolume;

  @Column({ type: "jsonb", nullable: true })
  tags?: string[];

  @Column({ type: "uuid" })
  category_uuid: string;

  @ManyToOne(() => ProductCategoryEntity, { onDelete: "CASCADE" })
  @JoinColumn({
    name: "category_uuid",
    referencedColumnName: "uuid",
    foreignKeyConstraintName: "fk_products_category_uuid",
  })
  category?: ProductCategoryEntity;

  @ManyToMany(() => ModifierEntity)
  @JoinTable({
    name: "product_modifiers",
    joinColumn: {
      name: "product",
      referencedColumnName: "uuid",
      foreignKeyConstraintName: "fk_product_modifiers_product_uuid",
    },
    inverseJoinColumn: {
      name: "modifier",
      referencedColumnName: "uuid",
      foreignKeyConstraintName: "fk_product_modifiers_modifier_uuid",
    },
  })
  modifiers: ModifierEntity[];

  static compare(a?: ProductEntity, b?: ProductEntity): number {
    const categoryCompare = ProductCategoryEntity.compare(
      a?.category,
      b?.category
    );

    if (categoryCompare !== 0) return categoryCompare;
    else if (!a && b) return 1;
    else if (a && !b) return -1;
    else if (!a || !b) return 0;
    else if (a.name < b.name) return -1;
    else if (a.name > b.name) return 1;
    return 0;
  }
}

export default ProductEntity;
