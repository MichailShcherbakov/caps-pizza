import { IProductWithFullPrice } from "interfaces";

export const orderProductsByProfitable = (
  products: IProductWithFullPrice[]
): IProductWithFullPrice[] => {
  const clone = [...products];
  return clone.sort((a, b) =>
    b.fullPrice - a.fullPrice === 0
      ? b.count - a.count
      : b.fullPrice - a.fullPrice
  );
};

export default orderProductsByProfitable;
