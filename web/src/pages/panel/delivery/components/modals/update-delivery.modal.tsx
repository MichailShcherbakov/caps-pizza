import React from "react";
import {
  FormModal,
  LoadingBackdrop,
  ModalController,
  ModalControllerProps,
  ModalProps,
} from "~/ui";
import {
  Delivery,
  useUpdateDeliveryMutation,
} from "~/services/delivery.service";
import UpdateDeliveryForm, {
  UpdateDeliveryFormProps,
  UpdateDeliveryFormSubmitData,
} from "../forms/update-delivery.form";
import { APIError } from "~/services/helpers/transform-response.helper";
import ModalErrorCatcher from "~/common/components/error-catcher/modal";

export interface UpdateDeliveryModalProps
  extends Pick<ModalControllerProps, "children">,
    Pick<ModalProps, "onClose">,
    Pick<UpdateDeliveryFormProps, "onSubmit"> {
  delivery: Delivery;
}

export const UpdateDeliveryModal: React.FC<UpdateDeliveryModalProps> = ({
  delivery,
  children,
  onSubmit,
  onClose,
}) => {
  const [error, setError] = React.useState<APIError | undefined>();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [createDelivery] = useUpdateDeliveryMutation();

  return (
    <>
      <LoadingBackdrop color="secondary" open={loading} />
      <ModalErrorCatcher error={error} />
      <ModalController
        Modal={FormModal}
        ModalProps={{
          onSubmit,
          onClose,
          Form: UpdateDeliveryForm,
          FormProps: {
            delivery,
            onSubmit: async (value: UpdateDeliveryFormSubmitData) => {
              try {
                setLoading(true);

                await createDelivery(value).unwrap();
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

export default UpdateDeliveryModal;
