import {
  ProductVolumeType,
  ProductWeightType,
} from "~/services/products.service";

export const locale = {
  [ProductWeightType.GRAMS]: "гр",
  [ProductWeightType.LITERS]: "л",
  [ProductVolumeType.DIAMETER]: "см",
  [ProductVolumeType.QUANTITY]: "шт",
};

export default locale;
