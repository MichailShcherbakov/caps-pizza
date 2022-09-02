import { Button, Stack, Typography } from "@mui/material";
import React from "react";
import Title from "../title";
import { useStyle } from "./index.style";

export interface ArticleProps {
  title: string;
  text: string;
  collapse?: boolean;
}

export const Article: React.FC<ArticleProps> = ({
  title,
  text,
  collapse: defaultCollapsed = false,
}) => {
  const [collapse, setCollapse] = React.useState<boolean>(false);
  const { classes } = useStyle({
    collapse,
  });

  React.useEffect(() => {
    setCollapse(defaultCollapsed);
  }, [defaultCollapsed]);

  const onClickHandler = () => setCollapse(!collapse);

  return (
    <Stack
      sx={{
        width: "100%",
      }}
    >
      <Title text={title} />
      <Stack className={classes.root}>
        {collapse && <Stack className={classes.curtain}></Stack>}
        <Typography className={classes.text}>{text}</Typography>
      </Stack>
      {collapse && (
        <Button
          variant="text"
          color="primary"
          className={classes.btn}
          onClick={onClickHandler}
        >
          Подробнее
        </Button>
      )}
    </Stack>
  );
};

export default Article;
