import {INeighborhood} from "@/shared/interfaces/NeighborhoodData";
import api from "..";

export const updateNeighborhoodRequest = (data: INeighborhood) =>
  api().patch(`bairro/${data.id}`, {
    propName: "NOME",
    value: data.nome,
  });
