import { Buildings, ChartPieSlice, Gauge, User } from "@phosphor-icons/react";
import { IRoutes } from "../interfaces/RoutesData";

export const RoutesProps: IRoutes[] = [
  { title: "Dashboard", href: "/", icon: <Gauge size={32} /> },
  {
    title: "Setor",
    icon: <Buildings size={32} />,
    children: [{ title: "Criar", href: "sector/create" }],
    open: false,
  },
  { title: "Funcionários", href: "user", icon: <User size={32} /> },
  { title: "Relatórios", href: "report", icon: <ChartPieSlice size={32} /> },
];
