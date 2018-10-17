import React, { Component } from "react";
import { API, Storage } from "aws-amplify";
import { FormGroup, FormControl, ControlLabel, DropdownButton } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import config from "../config";
import "./Questions.css";
import { s3Upload, s3Remove } from "../libs/awsLib";
/*
We get the id of our note from the URL using the props automatically passed to us by React-Router in this.props.match.params.id. The keyword id is a part of the pattern matching in our route (/notes/:id).
*/

export default class Questions extends Component {
	constructor(props) {
		super(props);

		this.file = null;

		this.state = {
		  isLoading: null,
		  isDeleting: null,
		  question: null,
		  topic: "",
		  content: "",
		  answer: ""
		};
	}

	async componentDidMount() {
		try {
		  const question = await this.getQuestion();
		  const { topic, content, answer } = question;

		  this.setState({
			question,
			content,
			topic,
			answer
		  });
		} catch (e) {
		  alert(e);
		}
	}
	
	deleteQuestion() {
	  return API.del("questions", `/questions/${this.props.match.params.id}`);
	}

	handleDelete = async event => {
	  event.preventDefault();

	  const confirmed = window.confirm(
		"Are you sure you want to delete this question?"
	  );

	  if (!confirmed) {
		return;
	  }

	  this.setState({ isDeleting: true });

	  try {
		await this.deleteQuestion();
		//if(this.state.note.attachment != null) s3Remove(this.state.note.attachment);
		this.props.history.push("/");
	  } catch (e) {
			alert(e);
		this.setState({ isDeleting: false });
	  }
	}

	getQuestion() {
		return API.get("questions", `/questions/${this.props.match.params.id}`);
	}
	
	//TODO: add built API for getting all topics for a given user.
	getTopic(){
		
	}

  
	validateForm() {
	  return this.state.content.length > 0;
	}
	/* Strips the filename of the timestamp that we added when putting it into the S3 Bucket.*/
	formatFilename(str) { 
	  return str.replace(/^\w+-/, "");
	}

	handleChange = event => {
	  this.setState({
		[event.target.id]: event.target.value
	  });
	}

	handleFileChange = event => {
	  this.file = event.target.files[0];
	}

	saveQuestion(question) {
	  return API.put("questions", `/questions/${this.props.match.params.id}`, {
		body: question
	  });
	}

	handleSubmit = async event => {
	  event.preventDefault();

	  this.setState({ isLoading: true });

	  try {
		//if(this.state.note.attachment != null && attachment != null) s3Remove(this.state.note.attachment);
		await this.saveQuestion({
		  topic: this.state.topic,
		  content: this.state.content,
		  answer: this.state.answer
		  //attachment: attachment || this.state.question.attachment
		});
		
		
		this.props.history.push("/");
	  } catch (e) {
		alert(e);
		this.setState({ isLoading: false });
	  }
	}

	render() {
	  return (
		<div className="Questions">
		  {this.state.question &&  /* We render our form only when this.state.note is available. */
			<form onSubmit={this.handleSubmit}>
			  Topic:
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
				text="Save"
				loadingText="Saving…"
			  />
			  <LoaderButton
				block
				bsStyle="danger"
				bsSize="large"
				isLoading={this.state.isDeleting}
				onClick={this.handleDelete}
				text="Delete"
				loadingText="Deleting…"
			  />
			</form>}
		</div>
	  );
	}
}