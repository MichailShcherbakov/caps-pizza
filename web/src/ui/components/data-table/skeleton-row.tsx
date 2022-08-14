import React from "react";
import { Stack } from "@mui/material";
import { TableCell, TableRow } from "../table";
import { useMediaQuery } from "../../theme";
import { DataTableRowProps } from "./row";
import Skeleton from "../skeleton";

export interface DataTableSkeletonRowProps
  extends Pick<DataTableRowProps, "head" | "collapsible"> {
  isHead?: boolean;
}

export const DataTableSkeletonRow: React.FC<DataTableSkeletonRowProps> =
  React.memo(({ head, isHead, collapsible }) => {
    const matches = useMediaQuery(theme => theme.breakpoints.up("md"));

    const currentRenderCols = matches
      ? head.cols.filter(col => !col.collapsed)
      : head.cols.filter(col => col.primary);

    return (
      <TableRow>
        {collapsible ? (
          <TableCell>
            {!isHead ? <Skeleton width={24} height={24} /> : undefined}
          </TableCell>
        ) : undefined}
        {currentRenderCols.map((col, idx) => (
          <TableCell key={col.name}>
            <Stack
              className={col.headColClassName}
              alignItems={!idx ? "flex-start" : "flex-end"}
            >
              {isHead ? (
                <Skeleton
                  width={col.skeleton?.head?.width ?? 68}
                  height={col.skeleton?.head?.height ?? 14}
                />
              ) : (
                <Skeleton
                  width={col.skeleton?.row?.width ?? 44}
                  height={col.skeleton?.row?.height ?? 14}
                />
              )}
            </Stack>
          </TableCell>
        ))}
      </TableRow>
    );
  });

DataTableSkeletonRow.displayName = "DataTableSkeletonRow";

export default DataTableSkeletonRow;
