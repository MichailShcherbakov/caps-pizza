import React from "react";
import { useInView } from "react-intersection-observer";
import { setCurrentActiveSection } from "~/helpers/section-provider";

export interface SectionProps {
  id: string;
  children?: React.ReactElement | React.ReactElement[];
  className?: string;
}

export const Section: React.FC<SectionProps> = ({
  id,
  children,
  className,
}) => {
  const { ref, inView } = useInView({
    rootMargin: "-50%",
    threshold: 0,
  });

  React.useEffect(() => {
    inView && setCurrentActiveSection(id);
  }, [id, inView]);

  return (
    <section
      id={id}
      ref={ref}
      className={["ui-flex ui-flex-col ui-gap-4", className].join(" ")}
      style={{ scrollMarginTop: "76px" }}
      data-section
    >
      {children}
    </section>
  );
};

export default Section;
