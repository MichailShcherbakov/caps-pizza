import React from "react";
import { Modifier } from "~/services/modifiers.service";
import { DataTable } from "~/ui";

export interface ModifierTableProps {
  modifiers: Modifier[];
  checkedModifiersUuids?: Set<string>;
  onModifierCheckedChange?: (Modifier: Modifier) => void;
}

export const ModifierTable: React.FC<ModifierTableProps> = React.memo(
  ({
    modifiers,
    checkedModifiersUuids = new Set<string>(),
    onModifierCheckedChange,
  }) => {
    return (
      <DataTable
        collapsible={false}
        head={{
          cols: [
            {
              type: "checkbox",
              name: "checked",
              displayName: "",
              primary: true,
            },
            {
              name: "name",
              displayName: "Название",
              primary: true,
            },
            {
              name: "categoryName",
              displayName: "Категория",
              primary: true,
            },
          ],
        }}
        rows={modifiers.map(modifier => ({
          cols: [
            {
              name: "checked",
              value: checkedModifiersUuids.has(modifier.uuid),
              onChange: () =>
                onModifierCheckedChange && onModifierCheckedChange(modifier),
            },
            {
              name: "name",
              value: modifier.name,
            },
            {
              name: "categoryName",
              value: modifier.category?.name ?? "Нет",
            },
          ],
        }))}
      />
    );
  }
);

ModifierTable.displayName = "ModifierTable";

export default ModifierTable;
