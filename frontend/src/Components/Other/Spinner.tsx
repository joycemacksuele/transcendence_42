import { Container } from "react-bootstrap";


export const CustomSpinner: React.FC = () => {
	return (
		<Container
        	className="d-flex justify-content-center align-items-center"
        	// style={{ minHeight: "100vh" }}
      	>
			<div className="d-flex flex-column align-items-center">
				<div className="spinner-pizza">
					<img className="giphy-embed"
							src="http://localhost:3000/spinner-pizza.gif"
							// src={`${process.env.REACT_APP_EHOST}/spinner-pizza.gif`}
							// allowFullScreen
					></img>
				</div>
				<h5>Loading ...</h5>
			</div>
      	</Container>
	)
}