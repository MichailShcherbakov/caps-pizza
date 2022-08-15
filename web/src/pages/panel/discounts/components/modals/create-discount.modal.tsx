import React from "react";
import {
  FormModal,
  ModalController,
  ModalControllerProps,
  ModalProps,
} from "~/ui";
import { useCreateDiscountMutation } from "~/services/discounts.service";
import CreateDiscountForm, {
  CreateDiscountFormProps,
  CreateDiscountFormSubmitData,
} from "../forms/create-discount.form";
import { APIError } from "~/services/helpers/transform-response.helper";
import { useGetProductCategoriesQuery } from "~/services/product-categories.service";
import { useGetModifiersQuery } from "~/services/modifiers.service";
import { useGetProductsQuery } from "~/services/products.service";
import ModalErrorCatcher from "~/common/components/error-catcher/modal";

export interface CreateDiscountModalProps
  extends Pick<ModalControllerProps, "children">,
    Pick<ModalProps, "onClose">,
    Pick<CreateDiscountFormProps, "onSubmit"> {}

export const CreateDiscountModal: React.FC<CreateDiscountModalProps> = ({
  children,
  onSubmit,
  onClose,
}) => {
  const [error, setError] = React.useState<APIError | undefined>();
  const [createDiscount] = useCreateDiscountMutation();
  const { data: products } = useGetProductsQuery();
  const { data: productCategories } = useGetProductCategoriesQuery();
  const { data: modifiers } = useGetModifiersQuery();

  return (
    <>
      <ModalErrorCatcher error={error} />
      <ModalController
        Modal={FormModal}
        ModalProps={{
          onSubmit,
          onClose,
          Form: CreateDiscountForm,
          FormProps: {
            products,
            productCategories,
            modifiers,
            onSubmit: async (value: CreateDiscountFormSubmitData) => {
              try {
                await createDiscount(value).unwrap();
              } catch (e) {
                setError(e);
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

export default CreateDiscountModal;
