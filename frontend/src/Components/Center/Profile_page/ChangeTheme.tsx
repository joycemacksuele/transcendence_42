import React, { useState, useEffect } from "react";

// localStorage.getItem('css-file');

const ChangeTheme = () => {
	const [theme, setTheme] = useState(localStorage.getItem('css-file') || '');
	
	// console.log(' >>>>>>>>>> CHANGE THEME')
	useEffect(() => {

		const link = document.getElementById('theme-style') as HTMLLinkElement | null;
		if (link)
			link.href = `/frontend/src/css/${theme}`;

		localStorage.setItem('css-file', theme)
	}, [theme]);

	return (
		<div className="inner-section">
			<p>Change Theme</p>
			<select value={theme} onChange={ e => setTheme(e.target.value )}>
				<option value='default.css'>Default</option>
				<option value='ugly.css'>Ugly</option>
				<option value='beautiful.css'>Beautiful</option>
			</select>
		</div>
	)
};

export default ChangeTheme;
