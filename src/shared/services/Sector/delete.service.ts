import api from '..';

export const DeleteSectorRequest = (id: string) =>
  api().delete(`setor/deletar/${id}`);
