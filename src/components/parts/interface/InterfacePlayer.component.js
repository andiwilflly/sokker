import React from 'react';
// Styles
import "styles/interface/interface-player.css";
// MobX
import { observer } from 'mobx-react';
import { observable } from 'mobx';
// Store
import store from "store";
// Components
import InterfacePlayerChart from "components/parts/interface/InterfacePlayerChart.component";
import InterfacePlayerInput from "components/parts/interface/InterfacePlayerInput.component";
import InterfacePlayerInfo from "components/parts/interface/InterfacePlayerInfo.component";
import PreLoader from "components/parts/PreLoader.component";


class InterfacePlayer extends React.Component {

	output = observable.map({
		gk: 0,
		def: 0,
		mid: 0,
		att: 0
	});

	isSavingData = observable.box(false);

	isReady = observable.box(false);


	constructor(props) {
		super();
		this.isReady.set(true);
		this.setOutput(props);
	}


	setOutput(props) {
		this.output.set('gk', +props.player.gk.toFixed(1));
		this.output.set('def', +props.player.def.toFixed(1));
		this.output.set('mid', +props.player.mid.toFixed(1));
		this.output.set('att', +props.player.att.toFixed(1));
	}


	savePlayer = async ()=> {
		this.isSavingData.set(true);
		await store.players.createMutation({
			...this.props.player,
			...this.output.toJSON(),
			playerId: this.props.player.id,
			userId: store.authorizedUser.id
		});
		this.isSavingData.set(false);
	};


	getPlayerPrediction(player = this.props.player) {
		return store.NET.run(player);
	};


	render() {
		if(!this.isReady.get()) return <PreLoader />;

		return (
			<div className="interface-player"
				 key={ store.NET.status } >
				<InterfacePlayerInfo player={ this.props.player } />

				<div className="interface-player-chart">
					{ store.players.isHideCharts ?
						<PreLoader />
						:
						<InterfacePlayerChart playerData={ this.getPlayerPrediction() } />
					}
				</div>

				<div className="interface-player-form">

					<div className="interface-player-form-inputs">
						<p>Net prediction: </p>
						<p>
							<span>GK</span>
							<InterfacePlayerInput pos="gk" output={ this.output } />
						</p>
						<p>
							<span>DEF</span>
							<InterfacePlayerInput pos="def" output={ this.output } />
						</p>
						<p>
							<span>MID</span>
							<InterfacePlayerInput pos="mid" output={ this.output } />
						</p>
						<p>
							<span>ATT</span>
							<InterfacePlayerInput pos="att" output={ this.output } />
						</p>

						<button onClick={ this.savePlayer } disabled={ this.isSavingData.get() }>
							{ this.isSavingData.get() ? 'Saving...' : 'Save' }
						</button>
					</div>
				</div>
			</div>
		);
	}
}

export default observer(InterfacePlayer);

