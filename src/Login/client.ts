import axios from "axios";

const axiosWithCredentials = axios.create({ withCredentials: true });
export const USERS_API = `http://localhost:8080/api/users`;

export const signin = async (credentials: any) => {
    const response = await axiosWithCredentials.post(`${USERS_API}/signin`, credentials);
    return response.data;
}

export const signup = async (credentials: any) => {
    const response = await axiosWithCredentials.post(`${USERS_API}/signup`, credentials);
    return response.data;
}

export const fetchCurrentUser = async () => {
    const response = await axiosWithCredentials.get(`${USERS_API}/current`);
    return response.data;
}