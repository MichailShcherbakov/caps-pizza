import { Button, Grid, Stack, Typography } from "@mui/material";
import { useFormik } from "formik";
import React from "react";
import ProductCard from "~/components/shopping-cart-drawer/components/product-card";
import Title from "~/components/title";
import useShoppingCart from "~/hooks/use-shopping-cart";
import { useGetDeliveriesQuery } from "~/services/delivery.service";
import { Order } from "~/services/orders.service";
import { useGetPaymentsQuery } from "~/services/payments.service";
import { MemoTextField, NumberTextField } from "~/ui";
import DeliverySelect from "./components/delivery-select";
import PaymentSelect from "./components/payment-select";
import PhoneNumberField from "./components/phone-number-field";
import validationSchema from "./helpers/validation-schema";
import { getAvailableDeliveries } from "@monorepo/common/modules/delivery/get-available-deliveries";
import styles from "./index.module.scss";
import EmptyShoppingCartStub from "./components/empty-shopping-cart-stub";
import NameField from "./components/name-field";
import OrderFormSkeleton from "./components/skeleton";

export interface OrderFormProps {
  onSubmit?: (order: Order) => void;
}

export const OrderForm: React.FC<OrderFormProps> = ({ onSubmit }) => {
  const { data: payments = [], isLoading: isGetPaymentsLoading } =
    useGetPaymentsQuery();
  const { data: deliveries = [], isLoading: isGetDeliveriesLoading } =
    useGetDeliveriesQuery();
  const {
    products,
    productsCount,
    totalCost,
    discount,
    discountValue,
    isLoading: isShoppingCartLoading,
  } = useShoppingCart();

  const formik = useFormik({
    initialValues: {
      name: "",
      phoneNumber: "",
      email: "",
      address: "",
      house: "",
      entrance: "",
      floor: "",
      apartment: "",
      description: "",
      payment_uuid: "",
      delivery_uuid: "",
    },
    validationSchema,
    onSubmit: value => {
      onSubmit &&
        onSubmit({
          products: (products ?? []).map(product => ({
            uuid: product.uuid,
            count: product.count,
            modifiers: product.modifiers.map(modifier => ({
              uuid: modifier.uuid,
            })),
          })),
          delivery_address: {
            street: value.address,
            house: value.house,
            entrance: Number.parseInt(value.entrance),
            floor: Number.parseInt(value.floor),
            apartment: Number.parseInt(value.apartment),
          },
          client_info: {
            name: value.name,
            phone: value.phoneNumber,
            email: value.email.length ? value.email : undefined,
          },
          description: value.description.length ? value.description : undefined,
          payment_uuid: value.payment_uuid,
          delivery_uuid: value.delivery_uuid,
        });
    },
  });

  const setFieldValue = formik.setFieldValue;
  const availableDeliveries = React.useMemo(() => {
    if (isShoppingCartLoading || isGetDeliveriesLoading) return [];

    const availableDeliveries = getAvailableDeliveries({
      deliveries,
      orderCost: totalCost,
      orderedProductsCount: productsCount,
    });

    if (availableDeliveries.length) {
      setFieldValue("delivery_uuid", availableDeliveries[0].uuid);
    }

    return availableDeliveries;
  }, [
    isShoppingCartLoading,
    isGetDeliveriesLoading,
    deliveries,
    totalCost,
    productsCount,
    setFieldValue,
  ]);

  const currentDelivery = React.useMemo(
    () => availableDeliveries.find(d => d.uuid === formik.values.delivery_uuid),
    [availableDeliveries, formik.values.delivery_uuid]
  );

  const totalOrderCost = React.useMemo(
    () => (totalCost ?? 0) + (currentDelivery?.value ?? 0),
    [currentDelivery, totalCost]
  );

  if (isGetPaymentsLoading || isShoppingCartLoading || isGetDeliveriesLoading)
    return <OrderFormSkeleton />;

  if (!products.length) return <EmptyShoppingCartStub />;

  return (
    <form className={styles["order-form"]} onSubmit={formik.handleSubmit}>
      <Title text="Ваш заказ" />
      <Stack component="ul" className="ui-gap-2">
        {products.map(product => (
          <ProductCard
            key={
              product.uuid +
              product.modifiers.reduce(
                (uuid, modifier) => uuid + modifier.uuid,
                ""
              )
            }
            product={product}
          />
        ))}
      </Stack>
      <Stack alignItems="flex-end" justifyContent="center">
        <Typography variant="h3" component="p">
          {`Итого: ${totalCost} ₽`}
        </Typography>
        {discount ? (
          <Typography variant="subtitle1" component="p">
            {`Скидка: ${discount?.name} ₽ - ${discountValue} ₽`}
          </Typography>
        ) : undefined}
      </Stack>
      <Stack className="ui-gap-4">
        <Title text="О Вас" />
        <Grid spacing={2} rowSpacing={2} container>
          <Grid item xl={4} lg={4} sm={4} xs={12}>
            <NameField
              value={formik.values.name}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid item xl={4} lg={4} sm={4} xs={12}>
            <PhoneNumberField
              id="phoneNumber"
              name="phoneNumber"
              error={
                formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)
              }
              helperText={
                formik.touched.phoneNumber && formik.errors.phoneNumber
              }
              value={formik.values.phoneNumber}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid item xl={4} lg={4} sm={4} xs={12}>
            <MemoTextField
              fullWidth
              id="email"
              name="email"
              label="Почта"
              placeholder="mail-address@mail.ru"
              value={formik.values.email}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              onChange={formik.handleChange}
            />
          </Grid>
        </Grid>
        <Title text="Адрес доставки" />
        <Grid spacing={2} rowSpacing={2} container>
          <Grid item xl={12} lg={12} sm={12} xs={12}>
            <MemoTextField
              fullWidth
              id="address"
              name="address"
              label="Адрес"
              placeholder="Пушкин"
              value={formik.values.address}
              error={formik.touched.address && Boolean(formik.errors.address)}
              helperText={formik.touched.address && formik.errors.address}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid item xl={3} lg={3} sm={6} xs={12}>
            <MemoTextField
              fullWidth
              id="house"
              name="house"
              label="Дом"
              placeholder="1а"
              value={formik.values.house}
              error={formik.touched.house && Boolean(formik.errors.house)}
              helperText={formik.touched.house && formik.errors.house}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid item xl={3} lg={3} sm={6} xs={12}>
            <NumberTextField
              fullWidth
              id="entrance"
              name="entrance"
              label="Парадная"
              placeholder="1"
              min={1}
              max={99}
              value={formik.values.entrance}
              error={formik.touched.entrance && Boolean(formik.errors.entrance)}
              helperText={formik.touched.entrance && formik.errors.entrance}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid item xl={3} lg={3} sm={6} xs={12}>
            <NumberTextField
              fullWidth
              id="floor"
              name="floor"
              label="Этаж"
              placeholder="2"
              min={1}
              max={99}
              value={formik.values.floor}
              error={formik.touched.floor && Boolean(formik.errors.floor)}
              helperText={formik.touched.floor && formik.errors.floor}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid item xl={3} lg={3} sm={6} xs={12}>
            <NumberTextField
              fullWidth
              id="apartment"
              name="apartment"
              label="Квартира"
              placeholder="15"
              min={1}
              max={999}
              value={formik.values.apartment}
              error={
                formik.touched.apartment && Boolean(formik.errors.apartment)
              }
              helperText={formik.touched.apartment && formik.errors.apartment}
              onChange={formik.handleChange}
            />
          </Grid>
        </Grid>
        {payments.length ? (
          <>
            <Title text="Оплата" />
            <PaymentSelect
              id="payment_uuid"
              name="payment_uuid"
              payments={payments}
              value={formik.values.payment_uuid}
              error={
                formik.touched.payment_uuid &&
                Boolean(formik.errors.payment_uuid)
              }
              helperText={
                formik.touched.payment_uuid
                  ? formik.errors.payment_uuid
                  : undefined
              }
              onChange={formik.handleChange}
            />
          </>
        ) : undefined}
        {availableDeliveries.length ? (
          <>
            <Title text="Доставка" />
            <DeliverySelect
              id="delivery_uuid"
              name="delivery_uuid"
              deliveries={availableDeliveries}
              value={formik.values.delivery_uuid}
              error={
                formik.touched.delivery_uuid &&
                Boolean(formik.errors.delivery_uuid)
              }
              helperText={
                formik.touched.delivery_uuid
                  ? formik.errors.delivery_uuid
                  : undefined
              }
              onChange={formik.handleChange}
            />
          </>
        ) : undefined}
        <Title text="Комментарий" />
        <MemoTextField
          multiline
          id="description"
          name="description"
          placeholder="Есть уточнения?"
          rows={6}
          value={formik.values.description}
          error={
            formik.touched.description && Boolean(formik.errors.description)
          }
          helperText={formik.touched.description && formik.errors.description}
          onChange={formik.handleChange}
        />
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Stack>
            <Typography variant="h3" component="p">
              {`Итого: ${totalOrderCost} ₽`}
            </Typography>
            {discount ? (
              <Typography variant="subtitle1" component="p">
                {`Скидка: ${discount?.name} ₽ - ${discountValue} ₽`}
              </Typography>
            ) : undefined}
            {currentDelivery ? (
              <Typography variant="subtitle1" component="p">
                {`Доставка: ${currentDelivery.name} - ${currentDelivery.value} ₽`}
              </Typography>
            ) : undefined}
          </Stack>
          <Button type="submit" variant="contained">
            <Typography variant="button">Оформить заказ</Typography>
          </Button>
        </Stack>
      </Stack>
    </form>
  );
};

export default OrderForm;