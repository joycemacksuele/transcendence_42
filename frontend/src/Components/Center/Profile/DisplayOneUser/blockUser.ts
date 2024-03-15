import axiosInstance from "../../../Other/AxiosInstance";
import axios from "axios";



async function handleClickBlocking(userIdToBlock: number,
	isBlocked: boolean,
	setIsBlocked: React.Dispatch<React.SetStateAction<boolean>>) {
		console.log("User id [", userIdToBlock, "] is about to be blocked / unblocked");
		if (!userIdToBlock) {
			console.error("User ID to block is undefined.");
			return;
		}

		try {
			const response = await axiosInstance.post('/blockship/block-user', {
				'id-to-block': userIdToBlock
			});
		if (response.data.success) {
			setIsBlocked(!isBlocked);
			console.log("This user is now blocked / unblocked.", response.data.message);
		} else {
			console.error("Error block/unblock user: ", response.data.message);
		}
		} catch (error: any) {
			console.error("Error blocking a user: " /*, error*/);
			if (axios.isAxiosError(error)) {
				const message = error.response?.data?.message ||
					"An axios error occurred while blocking a user.";
				console.error(message);
		} else {
			console.error("Another (non axios) error occured while blocking a user.");
		}
	}
};

export default handleClickBlocking;