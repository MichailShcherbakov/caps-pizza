import { Stack, Typography } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import React from "react";
import { MemoTextField } from "~/ui";
import Logo from "./logo";
import SushiMakerIllustration from "~/assets/sushi-maker.svg";
import { useFormik } from "formik";
import validationSchema from "./validation-schema";
import { SignInPayload } from "~/services/auth.service";
import { useStyle } from "./index.style";

export interface SignInFormProps {
  loading?: boolean;
  onSubmit?: (data: SignInPayload) => void;
}

export const SignInForm: React.FC<SignInFormProps> = ({
  loading,
  onSubmit,
}) => {
  const { classes } = useStyle();
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
      className={classes.root}
      spacing={6}
      onSubmit={formik.handleSubmit}
    >
      <Stack alignItems="center" justifyContent="center">
        <Logo />
        <Stack alignItems="center" justifyContent="center">
          <Typography>Вход в админ панель</Typography>
        </Stack>
      </Stack>
      <Stack direction="row" alignItems="center" justifyContent="center">
        <SushiMakerIllustration className={classes.illustration} />
      </Stack>
      <Stack spacing={2}>
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
      <Stack>
        <LoadingButton
          fullWidth
          type="submit"
          variant="contained"
          color="secondaryLight"
          loading={loading}
        >
          Войти
        </LoadingButton>
      </Stack>
    </Stack>
  );
};

export default SignInForm;
