import { Button, Stack, Typography } from "@mui/material";
import React from "react";
import { MemoTextField } from "~/ui";
import Logo from "../logo";
import SushiMakerIllustration from "~/assets/sushi-maker.svg";
import styles from "../../index.module.scss";
import { useFormik } from "formik";
import validationSchema from "./validation-schema";
import { SignInPayload } from "~/services/auth.service";

export interface SignInFormProps {
  onSubmit?: (data: SignInPayload) => void;
}

export const SignInForm: React.FC<SignInFormProps> = ({ onSubmit }) => {
  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema,
    onSubmit(value) {
      onSubmit && onSubmit(value);
    },
  });

  return (
    <Stack
      component="form"
      className={styles.signin__container}
      onSubmit={formik.handleSubmit}
    >
      <Stack
        alignItems="center"
        justifyContent="center"
        className={styles.signin__header}
      >
        <Logo />
        <Stack alignItems="center" justifyContent="center">
          <Typography>Вход в админ панель</Typography>
        </Stack>
      </Stack>
      <Stack direction="row" alignItems="center" justifyContent="center">
        <SushiMakerIllustration
          className={styles.signin__illustration_hidden}
        />
      </Stack>
      <Stack className={styles.signin__inner}>
        <MemoTextField
          fullWidth
          id="username"
          name="username"
          label="Имя пользователя"
          size="small"
          color="secondary"
          value={formik.values.username}
          error={formik.touched.username && Boolean(formik.errors.username)}
          helperText={formik.touched.username && formik.errors.username}
          onChange={formik.handleChange}
        />
        <MemoTextField
          fullWidth
          id="password"
          name="password"
          type="password"
          label="Пароль"
          size="small"
          color="secondary"
          value={formik.values.password}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
          onChange={formik.handleChange}
        />
      </Stack>
      <Stack className={styles.signin__footer}>
        <Button
          fullWidth
          type="submit"
          variant="contained"
          className={styles.signin__btn}
          color="secondaryLight"
        >
          <Typography variant="button">Войти</Typography>
        </Button>
      </Stack>
    </Stack>
  );
};

export default SignInForm;
