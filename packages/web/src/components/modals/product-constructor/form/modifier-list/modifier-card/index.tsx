import { Stack, Typography } from "@mui/material";
import React from "react";
import ExternalImage from "~/components/external-image";
import { Modifier } from "~/services/modifiers.service";
import { useStyle } from "./index.style";

export interface ModifierCardProps {
  modifier: Modifier;
  checked: boolean;
  onClick?: (modifier: Modifier) => void;
}

export const ModifierCard: React.FC<ModifierCardProps> = React.memo(
  ({ modifier, checked, onClick }) => {
    const { classes } = useStyle({
      checked,
    });
    return (
      <Stack
        component="button"
        alignItems="center"
        className={classes.root}
        onClick={() => onClick && onClick(modifier)}
      >
        <ExternalImage url={modifier.image_url} className={classes.image} />
        <Typography
          component="span"
          variant="subtitle2"
          className={classes.title}
        >
          {modifier.name}
        </Typography>
        <Typography component="span" variant="h6">
          {modifier.price} ₽
        </Typography>
      </Stack>
    );
  }
);

ModifierCard.displayName = "ModifierCard";

export default ModifierCard;
