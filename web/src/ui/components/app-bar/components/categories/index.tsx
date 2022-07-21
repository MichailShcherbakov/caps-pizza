import { Stack, StackProps } from "@mui/material";
import React from "react";
import CategoryCard, { CategoryCardProps } from "./components/card";
import styles from "./index.module.scss";

export interface CategoriesProps extends StackProps {}

function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top - window.innerHeight / 2 <= 0 &&
    -rect.top <= rect.height - window.innerHeight / 2
  );
}

export const Categories: React.FC<CategoriesProps> = React.forwardRef(
  (props, ref) => {
    const [categories, setCategories] = React.useState<CategoryCardProps[]>([
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

    React.useEffect(() => {
      const articles = Array.from(
        document.querySelectorAll("section[data-section]")
      );

      const scroll = () => {
        setCategories(
          categories.map((c) => {
            if (
              articles.find(
                (a) => c.id === a.getAttribute("id") && isInViewport(a)
              )
            )
              return {
                ...c,
                active: true,
              };

            return {
              ...c,
              active: false,
            };
          })
        );
      };

      window.addEventListener("scroll", scroll);

      return () => {
        window.removeEventListener("scroll", scroll);
      };
    }, [categories]);

    return (
      <Stack
        ref={ref}
        direction="row"
        alignItems="center"
        className={styles["categories"]}
        {...props}
      >
        {categories.map((c) => (
          <CategoryCard key={c.id} {...c} />
        ))}
      </Stack>
    );
  }
);

Categories.displayName = "Categories";

export default Categories;
