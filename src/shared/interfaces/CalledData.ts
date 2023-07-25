import { IBairro } from './BairroData';
import { ISolicitacao } from './SolicitacaoData';

export interface ICalled {
  atualizadoEm: string;
  bairro: IBairro;
  cpf: string;
  create_At: string;
  descricao: string;
  email: string;
  id: string;
  imagem: string;
  nome: string;
  pontoDeReferencia: string;
  prazo: string;
  solicitacao: ISolicitacao;
  status:
    | 'AGUARDANDOVALIDACAO'
    | 'EMANDAMENTO'
    | 'CONCLUIDO'
    | 'VALIDADO'
    | 'INVALIDADO';
  telefone: string;
}
