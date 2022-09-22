import getConfig from "next/config";
import React from "react";
import { Image, ImageProps } from "~/ui";

const { publicRuntimeConfig } = getConfig();

export interface ExternalImageProps extends ImageProps {}

export const ExternalImage: React.FC<ExternalImageProps> = ({
  url,
  alt,
  ...props
}) => {
  if (!url) return null;

  return (
    <Image
      {...props}
      alt={alt}
      url={`${publicRuntimeConfig.IMAGES_SOURCE_URL}${url}`}
    />
  );
};

export default ExternalImage;
