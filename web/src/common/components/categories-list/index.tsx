import React from "react";
import CategoryCard, { CategoryCardProps } from "./components/card";
import useScroll from "~/common/helpers/use-scroll";
import { ProductCategory } from "~/services/product-categories.service";
import styles from "./index.module.scss";

export interface CategoriesProps
  extends React.HTMLAttributes<HTMLUListElement> {
  fullWidth?: boolean;
  categories: ProductCategory[];
  CategoryCardProps?: Pick<CategoryCardProps, "size">;
}

export const CategoriesList: React.FC<CategoriesProps> = React.forwardRef<
  HTMLUListElement,
  CategoriesProps
>(({ fullWidth, categories, CategoryCardProps, ...props }, ref) => {
  const { scrollToSection } = useScroll();

  const onCategoryCardClick = (
    e: React.MouseEvent,
    category: ProductCategory
  ) => {
    e.preventDefault();

    scrollToSection(category.name);
  };

  return (
    <ul
      {...props}
      ref={ref}
      className={[
        styles["categories-list"],
        fullWidth ? styles["categories-list--full-width"] : "",
      ].join(" ")}
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
    </ul>
  );
});

CategoriesList.displayName = "CategoriesList";

export default CategoriesList;
