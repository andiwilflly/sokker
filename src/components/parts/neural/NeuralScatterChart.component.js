import React from "react";
// MobX
import { observable } from "mobx";
import { observer } from "mobx-react";
// @SOURCE: https://github.com/recharts/recharts/blob/master/demo/component/PieChart.js
import { ResponsiveContainer, ScatterChart, CartesianGrid, XAxis, YAxis, ZAxis, Tooltip, Legend, Scatter } from "recharts";
// Components
import PreLoader from "components/parts/PreLoader.component";
import InterfacePlayer from "components/parts/interface/InterfacePlayer.component";


class NeuralScatterChart extends React.Component {


	activeTab = observable.box('att');

	selectedPlayer = observable.box(null);

	colors = {
		att: '#2876b4',
		def: 'rgb(247, 126, 17)',
		mid: 'rgb(44, 160, 44)',
		gk: 'rgb(215, 39, 41)',
	};
	

	get chartData() {
		return this.props.players.map((player)=> {
			return {
				att: player.att + 0.01,
				def: player.def + 0.01,
				mid: player.mid + 0.01,
				gk: player.gk + 0.01,
				age: Math.round(player.age * 100),
				name: player.name,
				id: player.id
			};
		});
	};


	onScatterClick = ({ id })=> {
		const player = this.props.players.find((player)=> player.id === id);
		this.selectedPlayer.set(player);
	};


	renderTooltip = (tooltip)=> {
		if(!tooltip.payload.length) return null;
		const player = tooltip.payload[0].payload;
		return (
			<div style={{ background: 'whitesmoke', padding: '10px', fontSize: '13px', lineHeight: '20px' }}>
				{ player.name }<br/>
				age: { player.age }<br/>
				{ this.activeTab.get() }: { player[this.activeTab.get()].toFixed(1) }<br/>
			</div>
		)
	};


	renderScatterShape = (player)=> {
		const skill = player[this.activeTab.get()];
		return <circle cx={player.x}
					   cy={player.y}
					   r={ skill * 12 <= 6 ? 6 : skill * 12 }
					   fill={ this.colors[this.activeTab.get()] } stroke="none" />;
	};


	renderLabels() {
		return (
			<div style={{ display: 'flex', justifyContent: 'flex-end' }}>
				{ Object.keys(this.colors).map((skill)=> {
					return <div key={skill}
								onClick={ ()=> this.activeTab.set(skill) }
								style={{
									background: this.colors[skill],
									border: `2px solid ${ skill === this.activeTab.get() ? 'white' : this.colors[skill] }`,
									width: '40px',
									cursor: 'pointer',
									height: '20px',
									margin: '10px' }} />
				}) }
			</div>
		);
	}


	renderChart() {
		if(!this.props.players.length) return <div className="cssload-loader-big"><PreLoader /></div>;
		return (
			<ScatterChart margin={{ top: 10, right: 20, bottom: 50, left: 0 }}>
				<Legend />
				<XAxis type="number"
					   tick={{ fontSize: '11px' }}
					   dataKey={ this.activeTab.get() }
					   tickCount={ 6 }
					   domain={[0, 1]}
					   name={ this.activeTab.get() }
					   unit={` ${this.activeTab.get()}`} />
				<YAxis type="number"
					   dataKey="age"
					   tickCount={ 15 }
					   domain={[15, 'dataMax + 1']}
					   tick={{ fontSize: '11px' }}
					   name="age"
					   unit=" age" />
				<CartesianGrid />
				<Tooltip cursor={{ strokeDasharray: '3 3' }}
						 isAnimationActive={false}
						 content={ this.renderTooltip } />
				<Scatter name={ this.activeTab.get().toUpperCase() }
						 data={ this.chartData }
						 fill={ this.colors[this.activeTab.get()] }
						 onClick={ this.onScatterClick }
						 shape={ this.renderScatterShape }
				/>
			</ScatterChart>
		);
	}


	render() {
		return (
			<div style={{ width: '100%' }}>
				<div style={{ width: '100%', height: '600px', background: 'white' }}>
					{ this.renderLabels() }

					<ResponsiveContainer>
						{ this.renderChart() }
					</ResponsiveContainer>
				</div>
				<div>
					{ this.selectedPlayer.get() ?
						<InterfacePlayer player={ this.selectedPlayer.get() } key={this.selectedPlayer.get().id } />
						:
						null }
				</div>
			</div>
		);
	}
}


export default observer(NeuralScatterChart);