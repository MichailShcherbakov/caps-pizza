import React from "react";
import useShoppingCartActions from "~/hooks/use-shopping-cart-actions";
import { FormModal, ModalController, ModalControllerProps } from "~/ui";
import ProductConstructorForm, {
  ProductConstructorFormProps,
  ProductConstructorFormSubmitData,
} from "./form";

export interface ProductConstructorModalProps
  extends Pick<ModalControllerProps, "children">,
    ProductConstructorFormProps {}

export const ProductConstructorModal: React.FC<
  ProductConstructorModalProps
> = ({ children, ...props }) => {
  const { addProduct } = useShoppingCartActions();

  return (
    <ModalController
      Modal={
        FormModal<ProductConstructorFormProps, ProductConstructorFormSubmitData>
      }
      ModalProps={{
        Form: ProductConstructorForm,
        FormProps: {
          ...props,
          onSubmit({ chosenModifiers }) {
            addProduct({
              uuid: props.product.uuid,
              modifiers: chosenModifiers.map(modifier => ({
                uuid: modifier.uuid,
              })),
            });
          },
        },
      }}
    >
      {children}
    </ModalController>
  );
};

export default ProductConstructorModal;
