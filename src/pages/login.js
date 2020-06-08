import React, { Component } from "react";

//Material-UI
import withStyles from "@material-ui/core/styles/withStyles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";

//REACT-ROUTER
import { Link } from "react-router-dom";

//AXIOS
//import axios from "axios";

//PropTypes
import PropTypes from "prop-types";

//REDUX
import { connect } from "react-redux";
import { loginUser } from "../redux/actions/userActions.js";

const styles = {
  form: {
    textAlign: "center",
  },
  image: {
    margin: "10px auto 10px auto",
  },
  pageTitle: {
    margin: "10px auto 10px auto",
  },
  textField: {
    margin: "10px auto 10px auto",
  },
  button: {
    marginTop: 20,
    position: "relative",
  },
  customError: {
    color: "red",
    fontSize: "0.8rem",
  },
  progress: {
    position: "absolute",
  },
};

//Cloud Firestore (all REST API endpoints exist under this base URL)
//const baseURL = "https://us-central1-school-app-final.cloudfunctions.net/api";

class login extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      //loading: false,
      errors: {},
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.UI.errors) {
      this.setState({ errors: nextProps.UI.errors });
    }
  }
  handleSubmit = (event) => {
    console.log("hi");
    event.preventDefault();
    //this.setState({
    //  loading: true,
    //});

    const userData = {
      email: this.state.email,
      password: this.state.password,
    };

    this.props.loginUser(userData, this.props.history);
    /*
    axios
      .post(baseURL + "/login", userData)
      .then((response) => {
        localStorage.setItem("FBIdToken", `Bearer ${response.data.token}`);
        console.log("response.data: ", response.data);
        this.setState({
          loading: false,
        });
        this.props.history.push("/"); //Redirect user to the home page if login was successful

        console.log("userData:", userData);
      })
      .catch((error) => {
        console.log("error: ", error);
        this.setState({
          loading: false,
          errors: error.response.data,
        });
      });
      */
  };

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  render() {
    const {
      classes,
      UI: { loading },
    } = this.props;
    const { errors } = this.state;
    return (
      <Grid container className={classes.form}>
        <Grid item sm />
        <Grid item sm>
          <Typography variant="h2" className={classes.pageTitle}>
            Login
          </Typography>
          <form noValidate onSubmit={this.handleSubmit}>
            <TextField
              id="email"
              name="email"
              type="email"
              label="Email"
              className={classes.textField}
              value={this.state.email}
              helperText={errors.email}
              error={errors.email ? true : false}
              onChange={this.handleChange}
              fullWidth
            />
            <TextField
              id="password"
              name="password"
              type="password"
              label="Password"
              className={classes.textField}
              value={this.state.password}
              helperText={errors.password}
              error={errors.password ? true : false}
              onChange={this.handleChange}
              fullWidth
            />
            {errors.general && (
              <Typography variant="body2" className={classes.customError}>
                {errors.general}
              </Typography>
            )}
            <Button
              type="submit"
              variant="contain"
              color="primary"
              className={classes.button}
              disabled={loading}
            >
              Submit
              {loading && (
                <CircularProgress size={20} className={classes.progress} />
              )}
            </Button>
            <br></br>
            <small>
              Don't have an account? Sign up <Link to="/signup">here</Link>
            </small>
          </form>
        </Grid>
        <Grid item sm />
      </Grid>
    );
  }
}

//Ensures that certain props are being passed down
login.propTypes = {
  classes: PropTypes.object.isRequired,
  loginUser: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  UI: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user,
  UI: state.UI,
});

const mapActionsToProps = {
  loginUser,
};
//export default withStyles(styles)(login);
export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(login));
