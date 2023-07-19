import api from '..';

export const DeleteNeighborhoodRequest = (id: string) =>
  api().delete(`bairro/deletar/${id}`);
