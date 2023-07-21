import {
  Broom,
  Checks,
  ClockCountdown,
  ThumbsUp,
  User,
} from '@phosphor-icons/react';
import { ICalled } from '../interfaces/CalledData';

export interface CardInfo {
  id: string;
  title: string;
  description: string;
  value: number;
  status: string;
  icon: React.ReactNode;
}

export const filterValue = (data: ICalled[]) => {
  const cardInfos: CardInfo[] = [
    {
      id: '1',
      title: 'Aguardando Validação',
      description: 'Chamados que estão com prazo excedido',
      value: 0,
      status: 'AGUARDANDOVALIDACAO',
      icon: <ClockCountdown size={24} />,
    },
    {
      id: '2',
      title: 'Validado',
      description: 'Chamados que estão validados e prontos para iniciar',
      value: 0,
      status: 'VALIDADO',
      icon: <ThumbsUp size={32} />,
    },
    {
      id: '3',
      title: 'Em Andamento',
      description: 'Chamados que estão com prazo não excedido',
      value: 0,
      status: 'EMANDAMENTO',
      icon: <Broom size={24} />,
    },
    {
      id: '4',
      title: 'Concluídos',
      description: 'Chamados concluidos (somente para verificação)',
      value: 0,
      status: 'CONCLUIDO',
      icon: <Checks size={24} />,
    },
  ];

  const statusValidate = [
    'AGUARDANDOVALIDACAO',
    'EMANDAMENTO',
    'CONCLUIDO',
    'VALIDADO',
  ];

  let array1: { status: string; value: number }[] = [];

  statusValidate.forEach((element) => {
    const a = data.filter((item) => item.status === element.toString());
    array1.push({ status: element.toString(), value: a.length });
  });

  let mergedArray: CardInfo[] = cardInfos.map((cardInfo) => {
    const matchingObj = array1.find((item) => item.status === cardInfo.status);
    if (matchingObj) {
      return {
        ...cardInfo,
        value: cardInfo.value + matchingObj.value,
      };
    }
    return cardInfo;
  });

  return mergedArray;
};
