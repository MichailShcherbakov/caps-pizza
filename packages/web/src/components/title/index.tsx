import { Typography } from "@mui/material";

export interface TitleProps {
  className?: string;
  text: string;
}

export const Title: React.FC<TitleProps> = ({ text, className }) => {
  return (
    <Typography variant="h1" className={className}>
      {text}
    </Typography>
  );
};

export default Title;
