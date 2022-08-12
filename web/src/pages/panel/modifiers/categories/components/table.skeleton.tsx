import {
  Stack,
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
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="flex-start"
            >
              <UiKit.Skeleton width={48} height={16}></UiKit.Skeleton>
            </Stack>
          </TableCell>
          <TableCell>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="flex-end"
            >
              <UiKit.Skeleton width={72} height={16}></UiKit.Skeleton>
            </Stack>
          </TableCell>
          <TableCell></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {(3).map(i => (
          <TableRow key={i}>
            <TableCell>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="flex-start"
              >
                <UiKit.Skeleton width={196} height={16}></UiKit.Skeleton>
              </Stack>
            </TableCell>
            <TableCell>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="flex-end"
              >
                <UiKit.Skeleton width={128} height={16}></UiKit.Skeleton>
              </Stack>
            </TableCell>
            <TableCell>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="center"
                spacing={2}
              >
                <UiKit.Skeleton width={96} height={28}></UiKit.Skeleton>
                <UiKit.Skeleton width={96} height={28}></UiKit.Skeleton>
              </Stack>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ModifierCategoriesTableSkeleton;
