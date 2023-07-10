import api from "..";
import {IResgister} from "@/shared/interfaces/RegisterData";

export const RegisterUser = (data: IResgister) =>
  api().post("usuario/criar", data);
