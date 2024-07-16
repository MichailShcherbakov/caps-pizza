import IEntity from "./entity.interface";

export interface IProductCategory extends IEntity {
  name: string;
  image_url?: string | null;
  display: boolean;
  display_position?: number;
  parent_uuid?: string | null;
  parent?: IProductCategory | null;
}

export default IProductCategory;
