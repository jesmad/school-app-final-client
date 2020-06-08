import React, { Component } from "react";
//import "../App.css";

import axios from "axios";

//Local Components
import Comment from "./Comment.js";
import CounterButton from "./CounterButton.js";

//Day.js
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

//Material-UI
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import DialogActions from "@material-ui/core/DialogActions";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import withStyles from "@material-ui/core/styles/withStyles";
import TextField from "@material-ui/core/TextField";
import CardActionArea from "@material-ui/core/CardActionArea";
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";
import CommentIcon from "@material-ui/icons/Comment";
import Paper from "@material-ui/core/Paper";
import { sizing } from "@material-ui/system";
import Avatar from "@material-ui/core/Avatar";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";

//jwt-decode is a small browser library that helps decoding JWTs token which are Base64Url encoded
//import jwtDecode from "jwt-decode";

//Cloud Firestore (all REST API endpoints exist under this base URL)
const baseURL = "https://us-central1-school-app-final.cloudfunctions.net/api";
/*
const styles = {
  card: {
    display: "flex",
    marginBottom: 20,
  },
  content: {
    padding: 25,
    objectFit: "cover",
  },
  rootList: {
    width: "100%",
    maxWidth: 360,
    position: "relative",
    overflow: "auto",
    maxHeight: 300,
  },
  dialogWindow: {
    width: "100%",
  },
};
*/

const styles = {
  card: {
    width: 750,
  },
};

