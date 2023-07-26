import "../css/App_jaka.css";
import Header from "../Header/Header.tsx";
import Sidebar from "../Sidebar/Sidebar.tsx";
import Center from "../Center/Center.tsx";


const MainPage = () => {
  return (
	<div>
	  <Header />
	  <div className="main-grid-container">
		<Sidebar />
		<Center />
	  </div>
	</div>
  );
};

export default MainPage;
