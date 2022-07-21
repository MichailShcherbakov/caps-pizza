import { Stack } from "@mui/material";

export interface CategorySectionProps {
  id: string;
  children?: React.ReactElement | React.ReactElement[];
  className?: string;
}

export const CategorySection: React.FC<CategorySectionProps> = ({
  id,
  children,
  className,
}) => {
  return (
    <Stack id={id} component="section" className={className} data-section>
      {children}
    </Stack>
  );
};

export default CategorySection;
