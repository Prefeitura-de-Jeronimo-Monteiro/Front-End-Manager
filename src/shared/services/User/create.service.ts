import api from "..";

export const RegisterUser = (data) => api().post("user", data);
