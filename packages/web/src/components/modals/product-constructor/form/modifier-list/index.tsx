import { Grid, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import React from "react";
import {
  ModifierCategoryChoiceOptionEnum,
  ModifierCategoryDisplayVariantEnum,
} from "~/../../common/dist";
import { ModifierCategory } from "~/services/modifier-categories.service";
import { Modifier } from "~/services/modifiers.service";
import { ToggleButton } from "~/ui";
import ModifierCard from "./modifier-card";

export interface ModifierListProps {
  modifiers: Modifier[];
  modifierCategories: ModifierCategory[];
  chosenModifiers: Modifier[];
  onChange?: (newChosenModifiers: Modifier[]) => void;
}

export const ModifierList: React.FC<ModifierListProps> = React.memo(
  ({ modifiers, modifierCategories, chosenModifiers, onChange }) => {
    const chosenModifiersPerCategory = React.useMemo(() => {
      const map = new Map<string, Modifier[]>();

      chosenModifiers.forEach(modifier => {
        const existsModifiers = map.get(modifier.category_uuid);

        if (existsModifiers) {
          existsModifiers.push(modifier);
        } else {
          map.set(modifier.category_uuid, [modifier]);
        }
      });

      return map;
    }, [chosenModifiers]);

    const modifiersMap: Map<string, Modifier> = React.useMemo(
      () =>
        new Map<string, Modifier>(
          modifiers.map(modifier => [modifier.uuid, modifier])
        ),
      [modifiers]
    );

    const modifierCategoriesMap: Map<string, ModifierCategory> = React.useMemo(
      () =>
        new Map<string, ModifierCategory>(
          modifierCategories.map(category => [category.uuid, category])
        ),
      [modifierCategories]
    );

    const modifiersPerCategory: [ModifierCategory, Modifier[]][] =
      React.useMemo(() => {
        const mapModifiers = new Map<string, Modifier[]>();

        for (const modifier of modifiers) {
          const existsModifiers =
            mapModifiers.get(modifier.category_uuid) ?? [];
          existsModifiers.push(modifier);
          mapModifiers.set(modifier.category_uuid, existsModifiers);
        }

        return Array.from(mapModifiers).map(([category_uuid, modifiers]) => [
          modifierCategoriesMap.get(category_uuid) as ModifierCategory,
          modifiers,
        ]);
      }, [modifiers, modifierCategoriesMap]);

    return (
      <>
        {modifiersPerCategory.map(([category, modifiers]) => {
          const currentChosenModifiers =
            chosenModifiersPerCategory.get(category.uuid) ?? [];

          if (
            category.choice_option === ModifierCategoryChoiceOptionEnum.ONE &&
            category.display_variant ==
              ModifierCategoryDisplayVariantEnum.SWITCHER
          ) {
            return (
              <ToggleButton
                exclusive
                key={category.uuid}
                value={currentChosenModifiers.at(0)?.uuid} /// .at(0) - only one modifier can be chosen
                elements={modifiers.map(modifier => ({
                  name: modifier.name,
                  value: modifier.uuid,
                }))}
                onChange={(_, modifierUUID) => {
                  const modifier = modifiersMap.get(
                    modifierUUID as string
                  ) as Modifier;

                  chosenModifiersPerCategory.set(category.uuid, [modifier]); /// again - look above

                  onChange &&
                    onChange(
                      Array.from(chosenModifiersPerCategory).reduce<Modifier[]>(
                        (m, [_category, modifiers]) => {
                          m.push(...modifiers);
                          return m;
                        },
                        []
                      )
                    );
                }}
              />
            );
          }

          if (
            category.choice_option === ModifierCategoryChoiceOptionEnum.MANY &&
            category.display_variant == ModifierCategoryDisplayVariantEnum.LIST
          ) {
            return (
              <Stack key={category.uuid} spacing={2}>
                {category.display_name && (
                  <Typography component="p" variant="h4">
                    {category.display_name}
                  </Typography>
                )}
                <Stack>
                  <Grid
                    container
                    rowSpacing={1}
                    columnSpacing={1}
                    columns={{ xs: 12 }}
                  >
                    {modifiers.map(modifier =>
                      modifier.display ? (
                        <Grid item xs={4} key={modifier.uuid}>
                          <ModifierCard
                            modifier={modifier}
                            checked={Boolean(
                              currentChosenModifiers.find(
                                m => m.uuid === modifier.uuid
                              )
                            )}
                            onClick={modifier => {
                              /// already ckecked
                              const index = currentChosenModifiers.findIndex(
                                m => m.uuid === modifier.uuid
                              );
                              if (index === -1) {
                                currentChosenModifiers.push(modifier);
                              } else {
                                currentChosenModifiers.splice(index, 1);
                              }

                              chosenModifiersPerCategory.set(
                                category.uuid,
                                currentChosenModifiers
                              );

                              onChange &&
                                onChange(
                                  Array.from(chosenModifiersPerCategory).reduce<
                                    Modifier[]
                                  >((m, [_category, modifiers]) => {
                                    m.push(...modifiers);
                                    return m;
                                  }, [])
                                );
                            }}
                          />
                        </Grid>
                      ) : null
                    )}
                  </Grid>
                </Stack>
              </Stack>
            );
          }

          return null;
        })}
      </>
    );
  }
);

ModifierList.displayName = "ModifierList";

export default ModifierList;
