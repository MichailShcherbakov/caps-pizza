import { Typography } from "@mui/material";

export interface TitleProps {
  text: string;
}

export const Title: React.FC<TitleProps> = ({ text }) => {
  return <Typography variant="h1">{text}</Typography>;
};

export default Title;
