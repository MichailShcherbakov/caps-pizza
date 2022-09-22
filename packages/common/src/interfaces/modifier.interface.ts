import IEntity from "./entity.interface";
import IModifierCategory from "./modifier-category.interface";

export interface IModifier extends IEntity {
  name: string;
  desc?: string;
  article_number: number;
  image_url?: string;
  price: number;
  category_uuid: string;
  category?: IModifierCategory;
  display: boolean;
  display_position?: number;
}

export default IModifier;
