import makeStyles from "~/ui/theme/makesStyles";

export interface StyleProps {
  empty?: boolean;
}

export const useStyle = makeStyles<StyleProps>()((theme, { empty }) => ({
  root: {
    height: "100%",
    overflowX: "hidden",
    overflowY: "auto",
    gap: theme.spacing(2),

    ...(empty && {
      alignItems: "center",
      justifyContent: "center",
    }),
  },
}));
