import React from 'react';
// MobX
import { observer } from "mobx-react";
// Store
import store from "store";
// Components
import BoxList from "components/parts/boxes/BoxList.component";
import Link from "components/Link.component";


class HomePageContent extends React.Component {

	render() {
		return (
			<BoxList boxes={ [
				<div>
					{ !store.authorizedUser && <Link to="/login">Log in</Link> }
					{ !store.authorizedUser && <Link to="/registration">Registration</Link> }
				</div>
			] } />
		)
	}
}


export default observer(HomePageContent);