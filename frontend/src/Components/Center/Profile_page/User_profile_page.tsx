import React, { useState, useEffect } from "react";
import ImageUpload from "./changeUserImage";
import ButtonTfa from "./ButtonTfa";
import FriendsList from "./DisplayFriends";
import ChangeProfileName from "./changeProfileName";
import MyStatistics from "./MyStatistics";
import ChangeTheme from "./ChangeTheme";
import { CurrUserData } from "./contextCurrentUser";
// import JustTest from "./justTest_NOT_USED";

// import InputTFAcode from '../../Login_page/Form_inputTfaCode';

// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap/dist/js/bootstrap.min.js';

// Custom CSS
// import '../../../css/Profile.css'

// Importing bootstrap and other modules
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import DisplayOneUser from "./DisplayOneUser";

// interface User {
// 	name: string;
// }

type ContextProps = {
  updateContext: (updateUserData: CurrUserData) => void;
};

const UserProfilePage: React.FC<ContextProps> = ({ updateContext }) => {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const handleClickOnUser = (loginName: string) => {
    setSelectedUser(loginName);
  };

  const handleClickBack = () => {
    setSelectedUser(null);
  };

  // const [dummy, setDummy] = useState(false);
  // const handleClose = () => setDummy(false);
  // const handleShow = () => setDummy(true);
  // const [roomName, setRoomName] = useState('');
  // const [groupType, setGroupType] = useState(ChatUtils.PUBLIC);
  // const [roomPassword, setRoomPassword] = useState('');

  // const dummyFunction00 = () => {
  // 	console.log("Called dummy function");
  // };

  // const dummyFunction01 = (arg: any) => {
  // 	console.log("Called dummy function, arg: ", arg);
  // };

  return (
    // <Container fluid>
      <Row>
        {/* <p>Top row</p> */}
        {/* Column 1*/}
        {/* <Col className='bg-primary col-md-8'> */}
        <Col className="column-bckg text-black justify-content-left align-items-left p-3 rounded">
          <h5>MY PROFILE PAGE</h5>
          <ChangeProfileName updateContext={updateContext} />
          <ImageUpload updateContext={updateContext} />
          <ButtonTfa />
          <ChangeTheme />
        </Col>

        <Col className="column-bckg text-black justify-content-left align-items-left p-3 mx-2 rounded">
          {/* <Row className='h-75'> */}
          <h5>MY STATISTICS</h5>
          <MyStatistics />
        </Col>

        <Col className="column-bckg text-black justify-content-left align-items-left p-3 rounded">
          <div>
            <h5>MY FRIENDS</h5>
            {!selectedUser ? (
              <FriendsList clickOnUser={handleClickOnUser} />
            ) : (
              <>
                <button onClick={handleClickBack}>Back</button>
                <DisplayOneUser loginName={selectedUser} />
              </>
            )}
          </div>
        </Col>
      </Row>

      // {/* Temporary Row to display tfa form */}
      // {/* <Row> */}
      // {/* <InputTFAcode /> */}
      // {/* </Row> */}
    // </Container>
  );
};

export default UserProfilePage;
