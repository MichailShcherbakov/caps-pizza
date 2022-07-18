import { Container, Stack } from "@mui/material";
import React from "react";
import CategoryCard, { CategoryCardProps } from "./components/card";
import styles from "./index.module.scss";

export interface CategoriesProps {}

export const Categories: React.FC<CategoriesProps> = () => {
  const [categories] = React.useState<CategoryCardProps[]>([
    {
      id: "promotions",
      iconHref: "/icons/fire.svg",
      text: "Акции",
    },
    {
      id: "pizza",
      iconHref: "/icons/pizza.svg",
      text: "Пиццы",
    },
    {
      id: "rolls",
      iconHref: "/icons/rolls.svg",
      text: "Роллы",
    },
    {
      id: "combo",
      iconHref: "/icons/combo.svg",
      text: "Наборы",
    },
    {
      id: "snacks",
      iconHref: "/icons/snacks.svg",
      text: "Закуски",
    },
    {
      id: "drink",
      iconHref: "/icons/drink.svg",
      text: "Напитки",
    },
  ]);

  return (
    <Container className="ui-py-12">
      <Stack
        direction="row"
        alignItems="center"
        className={styles["categories"]}
      >
        {categories.map((c) => (
          <CategoryCard key={c.id} {...c} />
        ))}
      </Stack>
    </Container>
  );
};

export default Categories;
