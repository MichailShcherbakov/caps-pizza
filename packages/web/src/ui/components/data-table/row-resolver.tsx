import { Checkbox, Stack } from "@mui/material";
import { TableCell, TableTextCell } from "../table";
import { DataTableHeadColumnTypes } from "./types";
import ImageColumn from "./columns/image";

export interface DataTableRowResolverProps {
  col: DataTableHeadColumnTypes;
  value?: string;
  options?: {
    align?: "left" | "right";
  } & Record<string, unknown>;
}

export const DataTableRowResolver: React.FC<DataTableRowResolverProps> = ({
  col,
  value,
  options,
}) => {
  switch (col.type) {
    case "image": {
      return (
        <ImageColumn
          imageWidth={col.imageWidth}
          imageHeight={col.imageHeight}
          imageURL={value}
          align={options?.align}
          className={col.rowColClassName}
        />
      );
    }
    case "component": {
      return (
        <TableCell>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent={
              options?.align === "left" ? "flex-start" : "flex-end"
            }
            className={col.rowColClassName}
          >
            {col.component && col.component(value)}
          </Stack>
        </TableCell>
      );
    }
    case "checkbox": {
      return (
        <TableCell>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent={
              options?.align === "left" ? "flex-start" : "flex-end"
            }
            className={col.rowColClassName}
          >
            <Checkbox
              checked={Boolean(value)}
              onChange={options?.onChange as any}
              size="small"
              color="secondary"
            />
          </Stack>
        </TableCell>
      );
    }
    case "text":
    default: {
      return (
        <TableTextCell
          className={col.rowColClassName}
          align={options?.align ?? "right"}
          truncate={col.truncate}
        >
          {value}
        </TableTextCell>
      );
    }
  }
};

export default DataTableRowResolver;
