import { DataTable } from "~/ui";
import useModifiersTableHead from "../helpers/data-table-head";

export interface ModifiersTableSkeletonProps {}

export const ModifiersTableSkeleton: React.FC<
  ModifiersTableSkeletonProps
> = () => {
  const head = useModifiersTableHead();

  return <DataTable head={head} loading />;
};

export default ModifiersTableSkeleton;
