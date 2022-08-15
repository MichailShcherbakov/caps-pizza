import { DataTable } from "~/ui";
import useDeliveryTableHead from "../helpers/data-table-head";

export interface DeliveryTableSkeletonProps {}

export const DeliveryTableSkeleton: React.FC<
  DeliveryTableSkeletonProps
> = () => {
  const head = useDeliveryTableHead();

  return <DataTable head={head} loading />;
};

export default DeliveryTableSkeleton;
