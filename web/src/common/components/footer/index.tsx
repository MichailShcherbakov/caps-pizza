import { Container, Grid, Stack, Typography } from "@mui/material";
import Logo from "../../../common/components/app-bar/components/logo";
import styles from "./index.module.scss";
import PhoneIcon from "~/assets/phone.svg";
import EmailIcon from "~/assets/email.svg";
import PointIcon from "~/assets/point.svg";
import VkIcon from "~/assets/vk.svg";

export interface FooterProps {
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className }) => {
  return (
    <Stack
      component="footer"
      className={[styles["footer"], className].join(" ")}
    >
      <Container>
        <Grid className="ui-py-5" container>
          <Grid className="ui-py-5" item xl={3} lg={3} md={12} sm={12} xs={12}>
            <Stack
              direction="column"
              justifyContent="space-between"
              className="ui-h-full"
            >
              <Logo />
              <Typography className={styles["footer__copyright"]}>
                © Copyright 2022 — Пицца от КЭПа
              </Typography>
            </Stack>
          </Grid>
          <Grid className="ui-py-5" item xl={3} lg={3} md={12} sm={12} xs={12}>
            <Stack direction="column" spacing={2}>
              <Stack>
                <Typography variant="h4">Пицца от КЭПа</Typography>
              </Stack>
              <Stack spacing={2}>
                <Typography>О Компании</Typography>
                <Typography>Пользовательское соглашение</Typography>
                <Typography>Политика обработки данных</Typography>
              </Stack>
            </Stack>
          </Grid>
          <Grid className="ui-py-5" item xl={3} lg={3} md={12} sm={12} xs={12}>
            <Stack direction="column" spacing={2}>
              <Stack>
                <Typography variant="h4">Помощь</Typography>
              </Stack>
              <Stack spacing={2}>
                <Typography>Контакты</Typography>
                <Typography>Наши продукты</Typography>
                <Typography>Служба поддержки</Typography>
              </Stack>
            </Stack>
          </Grid>
          <Grid className="ui-py-5" item xl={3} lg={3} md={12} sm={12} xs={12}>
            <Stack direction="column" spacing={2}>
              <Stack>
                <Typography variant="h4">Контакты</Typography>
              </Stack>
              <Stack spacing={2}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <PhoneIcon className={styles["footer__icon"]} />
                    <Typography
                      component="a"
                      href="tel:+7(812)416-41-05"
                      className={styles["footer__link"]}
                    >
                      +7(812)416-41-05
                    </Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <PhoneIcon className={styles["footer__icon"]} />
                    <Typography
                      component="a"
                      href="tel:929-52-46"
                      className={styles["footer__link"]}
                    >
                      929-52-46
                    </Typography>
                  </Stack>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <EmailIcon className={styles["footer__icon"]} />
                  <Typography
                    component="a"
                    href="mailto:World151217@mail.ru"
                    className={styles["footer__link"]}
                  >
                    World151217@mail.ru
                  </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <PointIcon className={styles["footer__icon"]} />
                  <Typography>Пушкин, ул. Новодеревенская, д.19</Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <VkIcon className={styles["footer__icon"]} />
                  <Typography
                    component="a"
                    href="https://vk.com/pizza30cm_pushkin"
                    className={styles["footer__link"]}
                  >
                    Вконтакте
                  </Typography>
                </Stack>
              </Stack>
              <Typography className={styles["footer__copyright--hidden"]}>
                © Copyright 2022 — Пицца от КЭПа
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Stack>
  );
};

export default Footer;
