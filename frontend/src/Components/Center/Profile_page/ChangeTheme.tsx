import React, { useState, useEffect } from "react";

const ChangeTheme = () => {

	const [theme, setTheme] = useState('index');

	useEffect(() => {
		const link = document.getElementById('theme-style') as HTMLLinkElement | null;
		if (link)
			link.href = `/frontend/src/${theme}.css`;
	}, [theme]);

	return (
		<div>
			<p>Change Theme</p>
			<select value={theme} onChange={ e => setTheme(e.target.value )}>
				<option value='index'>Default</option>
				<option value='jaka1'>Jaka 1</option>
				<option value='jaka2'>Jaka 2</option>
			</select>
		</div>
	)
};

export default ChangeTheme;
