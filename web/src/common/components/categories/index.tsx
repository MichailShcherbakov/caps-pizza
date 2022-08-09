import { StackProps } from "@mui/material";
import { Stack } from "@mui/material";
import React from "react";
import { useAppSelector } from "~/store/hook";
import CategoryCard from "./components/card";
import styles from "./index.module.scss";

export interface CategoriesProps extends StackProps {}

export const Categories: React.FC<CategoriesProps> = ({
  className,
  ...props
}) => {
  const categories = useAppSelector((state) => state.categories.value);

  return (
    <Stack
      direction="row"
      alignItems="center"
      className={[styles["categories"], className].join(" ")}
      {...props}
    >
      {categories.map((c) => (
        <CategoryCard key={c.categoryUUID} {...c} />
      ))}
    </Stack>
  );
};

export default Categories;
