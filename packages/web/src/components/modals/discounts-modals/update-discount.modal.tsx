import React from "react";
import {
  FormModal,
  LoadingBackdrop,
  ModalController,
  ModalControllerProps,
  ModalProps,
} from "~/ui";
import {
  Discount,
  useUpdateDiscountMutation,
} from "~/services/discounts.service";
import UpdateDiscountForm, {
  UpdateDiscountFormProps,
  UpdateDiscountFormSubmitData,
} from "./forms/update-discount.form";
import { APIError } from "~/services/helpers/transform-response.helper";
import { useGetProductCategoriesQuery } from "~/services/product-categories.service";
import { useGetModifiersQuery } from "~/services/modifiers.service";
import { useGetProductsQuery } from "~/services/products.service";
import ModalErrorCatcher from "~/components/error-catcher/modal";

export interface UpdateDiscountModalProps
  extends Pick<ModalControllerProps, "children">,
    Pick<ModalProps, "onClose"> {
  discount: Discount;
}

export const UpdateDiscountModal: React.FC<UpdateDiscountModalProps> = ({
  discount,
  children,
  onClose,
}) => {
  const [error, setError] = React.useState<APIError | undefined>();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [updateDiscount] = useUpdateDiscountMutation();
  const { data: products = [] } = useGetProductsQuery();
  const { data: productCategories = [] } = useGetProductCategoriesQuery();
  const { data: modifiers = [] } = useGetModifiersQuery();

  return (
    <>
      <LoadingBackdrop color="secondary" open={loading} />
      <ModalErrorCatcher error={error} />
      <ModalController
        Modal={FormModal<UpdateDiscountFormProps, UpdateDiscountFormSubmitData>}
        ModalProps={{
          onClose,
          Form: UpdateDiscountForm,
          FormProps: {
            discount,
            products,
            productCategories,
            modifiers,
            onSubmit: async value => {
              try {
                setLoading(true);

                await updateDiscount(value).unwrap();
              } catch (e) {
                setError(e);
              } finally {
                setLoading(false);
              }
            },
          },
        }}
      >
        {children}
      </ModalController>
    </>
  );
};

export default UpdateDiscountModal;
