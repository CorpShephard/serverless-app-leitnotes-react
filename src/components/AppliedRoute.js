import React from "react";
import { Route } from "react-router-dom";

/*
	The Route.js component can take either a component or a render() method.  These are usually fed in
	based on the route being accessed by the user/app.  This code makes a component, C, with props, Cprops,
	that renders inside of our App's route.  Note that the props variable in this case will be what the Routes.js passes us.  Cprops is what we set want to set.
	If I understand correctly this allows us to concatenate the output of a route with extra properties (such as current login info).
*/
export default ({ component: C, props: cProps, ...rest }) =>
  <Route {...rest} render={props => <C {...props} {...cProps} />} />;