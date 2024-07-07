import { Column, Entity, JoinTable, ManyToMany } from "typeorm";
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

  @ManyToMany(() => ProductCategoryEntity)
  @JoinTable({
    name: "products_categories",
    joinColumn: {
      name: "product",
      referencedColumnName: "uuid",
      foreignKeyConstraintName: "fk_products_categories_product_uuid",
    },
    inverseJoinColumn: {
      name: "category",
      referencedColumnName: "uuid",
      foreignKeyConstraintName: "fk_products_categories_category_uuid",
    },
  })
  categories: ProductCategoryEntity[];

  @ManyToMany(() => ModifierEntity)
  @JoinTable({
    name: "products_modifiers",
    joinColumn: {
      name: "product",
      referencedColumnName: "uuid",
      foreignKeyConstraintName: "fk_products_modifiers_product_uuid",
    },
    inverseJoinColumn: {
      name: "modifier",
      referencedColumnName: "uuid",
      foreignKeyConstraintName: "fk_products_modifiers_modifier_uuid",
    },
  })
  modifiers: ModifierEntity[];

  static compare(a?: ProductEntity, b?: ProductEntity): number {
    if (!a && b) return 1;
    else if (a && !b) return -1;
    else if (!a || !b) return 0;
    else if (a.name < b.name) return -1;
    else if (a.name > b.name) return 1;
    return 0;
  }
}

export default ProductEntity;
