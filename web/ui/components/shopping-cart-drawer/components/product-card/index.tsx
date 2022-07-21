import Image from "next/image";
import { IconButton, Stack, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import styles from "./index.module.scss";
import CounterButton from "~/ui/components/counter-button";

export interface ProductCardProps {
  id: number;
  name: string;
  desc: string;
  specifics: string;
  iconURL: string;
  price: number;
  count?: number;
  onCountChanged?: (id: number, newCount: number) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  desc,
  specifics,
  price,
  iconURL,
  count: initialCount = 1,
  onCountChanged = () => {},
}) => {
  return (
    <Stack
      direction="row"
      alignItems="center"
      className={styles["product-card"]}
    >
      <Stack className={styles["product-card__image"]}>
        <Image
          src={iconURL}
          alt="The product card"
          layout="fill"
          className={styles["product-card__image-src"]}
        />
      </Stack>
      <Stack spacing={1} className="ui-w-full ui-h-full">
        <Stack spacing={1} className="ui-w-full ui-h-full">
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            className="ui-w-full ui-h-full"
          >
            <Typography variant="h4">{name}</Typography>
            <IconButton size="small">
              <CloseIcon />
            </IconButton>
          </Stack>
          <Typography>{desc}</Typography>
          <Typography variant="subtitle1">{specifics}</Typography>
        </Stack>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <CounterButton
            minValue={1}
            initialCount={initialCount}
            onValueChanged={(newCount) => onCountChanged(id, newCount)}
          />
          <Typography variant="h5" className={styles["product-card__price"]}>
            {`${price * initialCount} ₽`}
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default ProductCard;
