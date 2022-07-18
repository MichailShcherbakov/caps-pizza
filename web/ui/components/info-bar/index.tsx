import { Container, Stack, Typography } from "@mui/material";
import DestinationSelect from "./components/destination-select";
import styles from "./index.module.scss";

export interface InfoBarProps {}

export const InfoBar: React.FC<InfoBarProps> = () => {
  const deliveryTime = "00:24:19";

  return (
    <Container>
      <Stack direction="row" alignItems="center" className={styles["info-bar"]}>
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
    </Container>
  );
};
