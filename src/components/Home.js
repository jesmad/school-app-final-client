import React, { Component } from "react";
import axios from "axios";
import Post from "./Post.js";

//Material-UI
import Grid from "@material-ui/core/Grid";

//Cloud Firestore (all REST API endpoints exist under this base URL)
const baseURL = "https://us-central1-school-app-final.cloudfunctions.net/api";

class Home extends Component {
  //No constructor (i.e. no access to props)
  state = {
    posts: null,
  };
  componentDidMount() {
    axios
      .get(baseURL + "/posts")
      .then((response) => {
        console.log("SUCCESSFUL AXIOS CALL");
        this.setState({ posts: response.data });
      })
      .catch((error) => {
        console.log("error: ", error);
      });
  }
  render() {
    let i = 1;
    let postsToRender = this.state.posts ? (
      this.state.posts.map((post) => <Post key={post.postID} post={post} />)
    ) : (
      <p>No posts to render</p>
    );
    return (
      <Grid container justify="center" direction="column" alignItems="center">
        <Grid item>{postsToRender}</Grid>
      </Grid>
    );
  }
}

export default Home;
