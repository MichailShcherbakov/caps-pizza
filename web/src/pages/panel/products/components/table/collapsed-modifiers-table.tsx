import React from "react";
import { ModifierCategory } from "~/services/modifier-categories.service";
import { Modifier } from "~/services/modifiers.service";
import { DataTable } from "~/ui";

export interface CollapsedModifiersTableProps {
  modifiers: Modifier[];
  modifierCategories: ModifierCategory[];
}

export const CollapsedModifiersTable: React.FC<
  CollapsedModifiersTableProps
> = ({ modifiers, modifierCategories }) => {
  const modifierCategoriesMap = React.useMemo(
    () => new Map(modifierCategories.map(c => [c.uuid, c])),
    [modifierCategories]
  );

  return (
    <DataTable
      head={{
        cols: [
          {
            name: "articleNumber",
            displayName: "Артикул",
            fullWidth: true,
          },
          {
            name: "name",
            displayName: "Название",
            primary: true,
          },
          {
            name: "desc",
            displayName: "Описание",
            fullWidth: true,
          },
          {
            name: "price",
            displayName: "Цена",
            primary: true,
          },
          {
            name: "position",
            displayName: "Позиция",
            fullWidth: true,
          },
          {
            name: "category",
            displayName: "Категория",
            primary: true,
          },
        ],
      }}
      rows={modifiers.map(modifier => ({
        cols: [
          {
            name: "articleNumber",
            value: modifier.article_number,
          },
          {
            name: "name",
            value: modifier.name,
          },
          {
            name: "desc",
            value: modifier.desc ?? "Нет",
          },
          {
            name: "price",
            value: `${modifier.price} ₽`,
          },
          {
            name: "position",
            value: modifier.display_position ?? "Не указано",
          },
          {
            name: "category",
            value:
              modifierCategoriesMap.get(modifier.category_uuid)?.name ??
              "Не указано",
          },
        ],
      }))}
    />
  );
};

export default CollapsedModifiersTable;
