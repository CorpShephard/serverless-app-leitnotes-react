import React, { Component } from "react";
import { PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";
import "./Home.css";
import { API } from "aws-amplify";
import { Link } from "react-router-dom";

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      notes: [],
	  questions: []
    };
  }
  
	async componentDidMount() {
		if (!this.props.isAuthenticated) {
			return;
		}

		try { // Load Notes
			const notes = await this.notes();
			this.setState({ notes });
			
			const questions = await this.questions();
			this.setState({ questions });
		} 
		catch (e) {
			alert(e);
		}

		this.setState({ isLoading: false });
	}
	
	questions() {
		return API.get("questions", "/questions");
	}

	notes() {
	  return API.get("notes", "/notes");
	}

	renderNotesList(notes) {  /* map() is a "for each" explicitly made for traversing arrays */
	  return [{}].concat(notes).map((note, i) =>
			  i !== 0
				? <ListGroupItem /* If there are still notes, render them. */
					key={note.noteId}
					href={`/notes/${note.noteId}`}
					onClick={this.handleNoteClick}
					header={note.content.trim().split("\n")[0]}
				  >
					{"Created: " + new Date(note.createdAt).toLocaleString()}
				  </ListGroupItem>
				: <ListGroupItem /* Otherwise render a "new notes" button */
					key="new"
					href="/notes/new"
					onClick={this.handleNoteClick}
				  >
					<h4>
					  <b>{"\uFF0B"}</b> Create a new note
					</h4>
				  </ListGroupItem>
	  );
	}
	
	renderQuestionsList(questions){
		return [{}].concat(questions).map((question, i) =>
			i !== 0
			? <ListGroupItem /* If there are still questions, render them. */
				key={question.questionId}
				href={`/questions/${question.questionId}`}
				onClick={this.handleNoteClick}
				header={question.content.trim().split("\n")[0]}
			  >
				{"Created: " + new Date(question.createdAt).toLocaleString()}
			  </ListGroupItem>
			: <ListGroupItem /* Otherwise render a "new question" button */
				key="new"
				href="/questions/new"
				onClick={this.handleNoteClick}
			  >
				<h4>
				  <b>{"\uFF0B"}</b> Create a new Question
				</h4>
			  </ListGroupItem>
		);
	}

	handleNoteClick = event => {
	  event.preventDefault();
	  this.props.history.push(event.currentTarget.getAttribute("href"));
	}

	renderLander() {
	  return (
		<div className="lander">
		  <h1>Scratch</h1>
		  <p>A simple note taking app</p>
		  <div>
			<Link to="/login" className="btn btn-info btn-lg">
			  Login
			</Link>
			<Link to="/signup" className="btn btn-success btn-lg">
			  Signup
			</Link>
		  </div>
		</div>
	  );
	}

  renderNotes() {
    return (
      <div className="notes">
        <PageHeader>Your Notes</PageHeader>
        <ListGroup>
          {!this.state.isLoading && this.renderNotesList(this.state.notes)}
        </ListGroup>
      </div>
    );
  }
  
  renderQuestions(){
	return(
	  <div className="questions">
        <PageHeader>Your Questions</PageHeader>
        <ListGroup>
          {!this.state.isLoading && this.renderQuestionsList(this.state.questions)}
        </ListGroup>
      </div>
	);
  }
  
  renderNothing(){
	return(<div></div>);
  }


  render() {
    return (
      <div className="Home">
	  
		 {this.props.isAuthenticated ? this.renderNotes() : this.renderLander()}
         {this.props.isAuthenticated ? this.renderQuestions() : this.renderNothing()}
      </div>
    );
  }
}