import React from 'react';
import { CellMeasurer, List } from 'react-virtualized';
// Styles
import "styles/interface/interface.css";
// MobX
import { observable, values } from "mobx";
import { observer } from "mobx-react";
// Store
import store from "store";
// Components
import InterfacePlayer from "components/parts/interface/InterfacePlayer.component";
import Filters from "components/parts/filters/Filters.component";
import PreLoader from "components/parts/PreLoader.component";
import T from "components/parts/T.component";


class Interface extends React.Component {

	table = observable({
		height: this.tableHeight,
		width: this.tableWidth,
		marginLeft: 15,
		rowHeight: 370
	});



	constructor() {
		super();
		store.transfers.transfersMutation();
		window.addEventListener('resize', this.onResize);
	}


	componentWillUnmount() {
		window.removeEventListener('resize', this.onResize);
	}


	get tableWidth() { return store.device === "desktop" ? window.innerWidth / 100 * 60 : window.innerWidth; };

	get tableHeight() { return window.innerHeight - 50; };

	get userPlayers() { return values(store.players.all).filter((player)=> player.userId === store.authorizedUserId); };

	get players() { return store.transfers.filtered; };


	onResize = (e)=> {
		this.table.width = this.tableWidth;
		this.table.height = this.tableHeight;
	};


	renderFilter() {
		return store.device === "desktop" ?
			<div style={{
				position: 'fixed',
				left: this.tableWidth + 15,
				width: window.innerWidth - (this.tableWidth + 50)
			}}>
				{ store.authorizedUserId && <div style={{ height: this.table.height, overflowY: 'scroll' }}><Filters /></div> }
			</div>
			: null;
	}


	rowRenderer = ({ index, key, parent, style })=> {
		return (
			<CellMeasurer
				cache={ store.interfaceMeasurerCache }
				columnIndex={0}
				key={key}
				rowIndex={index}
				parent={parent}>
				{ ()=> (
					<div style={ style } key={ this.players[index].id }>
						<InterfacePlayer player={ this.players[index] }
										 index={index} />
					</div>
				) }
			</CellMeasurer>
		);
	};

	renderRefreshBtn() {
		if(store.device !== 'desktop') return null;
		return (
			<button className="interface-refresh-btn animated infinite heartBeat slower"
					onClick={ store.transfers.transfersMutation }
					style={{ left: this.table.width - 80 }}>
				<PreLoader />
			</button>
		);
	}


	render() {
		if(!store.transfers.players.size) return (
			<div style={{ display: 'flex', flexWrap: 'nowrap', alignItems: 'start' }}>
				<div style={{ overflow: 'hidden', width: this.table.width, padding: "0 10px" }}>
					{ this.renderRefreshBtn() }

					<div className="cssload-loader-big"><PreLoader/></div>
				</div>
				{ this.renderFilter() }
			</div>
		);


		return (
			<div style={{ display: 'flex', flexWrap: 'nowrap', alignItems: 'start' }}>
				<div style={{ overflow: 'hidden', width: this.table.width, padding: "0 10px" }}>
					{ this.renderRefreshBtn() }

					{ this.players.length ?
						<List rowCount={ this.players.length }
							  deferredMeasurementCache={ store.interfaceMeasurerCache }
							  height={ this.table.height }
							  width={ this.table.width }
							  rowHeight={ store.interfaceMeasurerCache.rowHeight }
							  rowRenderer={ this.rowRenderer } />
						:
						<div style={{ fontSize: 20, textAlign: 'center', marginTop: '100px' }}>
							<T>No players found</T>
						</div>
					}
				</div>

				{ this.renderFilter() }
			</div>
		)
	}
}


export default observer(Interface);