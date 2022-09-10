import makeStyles from "~/ui/theme/makesStyles";

const swiperNavigationSize = "40px";
const swiperNavigationArrowSize = "1.125rem";

export const useStyle = makeStyles()(theme => ({
  root: {
    "> .swiper-button-prev": {
      position: "absolute",
      top: "50%",
      width: swiperNavigationSize,
      height: swiperNavigationSize,
      marginTop: `calc(0px - (${swiperNavigationSize}/ 2))`,
      zIndex: "10",

      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",

      color: theme.palette.primary.main,
      // border: `1px solid ${theme.palette.primary.main}`,
      borderRadius: "50%",

      "&::after": {
        content: `"prev"`,
        fontSize: swiperNavigationArrowSize,
        fontWeight: 900,
      },

      "&.swiper-button-disabled": {
        display: "none",
      },
    },
    "> .swiper-button-next": {
      position: "absolute",
      top: "50%",
      width: swiperNavigationSize,
      height: swiperNavigationSize,
      marginTop: `calc(0px - (${swiperNavigationSize}/ 2))`,
      zIndex: "10",

      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",

      color: theme.palette.primary.main,
      // border: `1px solid ${theme.palette.primary.main}`,
      borderRadius: "50%",

      "&::after": {
        content: `"next"`,
        fontSize: swiperNavigationArrowSize,
        fontWeight: 900,
      },

      "&.swiper-button-disabled": {
        display: "none",
      },
    },
  },
  image: {
    position: "relative",
    width: "100%",
    height: "270px",
    userSelect: "none",

    "& > span img": {
      objectFit: "scale-down",
    },

    [theme.breakpoints.down("md")]: {
      height: "210px",
    },
  },
  section: {
    display: "block",
  },
}));
