import React from "react";
import { Modifier } from "~/services/modifiers.service";
import { ToggleButton } from "~/ui";

export interface ModifierListProps {
  modifiers: Modifier[];
  currentModifiers: Modifier[];
  onChange?: (currentModifiers: Modifier[]) => void;
}

export const ModifierList: React.FC<ModifierListProps> = React.memo(
  ({ modifiers, currentModifiers, onChange }) => {
    const currentModifierPerCategory = new Map<string, Modifier>(
      currentModifiers.map(modifier => [modifier.category_uuid, modifier])
    );
    const modifiersMap = React.useMemo(
      () =>
        new Map<string, Modifier>(
          modifiers.map(modifier => [modifier.uuid, modifier])
        ),
      [modifiers]
    );

    const modifiersPerCategory = React.useMemo(() => {
      const mapModifiers = new Map<string, Modifier[]>();

      for (const modifier of modifiers) {
        const existsModifiers = mapModifiers.get(modifier.category_uuid) ?? [];
        existsModifiers.push(modifier);
        mapModifiers.set(modifier.category_uuid, existsModifiers);
      }

      return Array.from(mapModifiers);
    }, [modifiers]);

    return (
      <>
        {modifiersPerCategory.map(([categoryUUID, modifiers]) => (
          <ToggleButton
            exclusive
            key={categoryUUID}
            value={currentModifierPerCategory.get(categoryUUID)?.uuid}
            elements={modifiers.map(modifier => ({
              name: modifier.name,
              value: modifier.uuid,
            }))}
            onChange={(_, modifierUUID) => {
              const modifier = modifiersMap.get(modifierUUID as string);

              if (
                !modifier ||
                currentModifierPerCategory.get(categoryUUID) === modifier
              )
                return;

              currentModifierPerCategory.set(categoryUUID, modifier);

              onChange &&
                onChange(
                  Array.from(currentModifierPerCategory).map(
                    ([_, modifier]) => modifier
                  )
                );
            }}
          />
        ))}
      </>
    );
  }
);

ModifierList.displayName = "ModifierList";

export default ModifierList;
