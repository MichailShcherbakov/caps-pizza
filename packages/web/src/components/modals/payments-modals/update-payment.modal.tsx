import React from "react";
import {
  FormModal,
  LoadingBackdrop,
  ModalController,
  ModalControllerProps,
  ModalProps,
} from "~/ui";
import { Payment, useUpdatePaymentMutation } from "~/services/payments.service";
import PaymentForm, { PaymentFormProps, PaymentFormSubmitData } from "./form";
import { APIError } from "~/services/helpers/transform-response.helper";
import ModalErrorCatcher from "~/components/error-catcher/modal";

export interface UpdatePaymentModalProps
  extends Pick<ModalControllerProps<UpdatePaymentModalProps>, "children">,
    Pick<ModalProps, "onClose"> {
  payment: Payment;
}

export const UpdatePaymentModal: React.FC<UpdatePaymentModalProps> = ({
  payment,
  children,
  onClose,
}) => {
  const [error, setError] = React.useState<APIError>();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [updatePayment] = useUpdatePaymentMutation();

  return (
    <>
      <LoadingBackdrop color="secondary" open={loading} />
      <ModalErrorCatcher error={error} />
      <ModalController
        Modal={FormModal<PaymentFormProps, PaymentFormSubmitData>}
        ModalProps={{
          onClose,
          Form: PaymentForm,
          FormProps: {
            payment,
            variant: "update",
            onSubmit: async value => {
              try {
                setLoading(true);

                await updatePayment({
                  uuid: payment.uuid,
                  ...value,
                }).unwrap();
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

export default UpdatePaymentModal;
