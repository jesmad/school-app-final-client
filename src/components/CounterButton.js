import React, { Component } from "react";

import Button from "@material-ui/core/Button";

class CounterButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      counter: props.initialValue,
    };
  }

  render() {
    return (
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          this.setState({ counter: this.state.counter + 1 });
        }}
      >
        {this.state.counter}
      </Button>
    );
  }
}

export default CounterButton;
