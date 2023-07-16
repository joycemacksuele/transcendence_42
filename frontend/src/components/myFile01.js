import React from 'react';

// Such functions are also called 'App Components'
// Only one function in a file can be exported as the default
function someFunction() {
	const myStyle = {
		backgroundColor: 'khaki', color: 'purple', width: '30%', padding: '1%' };
	return <h3 style={myStyle}>App01, someFunction  ... </h3>;
}

export default someFunction;
