import axios from "axios";

const axiosWithCredentials = axios.create({ withCredentials: true });
export const PANTRY_API = `http://localhost:8080/api/pantry`;

export const createPantry = async (pantryItem: any) => {
    const response = await axiosWithCredentials.post(`${PANTRY_API}`, pantryItem);
    return response.data;
}

export const getPantry = async () => {
    const response = await axiosWithCredentials.get(`${PANTRY_API}`);
    return response.data;
}

export const updatePantry = async (pantryItemId: number, pantryItem: any) => {
    const response = await axiosWithCredentials.put(`${PANTRY_API}/${pantryItemId}`, pantryItem);
    return response.data;
}

export const deletePantry = async (pantryItemId: number) => {
    const response = await axiosWithCredentials.delete(`${PANTRY_API}/${pantryItemId}`);
    return response.data;
}

