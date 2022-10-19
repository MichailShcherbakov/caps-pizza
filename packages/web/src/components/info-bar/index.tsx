import { StackProps } from "@mui/material";
import { Container, Stack, Typography } from "@mui/material";
import DestinationButton from "./components/destination-button";
import { useStyle } from "./index.style";
import PhoneIcon from "~/assets/phone-x16.svg";

export interface InfoBarProps extends StackProps {}

export const InfoBar: React.FC<InfoBarProps> = props => {
  const { classes } = useStyle();
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
          </Stack>
          <Stack alignItems="flex-end" className={classes.container}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="center"
              gap={1}
            >
              <Typography variant="subtitle2">
                Приём заказов с 11:00 до 22:30
              </Typography>
            </Stack>
            <Stack className={classes.linkContainer}>
              <Stack direction="row" alignItems="center" gap={1}>
                <PhoneIcon />
                <Typography
                  variant="subtitle2"
                  component="a"
                  href="tel:+7(812)416-41-05"
                  className={classes.link}
                >
                  +7(812)416-41-05
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="center" gap={1}>
                <PhoneIcon />
                <Typography
                  variant="subtitle2"
                  component="a"
                  href="tel:929-52-46"
                  className={classes.link}
                >
                  929-52-46
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </Container>
    </Stack>
  );
};

export default InfoBar;
