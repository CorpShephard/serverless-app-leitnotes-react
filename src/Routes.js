import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./containers/Home";
import NotFound from "./containers/NotFound";
import Login from "./containers/Login";
import AppliedRoute from "./components/AppliedRoute";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute";
import Signup from "./containers/Signup";
import NewNote from "./containers/NewNote";
import Notes from "./containers/Notes";
import NewQuestion from "./containers/NewQuestion";
import Questions from "./containers/Questions";


export default ({ childProps }) =>
  <Switch>
    <AppliedRoute path="/" exact component={Home} props={childProps} />
	<UnauthenticatedRoute path="/login" exact component={Login} props={childProps} />
	<UnauthenticatedRoute path="/signup" exact component={Signup} props={childProps} />
	<AuthenticatedRoute path="/notes/new" exact component={NewNote} props={childProps} />
	<AuthenticatedRoute path="/notes/:id" exact component={Notes} props={childProps} />
	<AuthenticatedRoute path="/questions/new" exact component={NewQuestion} props={childProps} />
	<AuthenticatedRoute path="/questions/:id" exact component={Questions} props={childProps} />
    { /* Finally, catch all unmatched routes */ }
    <Route component={NotFound} />
  </Switch>;
  
