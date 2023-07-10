import {IRoad} from "@/shared/interfaces/RoadData";
import api from "..";

export const updateRoadRequest = (data: IRoad) =>
  api().patch(`rua/${data.id}`, {
    propName: "NOME",
    value: data.nome,
  });
