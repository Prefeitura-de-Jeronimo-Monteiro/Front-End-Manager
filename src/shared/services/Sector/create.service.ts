import { ISector } from '@/shared/interfaces/SectorData';
import api from '..';

export const RegisterSector = (data: ISector) =>
  api().post('setor/criar', data);
