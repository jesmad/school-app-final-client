import React, { Component } from "react";

import axios from "axios";

//LOCAL COMPONENTS
import Post from "../components/Post.js";
import Profile from "../components/Profile.js";

//MATERIAL-UI
import withStyles from "@material-ui/styles/withStyles";
import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";

//Cloud Firestore (all REST API endpoints exist under this base URL)
const baseURL = "https://us-central1-school-app-final.cloudfunctions.net/api";

const styles = {
  item: {},
};

class home extends Component {
  state = {
    posts: null,
    loading: true,
  };

  componentDidMount() {
    axios
      .get(baseURL + "/posts")
      .then((response) => {
        console.log("GET POSTS, 200 OK:", response.data);
        this.setState({ loading: false, posts: response.data });
      })
      .catch((error) => {
        console.log("ERROR:", error);
      });
  }
  render() {
    const { classes } = this.props;
    /* if (posts exist) then render posts else if (posts are loading) then render progress circle else display "NO POSTS" */
    let displayPosts = this.state.posts ? (
      this.state.posts.map((post) => (
        <Grid sm={12} xs={12} item>
          <Post key={post.postID} post={post} />
        </Grid>
      ))
    ) : this.state.loading ? (
      <p></p>
    ) : (
      <p>NO POSTS</p>
    );

    return (
      <React.Fragment>
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justify="center"
        >
          <Grid item>{this.state.loading && <CircularProgress />}</Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <Grid container direction="column" spacing={2}>
              {displayPosts}
            </Grid>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}

//export default home;
export default withStyles(styles)(home);
