import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import UiKit from "~/ui";

export interface ModifierCategoriesTableSkeletonProps {}

export const ModifierCategoriesTableSkeleton: React.FC<
  ModifierCategoriesTableSkeletonProps
> = () => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>
            <UiKit.Skeleton width={48} height={16}></UiKit.Skeleton>
          </TableCell>
          <TableCell>
            <UiKit.Skeleton width={72} height={16}></UiKit.Skeleton>
          </TableCell>
          <TableCell></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {(3).map(i => (
          <TableRow key={i}>
            <TableCell>
              <UiKit.Skeleton width={196} height={16}></UiKit.Skeleton>
            </TableCell>
            <TableCell>
              <UiKit.Skeleton width={128} height={16}></UiKit.Skeleton>
            </TableCell>
            <TableCell>
              <UiKit.Skeleton width={96} height={24}></UiKit.Skeleton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ModifierCategoriesTableSkeleton;
