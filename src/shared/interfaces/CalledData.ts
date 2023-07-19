interface ICalled {
  atualizadoEm: string;
  bairro: string;
  cpf: string;
  create_At: string;
  descricao: string;
  email: string;
  id: string;
  imagem: string;
  nome: string;
  pontoDeReferencia: string;
  prazo: string;
  solicitacao: string;
  status: 'AGUARDANDOVALIDACAO' | 'EMANDAMENTO' | 'CONCLUIDO' | 'VALIDADO';
  telefone: string;
}
