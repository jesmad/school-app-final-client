import React, { Component } from "react";

//Styles
import { withStyles } from "@material-ui/core/styles";

import axios from "axios";

//LOCAL COMPONENTS
import Post from "../components/Post.js";
import Profile from "../components/Profile.js";

//MATERIAL-UI
import Grid from "@material-ui/core/Grid";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";

//Cloud Firestore (all REST API endpoints exist under this base URL)
const baseURL = "https://us-central1-school-app-final.cloudfunctions.net/api";

const styles = (theme) => ({
  content: {
    /*
    minWidth: "40vh",
    maxWidth: "40vh",
    minHeight: "50vh",
    maxHeight: "50vh",
    */
  },
});

class SchoolHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showDialog: false,
      department: "",
      subjectPosts: [],
      newPostTitle: "",
      newPostBody: "",
      loading: true,
    };
  }

  //Gets called for the first time when the SchoolHome component is rendered on the page.
  componentDidMount() {
    axios
      .get(baseURL + `/posts/${this.props.department}`)
      .then((response) => {
        console.log("SUCCESSFULL GET SUBJECT POSTS, 200 OK");
        console.log(
          `(${this.props.department}) -> response.data:`,
          response.data
        );
        this.setState({
          loading: false,
          subjectPosts: response.data,
          department: this.props.department,
        });
      })
      .catch((error) => {
        console.log("ERROR: ", error);
      });
  }

  //Subsequent changes to the department clicked (e.g. from the dropdown list) will update the state
  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      axios
        //.get(baseURL + `/posts/${this.state.department}`)
        .get(baseURL + `/posts/${this.props.department}`)
        .then((response) => {
          console.log(`GET ${this.props.department} POSTS, 200 OK`);
          console.log("response.data:", response.data);
          this.setState({
            subjectPosts: response.data,
            department: this.props.department,
          });
        })
        .catch((error) => {
          console.log("ERROR: ", error);
        });
    }
  }

  handleClose = () => {
    this.setState({
      showDialog: false,
      newPostTitle: "",
      newPostBody: "",
    });
  };

  handleChange = (event) => {
    //Computet Property Names  -> [expression]
    this.setState({ [event.target.name]: event.target.value });
  };

  handleMakePostClick = () => {
    console.log("Making a post");
  };

  handleSubmitPost = (event) => {
    event.preventDefault();

    const newPost = {
      body: this.state.newPostBody,
      subject: this.state.department,
      title: this.state.newPostTitle,
    };

    //Firestore JSON Web Token for signed in user
    const firestoreToken = localStorage.getItem("FBIdToken");

    if (!firestoreToken) {
      //Only logged in users are allowed to make comments
      window.location.href = "/login";
      return;
    }

    axios
      .post(baseURL + "/addPost", newPost, {
        Authorization: `Bearer ${firestoreToken}`,
      })
      .then((response) => {
        console.log("response.data:", response.data);
        //TODO: Here I will add the new document to the subjectPosts state variable so that the component re-renders
        let tempArray = [...this.state.subjectPosts];
        tempArray.unshift(response.data);
        this.setState({
          subjectPosts: tempArray,
          showDialog: false,
          newPostBody: "",
          newPostTitle: "",
        });
      })
      .catch((error) => {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log("Error", error.message);
        }
        console.log(error.config);
      });
  };

  render() {
    const { classes } = this.props;
    let displayPosts =
      this.state.subjectPosts.length > 0 ? (
        this.state.subjectPosts.map((post) => (
          <Grid xs={12} sm={12} item>
            <Post key={post.postID} post={post} />
          </Grid>
        ))
      ) : this.state.loading ? (
        <p></p>
      ) : (
        <p>No posts to display</p>
      );

    return (
      <React.Fragment>
        {/* Navigation Bar - Add Post + Search Bar */}
        <Grid
          container
          spacing={2}
          direction="row"
          justify="center"
          alignItems="center"
        >
          <Grid item>
            <Button
              variant="contained"
              //color="primary"
              onClick={() => {
                this.setState({ showDialog: true });
                this.handleMakePostClick();
              }}
            >
              Add Post
            </Button>
          </Grid>
        </Grid>
        {/* Display Posts */}
        <Grid
          container
          spacing={1}
          direction="column"
          alignItems="center"
          justify="center"
        >
          <Grid item>{this.state.loading && <CircularProgress />}</Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <Grid lg={12} container direction="column" spacing={2}>
              {displayPosts}
            </Grid>
          </Grid>
        </Grid>

        {/*Dialog Window - Submit a Post*/}
        <Dialog
          disableBackdropClick
          disableEscapeKeyDown
          onBackdropClick={() => this.handleClose()}
          onClose={this.handleClose}
          //aria-labelledby="customized-dialog-title"
          open={this.state.showDialog}
        >
          <DialogContent className={classes.content}>
            <form
              noValidate
              onSubmit={this.handleSubmitPost}
              autoComplete="off"
            >
              <Grid
                container
                spacing={2}
                direction="column"
                justify="center"
                alignItems="center"
              >
                {/* New Post - Title */}
                <Grid item>
                  <TextField
                    id="standard-basic"
                    label="Title"
                    value={this.state.newPostTitle}
                    name="newPostTitle"
                    onChange={this.handleChange}
                  />
                </Grid>
                {/* New Post - Body */}
                <Grid item>
                  <TextField
                    id="outlined-multiline-static"
                    multiline
                    rows={8}
                    label="Body"
                    value={this.state.newPostBody}
                    name="newPostBody"
                    onChange={this.handleChange}
                  />
                </Grid>
                {/* New Post - Actions (CANCEL and SUBMIT buttons) */}
                <Grid item>
                  <Grid container spacing={2} direction="row">
                    <Button
                      onClick={() => {
                        this.handleClose();
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      onClick={() => {
                        console.log("Clicking the submit post button");
                      }}
                    >
                      Post
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </form>
          </DialogContent>
        </Dialog>
      </React.Fragment>
    );
  }
}

//export default SchoolHome;
export default withStyles(styles)(SchoolHome);
