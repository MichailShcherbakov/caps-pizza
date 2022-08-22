import IEntity from "./entity.interface";
import IModifierCategory from "./modifier-category.interface";

export interface IModifier extends IEntity {
  name: string;
  desc?: string;
  article_number: number;
  image_url?: string;
  price: number;
  display_position?: number;
  category_uuid: string;
  category?: IModifierCategory;
}

export default IModifier;
