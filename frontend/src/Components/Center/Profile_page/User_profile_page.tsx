import ImageUpload from "./changeUserImage";
import UsersList from "./DisplayUsers";
import ChangeProfileName from "./changeProfileName";
import { CurrUserData } from "./contextCurrentUser";
// import JustTest from "./justTest_NOT_USED";

type ContextProps = {
  updateContext: (updateUserData: CurrUserData ) => void;
};

const UserProfilePage: React.FC<ContextProps> = ({ updateContext }) => {
  return (
    <div id="user-page">
      <p>USER PROFILE PAGE</p>
      <ChangeProfileName updateContext={ updateContext } />
      <ImageUpload updateContext={ updateContext }/>
      {/* <JustTest/> */}
      <UsersList />
    </div>
  );
};

export default UserProfilePage;
