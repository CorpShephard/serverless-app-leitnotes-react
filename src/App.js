import React, { Component, Fragment } from "react";
import { Link, withRouter } from "react-router-dom";
import { Nav, Navbar, NavItem } from "react-bootstrap";
import "./App.css";
import Routes from "./Routes";
import { LinkContainer } from "react-router-bootstrap";
import { Auth } from "aws-amplify";


class App extends Component {
	constructor(props) {
	super(props);

		this.state = {
		  isAuthenticated: false,
		  isAuthenticating: true
		};
	}
	
	async componentDidMount() {
	  try {
		 /* AWS amplify method for determinng if an active user session.  Returns a promise that resolves to the session object (if it exists).  Uses browser local storage?
		 */
		if (await Auth.currentSession()) {
		  this.userHasAuthenticated(true);
		}
	  }
	  catch(e) {
		if (e !== 'No current user') {
		  alert(e);
		}
	  }

	  this.setState({ isAuthenticating: false });
	}

	userHasAuthenticated = authenticated => {
	  this.setState({ isAuthenticated: authenticated });
	}
	
	handleLogout = async event => {
	  await Auth.signOut();

	  this.userHasAuthenticated(false);
	  this.props.history.push("/login");
	}
	
	render() {
		/* Pre-rendering JS */
		const childProps = {
		  isAuthenticated: this.state.isAuthenticated,
		  userHasAuthenticated: this.userHasAuthenticated
		};
		/* HTML from a return */
		/* On Fragment:  Normally a the conditional operator operates like: 
			condition ? value-if-true : value-if-false
			Thus the fragment combines two links into one alternative "object" without injecting additional HTML.  It essentially allows us to bundle objects into the fragment and execute logic with the whole bundle.
		*/
		return (
			!this.state.isAuthenticating &&
			<div className="App container">
			  <Navbar fluid collapseOnSelect>
				<Navbar.Header>
				  <Navbar.Brand>
					<Link to="/">Scratch</Link>
				  </Navbar.Brand>
				  <Navbar.Toggle />
				</Navbar.Header>
				<Navbar.Collapse>
				  <Nav pullRight>
					{this.state.isAuthenticated
					  ? <NavItem onClick={this.handleLogout}>Logout</NavItem>
					  : <Fragment>
						  <LinkContainer to="/signup">
							<NavItem>Signup</NavItem>
						  </LinkContainer>
						  <LinkContainer to="/login">
							<NavItem>Login</NavItem>
						  </LinkContainer>
						</Fragment>
					}
				  </Nav>
				</Navbar.Collapse>
			  </Navbar>
			  <Routes childProps={childProps} />
			</div>
		);
	}
}
/* combines the component of the app with the router component? */
export default withRouter(App);