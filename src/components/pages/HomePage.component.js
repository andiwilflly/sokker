import React from 'react';
// MobX
import { observer } from "mobx-react";
// Store
import store from "store";
// GraphQL
import USER_PLAYERS_QUERY from "graphql/queries/players/userPlayers.query";
// Components
import Link from "components/Link.component";
import QueryLoader from "components/QueryLoader.component";
import Interface from "components/parts/interface/Interface.component";
import PreLoader from "components/parts/PreLoader.component";
import T from "components/parts/T.component";


class HomePageContent extends React.Component {

	render() {
		return (
			<div style={{
				opacity: store.currentPath === "/" ? "1" : "0"
			}}>
				{ !store.authorizedUser &&
					<div style={{padding: '20px'}}>
						<Link to="/login"><T i18nKey="Login"><button>Login</button></T></Link>
						<Link to="/registration"><T i18nKey="Registration"><button>Registration</button></T></Link>
					</div>
				}

				{/*<T i18nKey="Hello">*/}
					{/*Hello <strong title={"Login"}>{{ name: store.t('NickName') }}</strong>, you have {{ count: 42 }} unread message.*/}
				{/*</T>*/}

				{ store.authorizedUser &&
					<QueryLoader query={ USER_PLAYERS_QUERY }
								 preLoader={ <div className="cssload-loader-big"><PreLoader/></div>}
								 variables={{ userId: store.authorizedUser.id }}>
						<Interface />
					</QueryLoader>
				}
			</div>
		)
	}
}


export default observer(HomePageContent);