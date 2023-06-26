import api from "..";

export const RegisterUser = (data: IRegisterData) => api.post("user", data);
