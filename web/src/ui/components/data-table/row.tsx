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
  collapsedRowSpace?: () => React.ReactElement | React.ReactElement[];
}

export const DataTableRow: React.FC<DataTableRowProps> = React.memo(
  ({ head, cols = [], collapsible, collapsedRowSpace }) => {
    const [isOpen, setIsOpen] = React.useState<boolean>(false);
    const matches = useMediaQuery(theme => theme.breakpoints.up("md"));

    const colsMap = new Map(cols.map(col => [col.name, col]));

    const currentRenderCols: DataTableHeadColumnTypes[] = matches
      ? head.cols.filter(col => !col.collapsed)
      : head.cols.filter(col => col.primary);

    const hiddenCols: DataTableHeadColumnTypes[] = matches
      ? head.cols.filter(col => col.collapsed)
      : head.cols.filter(col => !col.primary);

    const hasCollapsedSpace =
      collapsible && (collapsedRowSpace || hiddenCols.length);

    return (
      <>
        <TableRow>
          {hasCollapsedSpace ? (
            <TableCell>
              <IconButton
                aria-label="expand row"
                size="small"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              </IconButton>
            </TableCell>
          ) : undefined}
          {currentRenderCols.map((col, idx) => (
            <DataTableRowResolver
              key={col.name}
              col={col}
              value={colsMap.get(col.name)?.value}
              options={{ align: !idx ? "left" : "right" }}
            />
          ))}
        </TableRow>
        {hasCollapsedSpace ? (
          <CollapsibleTableRow
            in={isOpen}
            colSpan={currentRenderCols.length + (collapsible ? 1 : 0)} // + 1 collapse button
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
