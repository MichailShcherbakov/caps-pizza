import React from "react";
import CategoryCard, { CategoryCardProps } from "./components/card";
import { ProductCategory } from "~/services/product-categories.service";
import { useCurrentSection } from "~/helpers/section-provider";
import { useStyle } from "./index.style";

export interface CategoriesProps
  extends React.HTMLAttributes<HTMLUListElement> {
  fullWidth?: boolean;
  categories: ProductCategory[];
  CategoryCardProps?: Pick<CategoryCardProps, "size">;
}

export const CategoriesList: React.FC<CategoriesProps> = React.forwardRef<
  HTMLUListElement,
  CategoriesProps
>(({ fullWidth, categories, CategoryCardProps, className, ...props }, ref) => {
  const { classes, cx } = useStyle({
    width: fullWidth ? "full" : categories.length < 6 ? "auto" : undefined,
  });
  const { currentActiveSectionName } = useCurrentSection();

  return (
    <ul {...props} ref={ref} className={cx(classes.root, className)}>
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
