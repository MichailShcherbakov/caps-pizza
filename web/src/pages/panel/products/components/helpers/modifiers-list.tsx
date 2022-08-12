import {
  Checkbox,
  List,
  ListItem,
  ListItemButton,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";
import { Modifier } from "~/services/modifiers.service";
import styles from "../index.module.scss";

export interface ModifierListProps {
  modifiers: Modifier[];
  value: Modifier[];
  onChange?: (checkedModifiers: Modifier[]) => void;
}

export const ModifierList: React.FC<ModifierListProps> = ({
  value,
  modifiers,
  onChange,
}) => {
  const checked = new Set<string>(value.map(m => m.uuid));

  const isAvaliable = (m: Modifier) => {
    for (const modifier of modifiers) {
      if (
        modifier.uuid !== m.uuid &&
        modifier.category_uuid === m.category_uuid &&
        checked.has(modifier.uuid)
      )
        return false;
    }

    return true;
  };

  const handleToggle = (m: Modifier) => () => {
    if (checked.has(m.uuid)) {
      checked.delete(m.uuid);
    } else {
      checked.add(m.uuid);
    }

    onChange && onChange(modifiers.filter(m => checked.has(m.uuid)));
  };

  return (
    <List className={styles["modifier-list"]}>
      {modifiers.map(m => (
        <ListItem key={m.uuid} disablePadding>
          <ListItemButton
            color="neutral"
            onClick={handleToggle(m)}
            dense
            disabled={!isAvaliable(m)}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <Checkbox
                color="neutral"
                edge="start"
                checked={checked.has(m.uuid)}
                tabIndex={-1}
                disableRipple
                size="small"
              />
              <Stack>
                <Typography variant="body1" component="p">
                  {m.name}
                </Typography>
                <Typography variant="subtitle2" component="p">
                  {m.category?.name}
                </Typography>
              </Stack>
            </Stack>
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
};

export default ModifierList;
