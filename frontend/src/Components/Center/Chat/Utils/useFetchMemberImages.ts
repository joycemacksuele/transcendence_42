import { useEffect, useState } from 'react';
import axiosInstance from '../../../Other/AxiosInstance';


// Jaka:  Getting profile images of all members
//        to display little icons in front of the name 
//        (Could be improved by just get the path instead of the whole User)

const getUserImage = async (intraName: string | undefined) => {
  if (!intraName)
      return null; // Early return for undefined  
  try {
    const response = await axiosInstance.get(`/users/get-user/${intraName}`);
    return response.data.profileImage;
  } catch (error) {
    console.error('Error getting member profile image: ', error);
    return null;
  }
}

const useFetchMemberImages = (usersIntraName: string[] | undefined) => {
	const [userImages, setUserImages] = useState<string[]>([]);

  useEffect(() => {
    if (usersIntraName) {
      const fetchImages = async () => {
        // Loop and collect all image paths into array
        const imagesPromises = usersIntraName.map(async (member) => {
          try {
            const imageUrl = await getUserImage(member);
            // console.log('       Member: ' + member + 'imageUrl: ' + imageUrl);
            return imageUrl;
          } catch (error) {
            console.error('Error fetching image for member', member, error);
            return null; // Or return a default image in case of error
          }
        });
        // Wait for all imageUrls to be returned from above .map()
        const images = await Promise.all(imagesPromises);
        setUserImages(images); // Update state with the fetched image URLs
        // console.log('       Images: ' + images);
      };

      fetchImages();
    }
  }, [usersIntraName]);

  return userImages;
}

export default useFetchMemberImages;