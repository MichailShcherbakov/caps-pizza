import locale from "~/pages/panel/products/components/helpers/locale";
import { Product } from "~/services/products.service";

export const getSpecifics = (product: Product): string => {
  let specifics = "";

  if (product.volume) {
    specifics += `${product.volume.value}${locale[product.volume.type]}`;
  }

  if (product.weight) {
    specifics += ` / ${product.weight.value}${locale[product.weight.type]}`;
  }

  return specifics;
};

export default getSpecifics;
