import React from "react";
import type { NextPage } from "next";
import {
  Button,
  FormControlLabel,
  Grid,
  InputAdornment,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from "@mui/material";
import MainLayout from "~/layouts/main";
import ProductCard from "~/ui/components/shopping-cart-drawer/components/product-card";
import Title from "~/ui/components/title";
import styles from "./index.module.scss";
import TextField, { MaskedTextField } from "~/ui/components/text-field";

export const TEST_PRODUCTS = [
  {
    id: 0,
    name: "Пицца Маргарита",
    desc: "Томатный соус, сыр моцарелла, базилик",
    price: 440,
    size: "30 см",
    weight: "760 гр",
    iconURL: "/pizza/margarita.png",
    count: 5,
  },
  {
    id: 1,
    name: "Пицца Маргарита",
    desc: "Томатный соус, сыр моцарелла, базилик",
    price: 440,
    size: "30 см",
    weight: "760 гр",
    iconURL: "/pizza/margarita.png",
    count: 1,
  },
  {
    id: 2,
    name: "Пицца Маргарита",
    desc: "Томатный соус, сыр моцарелла, базилик",
    price: 440,
    size: "30 см",
    weight: "760 гр",
    iconURL: "/pizza/margarita.png",
    count: 2,
  },
];

export const computeFinalPrice = (products) => {
  let finalPrice = 0;

  for (const product of products) {
    finalPrice += product.price * product.count;
  }

  return finalPrice;
};

export const OrderPage: NextPage = () => {
  const [products, setProducts] = React.useState(TEST_PRODUCTS);
  const [payment, setPayment] = React.useState<"in-cash" | "by-card">(
    "in-cash"
  );
  const [change, setChange] = React.useState<"with" | "without">("without");

  const onCountChangedHandler = (id: number, newCount: number) => {
    setProducts(
      products.map((p) => {
        if (p.id !== id) return p;

        return {
          ...p,
          count: newCount,
        };
      })
    );
  };

  return (
    <MainLayout>
      <Title text="Ваш заказ" />
      <Stack component="ul" className={styles["ordered-products"]}>
        {products.map((p) => (
          <ProductCard
            key={p.id}
            id={p.id}
            name={p.name}
            desc={p.desc}
            price={p.price}
            specifics={`${p.size} / ${p.weight}`}
            iconURL={p.iconURL}
            count={p.count}
            onCountChanged={onCountChangedHandler}
          />
        ))}
      </Stack>
      <Stack
        alignItems="flex-end"
        justifyContent="center"
        className={styles["ordered-products__final-price"]}
      >
        <Typography
          variant="h3"
          component="p"
          className={styles["ordered-products__final-price-text"]}
        >
          Итого: {computeFinalPrice(products)} ₽
        </Typography>
      </Stack>
      <Stack>
        <Title text="О Вас" />
        <Grid spacing={2} rowSpacing={2} container className="ui-py-8">
          <Grid item xl={4} lg={4} sm={4} xs={12}>
            <MaskedTextField
              label="Имя"
              placeholder="Алексей"
              options={{ mask: /[ЁёА-я ]$/ }}
              required
            />
          </Grid>
          <Grid item xl={4} lg={4} sm={4} xs={12}>
            <MaskedTextField
              label="Номер телефона"
              placeholder="+7"
              options={{
                mask: "+7 (000) 000-00-00",
              }}
              required
            />
          </Grid>
          <Grid item xl={4} lg={4} sm={4} xs={12}>
            <TextField label="Почта" placeholder="mail-address@mail.ru" />
          </Grid>
        </Grid>
        <Title text="Доставка" />
        <Grid spacing={2} rowSpacing={2} container className="ui-py-8">
          <Grid item xl={12} lg={12} sm={12} xs={12}>
            <TextField label="Адрес" placeholder="Пушкин" required />
          </Grid>
          <Grid item xl={3} lg={3} sm={6} xs={12}>
            <TextField label="Дом" placeholder="1а" required />
          </Grid>
          <Grid item xl={3} lg={3} sm={6} xs={12}>
            <MaskedTextField
              label="Парадная"
              placeholder="1"
              options={{
                mask: Number,
                min: 1,
                max: 99,
              }}
              required
            />
          </Grid>
          <Grid item xl={3} lg={3} sm={6} xs={12}>
            <MaskedTextField
              label="Этаж"
              placeholder="2"
              options={{
                mask: Number,
                min: 1,
                max: 99,
              }}
              required
            />
          </Grid>
          <Grid item xl={3} lg={3} sm={6} xs={12}>
            <MaskedTextField
              label="Квартира"
              placeholder="15"
              options={{
                mask: Number,
                min: 1,
                max: 999,
              }}
              required
            />
          </Grid>
        </Grid>
        <Title text="Оплата" />
        <RadioGroup
          row
          defaultValue="in-cash"
          className="ui-py-8"
          onChange={(e) => setPayment(e.target.value as "in-cash" | "by-card")}
        >
          <FormControlLabel
            value="in-cash"
            control={<Radio />}
            label="Наличными"
          />
          <FormControlLabel
            value="by-card"
            control={<Radio />}
            label="Картой"
          />
        </RadioGroup>
        {payment === "in-cash" && (
          <>
            <Title text="Сдача" />
            <RadioGroup
              row
              defaultValue="without"
              className="ui-py-8"
              onChange={(e) => setChange(e.target.value as "with" | "without")}
            >
              <FormControlLabel
                value="without"
                control={<Radio />}
                label="Без сдачи"
              />
              <Stack direction="row">
                <FormControlLabel
                  value="with"
                  control={<Radio />}
                  label="Сдача с"
                  className="ui-flex-fixed"
                />
                <TextField
                  type="number"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">₽</InputAdornment>
                    ),
                  }}
                  disabled={change !== "with"}
                />
              </Stack>
            </RadioGroup>
          </>
        )}
        <Title text="Комментарий" />
        <TextField
          placeholder="Есть уточнения?"
          rows={6}
          multiline
          className="ui-my-8"
        />
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          className="ui-py-8"
        >
          <Typography
            variant="h3"
            component="p"
            className={styles["ordered-products__final-price-text"]}
          >
            Итого: {computeFinalPrice(products)} ₽
          </Typography>
          <Button variant="contained">
            <Typography variant="button">Оформить заказ</Typography>
          </Button>
        </Stack>
      </Stack>
    </MainLayout>
  );
};

export default OrderPage;
