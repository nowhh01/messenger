import React, { useState } from "react";
import { Redirect, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import {
  Grid,
  Typography,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  Input,
  makeStyles
} from "@material-ui/core";
import { register } from "./store/utils/thunkCreators";

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
    paddingBottom: "12px"
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
  submitButton: {
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
  const classes = useStyles();

  const { user, register } = props;
  const [formErrorMessage, setFormErrorMessage] = useState({});

  const handleRegister = async (event) => {
    event.preventDefault();
    const username = event.target.username.value;
    const email = event.target.email.value;
    const password = event.target.password.value;
    const confirmPassword = event.target.confirmPassword.value;

    if (password !== confirmPassword) {
      setFormErrorMessage({ confirmPassword: "Passwords must match" });
      return;
    }

    await register({ username, email, password });
  };

  if (user.id) {
    return <Redirect to="/home" />;
  }

  return (
    <>
      <Grid container className={classes.topContainer}>
        <Typography align="center" className={classes.topContainerText}>
          Already have an account?
        </Typography>
        <Button
          onClick={() => history.push("/login")}
          className={classes.topContainerButton}
        >
          Login
        </Button>
      </Grid>
      <form onSubmit={handleRegister} className={classes.form}>
        <Typography className={classes.formHeader}>
          Create an account
        </Typography>
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
          </FormControl>
        </Grid>
        <Grid>
          <FormControl fullWidth required className={classes.formControl}>
            <InputLabel htmlFor="email" shrink className={classes.inputLabel}>
              Email
            </InputLabel>
            <Input
              id="email"
              aria-label="e-mail address"
              name="email"
              type="email"
              className={classes.input}
            />
          </FormControl>
        </Grid>
        <Grid>
          <FormControl
            fullWidth
            required
            className={classes.formControl}
            error={!!formErrorMessage.confirmPassword}
          >
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
            <FormHelperText>{formErrorMessage.confirmPassword}</FormHelperText>
          </FormControl>
        </Grid>
        <Grid>
          <FormControl
            fullWidth
            required
            className={classes.formControl}
            error={!!formErrorMessage.confirmPassword}
          >
            <InputLabel
              htmlFor="confirmPassword"
              shrink
              className={classes.inputLabel}
            >
              Confirm Password
            </InputLabel>
            <Input
              id="confirmPassword"
              aria-label="confirmPassword"
              name="confirmPassword"
              type="password"
              className={classes.input}
              inputProps={{ minLength: 6 }}
            />
            <FormHelperText>{formErrorMessage.confirmPassword}</FormHelperText>
          </FormControl>
        </Grid>
        <Button
          type="submit"
          variant="contained"
          className={classes.submitButton}
        >
          Create
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
    register: (credentials) => {
      dispatch(register(credentials));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
