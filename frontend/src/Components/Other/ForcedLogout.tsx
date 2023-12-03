import { Container, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

function ForcedLogout () {
	return (
		<Container style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
			<Col style={{ textAlign: "center"}}>
				<p>You ran out of cookies!<br />Go get more cookies ...</p>
				{/* <p><a href="/"> LOGIN PAGE </a></p> */}
				<Button className="button_default" >
					<Link to="/" style={{color: "white"}}> LOGIN PAGE </Link>
				</Button>
			</Col>
		</Container>
	)
}

export default ForcedLogout;
