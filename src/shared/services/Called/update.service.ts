import api from '..';

export const patchAlterarStatus = ({
  id,
  status,
}: {
  id: string;
  status: string;
}) => api().patch('chamado/status', { id, status });
