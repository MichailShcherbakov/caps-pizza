import IEntity from "./entity.interface";

export interface IPromotion extends IEntity {
  name: string;
  image_url: string;
  display: boolean;
  display_position: number;
}

export default IPromotion;
