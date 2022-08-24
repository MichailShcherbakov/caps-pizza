import {
  Skeleton as MUISkeleton,
  SkeletonProps as MUISkeletonProps,
} from "@mui/material";

export interface SkeletonProps extends MUISkeletonProps {
  fullWidth?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  fullWidth,
  className,
  ...props
}) => {
  return (
    <MUISkeleton
      {...props}
      variant="rectangular"
      animation="wave"
      className={["ui-rounded-1", fullWidth ? "ui-w-full" : "", className].join(
        " "
      )}
    />
  );
};

export default Skeleton;
