import { StackProps } from "@mui/material";
import { Container, Stack, Typography } from "@mui/material";
import DestinationSelect from "./components/destination-select";
import styles from "./index.module.scss";

export interface InfoBarProps extends StackProps {}

export const InfoBar: React.FC<InfoBarProps> = (props) => {
  const deliveryTime = "00:24:19";

  return (
    <Stack {...props}>
      <Container>
        <Stack
          direction="row"
          alignItems="center"
          className={styles["info-bar"]}
        >
          <Stack
            direction="row"
            alignItems="center"
            className={styles["info-bar__destination"]}
          >
            <DestinationSelect />
            <Typography className={styles["info-bar__delivery-time"]}>
              Среднее время доставки*: {deliveryTime}
            </Typography>
          </Stack>
          <Typography>Время работы: с 11:00 до 22:30</Typography>
        </Stack>
      </Container>
    </Stack>
  );
};
