import { Stack, StackProps } from "@mui/material";
import React from "react";
import CategoryCard, { CategoryCardProps } from "./components/card";
import useScroll from "~/common/helpers/use-scroll";
import { ProductCategory } from "~/services/product-categories.service";
import styles from "./index.module.scss";

export interface CategoriesProps extends StackProps {
  fullWidth?: boolean;
  categories: ProductCategory[];
  CategoryCardProps?: Pick<CategoryCardProps, "size">;
}

export const CategoriesList: React.FC<CategoriesProps> = React.forwardRef(
  ({ fullWidth, categories, CategoryCardProps, ...props }, ref) => {
    const { scrollToSection } = useScroll();

    const onCategoryCardClick = (
      e: React.MouseEvent,
      category: ProductCategory
    ) => {
      e.preventDefault();

      scrollToSection(category.name);
    };

    return (
      <Stack
        {...props}
        ref={ref}
        direction="row"
        alignItems="center"
        className={[
          styles["categories-list"],
          fullWidth ? styles["categories-list--full-width"] : "",
        ].join(" ")}
        spacing={2}
      >
        {categories.map(c => (
          <CategoryCard
            {...CategoryCardProps}
            key={c.uuid}
            name={c.name}
            imageURL={c.image_url}
            onClick={e => onCategoryCardClick(e, c)}
          />
        ))}
      </Stack>
    );
  }
);

CategoriesList.displayName = "CategoriesList";

export default CategoriesList;
