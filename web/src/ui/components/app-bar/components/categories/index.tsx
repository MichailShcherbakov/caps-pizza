import { Stack, StackProps } from "@mui/material";
import React from "react";
import { setActiveCategoryName } from "~/store/categories.reducer";
import { useAppDispatch, useAppSelector } from "~/store/hook";
import CategoryCard from "./components/card";
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
    const categories = useAppSelector((state) => state.categories.value);
    const currentActiveCategoryName = useAppSelector(
      (state) => state.categories.activeCategoryName
    );
    const dispatch = useAppDispatch();

    React.useEffect(() => {
      const articles = Array.from(
        document.querySelectorAll("section[data-section]")
      );

      const scroll = () => {
        const activeArticle = articles.find((a) => isInViewport(a));

        if (!activeArticle) {
          dispatch(setActiveCategoryName(null));
          return;
        }

        dispatch(setActiveCategoryName(activeArticle.getAttribute("id")));
      };

      window.addEventListener("scroll", scroll);

      return () => {
        window.removeEventListener("scroll", scroll);
      };
    }, [categories, dispatch]);

    return (
      <Stack
        ref={ref}
        direction="row"
        alignItems="center"
        className={styles["categories"]}
        {...props}
      >
        {categories.map((c) => (
          <CategoryCard
            key={c.categoryUUID}
            active={c.name === currentActiveCategoryName}
            {...c}
          />
        ))}
      </Stack>
    );
  }
);

Categories.displayName = "Categories";

export default Categories;
