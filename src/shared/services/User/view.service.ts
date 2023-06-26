import api from "..";

export const getUserDataById = (id: string) => api.get(`user/${id}`);
