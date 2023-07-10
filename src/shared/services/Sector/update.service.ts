import {ISector} from "@/shared/interfaces/SectorData";
import api from "..";

export const updateSectorRequest = (data: ISector) =>
  api().patch(`setor/${data.id}`, {
    propName: "NOME",
    value: data.nome,
  });
