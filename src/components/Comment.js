import React, { Component } from "react";

//MATERIAL-UI
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

class Comment extends Component {
  render() {
    const {
      comment: {
        docID,
        data: { body, handle, publishDate, parentID },
      },
    } = this.props;
    return (
      <Paper>
        <Typography>Body: {body}</Typography>
        <Typography>Handle: {handle}</Typography>
        <Typography>Date: {publishDate}</Typography>
        <Typography>DocID: {docID}</Typography>
        <Typography>ParentID: {parentID}</Typography>
      </Paper>
    );
  }
}

export default Comment;
