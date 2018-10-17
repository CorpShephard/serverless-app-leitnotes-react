import React, { Component } from "react";
import { FormGroup, FormControl, ControlLabel, DropdownButton, MenuItem} from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import config from "../config";
import "./NewQuestion.css";
import { API } from "aws-amplify";
//import { s3Upload } from "../libs/awsLib";

export default class NewQuestion extends Component {
	constructor(props) {
		super(props);

		this.state = {
		  isLoading: null,
		  topic: "",
		  content: "",
		  answer: ""
		};
	}

	validateForm() {
		return this.state.content.length > 0;
	}

	handleChange = event => {
		this.setState({
			[event.target.id]: event.target.value
		});
	}

	handleFileChange = event => {
		this.file = event.target.files[0];
	}

	handleSubmit = async event => {
	  event.preventDefault();

	  this.setState({ isLoading: true });

	  try {
		await this.createQuestion({
		  topic: this.state.topic,
		  content: this.state.content,
		  answer: this.state.answer
		});
		this.props.history.push("/");
	  } catch (e) {
		alert(e);
		this.setState({ isLoading: false });
	  }
	}
	
	createQuestion(question) {
	  return API.post("questions", "/questions", {
		body: question
	  });
	}

  render() {
    return (
      <div className="NewQuestion">
		Question Topic:
		<br></br>
		<DropdownButton
		  bsStyle="large"
		  title="Previous Topics"
		  id="dropdown-size-large"
		>
		<MenuItem eventKey="1">TestItem</MenuItem>
			
		</DropdownButton>
        <form onSubmit={this.handleSubmit}>
		  <FormGroup controlId="topic">
            <FormControl
              onChange={this.handleChange}
              value={this.state.topic}
              componentClass="textarea"
           />
		  </FormGroup>
		  Question:
          <FormGroup controlId="content">
            <FormControl
              onChange={this.handleChange}
              value={this.state.content}
              componentClass="textarea"
            />
		  </FormGroup>
		  Answer:
		  <FormGroup controlId="answer">
            <FormControl
              onChange={this.handleChange}
              value={this.state.answer}
              componentClass="textarea"
           />
          </FormGroup>
		  
          <LoaderButton
            block
            bsStyle="primary"
            bsSize="large"
            disabled={!this.validateForm()}
            type="submit"
            isLoading={this.state.isLoading}
            text="Create"
            loadingText="Creating…"
          />
        </form>
      </div>
    );
  }
}