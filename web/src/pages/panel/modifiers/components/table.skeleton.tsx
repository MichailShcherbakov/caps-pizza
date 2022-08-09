import {
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import UiKit from "~/ui";

export interface ModifiersTableSkeletonProps {}

export const ModifiersTableSkeleton: React.FC<
  ModifiersTableSkeletonProps
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
              <UiKit.Skeleton width={96} height={14} />
            </Stack>
          </TableCell>
          <TableCell>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="flex-end"
            >
              <UiKit.Skeleton width={96} height={14} />
            </Stack>
          </TableCell>
          <TableCell>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="flex-end"
            >
              <UiKit.Skeleton width={96} height={14} />
            </Stack>
          </TableCell>
          <TableCell>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="flex-end"
            >
              <UiKit.Skeleton width={96} height={14} />
            </Stack>
          </TableCell>
          <TableCell>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="flex-end"
            >
              <UiKit.Skeleton width={96} height={14} />
            </Stack>
          </TableCell>
          <TableCell>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="flex-end"
            >
              <UiKit.Skeleton width={96} height={14} />
            </Stack>
          </TableCell>
          <TableCell></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {(3).map(idx => (
          <TableRow key={idx}>
            <TableCell>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="flex-start"
              >
                <UiKit.Skeleton width={256} height={14} />
              </Stack>
            </TableCell>
            <TableCell>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="flex-end"
              >
                <UiKit.Skeleton width={72} height={14} />
              </Stack>
            </TableCell>
            <TableCell>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="flex-end"
              >
                <UiKit.Skeleton width={72} height={14} />
              </Stack>
            </TableCell>
            <TableCell>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="flex-end"
              >
                <UiKit.Skeleton width={72} height={14} />
              </Stack>
            </TableCell>
            <TableCell>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="flex-end"
              >
                <UiKit.Skeleton width={72} height={14} />
              </Stack>
            </TableCell>
            <TableCell>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="flex-end"
              >
                <UiKit.Skeleton width={72} height={14} />
              </Stack>
            </TableCell>
            <TableCell>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="center"
                spacing={2}
              >
                <UiKit.Skeleton width={72} height={28} />
                <UiKit.Skeleton width={72} height={28} />
              </Stack>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ModifiersTableSkeleton;
