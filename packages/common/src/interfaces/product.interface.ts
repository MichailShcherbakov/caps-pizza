import IEntity from './entity.interface';
import IModifier from './modifier.interface';
import IProductCategory from './product-category.interface';

export enum ProductWeightTypeEnum {
  GRAMS = "GRAMS",
  LITERS = "LITERS",
}

export enum ProductVolumeTypeEnum {
  DIAMETER = "DIAMETER",
  QUANTITY = "QUANTITY",
}

export interface IProductWeight {
  type: ProductWeightTypeEnum;
  value: number;
}

export interface IProductVolume {
  type: ProductVolumeTypeEnum;
  value: number;
}

export interface IProduct extends IEntity {
  name: string;
  desc?: string;
  article_number: number;
  image_url: string;
  price: number;
  weight?: IProductWeight;
  volume?: IProductVolume;
  tags?: string[];
  category_uuid: string;
  category?: IProductCategory;
  modifiers: IModifier[];
}

export default IProduct;