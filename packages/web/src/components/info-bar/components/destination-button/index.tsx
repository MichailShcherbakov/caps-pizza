import React from "react";
import { Button } from "@mui/material";
import LocationIcon from "~/assets/location.svg";

export interface DestinationSelectProps {}

export const DestinationButton: React.FC<DestinationSelectProps> = () => {
  return (
    <Button variant="text" color="secondary" startIcon={<LocationIcon />}>
      Пушкин
    </Button>
  );
};

export default DestinationButton;
