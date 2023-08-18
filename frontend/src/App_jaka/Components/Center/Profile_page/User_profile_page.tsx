// import InputUserName from "../../Other/InputUserName";
import UsersList from "./exampleDisplayUsers";
import ChangeProfileName from "./changeProfileName";
import { CurrUserData } from "./contextCurrentUser";
import ImageUpload from "./changeImageAvatar";
import UploadAvatar from "../../Other/UploadAvatar";
import UsersList from "./exampleDisplayUsers";
import ChangeProfileName from "./changeProfileName";
import { CurrUserData } from "./contextCurrentUser";

type ContextProps = {
  updateContext: (updateUserData: CurrUserData ) => void;
};

const UserProfilePage: React.FC<ContextProps> = ({ updateContext }) => {
  return (
    <div id="user-page">
      <p>USER PROFILE PAGE</p>
      {/* <p>Change your username: </p> */}
      {/* <InputUserName /> */}
      <ChangeProfileName updateContext={ updateContext } />
      <ImageUpload />
      <UploadAvatar />
      <UsersList />
    </div>
  );
};

export default UserProfilePage;
