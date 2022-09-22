import { Stack } from "@mui/material";
import NextImage from "next/image";
import React from "react";
import { useStyle } from "./index.style";

export interface ImageProps {
  url?: string;
  imageWidth?: number;
  imageHeight?: number;
  className?: string;
  alt?: string;
  LoadingComponent?: React.ReactNode;
  onLoadingComplete?: (options: {
    naturalWidth: number;
    naturalHeight: number;
  }) => void;
}

export const Image: React.FC<ImageProps> = ({
  url,
  alt,
  imageWidth,
  imageHeight,
  className,
  LoadingComponent,
  onLoadingComplete,
}) => {
  const [loading, setLoading] = React.useState<boolean>(true);
  const { classes, cx } = useStyle({
    loading,
  });

  const onLoadingCompleteHandle = React.useCallback(
    params => {
      onLoadingComplete && onLoadingComplete(params);
      setLoading(false);
    },
    [onLoadingComplete]
  );

  if (!url) return null;

  return (
    <Stack
      component="picture"
      className={cx(classes.root, className)}
      sx={{
        width: imageWidth,
        height: imageHeight,
      }}
    >
      {loading ? LoadingComponent : undefined}
      <NextImage
        src={url}
        layout="fill"
        alt={alt}
        priority
        onLoadingComplete={onLoadingCompleteHandle}
      />
    </Stack>
  );
};

export default Image;
