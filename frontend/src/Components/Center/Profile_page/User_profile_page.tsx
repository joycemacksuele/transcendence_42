import React, { useState, useEffect } from "react";
import ImageUpload from "./changeUserImage";
import ButtonTfa from "./ButtonTfa";
import FriendsList from "./DisplayFriends";
import ChangeProfileName from "./changeProfileName";
import MyStatistics from "./MyStatistics";
import MatchHistory from "./MatchHistory";
import ChangeTheme from "./ChangeTheme";
import { CurrUserData } from "./contextCurrentUser";

// Importing bootstrap and other modules
import { Container, Row, Col} from "react-bootstrap";
import DisplayOneUser from "./DisplayOneUser";

// interface User {
// 	name: string;
// }

type ContextProps = {
  updateContext: (updateUserData: CurrUserData) => void;
};

const UserProfilePage: React.FC<ContextProps> = ({ updateContext }) => {

  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [showMatchHistory, setShowMatchHistory] = useState(false);

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
    <Container fluid>
      <Row>
        <Col className="column-bckg justify-content-left align-items-left p-3 mx-2 rounded">
          <h5>MY PROFILE PAGE</h5>
          <ChangeProfileName updateContext={updateContext} />
          <ImageUpload updateContext={updateContext} />
          <ButtonTfa />
          <ChangeTheme />
        </Col>

        <Col className="column-bckg justify-content-left align-items-left p-3 mx-2 rounded">
          {/* <Row className='h-75'> */}
          <h5>MY STATISTICS</h5>
          <MyStatistics />
          {/* <br /><h5>MY MATCH HISTORY</h5> */}
          {/* <MatchHistory /> */}
          <MatchHistory loginName={selectedUser}/>
        </Col>

        <Col className="column-bckg justify-content-left align-items-left p-3 mx-2 rounded">
          <div>
            <h5>MY FRIENDS</h5>
            {!selectedUser ? (
              <FriendsList clickOnUser={handleClickOnUser} />
            ) : (
              <>
                <button onClick={handleClickBack}>Back</button>
                <DisplayOneUser loginName={selectedUser} 
                                showMatchHistory={showMatchHistory}
                                setShowMatchHistory={setShowMatchHistory}
                
                
                />
              </>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default UserProfilePage;
