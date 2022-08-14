export interface DataTableColumn<T = any> {
  name: string;
  value?: string | boolean | number | T;
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
}

export interface DataTableTextHeadColumn extends DataTableHeadColumn {
  type?: "text";
}

export interface DataTableImageHeadColumn extends DataTableHeadColumn {
  type: "image";
  imageWidth: number;
  imageHeight: number;
}

export interface DataTableComponentHeadColumn<T = any>
  extends DataTableHeadColumn {
  type: "component";
  component?: (value?: T) => React.ReactElement;
}

export type DataTableHeadColumnTypes =
  | DataTableTextHeadColumn
  | DataTableImageHeadColumn
  | DataTableComponentHeadColumn;

export interface DataTableHead {
  cols: DataTableHeadColumnTypes[];
}
