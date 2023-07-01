import React from 'react';

// Such functions are also called 'App Components'
// Only one function in a file can be exported as the default
function myFunction() {
	const myStyle = {
		backgroundColor: 'grey', color: 'blue', width: '30%', padding: '1%'
	};   
	
	return <h3 style={myStyle}>App00, myFunction: Hello World!</h3>;
}

export default myFunction;
