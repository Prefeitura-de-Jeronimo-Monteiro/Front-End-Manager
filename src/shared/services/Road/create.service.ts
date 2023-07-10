import { IRoad } from "@/shared/interfaces/RoadData";
import api from "..";

export const RegisterRoad = (data: IRoad) => api().post("rua/criar", data);
