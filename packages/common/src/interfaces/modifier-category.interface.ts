import IEntity from "./entity.interface";

export enum ModifierCategoryChoiceOptionEnum {
  ONE = "ONE",
  MANY = "MANY",
}

export enum ModifierCategoryDisplayVariantEnum {
  SWITCHER = "SWITCHER",
  LIST = "LIST",
}

export interface IModifierCategory extends IEntity {
  name: string;
  image_url?: string;
  choice_option: ModifierCategoryChoiceOptionEnum;
  display: boolean;
  display_name?: string;
  display_variant?: ModifierCategoryDisplayVariantEnum;
  display_position?: number;
}

export default IModifierCategory;
