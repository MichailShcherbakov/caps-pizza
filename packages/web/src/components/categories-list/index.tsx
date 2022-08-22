import React from "react";
import CategoryCard, { CategoryCardProps } from "./components/card";
import { ProductCategory } from "~/services/product-categories.service";
import styles from "./index.module.scss";
import { useCurrentSection } from "~/helpers/section-provider";

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
  const { currentActiveSectionName } = useCurrentSection();

  return (
    <ul
      {...props}
      ref={ref}
      className={[
        styles["categories-list"],
        fullWidth ? styles["categories-list--full-width"] : "",
        props.className,
      ].join(" ")}
    >
      {categories.map(category => (
        <CategoryCard
          {...CategoryCardProps}
          key={category.uuid}
          name={category.name}
          imageURL={category.image_url}
          active={currentActiveSectionName === category.name}
        />
      ))}
    </ul>
  );
});

CategoriesList.displayName = "CategoriesList";

export default CategoriesList;
