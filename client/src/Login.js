import React from "react";
import { Redirect, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import {
  Grid,
  Typography,
  Button,
  FormControl,
  makeStyles,
  InputLabel,
  Input
} from "@material-ui/core";
import { login } from "./store/utils/thunkCreators";

const useStyles = makeStyles(() => ({
  topContainer: {
    padding: "30px",
    justifyContent: "flex-end"
  },
  topContainerText: {
    fontSize: "14px",
    lineHeight: "17px",
    padding: "0 32px",
    color: "#B0B0B0",
    alignSelf: "center"
  },
  topContainerButton: {
    width: "140px",
    height: "54px",
    boxShadow: "0 2px 12px #4A6A9533",
    fontSize: "14px",
    lineHeight: "17px",
    color: "#3A8DFF"
  },
  form: {
    height: "calc(100% - 114px - 200px)",
    padding: "100px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center"
  },
  formHeader: {
    fontSize: "26px",
    lineHeight: "40px",
    paddingBottom: "40px"
  },
  formControl: {
    paddingBottom: "40px"
  },
  inputLabel: {
    color: "#B0B0B0"
  },
  input: {
    paddingTop: "12px"
  },
  loginButton: {
    width: "160px",
    height: "56px",
    color: "white",
    fontSize: "16px",
    lineHeight: "19px",
    alignSelf: "center",
    backgroundColor: "#3A8DFF",
    borderRadius: "3px"
  }
}));

const Login = (props) => {
  const history = useHistory();
  const { user, login } = props;
  const classes = useStyles();

  const handleLogin = async (event) => {
    event.preventDefault();
    const username = event.target.username.value;
    const password = event.target.password.value;

    await login({ username, password });
  };

  if (user.id) {
    return <Redirect to="/home" />;
  }

  return (
    <>
      <Grid container className={classes.topContainer}>
        <Typography align="center" className={classes.topContainerText}>
          Don't have an account?
        </Typography>
        <Button
          onClick={() => history.push("/register")}
          className={classes.topContainerButton}
        >
          Create account
        </Button>
      </Grid>
      <form onSubmit={handleLogin} className={classes.form}>
        <Typography className={classes.formHeader}>Welcome Back!</Typography>
        <Grid>
          <FormControl fullWidth required className={classes.formControl}>
            <InputLabel
              htmlFor="username"
              shrink
              className={classes.inputLabel}
            >
              Username
            </InputLabel>
            <Input
              id="username"
              aria-label="username"
              name="username"
              type="text"
              className={classes.input}
            />
          </FormControl>{" "}
        </Grid>
        <Grid>
          <FormControl fullWidth required className={classes.formControl}>
            <InputLabel
              htmlFor="password"
              shrink
              className={classes.inputLabel}
            >
              Password
            </InputLabel>
            <Input
              id="password"
              aria-label="password"
              name="password"
              type="password"
              className={classes.input}
              inputProps={{ minLength: 6 }}
            />
          </FormControl>
        </Grid>
        <Button
          type="submit"
          variant="contained"
          className={classes.loginButton}
        >
          Login
        </Button>
      </form>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    login: (credentials) => {
      dispatch(login(credentials));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
