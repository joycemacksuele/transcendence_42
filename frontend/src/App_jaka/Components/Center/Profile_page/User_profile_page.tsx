// import InputUserName from "../../Other/InputUserName";
import UploadAvatar from "../../Other/UploadAvatar";
import UsersList from "./exampleDisplayUsers";
import ChangeProfileName from "./changeProfileName";


const UserPage = () => {
  return (
    <div id="user-page">
      <p>USER PAGE</p>
      {/* <p>Change your username: </p> */}
      {/* <InputUserName /> */}
      <ChangeProfileName />
      <UploadAvatar />
      <UsersList />
    </div>
  );
};

export default UserPage;
