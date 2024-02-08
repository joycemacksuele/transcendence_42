import { Container } from "react-bootstrap";


function PageNotFound () {
	return (
		<Container 	className='d-flex justify-content-center align-items-center'
						style={{ minHeight: "100vh" }}
			>
				<div className='d-flex flex-column align-items-center'>
						<h3>Page not found :&#40;</h3>
				</div>
			</Container>
	)
}

export default PageNotFound;