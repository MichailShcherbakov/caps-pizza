import { IProductWithFullPrice } from "interfaces";

export const orderProductsByProfitable = (
  products: IProductWithFullPrice[]
): IProductWithFullPrice[] => {
  const clone = [...products];
  return clone.sort((a, b) =>
    a.fullPrice - b.fullPrice === 0
      ? a.count - b.count
      : a.fullPrice - b.fullPrice
  );
};

export default orderProductsByProfitable;
