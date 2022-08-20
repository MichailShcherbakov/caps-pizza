import { StackProps } from "@mui/material";
import { Container, Stack, Typography } from "@mui/material";
import DestinationButton from "./components/destination-button";
import styles from "./index.module.scss";

export interface InfoBarProps extends StackProps {}

export const InfoBar: React.FC<InfoBarProps> = props => {
  const deliveryTime = "00:24:19";

  return (
    <Stack {...props} className={styles["info-bar"]} alignItems="center">
      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Stack
            direction="row"
            alignItems="center"
            className={styles["info-bar__destination"]}
          >
            <DestinationButton />
            <Typography
              variant="subtitle2"
              className={styles["info-bar__delivery-time"]}
            >
              Среднее время доставки*: {deliveryTime}
            </Typography>
          </Stack>
          <Typography variant="subtitle2">
            Время работы: с 11:00 до 22:30
          </Typography>
        </Stack>
      </Container>
    </Stack>
  );
};

export default InfoBar;
