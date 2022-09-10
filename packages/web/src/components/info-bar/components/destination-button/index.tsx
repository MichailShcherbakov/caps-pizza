import React from "react";
import { Stack, Typography } from "@mui/material";
import LocationIcon from "~/assets/location.svg";

export interface DestinationSelectProps {}

export const DestinationButton: React.FC<DestinationSelectProps> = () => {
  return (
    <Stack direction="row" alignItems="center" spacing={1} py={1}>
      <LocationIcon />
      <Typography>Пушкин</Typography>
    </Stack>
  );
};

export default DestinationButton;
