import React, { useState, useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import axiosInstance from "../../../Other/AxiosInstance";
import { CustomSpinner } from "../../../Other/Spinner";

interface UserStats {
  // loginName: string;
  rank: number;
  gamesPlayed: number;
  gamesLost: number;
  gamesWon: number;
  achievements: string;
}

const MyStatistics: React.FC = () => {
  // new endpoint to get the statistics or just return the userdata
  const [currUser, setCurrUser] = useState<UserStats | null>(null);

  useEffect(() => {
    const getCurrUser = async () => {
      try {
        const response = await axiosInstance.get("/users/get-current-user");
        setCurrUser(response.data);
      } catch (error) {
        console.error("Error fetching current user: ", error);
      }
    };
    getCurrUser();
  }, []);

  return (
    <>
      {!currUser ? (
        <CustomSpinner />
      ) : (
        <Col className="column-bckg p-3 rounded inner-section">
          <Row className="m-2">Rank: {currUser?.rank}</Row>
          <Row className="m-2">Won: {currUser?.gamesWon}</Row>
          <Row className="m-2">Lost: {currUser?.gamesLost}</Row>
          <Row className="m-2">Games Played: {currUser?.gamesPlayed}</Row>
          <Row className="m-2">Achivements: {currUser?.achievements}</Row>
        </Col>
      )}
    </>
  );
};

export default MyStatistics;
