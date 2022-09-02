import { Box, BoxProps } from "@mui/material";
import React from "react";

export interface ExternalSvgProps extends BoxProps {
  src: string;
}

export const ExternalSvg: React.FC<ExternalSvgProps> = ({ src, ...props }) => {
  return <Box {...props} component="svg" data-src={src} />;
};

export default ExternalSvg;
