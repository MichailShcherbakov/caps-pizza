import Image from "next/image";
import { Stack, Typography } from "@mui/material";
import styles from "./index.module.scss";

export interface CategoryCardProps {
  id: string;
  iconHref: string;
  text: string;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  id,
  iconHref,
  text,
}) => {
  return (
    <Stack component={"a"} href={`#${id}`} className={styles["category-card"]}>
      <Stack className={styles["category-card__icon"]}>
        <Image
          src={iconHref}
          alt="A picture of the category"
          layout="fill"
          objectFit="cover"
        />
      </Stack>
      <Typography>{text}</Typography>
    </Stack>
  );
};

export default CategoryCard;
