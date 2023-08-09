import InputUserName from "../../Other/InputUserName";
import UploadAvatar from "../../Other/UploadAvatar";
import UsersList from "./exampleDisplayUsers";

const UserPage = () => {
  return (
    <div id="user-page">
      <p>USER PAGE</p>
      {/* <p>Change your username: </p> */}
      <InputUserName />
      <UploadAvatar />
      <UsersList />
    </div>
  );
};

export default UserPage;
