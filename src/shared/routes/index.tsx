import {Buildings, ChartPieSlice, Gauge, RoadHorizon, TrafficSign, User,} from "@phosphor-icons/react";
import {IRoutes} from "../interfaces/RoutesData";

export const RoutesProps: IRoutes[] = [
  {title: "Dashboard", href: "/", icon: <Gauge size={32}/>},
  {title: "Setor", href: "sector", icon: <Buildings size={32}/>},
  {title: "Funcionários", href: "user", icon: <User size={32}/>},
  {
    title: "Relatórios",
    icon: <ChartPieSlice size={32}/>,
    children: [
      {title: "Teste", href: "report", icon: <ChartPieSlice size={28}/>},
    ],
    open: false,
  },
  {title: "Rua", href: "road", icon: <TrafficSign size={32}/>},
  {title: "Bairro", href: "neighborhood", icon: <RoadHorizon size={32}/>},
];
