import IEntity from "./entity.interface";

export interface IModifierCategory extends IEntity {
  name: string;
  image_url?: string;
  display_position?: number;
}

export default IModifierCategory;