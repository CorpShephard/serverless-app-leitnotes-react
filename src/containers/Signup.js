import React, { Component } from "react";
import {
  HelpBlock,
  FormGroup,
  FormControl,
  ControlLabel
} from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import "./Signup.css";
import { Auth } from "aws-amplify";

export default class Signup extends Component {
	constructor(props) {
		super(props);

		this.state = {
		  isLoading: false,
		  isResending: false,
		  email: "",
		  password: "",
		  confirmPassword: "",
		  confirmationCode: "",
		  newUser: null
		};
	}

	validateForm() {
		return (
		  this.state.email.length > 0 &&
		  this.state.password.length > 0 &&
		  this.state.password === this.state.confirmPassword
		);
	}

	validateConfirmationForm() {
		return this.state.confirmationCode.length > 0;
	}

	handleChange = event => {
		this.setState({
		  [event.target.id]: event.target.value
		});
	}

	handleSubmit = async event => {
	  event.preventDefault();

	  this.setState({ isLoading: true });

	  try {
		const newUser = await Auth.signUp({
		  username: this.state.email,
		  password: this.state.password
		});
		this.setState({
			newUser
		});
	  } catch (e) {
			if(e.name == "UsernameExistsException"){
				alert("User exists but has not confirmed their e-mail.  Please confirm.");
				try{
					this.setState({
						newUser: {
							username: this.state.email,
							password: this.state.password,
						},
					});
				}catch (g){
					alert(g.message);
				}
				
			} else alert(e.message);
	  }

	  this.setState({ isLoading: false });
	}

	handleConfirmationSubmit = async event => {
	  event.preventDefault();

	  this.setState({ isLoading: true });

	  try {
		await Auth.confirmSignUp(this.state.email, this.state.confirmationCode);
		await Auth.signIn(this.state.email, this.state.password);

		this.props.userHasAuthenticated(true);
		this.props.history.push("/");
	  } catch (e) {
		alert(e.message);
		this.setState({ isLoading: false });
	  }
	}
	
	handleResendSubmit = async event => {
		event.preventDefault();
		
		this.setState({ isResending: true });
		try{
			var promise = Auth.resendSignUp(this.state.email)
			alert("E-mail sent");
		}catch (e) {
			alert(e.message);
		}
		this.setState({ isResending: false });
	}

    renderConfirmationForm() {
		return (
			<div>
			    <form onSubmit={this.handleConfirmationSubmit}>
					<FormGroup controlId="confirmationCode" bsSize="large">
					  <ControlLabel>Confirmation Code</ControlLabel>
					  <FormControl
						autoFocus
						type="tel"
						value={this.state.confirmationCode}
						onChange={this.handleChange}
					  />
					  <HelpBlock>Please check your email for the code.</HelpBlock>
					</FormGroup>
					<LoaderButton
					  block
					  bsSize="large"
					  disabled={!this.validateConfirmationForm()}
					  type="submit"
					  isLoading={this.state.isLoading}
					  text="Verify"
					  loadingText="Verifying…"
					/>
			    </form>
				<br>
				</br>
				<form onSubmit={this.handleResendSubmit}>
					<LoaderButton
					  block
					  bsSize="large"
					  type="submit"
					  isLoading={this.state.isResending}
					  text="Resend Confirmation E-mail"
					  loadingText="Resending..."
					/>
				</form>
			</div>
		);
	}

	renderResendForm() {
		return(
			<form onSubmit={this.handleResendSubmit}>
				<LoaderButton
				  block
				  bsSize="large"
				  type="submit"
				  isLoading={this.state.isResending}
				  text="Resend Confirmation E-mail"
				  loadingText="Resending..."
				/>
			</form>
		);
	}

    renderForm() {
		return (
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
			<FormGroup controlId="confirmPassword" bsSize="large">
			  <ControlLabel>Confirm Password</ControlLabel>
			  <FormControl
				value={this.state.confirmPassword}
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
			  text="Signup"
			  loadingText="Signing up…"
			/>
		  </form>
		);
    }
	/* 	The moment a new user is created it is locally assigned so the view will change to the 
		renderConfirmationForm format.
	*/
    render() {
		return (
		  <div className="Signup">
			{this.state.newUser === null
			  ? this.renderForm()
			  : this.renderConfirmationForm()
			}
		  </div>
		);
    }
}