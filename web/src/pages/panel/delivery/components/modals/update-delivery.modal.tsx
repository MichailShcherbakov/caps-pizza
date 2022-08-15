import React from "react";
import {
  FormModal,
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
  const [createDelivery] = useUpdateDeliveryMutation();

  return (
    <>
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
                await createDelivery(value).unwrap();
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

export default UpdateDeliveryModal;
