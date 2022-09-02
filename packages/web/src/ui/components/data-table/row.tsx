import React from "react";
import { Grid, IconButton, Stack, Typography } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { CollapsibleTableRow, TableCell, TableRow } from "../table";
import NextImage from "next/image";
import { useMediaQuery } from "../../theme";
import {
  DataTableColumn,
  DataTableHead,
  DataTableHeadColumnTypes,
} from "./types";
import DataTableRowResolver from "./row-resolver";

export interface DataTableRowProps {
  head: DataTableHead;
  cols: DataTableColumn[];
  collapsible?: boolean;
  collapsedRowSpace?: () => React.ReactElement | React.ReactElement[] | null;
}

export const DataTableRow: React.FC<DataTableRowProps> = React.memo(
  ({
    head,
    cols = [],
    collapsible,
    collapsedRowSpace: collapsedRowSpaceFunc,
  }) => {
    const [isOpen, setIsOpen] = React.useState<boolean>(false);
    const matches = useMediaQuery(theme => theme.breakpoints.up("md"));

    const colsMap = new Map(cols.map(col => [col.name, col]));

    const currentRenderCols: DataTableHeadColumnTypes[] = matches
      ? head.cols.filter(col => !col.collapsed)
      : head.cols.filter(col => col.primary);

    const hiddenCols: DataTableHeadColumnTypes[] = matches
      ? head.cols.filter(col => col.collapsed)
      : head.cols.filter(col => !col.primary);

    const collapsedRowSpace = collapsedRowSpaceFunc && collapsedRowSpaceFunc();
    const hasCollapsedSpace = collapsedRowSpace || hiddenCols.length;

    return (
      <>
        <TableRow>
          {collapsible ? (
            <TableCell>
              {hasCollapsedSpace ? (
                <IconButton
                  aria-label="expand row"
                  size="small"
                  onClick={() => setIsOpen(!isOpen)}
                >
                  {isOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
              ) : undefined}
            </TableCell>
          ) : undefined}
          {currentRenderCols.map((col, idx) => {
            const { name, value, defaultValue, ...options } = colsMap.get(
              col.name
            ) as DataTableColumn;
            return (
              <DataTableRowResolver
                key={name}
                col={col}
                value={(value ?? defaultValue) as string}
                options={{
                  align: col.align ?? (!idx ? "left" : "right"),
                  ...options,
                }}
              />
            );
          })}
        </TableRow>
        {hasCollapsedSpace ? (
          <CollapsibleTableRow
            in={isOpen}
            colSpan={currentRenderCols.length + (collapsible ? 1 : 0)} // + 1 collapse button
          >
            <Stack spacing={2}>
              {hiddenCols.length ? (
                <>
                  <Typography variant="h6" px={2}>
                    Информация
                  </Typography>
                  <Stack
                    direction="row"
                    alignItems="flex-start"
                    px={2}
                    spacing={2}
                  >
                    {hiddenCols.filter(col => col.type === "image").length ? (
                      <Stack>
                        {hiddenCols.map(col => {
                          if (col.type !== "image") return undefined;

                          return (
                            <Stack key={col.name}>
                              <Typography variant="subtitle1">
                                {col.displayName}
                              </Typography>
                              <Stack direction="row">
                                <NextImage
                                  src={`${
                                    process.env.NEXT_PUBLIC_IMAGES_SOURCE_URL
                                  }${colsMap.get(col.name)?.value}`}
                                  width={100}
                                  height={100}
                                  layout="fixed"
                                  alt="product image"
                                />
                              </Stack>
                            </Stack>
                          );
                        })}
                      </Stack>
                    ) : undefined}
                    <Grid
                      container
                      spacing={2}
                      style={{
                        margin: 0,
                      }}
                    >
                      {hiddenCols
                        .filter(col => !col.type || col.type === "text")
                        .map(col => (
                          <Grid
                            container
                            item
                            key={col.name}
                            sx={{
                              padding: 0,
                              paddingRight: "1rem",
                              paddingBottom: "1rem",
                              width: col.fullWidth ? undefined : "fit-content",
                            }}
                          >
                            <Stack>
                              <Typography variant="subtitle1">
                                {col.displayName}
                              </Typography>
                              <Typography>
                                {colsMap.get(col.name)?.value as string}
                              </Typography>
                            </Stack>
                          </Grid>
                        ))}
                    </Grid>
                  </Stack>
                </>
              ) : undefined}
              {collapsedRowSpace}
            </Stack>
          </CollapsibleTableRow>
        ) : undefined}
      </>
    );
  }
);

DataTableRow.displayName = "DataTableRow";

export default DataTableRow;
