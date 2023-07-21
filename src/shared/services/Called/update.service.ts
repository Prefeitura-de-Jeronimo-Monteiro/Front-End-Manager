import api from '..';

export const patchAlterarStatus = ({
  id,
  status,
}: {
  id: string;
  status: string;
}) => api().patch('chamado/status', { id, status });

export const patchAlterarPrazo = ({
  chamadoId,
  deadLineDate,
}: {
  chamadoId: string;
  deadLineDate: string;
}) => api().patch('chamado/prazo', { chamadoId, deadLineDate });
