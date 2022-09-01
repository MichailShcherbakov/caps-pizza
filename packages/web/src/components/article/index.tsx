import { Button, Stack, Typography } from "@mui/material";
import React from "react";
import Title from "../title";
import styles from "./index.module.scss";

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

  React.useEffect(() => {
    setCollapse(defaultCollapsed);
  }, [defaultCollapsed]);

  const onClickHandler = () => setCollapse(!collapse);

  return (
    <Stack className="ui-w-full">
      <Title text={title} />
      <Stack
        className={[
          styles["article"],
          collapse ? styles["article--collapsed"] : "",
        ].join(" ")}
      >
        {collapse && <Stack className={styles["article__curtain"]}></Stack>}
        <Typography className={styles["article__text"]}>{text}</Typography>
      </Stack>
      {collapse && (
        <Button
          variant="text"
          color="primary"
          className={styles["article__btn"]}
          onClick={onClickHandler}
        >
          Подробнее
        </Button>
      )}
    </Stack>
  );
};

export default Article;
