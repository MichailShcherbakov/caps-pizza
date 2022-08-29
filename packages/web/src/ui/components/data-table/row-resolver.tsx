import { Checkbox, Stack } from "@mui/material";
import { TableCell, TableTextCell } from "../table";
import { DataTableHeadColumnTypes } from "./types";
import NextImage from "next/image";

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
        <TableCell align={options?.align ?? "right"}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent={
              options?.align === "left" ? "flex-start" : "flex-end"
            }
            className={col.rowColClassName}
          >
            <NextImage
              src={`${process.env.NEXT_PUBLIC_IMAGES_SOURCE_URL}${value}`}
              width={col.imageWidth}
              height={col.imageHeight}
              layout="fixed"
              alt="data table image cell"
            />
          </Stack>
        </TableCell>
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
        >
          {value}
        </TableTextCell>
      );
    }
  }
};

export default DataTableRowResolver;
