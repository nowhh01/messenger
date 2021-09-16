import React from "react";
import { Box, makeStyles, Typography } from "@material-ui/core";
import { withTheme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  container: {
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    backgroundColor: theme.palette.primary.main,
    borderRadius: "10px"
  },
  text: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 10,
    fontWeight: "bold",
    color: "#FFFFFF",
    lineHeight: "12px",
    letterSpacing: -0.5
  }
}));

function UnreadMessageCount({ theme, count }) {
  const classes = useStyles(theme);

  return (
    <Box className={classes.container}>
      <Typography className={classes.text}>{count}</Typography>
    </Box>
  );
}

export default withTheme(UnreadMessageCount);
