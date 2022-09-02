import { StackProps } from "@mui/material";
import { Container, Stack, Typography } from "@mui/material";
import DestinationButton from "./components/destination-button";
import { useStyle } from "./index.style";

export interface InfoBarProps extends StackProps {}

export const InfoBar: React.FC<InfoBarProps> = props => {
  const { classes } = useStyle();
  const deliveryTime = "00:24:19";

  return (
    <Stack {...props} className={classes.root} alignItems="center">
      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <DestinationButton />
            <Typography variant="subtitle2" className={classes.deliveryTime}>
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
