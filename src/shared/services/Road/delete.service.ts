import api from '..';

export const DeleteRoadRequest = (id: string) =>
  api().delete(`rua/deletar/${id}`);
