import { Grid, Stack } from "@mui/material";
import { Skeleton } from "~/ui";

export const ProductCardSkeleton = () => {
  return (
    <Stack
      direction="row"
      className="ui-w-full ui-p-8 ui-gap-2 ui-border-rounded-4"
    >
      <Skeleton width={120} height={120} className="ui-rounded-4" />
      <Stack className="ui-w-full">
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          className="ui-w-full"
        >
          <Skeleton width={120} height={16} />
          <Skeleton width={16} height={14} />
        </Stack>
        <Stack justifyContent="flex-end" className="ui-w-full ui-h-full">
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            className="ui-w-full"
          >
            <Stack className="ui-gap-1">
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
  return <Skeleton width={164} height={32} className="ui-my-2" />;
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
    <Stack className="ui-gap-4 ui-py-8">
      <TitleSkeleton />
      <Stack component="ul" className="ui-gap-2">
        {(3).map(index => (
          <ProductCardSkeleton key={index} />
        ))}
      </Stack>
      <Stack alignItems="flex-end" justifyContent="center">
        <TitleSkeleton />
        <Skeleton />
      </Stack>
      <Stack className="ui-gap-4">
        <TitleSkeleton />
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
        <TitleSkeleton />
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
          <Stack className="ui-gap-1">
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
