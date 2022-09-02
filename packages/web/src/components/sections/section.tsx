import { Stack } from "@mui/material";
import React from "react";
import { useInView } from "react-intersection-observer";
import { setCurrentActiveSection } from "~/helpers/section-provider";

export interface SectionProps {
  id: string;
  children?: React.ReactElement | React.ReactElement[];
  className?: string;
}

export const Section: React.FC<SectionProps> = ({ id, children, ...props }) => {
  const { ref, inView } = useInView({
    rootMargin: "-50%",
    threshold: 0,
  });

  React.useEffect(() => {
    inView && setCurrentActiveSection(id);
  }, [id, inView]);

  return (
    <Stack
      {...props}
      component="section"
      id={id}
      ref={ref}
      style={{ scrollMarginTop: "76px" }}
      data-section
      spacing={4}
      sx={{
        paddingY: 2,
      }}
    >
      {children}
    </Stack>
  );
};

export default Section;
