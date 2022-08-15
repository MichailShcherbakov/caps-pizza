import React from "react";
import {
  FormModal,
  ModalController,
  ModalControllerProps,
  ModalProps,
} from "~/ui";
import { useCreateDeliveryMutation } from "~/services/delivery.service";
import CreateDeliveryForm, {
  CreateDeliveryFormProps,
  CreateDeliveryFormSubmitData,
} from "../forms/create-delivery.form";
import { APIError } from "~/services/helpers/transform-response.helper";
import ModalErrorCatcher from "~/common/components/error-catcher/modal";

export interface CreateDeliveryModalProps
  extends Pick<ModalControllerProps, "children">,
    Pick<ModalProps, "onClose">,
    Pick<CreateDeliveryFormProps, "onSubmit"> {}

export const CreateDeliveryModal: React.FC<CreateDeliveryModalProps> = ({
  children,
  onSubmit,
  onClose,
}) => {
  const [error, setError] = React.useState<APIError | undefined>();
  const [createDelivery] = useCreateDeliveryMutation();

  return (
    <>
      <ModalErrorCatcher error={error} />
      <ModalController
        Modal={FormModal}
        ModalProps={{
          onSubmit,
          onClose,
          Form: CreateDeliveryForm,
          FormProps: {
            onSubmit: async (value: CreateDeliveryFormSubmitData) => {
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

export default CreateDeliveryModal;
