export interface DataTableColumn<T = unknown> extends Record<string, unknown> {
  name: string;
  value?: string | boolean | number | T;
  defaultValue?: string | boolean | number | T;
}

export interface DataTableHeadColumn {
  name: string;
  displayName: string;
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
  align?: "left" | "right";
}

export interface DataTableTextHeadColumn extends DataTableHeadColumn {
  type?: "text";
}

export interface DataTableImageHeadColumn extends DataTableHeadColumn {
  type: "image";
  imageWidth: number;
  imageHeight: number;
}

export interface DataTableCheckboxHeadColumn extends DataTableHeadColumn {
  type: "checkbox";
}

export interface DataTableComponentHeadColumn<T = unknown>
  extends DataTableHeadColumn {
  type: "component";
  component?: (value?: T) => React.ReactElement;
}

export type DataTableHeadColumnTypes =
  | DataTableTextHeadColumn
  | DataTableImageHeadColumn
  | DataTableCheckboxHeadColumn
  | DataTableComponentHeadColumn;

export interface DataTableHead {
  cols: DataTableHeadColumnTypes[];
}
