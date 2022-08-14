import React from "react";
import { Button, ButtonProps } from "@mui/material";
import { ModalController } from "~/ui";
import {
  Discount,
  useUpdateDiscountMutation,
} from "~/services/discounts.service";
import UpdateDiscountForm from "./update-discount.form";
import { APIError } from "~/services/helpers/transform-response.helper";
import { useGetProductCategoriesQuery } from "~/services/product-categories.service";
import { useGetModifiersQuery } from "~/services/modifiers.service";
import { useGetProductsQuery } from "~/services/products.service";
import ModalErrorCatcher from "~/common/components/error-catcher/modal";

export interface UpdateDiscountModalProps extends ButtonProps {
  discount: Discount;
}

export const UpdateDiscountModal: React.FC<UpdateDiscountModalProps> = ({
  discount,
  ...props
}) => {
  const [error, setError] = React.useState<APIError | undefined>();
  const [updateDiscount] = useUpdateDiscountMutation();
  const { data: products } = useGetProductsQuery();
  const { data: productCategories } = useGetProductCategoriesQuery();
  const { data: modifiers } = useGetModifiersQuery();

  const modalController = React.useCallback(
    ({ open }) => (
      <Button
        {...props}
        variant="outlined"
        color="warning"
        size="small"
        onClick={open}
      >
        Изменить
      </Button>
    ),
    [props]
  );

  return (
    <>
      <ModalErrorCatcher error={error} />
      <ModalController
        Modal={UpdateDiscountForm}
        ModalProps={{
          discount,
          products,
          productCategories,
          modifiers,
          onSubmit: async value => {
            try {
              await updateDiscount(value).unwrap();
            } catch (e) {
              setError(e);
            }
          },
        }}
      >
        {modalController}
      </ModalController>
    </>
  );
};

export default UpdateDiscountModal;
