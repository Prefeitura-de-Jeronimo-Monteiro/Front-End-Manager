import api from '..';

interface TrocaSenhaProps {
  senhaNova: string;
  idUsuario: string;
}

export const updatePassword = (data: TrocaSenhaProps) =>
  api().patch('usuario/trocasenha', data);
