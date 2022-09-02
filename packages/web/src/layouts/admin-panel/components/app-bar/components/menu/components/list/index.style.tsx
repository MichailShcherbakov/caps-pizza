import makeStyles from "~/ui/theme/makesStyles";

export const useStyle = makeStyles()(theme => ({
  root: {
    "& > .MuiListItem-root > .MuiListItemButton-root.Mui-selected": {
      backgroundColor: theme.palette.secondaryLight.main,
      borderRadius: theme.spacing(1),
    },
  },
}));
