import { GetServerSidePropsContext } from 'next';
import api from '..';

export const getChamados = (ctx?: GetServerSidePropsContext) =>
  api(ctx).get('chamado');

export const getChamadoById = ({
  ctx,
  id,
}: {
  ctx?: GetServerSidePropsContext;
  id: string | string[] | undefined;
}) => api(ctx).get(`chamado/${id}`);

export const getChamadoByStatus = (status: string) =>
  api().get(`chamado?status=${status}`);
