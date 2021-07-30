import React from "react";
import { Grid, Typography, makeStyles } from "@material-ui/core";
import { TextsmsOutlined as TextsmsOutlinedIcon } from "@material-ui/icons";

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    minHeight: "100vh"
  },
  banner: {
    flex: 1,
    backgroundImage:
      'linear-gradient(#3A8DFFD9, #86B9FFD9), url("/static/images/bg-img.png")',
    backgroundRepeat: "no-repeat",
    opacity: 0.85,
    backgroundSize: "cover"
  },
  bannerContent: {
    height: "100%",
    alignItems: "center",
    justifyContent: "center"
  },
  icon: {
    fontSize: "67px",
    color: "white"
  },
  bannerText: {
    width: "100%",
    maxWidth: "280px",
    fontSize: "26px",
    lineHeight: "40px",
    color: "white",
    textAlign: "center"
  }
}));

const AuthLayout = ({ children }) => {
  const classes = useStyles();

  return (
    <Grid container justify="center" className={classes.root}>
      <Grid item xs={5} className={classes.banner}>
        <Grid container direction="column" className={classes.bannerContent}>
          <TextsmsOutlinedIcon fontSize="67px" className={classes.icon} />
          <Typography className={classes.bannerText}>
            Converse with anyone with any language
          </Typography>
        </Grid>
      </Grid>
      <Grid item xs={7} justifyContent="flex-end">
        {children}
      </Grid>
    </Grid>
  );
};

export default AuthLayout;
