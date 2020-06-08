import React, { Component } from "react";

//Material-UI
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

//React Router
import { Link } from "react-router-dom";

/*
const Navbar = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    console.log("MENU ITEM CLICKED");
  };

  return (
    <AppBar>
      <Toolbar className="nav-container">
        <Button color="inherit" component={Link} to="/">
          Home
        </Button>
        <Button
          color="inherit"
          aria-controls="simple-menu"
          aria-haspopup="true"
          onClick={handleClick}
          component={Link}
        >
          School
        </Button>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem component={Link} to="/school/arts" onClick={handleClose}>
            Arts
          </MenuItem>
          <MenuItem
            component={Link}
            to="/school/business"
            onClick={handleClose}
          >
            Business
          </MenuItem>
          <MenuItem component={Link} to="/school/soc-sci" onClick={handleClose}>
            Social Sciences
          </MenuItem>
          <MenuItem
            component={Link}
            to="/school/engineering"
            onClick={handleClose}
          >
            Engineering
          </MenuItem>
          <MenuItem component={Link} to="/school/ics" onClick={handleClose}>
            Computer Science
          </MenuItem>
          <MenuItem
            component={Link}
            to="/school/phys-sci"
            onClick={handleClose}
          >
            Physical Sciences
          </MenuItem>
          <MenuItem component={Link} to="/school/bio-sci" onClick={handleClose}>
            Biological Sciences
          </MenuItem>
          <MenuItem
            component={Link}
            to="/school/humanities"
            onClick={handleClose}
          >
            Humanities
          </MenuItem>
        </Menu>
        <Button color="inherit" component={Link} to="/login">
          Login
        </Button>
        <Button color="inherit" component={Link} to="/signup">
          Signup
        </Button>
      </Toolbar>
    </AppBar>
  );
};
*/
class Navbar extends Component {
  constructor() {
    super();
    this.state = {
      anchorElement: null,
    };
  }

  handleClick = (event) => {
    //console.log("HANDLE CLICK");
    //console.log("event:", event);
    this.setState({
      anchorElement: event.currentTarget,
    });
  };

  handleClose = () => {
    this.setState({
      anchorElement: null,
    });
  };

  render() {
    return (
      <AppBar>
        <Toolbar className="nav-container">
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>
          <Button
            color="inherit"
            aria-controls="simple-menu"
            aria-haspopup="true"
            onClick={this.handleClick}
            //component={Link}
          >
            School
          </Button>
          <Menu
            id="simple-menu"
            anchorEl={this.state.anchorElement}
            keepMounted
            open={Boolean(this.state.anchorElement)}
            onClose={this.handleClose}
          >
            <MenuItem
              component={Link}
              to="/school/arts"
              onClick={this.handleClose}
            >
              Arts
            </MenuItem>
            <MenuItem
              component={Link}
              to="/school/business"
              onClick={this.handleClose}
            >
              Business
            </MenuItem>
            <MenuItem
              component={Link}
              to="/school/soc-sci"
              onClick={this.handleClose}
            >
              Social Sciences
            </MenuItem>
            <MenuItem
              component={Link}
              to="/school/engineering"
              onClick={this.handleClose}
            >
              Engineering
            </MenuItem>
            <MenuItem
              component={Link}
              to="/school/ics"
              onClick={this.handleClose}
            >
              Computer Science
            </MenuItem>
            <MenuItem
              component={Link}
              to="/school/phys-sci"
              onClick={this.handleClose}
            >
              Physical Sciences
            </MenuItem>
            <MenuItem
              component={Link}
              to="/school/bio-sci"
              onClick={this.handleClose}
            >
              Biological Sciences
            </MenuItem>
            <MenuItem
              component={Link}
              to="/school/humanities"
              onClick={this.handleClose}
            >
              Humanities
            </MenuItem>
          </Menu>
          <Button color="inherit" component={Link} to="/login">
            Login
          </Button>
          <Button color="inherit" component={Link} to="/signup">
            Signup
          </Button>
        </Toolbar>
      </AppBar>
    );
  }
}

export default Navbar;
