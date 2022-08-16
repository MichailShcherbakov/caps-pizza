import React from "react";
import { Stack, Typography } from "@mui/material";
import SubtitlesOffOutlinedIcon from "@mui/icons-material/SubtitlesOffOutlined";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableTextCell,
} from "~/ui";
import { useMediaQuery } from "../../theme";
import DataTableRow, { DataTableRowProps } from "./row";
import DataTableSkeletonRow from "./skeleton-row";
import { DataTableHead } from "./types";

export interface DataTableProps {
  head: DataTableHead;
  rows?: Omit<DataTableRowProps, "head">[];
  collapsible?: boolean;
  loading?: boolean;
  EmptyComponent?: React.ReactElement;
  LoadingComponent?: React.ReactElement;
  emptyTitle?: string;
  emptySubTitle?: string;
}

export const DataTable: React.FC<DataTableProps> = React.memo(
  ({
    head,
    rows = [],
    EmptyComponent,
    LoadingComponent,
    emptyTitle,
    emptySubTitle,
    collapsible = true,
    loading,
  }) => {
    const matches = useMediaQuery(theme => theme.breakpoints.up("md"));
    const currentRenderCols = React.useMemo(
      () =>
        matches
          ? head.cols.filter(col => !col.collapsed)
          : head.cols.filter(col => col.primary),
      [matches, head]
    );

    if (!loading && !rows.length)
      return (
        <Stack>
          {EmptyComponent ? (
            EmptyComponent
          ) : (
            <Stack direction="row" alignItems="center" spacing={2}>
              <SubtitlesOffOutlinedIcon color="secondary" />
              <Stack>
                <Typography variant="h6" component="p">
                  {emptyTitle ?? "Список пуст "}
                </Typography>
                <Typography variant="subtitle2">
                  {emptySubTitle ?? ""}
                </Typography>
              </Stack>
            </Stack>
          )}
        </Stack>
      );

    if (loading && LoadingComponent) return LoadingComponent;

    return (
      <Table size="small">
        <TableHead>
          {loading ? (
            <DataTableSkeletonRow
              head={head}
              collapsible={collapsible}
              isHead
            />
          ) : (
            <TableRow>
              {collapsible ? <TableCell></TableCell> : undefined}
              {currentRenderCols.map((col, idx) => (
                <TableTextCell
                  key={col.name}
                  className={col.headColClassName}
                  align={!idx ? "left" : "right"}
                >
                  {col.displayName}
                </TableTextCell>
              ))}
            </TableRow>
          )}
        </TableHead>
        <TableBody>
          {loading
            ? (3).map(idx => (
                <DataTableSkeletonRow
                  key={idx}
                  head={head}
                  collapsible={collapsible}
                />
              ))
            : rows.map((row, idx) => (
                <DataTableRow
                  key={idx}
                  collapsible={collapsible}
                  {...row}
                  head={head}
                />
              ))}
        </TableBody>
      </Table>
    );
  }
);

DataTable.displayName = " DataTable";

export default DataTable;
