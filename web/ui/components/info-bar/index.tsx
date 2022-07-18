import { Stack, Typography } from "@mui/material";
import DestinationSelect from "./components/destination-select";
import styles from "./index.module.scss";

export interface InfoBarProps {}

export const InfoBar: React.FC<InfoBarProps> = () => {
  const deliveryTime = "00:24:19";

  return (
    <Stack
      direction="row"
      alignItems="center"
      className="ui-flex ui-w-full ui-space-x-between"
    >
      <Stack
        direction="row"
        alignItems="center"
        className={styles["info-bar__destination"]}
      >
        <DestinationSelect />
        <Typography>Среднее время доставки*: {deliveryTime}</Typography>
      </Stack>
      <Typography>Время работы: с 11:00 до 23:00</Typography>
    </Stack>
  );
};