class Post extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showDialog: false,
      comments: [],
      showTextField: false,
      commentBody: "",
      likeCount: props.post.numberLikes,
      commentsCount: props.post.numberComments,
      likeButton: false,
    };
  }

  handleClose() {
    this.setState({
      showDialog: false,
      showTextField: false,
      commentBody: "",
    });
  }

  retrieveComments() {
    axios
      .get(baseURL + `/posts/${this.props.post.postID}/comments`)
      .then((response) => {
        console.log("SUCCESSFULLY RETRIEVED COMMENTS");
        this.setState({ comments: response.data.comments });
        //console.log("this.state.comments:", this.state.comments);
      })
      .catch((error) => {
        console.log("AN ERROR OCCURRED WHEN TRYING TO RETRIEVE COMMENTS");
        console.log("error: ", error);
      });
  }

  handleSubmit = (event) => {
    event.preventDefault();

    //Firestore JSON Web Token for signed in user
    const firestoreToken = localStorage.getItem("FBIdToken");

    if (!firestoreToken) {
      //Only logged in users are allowed to make comments
      window.location.href = "/login";
      return;
    }
    //TODO: Ensure that the comment has content.
    axios
      .post(
        baseURL + `/posts/${this.props.post.postID}/comment`,
        {
          body: this.state.commentBody,
        },
        {
          Authorization: `Bearer ${firestoreToken}`,
        }
      )
      .then((response) => {
        /* 
            response.data => { docID: ..., data : {handle: ..., body: ..., publishDate: ..., parentID: ...} }
        */
        let tempArray = [...this.state.comments];
        tempArray.unshift(response.data);
        this.setState({
          comments: tempArray,
          commentBody: "",
          showTextField: false,
          commentsCount: this.state.commentsCount + 1,
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

  handleChange = (event) => {
    //Callback function to update the state when updating the TextField
    const { value } = event.target;
    this.setState({
      commentBody: value,
    });
  };

  handleLikeButton() {
    //Firestore JSON Web Token for signed in user
    const firestoreToken = localStorage.getItem("FBIdToken");

    if (!firestoreToken) {
      //Only logged in users are allowed to make comments
      window.location.href = "/login";
      return;
    }

    //TODO: Check if button has already been liked by the current user. If so, initiate a unlike request.
    axios
      .get(baseURL + `/posts/${this.props.post.postID}/like`, {
        Authorization: `Bearer ${firestoreToken}`,
      })
      .then((response) => {
        /* Response.data is a Javascript object 
              {
                numberLikes : ...,
                numberComments : ...,
                postID : ...,
                publishDate : ...,
                subject : ...,
                body : ...,
                user : ...,
                userImage : ...,
                title : ...
              }
        */
        if (response.data.message) {
          //Post HAS already been liked. Response.data is in this case -> {message : "Error: Post has already been liked"}
          axios
            //.get(baseURL + `/posts/${post.postID}/unlike`, {
            .get(baseURL + `/posts/${this.props.post.postID}/unlike`, {
              Authorization: `Bearer ${firestoreToken}`,
            })
            .then((response) => {
              /* Response.data is a Javascript object 
              {
                  data : {
                      numberLikes : ...,
                      numberComments : ...,
                      postID : ...,
                      publishDate : ...,
                      subject : ...,
                      body : ...,
                      user : ...,
                      userImage : ...,
                      title : ...
                  }
              }
              */
              this.setState({ likeCount: response.data.data.numberLikes });
            });
        } else {
          //Post HAS NOT been liked. Response is -> {numberComments: ..., title: ..., body: ..., numberLikes: ..., postID: ..., ...}
          this.setState({ likeCount: response.data.numberLikes });
        }
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
  }

  render() {
    dayjs.extend(relativeTime);
    const { classes } = this.props;
    const {
      post: {
        postID,
        title,
        body,
        //numberComments,
        //numberLikes,
        publishDate,
        subject,
        user,
        //userImage,
      },
    } = this.props;

    let likeBtnClass = this.state.likeButton ? "blackButton" : "whiteButton";

    let displayComments =
      this.state.comments.length !== 0 ? (
        this.state.comments.map((comment) => (
          <div className="comment-container">
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <AccountCircleIcon />
                </Avatar>
              </ListItemAvatar>
              <Grid direction="column" container>
                <Grid item>
                  <Typography variant="button">{comment.data.body}</Typography>
                </Grid>
                <Grid item>
                  <Grid container direction="row" spacing={1}>
                    <Grid item>
                      <Typography variant="caption">
                        {comment.data.handle}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="caption">
                        {dayjs(comment.data.publishDate).fromNow()}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </ListItem>
          </div>
          //<Divider variant="inset" component="li" />
          /*
          <div className="comment-container">
            <Divider />
            <Comment key={comment.docID} comment={comment} />
            <Divider light />
          </div>
          */
        ))
      ) : (
        <small>Be the first to comment</small>
      );

    return (
      <div>
        {/*</div><Card className={classes.card}>*/}
        <Card className={classes.card}>
          <CardActionArea
            onClick={() => {
              this.setState({ showDialog: true });
              this.retrieveComments();
            }}
          >
            {/*
            <CardMedia
              className={classes.image}
              image={userImage}
              title="Profile image"
            />
            */}
            {/* <CardActionArea><CardContent className={classes.content}>*/}
            <CardContent>
              <Grid
                container
                direction="column"
                spacing={2}
                alignItems="stretch"
              >
                {/* Container for TITLE, USER_HANDLE, POSTED_TIME */}
                <Grid item>
                  <Grid
                    container
                    direction="row"
                    spacing={2}
                    alignItems="baseline"
                  >
                    <Grid item>
                      <Typography inline align="baseline" variant="h5" noWrap>
                        {title}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography
                        inline
                        align="baseline"
                        variant="subtitle1"
                        gutterBottom
                      >
                        Posted by {user}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="body2" color="textSecondary">
                        {dayjs(publishDate).fromNow()}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Divider variant="middle" />
                <Grid item>
                  <Typography variant="body2">{body}</Typography>
                  <Typography variant="body1">{subject}</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </CardActionArea>

          {/* Container for LIKE and COMMENT buttons */}

          <CardActions>
            <Grid
              alignItems="center"
              justify="center"
              container
              direction="row"
              spacing={9}
            >
              <Grid item>
                <Button
                  className={likeBtnClass}
                  size="small"
                  variant="contained"
                  startIcon={<ThumbUpAltIcon />}
                  onClick={() => {
                    this.setState({ likeButton: !this.state.likeButton });
                    this.handleLikeButton();
                  }}
                >
                  {this.state.likeCount}
                </Button>
              </Grid>
              <Grid item>
                <Button
                  size="small"
                  variant="contained"
                  color="default"
                  startIcon={<CommentIcon />}
                  onClick={() => {
                    this.setState({ showDialog: true });
                    this.retrieveComments();
                  }}
                >
                  {this.state.commentsCount}
                </Button>
              </Grid>
            </Grid>
          </CardActions>
        </Card>

        {/* Dialog Window - Opens up when a user clicks a post */}
        <Dialog
          disableBackdropClick
          disableEscapeKeyDown
          onBackdropClick={() => this.handleClose()}
          onClose={this.handleClose}
          aria-labelledby="customized-dialog-title"
          open={this.state.showDialog}
        >
          <DialogContent>
            <Grid
              container
              spacing={2}
              direction="column"
              justify="center"
              alignItems="center"
            >
              {/*POST*/}
              <Grid item>
                <Paper elevation={0}>
                  <Grid
                    container
                    direction="column"
                    spacing={2}
                    alignItems="stretch"
                  >
                    {/* Container for TITLE, USER_HANDLE, POSTED_TIME */}
                    <Grid item>
                      <Grid
                        container
                        direction="row"
                        spacing={2}
                        alignItems="baseline"
                      >
                        <Grid item>
                          <Typography
                            inline
                            align="baseline"
                            variant="h5"
                            noWrap
                          >
                            {title}
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Typography
                            inline
                            align="baseline"
                            variant="subtitle1"
                            gutterBottom
                          >
                            Posted by {user}
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Typography variant="body2" color="textSecondary">
                            {dayjs(publishDate).fromNow()}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item>
                      <Typography variant="body2">{body}</Typography>
                      <Typography variant="body1">{subject}</Typography>
                      {/* <Typography variant="body1">{postID}</Typography> */}
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
              <Divider variant="middle" />

              {/*COMMENTS*/}
              <Grid item>
                {/* </Grid><List className={classes.rootList} subheader={<li />}> */}
                <List subheader={<li />}>{displayComments}</List>
              </Grid>
              <Grid item>
                <Button
                  variant="outlined"
                  onClick={() => {
                    this.setState({
                      showTextField: !this.state.showTextField,
                      commentBody: "",
                    });
                    //this.handleReply();
                  }}
                >
                  Reply
                </Button>
              </Grid>
            </Grid>
            <br></br>
            <Divider variant="middle" />
            <br></br>

            {/* Text Field will be rendered when the Reply button is pressed */}
            {this.state.showTextField && (
              <form noValidate autoComplete="off" onSubmit={this.handleSubmit}>
                <TextField
                  id="outlined-multiline-static"
                  value={this.state.commentBody}
                  onChange={this.handleChange}
                  name="commentBody"
                  label="Message"
                  multiline
                  rows={4}
                  variant="outlined"
                />

                <br></br>
                <br></br>

                <Button type="submit" variant="outlined">
                  Post
                </Button>
              </form>
            )}

            <DialogActions>
              <Button
                autoFocus
                onClick={() => {
                  this.handleClose();
                }}
                color="primary"
              >
                Save changes
              </Button>
            </DialogActions>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

export default withStyles(styles)(Post);
//export default Post;
