import React from 'react';
import InputMask from 'react-input-mask';
// MobX
import { observer } from 'mobx-react';


export default observer(function({ output, pos }) {
	return (
		<InputMask mask="9.9"
				   maskChar=" "
				   alwaysShowMask={ true }
				   value={ output.get(pos) }
				   onChange={ (e)=> output.set(pos, +e.currentTarget.value) }
				   style={{
					   outline: 'none',
					   width: 30,
					   height: 20,
					   border: 'none',
					   borderBottom: '1px solid black',
					   fontSize: 14
				   }}
		/>
	);
})