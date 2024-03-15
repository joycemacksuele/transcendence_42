import axiosInstance from "../../../Other/AxiosInstance";
import axios from "axios";


async function startFollowing(myId: number, friendId: number) {
    // const friendId = userData?.id; // todo: fetch the id (the to-be friend)
    try {
      await axiosInstance.post(`/friendship/${myId}/addFriend/${friendId}`);
      //console.log("Success: Friendship added: ", response.data);
    } catch (error: any) {
      console.error("Error adding a friend: " /*, error*/);
      if (axios.isAxiosError(error)) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          console.error(error.response.data.message);
        } else {
          console.error("An axiosError occured while adding a friend.");
        }
      } else {
        console.error(
          "Another (non axios) error occured while adding a friend."
        );
      }
    }
  }

  async function stopFollowing(myId: number, friendId: number) {
    try {
      await axiosInstance.post(
        `/friendship/${myId}/removeFriend/${friendId}`
      );
      // console.log("Success remnoving a friend: ", response);
    } catch (error: any) {
      console.error("Error removing a friend");
      if (axios.isAxiosError(error)) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          console.error(error.response.data.message);
        } else {
          console.error("An axiosError while removing a friend");
        }
      } else {
        console.error("Another error while removing a friend");
      }
    }
  }

// setIsBlocked: React.Dispatch<React.SetStateAction<boolean>>) {
		//
  

  const handleClickFollowing = async (
		myId: number,
		friendId: number,
		IamFollowing: boolean,
		setIamFollowing: React.Dispatch<React.SetStateAction<boolean>>) => {
    
	if (!friendId) {
      console.error("Error, userData.id (a friend) is not available");
      return;
    }
    if (IamFollowing) {
      await stopFollowing(myId, friendId);
    } else {
      await startFollowing(myId, friendId);
    }
    setIamFollowing(!IamFollowing); // Toggle to the opposite state
  };

  export default handleClickFollowing;
