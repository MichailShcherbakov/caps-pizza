import {
  Skeleton as MUISkeleton,
  SkeletonProps as MUISkeletonProps,
} from "@mui/material";

export interface SkeletonProps extends MUISkeletonProps {}

export const Skeleton: React.FC<SkeletonProps> = props => {
  return (
    <MUISkeleton
      {...props}
      variant="rectangular"
      animation="wave"
      className="ui-rounded-1"
    />
  );
};

export default Skeleton;
