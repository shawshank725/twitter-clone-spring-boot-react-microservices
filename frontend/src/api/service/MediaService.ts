import axios from 'axios';
import  { API_URL } from '@constants/MiscConstants';
import { getAuthHeader } from '@methods/GetHeader';

const MediaService = "media-service/media";

//UPLOADING MEDIA METHODS
export async function uploadMedia(file: File | null){
    if (file) {
        const formData = new FormData();
        formData.append("media", file);

        return await axios.post(`${API_URL}/${MediaService}/uploadMedia`, formData, {
            ...getAuthHeader(),
            headers: {
                "Content-Type": "multipart/form-data",
                ...getAuthHeader().headers
            },
        });
    }
    return null;
}


// DELETE MEDIA FROM CLOUDINARY
export async function deleteMedia(imageUrl:string){
    return await axios.post(`${API_URL}/${MediaService}/deleteMedia`, imageUrl, getAuthHeader());
}