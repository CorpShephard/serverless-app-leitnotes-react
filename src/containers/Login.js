import React, { Component } from "react";
import "./Login.css";
import { Auth } from "aws-amplify";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";

export default class Login extends Component {
	constructor(props) {
	super(props);
	
	this.state = {
		isLoading: false,
		email: "",
		password: ""
		};
	}

	validateForm() {
		return this.state.email.length > 0 && this.state.password.length > 0;
	}
	/* Arrow function handle change.  Arrow functions are simliar to anon functions but inherit*
	certian aspects of their parent function such as the "this" keyword.*/
	handleChange = event => {
	this.setState({
	  [event.target.id]: event.target.value
	});
	}

	handleSubmit = async event => {
	  event.preventDefault();

	  this.setState({ isLoading: true });

	  try {
		await Auth.signIn(this.state.email, this.state.password);
		this.props.userHasAuthenticated(true);
	  } catch (e) {
		alert(e.message);
		this.setState({ isLoading: false });
	  }
	}

  	/* Control ID of the form group somehow gets into the handle change event as the target of the change. */
  render() {
    return (
      <div className="Login">
        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId="email" bsSize="large"> 
            <ControlLabel>Email</ControlLabel>
            <FormControl
              autoFocus
              type="email"
              value={this.state.email}
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup controlId="password" bsSize="large">
            <ControlLabel>Password</ControlLabel>
            <FormControl
              value={this.state.password}
              onChange={this.handleChange}
              type="password"
            />
          </FormGroup>
          <LoaderButton
			  block
			  bsSize="large"
			  disabled={!this.validateForm()}
			  type="submit"
			  isLoading={this.state.isLoading}
			  text="Login"
			  loadingText="Logging in…"
			/>
        </form>
      </div>
    );
  }
}