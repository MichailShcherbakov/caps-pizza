import { Container, Grid, Stack, Typography } from "@mui/material";
import Logo from "../app-bar/components/logo";
import PhoneIcon from "~/assets/phone.svg";
import EmailIcon from "~/assets/email.svg";
import PointIcon from "~/assets/point.svg";
import VkIcon from "~/assets/vk.svg";
import { useStyle } from "./index.style";

export interface FooterProps {
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className }) => {
  const { classes, cx } = useStyle({});
  return (
    <Stack component="footer" className={cx(classes.root, className)}>
      <Container>
        <Grid direction="row" container>
          <Grid
            className={classes.section}
            item
            xl={6}
            lg={6}
            md={6}
            sm={12}
            xs={12}
          >
            <Stack
              direction="column"
              justifyContent="space-between"
              sx={{ height: "100%" }}
            >
              <Logo />
              <Typography className={classes.copyright}>
                © Copyright 2022 — Пицца от КЭПа
              </Typography>
            </Stack>
          </Grid>
          <Grid container item xl={6} lg={6} md={6} sm={12} xs={12}>
            <Grid
              className={classes.section}
              item
              xl={6}
              lg={6}
              md={12}
              sm={12}
              xs={12}
            >
              <Stack direction="column" spacing={2}>
                <Stack>
                  <Typography variant="h4" component="p">
                    Пицца от КЭПа
                  </Typography>
                </Stack>
                <Stack spacing={2}>
                  <Typography
                    component="a"
                    href="/policy"
                    className={classes.link}
                  >
                    Политика обработки персональных данных
                  </Typography>
                  <Typography
                    component="a"
                    href="https://vk.com/pizza30cm_pushkin"
                    target="_blank"
                    className={classes.link}
                  >
                    Служба поддержки
                  </Typography>
                </Stack>
              </Stack>
            </Grid>
            <Grid
              className={classes.section}
              item
              xl={6}
              lg={6}
              md={12}
              sm={12}
              xs={12}
            >
              <Stack direction="column" spacing={2}>
                <Stack>
                  <Typography variant="h4" component="p">
                    Контакты
                  </Typography>
                </Stack>
                <Stack spacing={2}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <PhoneIcon className={classes.icon} />
                      <Typography
                        component="a"
                        href="tel:+7(812)416-41-05"
                        className={classes.link}
                      >
                        +7(812)416-41-05
                      </Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <PhoneIcon className={classes.icon} />
                      <Typography
                        component="a"
                        href="tel:929-52-46"
                        className={classes.link}
                      >
                        929-52-46
                      </Typography>
                    </Stack>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <EmailIcon className={classes.icon} />
                    <Typography
                      component="a"
                      href="mailto:World151217@mail.ru"
                      target="_blank"
                      className={classes.link}
                    >
                      World151217@mail.ru
                    </Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <PointIcon className={classes.icon} />
                    <Typography>Пушкин, ул. Новодеревенская, д.19</Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <VkIcon className={classes.icon} />
                    <Typography
                      component="a"
                      href="https://vk.com/pizza30cm_pushkin"
                      target="_blank"
                      className={classes.link}
                    >
                      Вконтакте
                    </Typography>
                  </Stack>
                </Stack>
                <Typography className={classes.hiddenCopyright}>
                  © Copyright 2022 — Пицца от КЭПа
                </Typography>
              </Stack>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Stack>
  );
};

export default Footer;
