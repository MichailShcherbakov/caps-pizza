import {
  Skeleton as MUISkeleton,
  SkeletonProps as MUISkeletonProps,
} from "@mui/material";

export interface SkeletonProps extends MUISkeletonProps {
  fullWidth?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({ fullWidth, ...props }) => {
  return (
    <MUISkeleton
      {...props}
      variant="rectangular"
      animation="wave"
      sx={{
        borderRadius: theme => theme.spacing(0.5),
        width: fullWidth ? "100%" : undefined,
      }}
    />
  );
};

export default Skeleton;
