import { useDispatch } from "react-redux";
import { useAppSelector } from "~/store/hook";
import {
  addProduct,
  updateProduct,
  removeProduct,
  selectOrderedProducts,
} from "~/store/order.reducer";
import * as uuid from "uuid";

export const useProductOrderList = () => {
  const maxOrdersPerProductAllowedNumber = useAppSelector(
    (state) => state.config.maxOrdersPerProductAllowedNumber
  );

  const orderedProducts = useAppSelector(selectOrderedProducts);

  const dispatch = useDispatch();

  return {
    orderedProducts,
    addProduct: ({ productUUID, price }) => {
      const existsOrderedProduct = orderedProducts.find(
        (p) => p.productUUID === productUUID && p.price === price
      );

      if (
        existsOrderedProduct &&
        existsOrderedProduct.count + 1 <= maxOrdersPerProductAllowedNumber
      ) {
        dispatch(
          updateProduct({
            orderedProductUUID: existsOrderedProduct.orderedProductUUID,
            count: existsOrderedProduct.count + 1,
          })
        );
        return;
      }

      dispatch(
        addProduct({
          orderedProductUUID: uuid.v4(),
          productUUID,
          price,
          count: 1,
        })
      );
    },
    removeProduct: (
      orderedProductUUID: string,
      options: Partial<{ force: boolean }> = {}
    ) => {
      const existsOrderedProduct = orderedProducts.find(
        (p) => p.orderedProductUUID === orderedProductUUID
      );

      if (!existsOrderedProduct) return;

      if (!options.force && existsOrderedProduct.count - 1 > 0) {
        dispatch(
          updateProduct({
            orderedProductUUID: existsOrderedProduct.orderedProductUUID,
            count: existsOrderedProduct.count - 1,
          })
        );
        return;
      }

      dispatch(removeProduct(orderedProductUUID));
    },
  };
};
