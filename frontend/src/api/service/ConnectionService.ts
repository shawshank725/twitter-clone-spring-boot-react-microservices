import axios, { type AxiosResponse } from 'axios';
import  { API_URL } from '@constants/MiscConstants';
import type { NewConnectionEntity } from '@/types/Connections/ConnectionEntity';
import type { FollowerFolloweeDTO } from '@/types/Connections/FollowerFolloweeDTO';
import { getAuthHeader } from '@methods/GetHeader';

const ConnectionService = "connection-service";
const ConnectionEndpoint = "connection";
const addConnectionEndpoint = "addConnection";
const deleteConnectionEntityByFollowerAndFolloweeId = "deleteConnectionByFollowerAndFolloweeId";
const getUsersConnectionEndpoint = "getUserConnections";

export async function addConnection(newConnectionEntity: NewConnectionEntity){
    return await axios.post(
        `${API_URL}/${ConnectionService}/${ConnectionEndpoint}/${addConnectionEndpoint}`, 
        newConnectionEntity,
        getAuthHeader()
    );
}

export async function deleteConnectionByBothIds(followeeId: number , followerId: number){
    return await axios.post(`${API_URL}/${ConnectionService}/${ConnectionEndpoint}/${deleteConnectionEntityByFollowerAndFolloweeId}`, 
        null,
        {
        ...getAuthHeader(),
        params: { followerId, followeeId }
        }
    );
}

export async function getUsersConnection(userId: number): Promise<AxiosResponse<FollowerFolloweeDTO>>{
    return await axios.get(`${API_URL}/${ConnectionService}/${ConnectionEndpoint}/${getUsersConnectionEndpoint}`, 
        {
            ...getAuthHeader(),
            params: { userId }
        }
    );
}
