import React from 'react';

// Such functions are also called 'App Components'
// Only one function in a file can be exported as the default
function someFunction() {
    const myStyle = {
        backgroundColor: 'blue',
        color: 'yellow',
    };
    return <h1 style={myStyle}>App01, someFunction  ... </h1>;
}

export default someFunction;