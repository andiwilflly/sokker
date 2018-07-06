import React from 'react';
// Store
import store from "store";
// MobX
import { observer } from "mobx-react";


function getSkill(name) { return store.filters.skills.get(name); };

function onSkillChange(name) {
	const skill = store.filters.skills.get(name);
	store.filters.change({
		skills: {
			[name]: skill === "✘" ?
				"▼"
				:
				skill === "▲" ? "✘" : "▲"
		}
	});
}


export default observer(function({ name, color="#2876b4" }) {
	return (
		<button onClick={ ()=> onSkillChange(name) } style={{ background: getSkill(name) === "✘" ? "gray" : color }}>{ name } { getSkill(name) }</button>
	)
});