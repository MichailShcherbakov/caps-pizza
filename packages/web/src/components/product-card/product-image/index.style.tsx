import makeStyles from "~/ui/theme/makesStyles";

export interface StyleProps {
  cover?: boolean;
  loading?: boolean;
}

export const useStyle = makeStyles<StyleProps>()(
  (theme, { cover, loading }) => ({
    root: {
      position: "relative",
      alignSelf: "center",
      width: "240px",
      height: "240px",
      flexShrink: 0,
      alignItems: "center",
      justifyContent: "center",
      fill: theme.palette.neutral.light,

      "& > span img": {
        borderRadius: theme.spacing(2),
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
      },

      ...(cover && {
        width: "100%",

        "& > span img": {
          objectFit: "cover",

          borderRadius: theme.spacing(2),
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
        },
      }),

      ...(loading && {
        "& > span img": {
          visibility: "hidden",
        },
      }),

      [theme.breakpoints.down("sm")]: {
        flexDirection: "row",
        width: "170px",
        height: "100%",
        minHeight: "200px",
        maxHeight: "fit-content",

        "& > span img": {
          objectFit: "scale-down",
        },

        ...(cover && {
          "& > span img": {
            objectFit: "cover",

            borderRadius: theme.spacing(2),
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
          },
        }),
      },

      [theme.breakpoints.down("xs")]: {
        width: "135px",
        height: "100%",
      },
    },
  })
);
