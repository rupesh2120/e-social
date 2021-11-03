import React, { Fragment, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Alert from "./components/layout/Alert";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";

//import Routes from "./components/routing/Routes";
//import { LOGOUT } from "./actions/types";

// Redux
import { Provider } from "react-redux";
import store from "./store";
import { loadUser } from "./actions/auth";
import setAuthToken from "./utils/setAuthToken";

import "./App.css";
import Dashboard from "./components/dashboard/Dashboard";
import PrivateRoute from "./components/routing/PrivateRoute";
import CreateProfile from "./components/profile-form/CreateProfile";

if (localStorage.token) {
	setAuthToken(localStorage.token);
}

const App = () => {
	useEffect(() => {
		// check for token in LS
		// if (localStorage.token) {
		// 	setAuthToken(localStorage.token);
		// }
		store.dispatch(loadUser());

		// log user out from all tabs if they log out in one tab
		// window.addEventListener("storage", () => {
		// 	if (!localStorage.token) store.dispatch({ type: LOGOUT });
		// });
	}, []);

	return (
		<Provider store={store}>
			<Router>
				<Fragment>
					<Navbar />
					<Route exact path="/" component={Landing} />
					<section className="container">
						<Alert />
						<Switch>
							<Route exact path="/register" component={Register} />
							<Route exact path="/login" component={Login} />
							<PrivateRoute exact path="/dashboard" component={Dashboard} />
							<PrivateRoute exact path="/dashboard" component={CreateProfile} />
						</Switch>
					</section>
				</Fragment>
			</Router>
		</Provider>
	);
};
// const App = () => (
//{
// 	/* <Provider store={store}>
// 	<Router>
// 		<Fragment>
// 			<Navbar />
// 			<Route exact path="/" component={Landing} />
// 			<section className="container">
// 				<Alert />
// 				<Switch>
// 					<Route exact path="/register" component={Register} />
// 					<Route exact path="/login" component={Login} />
// 				</Switch>
// 			</section>
// 		</Fragment>
// 	</Router>
// </Provider>; */
//}
// );

export default App;
