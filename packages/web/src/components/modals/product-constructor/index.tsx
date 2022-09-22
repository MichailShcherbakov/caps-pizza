import React from "react";
import useShoppingCartActions from "~/hooks/use-shopping-cart-actions";
import {
  FormModal,
  ModalController,
  ModalControllerProps,
  Snackbar,
} from "~/ui";
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
  const [showSnackbar, setShowSnackbar] = React.useState<boolean>(false);
  const { addProduct } = useShoppingCartActions();

  const handleClose = React.useCallback(() => {
    setShowSnackbar(false);
  }, []);

  return (
    <>
      <ModalController
        Modal={
          FormModal<
            ProductConstructorFormProps,
            ProductConstructorFormSubmitData
          >
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

              setShowSnackbar(true);
            },
          },
        }}
      >
        {children}
      </ModalController>
      <Snackbar
        open={showSnackbar}
        onClose={handleClose}
        label="Товар добавлен в корзину"
      />
    </>
  );
};

export default ProductConstructorModal;
