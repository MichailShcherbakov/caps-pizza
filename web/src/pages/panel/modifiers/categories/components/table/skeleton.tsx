import { DataTable } from "~/ui";
import useModifierCategoriesTableHead from "../helpers/data-table-head";

export interface ModifierCategoriesTableSkeletonProps {}

export const ModifierCategoriesTableSkeleton: React.FC<
  ModifierCategoriesTableSkeletonProps
> = () => {
  const head = useModifierCategoriesTableHead();

  return <DataTable head={head} loading />;
};

export default ModifierCategoriesTableSkeleton;
