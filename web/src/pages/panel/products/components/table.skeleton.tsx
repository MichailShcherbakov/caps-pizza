import {
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { Skeleton } from "~/ui";

export interface ProductsTableSkeletonProps {}

export const ProductsTableSkeleton: React.FC<
  ProductsTableSkeletonProps
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
              <Skeleton width={48} height={14} />
            </Stack>
          </TableCell>
          <TableCell>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="flex-end"
            >
              <Skeleton width={64} height={14} />
            </Stack>
          </TableCell>
          <TableCell align="right">
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="flex-end"
            >
              <Skeleton width={64} height={14} />
            </Stack>
          </TableCell>
          <TableCell align="right">
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="flex-end"
            >
              <Skeleton width={64} height={14} />
            </Stack>
          </TableCell>
          <TableCell align="right">
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="flex-end"
            >
              <Skeleton width={64} height={14} />
            </Stack>
          </TableCell>
          <TableCell align="right">
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="flex-end"
            >
              <Skeleton width={64} height={14} />
            </Stack>
          </TableCell>
          <TableCell align="right">
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="flex-end"
            >
              <Skeleton width={64} height={14} />
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
                <Skeleton width={128} height={14} />
              </Stack>
            </TableCell>
            <TableCell>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="flex-end"
              >
                <Skeleton width={48} height={14} />
              </Stack>
            </TableCell>
            <TableCell>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="flex-end"
              >
                <Skeleton width={48} height={14} />
              </Stack>
            </TableCell>
            <TableCell>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="flex-end"
              >
                <Skeleton width={48} height={14} />
              </Stack>
            </TableCell>
            <TableCell>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="flex-end"
              >
                <Skeleton width={48} height={14} />
              </Stack>
            </TableCell>
            <TableCell>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="flex-end"
              >
                <Skeleton width={48} height={14} />
              </Stack>
            </TableCell>
            <TableCell>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="flex-end"
              >
                <Skeleton width={48} height={14} />
              </Stack>
            </TableCell>
            <TableCell>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="center"
                spacing={2}
              >
                <Skeleton width={96} height={28} />
                <Skeleton width={96} height={28} />
              </Stack>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ProductsTableSkeleton;
