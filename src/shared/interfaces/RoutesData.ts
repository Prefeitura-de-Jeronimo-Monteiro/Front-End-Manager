export interface IRoutes {
  href?: string;
  title: string;
  icon?: React.ReactNode;
  children?: IRoutes[];
  open?: boolean;
}
