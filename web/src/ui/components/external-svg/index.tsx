import React from "react";

export interface ExternalSvgProps extends React.HTMLAttributes<SVGElement> {
  src: string;
}

export const ExternalSvg: React.FC<ExternalSvgProps> = ({ src, ...props }) => {
  return <svg {...props} data-src={src} />;
};

export default ExternalSvg;
