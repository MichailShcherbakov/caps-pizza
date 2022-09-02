import { Grid, Stack } from "@mui/material";
import { Skeleton } from "~/ui";
import { useStyle } from "./index.style";

export const ProductCardSkeleton = () => {
  const { classes } = useStyle();
  return (
    <Stack direction="row" className={classes.root}>
      <Skeleton width={120} height={120} className={classes.image} />
      <Stack width="100%">
        <Stack
          width="100%"
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Skeleton width={120} height={16} />
          <Skeleton width={16} height={14} />
        </Stack>
        <Stack width="100%" height="100%" justifyContent="flex-end">
          <Stack
            width="100%"
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Stack spacing={1}>
              <Skeleton width={64} height={14} />
              <Skeleton width={100} height={32} />
            </Stack>
            <Skeleton width={64} height={16} />
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

export const TitleSkeleton = () => {
  return (
    <Skeleton
      width={164}
      height={32}
      sx={{
        marginTop: 2,
        marginBottom: 2,
      }}
    />
  );
};

export const TextFieldSkeleton = () => {
  return <Skeleton fullWidth height={56} />;
};

export const SubTitleSkeleton = () => {
  return <Skeleton width={180} height={12} />;
};

export interface OrderFormSkeletonProps {}

export const OrderFormSkeleton: React.FC<OrderFormSkeletonProps> = () => {
  return (
    <Stack py={2} spacing={4}>
      <TitleSkeleton />
      <Stack component="ul" spacing={2}>
        {(3).map(index => (
          <ProductCardSkeleton key={index} />
        ))}
      </Stack>
      <Stack alignItems="flex-end" justifyContent="center">
        <TitleSkeleton />
        <Skeleton />
      </Stack>
      <Stack spacing={4}>
        <TitleSkeleton />
        <Stack>
          <Grid spacing={2} rowSpacing={2} container>
            <Grid item xl={4} lg={4} sm={4} xs={12}>
              <TextFieldSkeleton />
            </Grid>
            <Grid item xl={4} lg={4} sm={4} xs={12}>
              <TextFieldSkeleton />
            </Grid>
            <Grid item xl={4} lg={4} sm={4} xs={12}>
              <TextFieldSkeleton />
            </Grid>
          </Grid>
        </Stack>
        <TitleSkeleton />
        <Stack>
          <Grid spacing={2} rowSpacing={2} container>
            <Grid item xl={12} lg={12} sm={12} xs={12}>
              <TextFieldSkeleton />
            </Grid>
            <Grid item xl={3} lg={3} sm={6} xs={12}>
              <TextFieldSkeleton />
            </Grid>
            <Grid item xl={3} lg={3} sm={6} xs={12}>
              <TextFieldSkeleton />
            </Grid>
            <Grid item xl={3} lg={3} sm={6} xs={12}>
              <TextFieldSkeleton />
            </Grid>
            <Grid item xl={3} lg={3} sm={6} xs={12}>
              <TextFieldSkeleton />
            </Grid>
          </Grid>
        </Stack>
        <TitleSkeleton />
        <TextFieldSkeleton />
        <TitleSkeleton />
        <TextFieldSkeleton />
        <TitleSkeleton />
        <Skeleton fullWidth height={128} />
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Stack spacing={1}>
            <TitleSkeleton />
            <SubTitleSkeleton />
            <SubTitleSkeleton />
          </Stack>
          <Skeleton width={151} height={36} />
        </Stack>
      </Stack>
    </Stack>
  );
};

export default OrderFormSkeleton;
