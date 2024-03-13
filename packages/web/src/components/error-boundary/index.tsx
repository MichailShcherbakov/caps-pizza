import { Stack, Typography } from "@mui/material";
import React from "react";
import { log } from "~/services/logger.service";

export class ErrorBoundary extends React.Component<
  { children: any },
  {
    hasError: boolean;
    error: Error | null;
  }
> {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  async componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    await log({
      error: error.toString(),
      errorStack: error.stack ?? null,
      errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <Stack alignItems="center" justifyContent="center" width="100%">
          <Typography component="h2" variant="h3">
            Что-то пошло не так
          </Typography>
          <Typography>Попробуйте перезагрузить страницу</Typography>
        </Stack>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
