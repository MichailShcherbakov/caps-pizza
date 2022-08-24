import React from "react";
import AppPage from "~/interfaces/app-page.interface";
import OrderLayout from "~/layouts/order";
import OrderForm from "~/components/forms/order-form";
import { Order, useMakeOrderMutation } from "~/services/orders.service";
import ModalErrorCatcher from "~/components/error-catcher/modal";
import { APIError } from "~/services/helpers/transform-response.helper";
import { LoadingBackdrop } from "~/ui";
import OrderMadeSuccessfully from "~/components/stubs/order-made-successfully";
import useShoppingCartActions from "~/hooks/use-shopping-cart-actions";

export const OrderPage: AppPage = () => {
  const { clear } = useShoppingCartActions();
  const [error, setError] = React.useState<APIError>();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [orderNumber, setOrderNumber] = React.useState<number>();
  const [makeOrder] = useMakeOrderMutation();

  const onOrderSubmit = React.useCallback(
    async (order: Order) => {
      try {
        setLoading(true);
        const makeOrderResponse = await makeOrder(order).unwrap();
        setOrderNumber(makeOrderResponse?.order_id);
        clear();
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    },
    [clear, makeOrder]
  );

  return (
    <>
      <LoadingBackdrop open={loading} />
      <ModalErrorCatcher error={error} />
      {orderNumber ? (
        <OrderMadeSuccessfully orderNumber={orderNumber} />
      ) : (
        <OrderForm onSubmit={onOrderSubmit} />
      )}
    </>
  );
};

OrderPage.getLayout = page => {
  return <OrderLayout>{page}</OrderLayout>;
};

export default OrderPage;