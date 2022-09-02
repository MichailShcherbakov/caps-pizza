import {
  Typography,
  Table as MUITable,
  TableProps as MUITableProps,
  TableHead as MUITableHead,
  TableHeadProps as MUITableHeadProps,
  TableBody as MUITableBody,
  TableBodyProps as MUITableBodyProps,
  TableRow as MUITableRow,
  TableRowProps as MUITableRowProps,
  TableCell as MUITableCell,
  TableCellProps as MUITableCellProps,
  Collapse,
  Stack,
} from "@mui/material";
import React from "react";
import { useStyle } from "./index.style";

export interface TableHeadProps extends MUITableHeadProps {}

export const TableHead: React.FC<TableHeadProps> = props => {
  return <MUITableHead {...props} />;
};

export interface TableBodyProps extends MUITableBodyProps {}

export const TableBody: React.FC<TableBodyProps> = props => {
  return <MUITableBody {...props} />;
};

export interface TableRowProps extends MUITableRowProps {}

export const TableRow: React.FC<TableRowProps> = props => {
  return <MUITableRow {...props} />;
};

export interface TableCellProps extends MUITableCellProps {}

export const TableCell: React.FC<TableCellProps> = props => {
  return <MUITableCell {...props} />;
};

export interface TableTextCellProps extends TableCellProps {
  children?: string | boolean | number | null;
}

export const TableTextCell: React.FC<TableTextCellProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <TableCell {...props}>
      <Typography className={className} textAlign={props.align}>
        {children}
      </Typography>
    </TableCell>
  );
};

export interface CollapsibleTableRowProps {
  colSpan: number;
  in: boolean;
  children?:
    | React.ReactElement
    | (React.ReactElement | null | undefined)[]
    | null;
}

export const CollapsibleTableRow: React.FC<CollapsibleTableRowProps> = ({
  in: isOpen,
  colSpan,
  children,
}) => {
  const { classes } = useStyle();
  return (
    <TableRow>
      <TableCell
        colSpan={colSpan}
        className={classes.tableCell}
        style={{ borderWidth: isOpen ? 1 : 0 }}
      >
        <Collapse in={isOpen} timeout="auto" unmountOnExit>
          <Stack spacing={2} py={2}>
            {children}
          </Stack>
        </Collapse>
      </TableCell>
    </TableRow>
  );
};

export interface TableProps extends MUITableProps {}

export const Table: React.FC<TableProps> = props => {
  return <MUITable {...props} />;
};

export default Table;
