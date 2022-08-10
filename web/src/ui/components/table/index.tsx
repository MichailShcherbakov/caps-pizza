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
} from "@mui/material";
import styles from "./index.module.scss";

export interface TableHeadProps extends MUITableHeadProps {}

export const TableHead: React.FC<TableHeadProps> = props => {
  return (
    <MUITableHead
      {...props}
      className={styles["ui-table__head"]}
    ></MUITableHead>
  );
};

export interface TableBodyProps extends MUITableBodyProps {}

export const TableBody: React.FC<TableBodyProps> = props => {
  return (
    <MUITableBody
      {...props}
      className={styles["ui-table__body"]}
    ></MUITableBody>
  );
};

export interface TableRowProps extends MUITableRowProps {}

export const TableRow: React.FC<TableRowProps> = props => {
  return (
    <MUITableRow {...props} className={styles["ui-table__row"]}></MUITableRow>
  );
};

export interface TableCellProps extends MUITableCellProps {}

export const TableCell: React.FC<TableCellProps> = props => {
  return (
    <MUITableCell
      {...props}
      className={styles["ui-table__cell"]}
    ></MUITableCell>
  );
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
  return <MUITable {...props} className={styles["ui-table"]}></MUITable>;
};

export default Table;

export interface CollapseProps {
  component: React.ElementType;
  in: boolean;
  children?: React.ReactElement | React.ReactElement[];
}

export const Collapse: React.FC<CollapseProps> = ({
  component: Component,
  in: collapse,
  ...props
}) => {
  return (
    <Component
      {...props}
      style={{
        height: collapse ? "auto" : 0,
        minHeight: 0,
        overflow: "hidden",
        transition: "height 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
      }}
    />
  );
};
