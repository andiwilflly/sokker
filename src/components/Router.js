import React from "react";
import history from 'utils/history.utils';
import { Router, Route, Switch, Redirect } from "react-router-dom";
import { ApolloProvider } from 'react-apollo';
// MobX
import { observer } from 'mobx-react';
// Store
import store from 'store';
// Pages
import Layout from "components/Layout.component";
import HomePage from "components/pages/lazy/HomePage.lazy.component";
import LogInPage from "components/pages/lazy/LogInPage.lazy.component";
import RegistrationPage from "components/pages/lazy/RegistrationPage.lazy.component";
import FavoritesPage from "components/pages/lazy/FavoritesPage.lazy.component";
import NeuralNetworkPage from "components/pages/lazy/NeuralNetworkPage.lazy.component";
import Page404 from "components/pages/Page404.component";
// Components
import QueryLoader from "components/QueryLoader.component";
import PreLoader from "components/parts/PreLoader.component";
// GraphQL
import client from "graphql/client";
import LOGGED_IN_USER_QUERY from "graphql/queries/loggedInUser.query";


const RouteComponent = ({ component: Component, ...rest })=> {
	store.setCurrentPath(rest.location.pathname);
	// Need needAuth case
	if(!Component.permissions) return Component; // HomePage
	if(Component.permissions.needAuth === true && !store.authorizedUser) store.setNextPathUrl(rest.path);
	if(Component.permissions.needAuth === true && !store.authorizedUser) return <Redirect to={{ pathname: Component.permissions.redirectPath }} />;

	if(Component.permissions.notForAuth === true && store.authorizedUser) return <Redirect to={{ pathname: Component.permissions.redirectPath }} />;

	// Default case
	return (
		<Route { ...rest } render={ (props)=>
			React.createElement(Component, props)
		}/>
	);
};


// @SOURCE: https://reacttraining.com/react-router/
// TODO: https://reacttraining.com/react-router/web/example/auth-workflow
const Routes = ()=> {
	return (
		<Router history={history}>
			<ApolloProvider client={client}>
				<QueryLoader query={ LOGGED_IN_USER_QUERY }
							 preLoader={ <div className="cssload-loader-big"><PreLoader/></div>}>
					<Layout>
						<Switch>
							<RouteComponent exact path="/" component={<div>{null}</div>} />
							<RouteComponent exact path="/login" component={LogInPage} />
							<RouteComponent exact path="/registration" component={RegistrationPage} />
							<RouteComponent exact path="/favorites" component={ FavoritesPage } />
							<RouteComponent exact path="/neuralnetwork" component={ NeuralNetworkPage } />
							{/*<RouteComponent exact path="/profile" component={RegistrationPage} />*/}
							<RouteComponent component={Page404} />
						</Switch>
						<HomePage />
					</Layout>
				</QueryLoader>
			</ApolloProvider>
		</Router>
	);
}

;

export default observer(Routes);