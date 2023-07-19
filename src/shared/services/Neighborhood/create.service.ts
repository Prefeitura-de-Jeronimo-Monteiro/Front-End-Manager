import { INeighborhood } from '@/shared/interfaces/NeighborhoodData';
import api from '..';

export const RegisterNeighborhood = (data: INeighborhood) =>
  api().post('bairro/criar', data);
