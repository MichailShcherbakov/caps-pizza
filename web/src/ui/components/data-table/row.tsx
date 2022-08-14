import React from "react";
import { Grid, IconButton, Stack, Typography } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import {
  CollapsibleTableRow,
  TableCell,
  TableRow,
  TableTextCell,
} from "../table";
import NextImage from "next/image";
import { useMediaQuery } from "../../theme";

export interface DataTableColumn<T = any> {
  name: string;
  value?: string | boolean | number | T;
}

export interface DataTableHeadColumn<T> {
  name: string;
  displayName: string;
  type?: "text" | "image" | "component";
  headColClassName?: string;
  rowColClassName?: string;
  collapsed?: boolean;
  primary?: boolean;
  fullWidth?: boolean;
  skeleton?: {
    head?: {
      width?: number;
      height?: number;
    };
    row?: {
      width?: number;
      height?: number;
    };
  };
  component?: (value?: T) => React.ReactElement;
}

export interface DataTableHead<T = any> {
  cols: DataTableHeadColumn<T>[];
}

export interface DataTableRowProps<T = any> {
  head: DataTableHead;
  cols: DataTableColumn[];
  collapsible?: boolean;
  collapsedRowSpace?: (value?: T) => React.ReactElement | React.ReactElement[];
  value?: T;
}

export const DataTableRow: React.FC<DataTableRowProps> = React.memo(
  ({ head, cols = [], collapsible, collapsedRowSpace }) => {
    const [isOpen, setIsOpen] = React.useState<boolean>(false);
    const matches = useMediaQuery(theme => theme.breakpoints.up("md"));

    const colsMap = new Map(cols.map(col => [col.name, col]));

    const currentRenderCols = matches
      ? head.cols.filter(col => !col.collapsed)
      : head.cols.filter(col => col.primary);

    const hiddenCols = matches
      ? head.cols.filter(col => col.collapsed)
      : head.cols.filter(col => !col.primary);

    const hasCollapsedSpace =
      collapsible && (collapsedRowSpace || hiddenCols.length);

    return (
      <>
        <TableRow>
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
          {currentRenderCols.map((col, idx) =>
            !col.type || col.type === "text" ? (
              <TableTextCell
                key={col.name}
                className={col.rowColClassName}
                align={!idx ? "left" : "right"}
              >
                {colsMap.get(col.name)?.value}
              </TableTextCell>
            ) : col.type === "image" ? (
              <TableCell key={col.name}>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="flex-end"
                  className={col.rowColClassName}
                >
                  <NextImage
                    src={`${process.env.NEXT_PUBLIC_IMAGES_SOURCE_URL}${
                      colsMap.get(col.name)?.value
                    }`}
                    width={72}
                    height={72}
                    layout="fixed"
                    alt="product image"
                  />
                </Stack>
              </TableCell>
            ) : col.type === "component" && col.component ? (
              <TableCell key={col.name} className={col.rowColClassName}>
                {col.component(colsMap.get(col.name)?.value)}
              </TableCell>
            ) : undefined
          )}
        </TableRow>
        {hasCollapsedSpace ? (
          <CollapsibleTableRow
            in={isOpen}
            colSpan={currentRenderCols.length + 1} // with collapse button
          >
            <Stack spacing={2}>
              {hiddenCols.length ? (
                <>
                  <Typography variant="h6" className="ui-px-8">
                    Информация
                  </Typography>
                  <Stack
                    direction="row"
                    alignItems="flex-start"
                    className="ui-px-8 ui-gap-2"
                  >
                    {hiddenCols.filter(col => col.type === "image").length ? (
                      <Stack>
                        {hiddenCols
                          .filter(col => col.type === "image")
                          .map(col => (
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
                          ))}
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
                            className={!col.fullWidth ? "ui-w-fit-content" : ""}
                            style={{
                              padding: 0,
                              paddingRight: "1rem",
                              paddingBottom: "1rem",
                            }}
                          >
                            <Stack>
                              <Typography variant="subtitle1">
                                {col.displayName}
                              </Typography>
                              <Typography>
                                {colsMap.get(col.name)?.value}
                              </Typography>
                            </Stack>
                          </Grid>
                        ))}
                    </Grid>
                  </Stack>
                </>
              ) : undefined}
              {collapsedRowSpace && collapsedRowSpace()}
            </Stack>
          </CollapsibleTableRow>
        ) : undefined}
      </>
    );
  }
);

DataTableRow.displayName = "DataTableRow";

export default DataTableRow;
