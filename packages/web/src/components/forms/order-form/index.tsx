import { Button, Grid, Stack, Typography } from "@mui/material";
import { useFormik } from "formik";
import React from "react";
import ProductCard from "~/components/shopping-cart-drawer/components/product-card";
import Title from "~/components/title";
import useShoppingCart from "~/hooks/use-shopping-cart";
import { useGetDeliveriesQuery } from "~/services/delivery.service";
import { Order } from "~/services/orders.service";
import { useGetPaymentsQuery } from "~/services/payments.service";
import { NumberTextField } from "~/ui";
import DeliverySelect from "./components/delivery-select";
import PaymentSelect from "./components/payment-select";
import PhoneNumberField from "./components/phone-number-field";
import validationSchema from "./helpers/validation-schema";
import { getAvailableDeliveries } from "@monorepo/common/modules/delivery/get-available-deliveries";
import EmptyShoppingCartStub from "./components/empty-shopping-cart-stub";
import NameField from "./components/name-field";
import OrderFormSkeleton from "./components/skeleton";
import { useOrderCache } from "~/hooks/use-order-cache";
import LimitedTextField from "~/ui/components/text-field/limited";

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
    discounts,
    isLoading: isShoppingCartLoading,
  } = useShoppingCart();
  const { cache, write } = useOrderCache();

  const formik = useFormik({
    initialValues: {
      name: cache.client_info?.name ?? "",
      phoneNumber: cache.client_info?.phone ?? "",
      email: cache.client_info?.email ?? "",
      address: cache.delivery_address?.street ?? "",
      house: cache.delivery_address?.house ?? "",
      entrance: cache.delivery_address?.entrance.toString() ?? "",
      floor: cache.delivery_address?.floor.toString() ?? "",
      apartment: cache.delivery_address?.apartment.toString() ?? "",
      description: "",
      payment_uuid: "",
      delivery_uuid: "",
    },
    validationSchema,
    onSubmit: value => {
      const order: Order = {
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
          phone: value.phoneNumber.replaceAll(/[+ ]/g, ""),
          email: value.email.length ? value.email : undefined,
        },
        description: value.description.length ? value.description : undefined,
        payment_uuid: value.payment_uuid,
        delivery_uuid: value.delivery_uuid,
      };

      write({
        cache: {
          client_info: order.client_info,
          delivery_address: order.delivery_address,
        },
      });

      onSubmit && onSubmit(order);
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

  React.useEffect(() => {
    if (cache.client_info?.name) setFieldValue("name", cache.client_info.name);

    /* Phone number is not stored */

    if (cache.client_info?.email)
      setFieldValue("email", cache.client_info.email);

    if (cache.delivery_address?.street)
      setFieldValue("address", cache.delivery_address.street);

    if (cache.delivery_address?.house)
      setFieldValue("house", cache.delivery_address.house);

    if (cache.delivery_address?.entrance)
      setFieldValue("entrance", cache.delivery_address.entrance);

    if (cache.delivery_address?.floor)
      setFieldValue("floor", cache.delivery_address.floor);

    if (cache.delivery_address?.apartment)
      setFieldValue("apartment", cache.delivery_address.apartment);
  }, [cache, setFieldValue]);

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
    <Stack
      component="form"
      direction="column"
      spacing={4}
      py={1}
      onSubmit={formik.handleSubmit}
    >
      <Title text="Ваш заказ" />
      <Stack component="ul" spacing={2}>
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
        {discounts.map(({ discount, discountValue }) => (
          <Typography key={discount.name} variant="subtitle1" component="p">
            {`Скидка: ${discount.name} - ${discountValue} ₽`}
          </Typography>
        ))}
      </Stack>
      <Stack spacing={4}>
        <Title text="О Вас" />
        <Stack>
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
                  formik.touched.phoneNumber &&
                  Boolean(formik.errors.phoneNumber)
                }
                helperText={
                  formik.touched.phoneNumber && formik.errors.phoneNumber
                }
                value={formik.values.phoneNumber}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xl={4} lg={4} sm={4} xs={12}>
              <LimitedTextField
                fullWidth
                id="email"
                name="email"
                label="Почта"
                maxLength={50}
                placeholder="mail-address@mail.ru"
                value={formik.values.email}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                onChange={formik.handleChange}
              />
            </Grid>
          </Grid>
        </Stack>
        <Title text="Адрес доставки" />
        <Stack>
          <Grid spacing={2} rowSpacing={2} container>
            <Grid item xl={12} lg={12} sm={12} xs={12}>
              <LimitedTextField
                fullWidth
                id="address"
                name="address"
                label="Адрес"
                maxLength={50}
                placeholder="Пушкин"
                value={formik.values.address}
                error={formik.touched.address && Boolean(formik.errors.address)}
                helperText={formik.touched.address && formik.errors.address}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xl={3} lg={3} sm={6} xs={12}>
              <LimitedTextField
                fullWidth
                id="house"
                name="house"
                label="Дом"
                placeholder="1а"
                maxLength={4}
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
                error={
                  formik.touched.entrance && Boolean(formik.errors.entrance)
                }
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
                max={9999}
                value={formik.values.apartment}
                error={
                  formik.touched.apartment && Boolean(formik.errors.apartment)
                }
                helperText={formik.touched.apartment && formik.errors.apartment}
                onChange={formik.handleChange}
              />
            </Grid>
          </Grid>
        </Stack>
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
        <LimitedTextField
          multiline
          id="description"
          name="description"
          placeholder="Есть уточнения?"
          rows={6}
          maxLength={100}
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
            {discounts.map(({ discount, discountValue }) => (
              <Typography key={discount.name} variant="subtitle1" component="p">
                {`Скидка: ${discount.name} - ${discountValue} ₽`}
              </Typography>
            ))}
            {currentDelivery ? (
              <Typography variant="subtitle1" component="p">
                {`Доставка: ${currentDelivery.name} - ${currentDelivery.value} ₽`}
              </Typography>
            ) : undefined}
          </Stack>
          <Button type="submit" variant="contained">
            Оформить заказ
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default OrderForm;
