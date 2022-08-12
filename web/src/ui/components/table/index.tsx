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

export interface TableHeadProps extends MUITableHeadProps {}

export const TableHead: React.FC<TableHeadProps> = props => {
  return <MUITableHead {...props}></MUITableHead>;
};

export interface TableBodyProps extends MUITableBodyProps {}

export const TableBody: React.FC<TableBodyProps> = props => {
  return <MUITableBody {...props}></MUITableBody>;
};

export interface TableRowProps extends MUITableRowProps {}

export const TableRow: React.FC<TableRowProps> = props => {
  return <MUITableRow {...props}></MUITableRow>;
};

export interface TableCellProps extends MUITableCellProps {}

export const TableCell: React.FC<TableCellProps> = props => {
  return <MUITableCell {...props}></MUITableCell>;
};

export interface TableTextCellProps extends TableCellProps {
  children?: string | boolean | number | null;
}

export const TableTextCell: React.FC<TableTextCellProps> = ({
  children,
  ...props
}) => {
  return (
    <TableCell {...props}>
      <Typography>{children}</Typography>
    </TableCell>
  );
};

export interface TableProps extends MUITableProps {}

export const Table: React.FC<TableProps> = props => {
  return <MUITable {...props}></MUITable>;
};

export default Table;

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
  return (
    <TableRow>
      <TableCell
        colSpan={colSpan}
        className="ui-p-0"
        style={{ borderWidth: isOpen ? 1 : 0 }}
      >
        <Collapse in={isOpen} timeout="auto" unmountOnExit>
          <Stack className="ui-py-8" spacing={2}>
            {children}
          </Stack>
        </Collapse>
      </TableCell>
    </TableRow>
  );
};
