import { IRoutes } from "@/shared/interfaces/RoutesData";
import { CaretRight } from "@phosphor-icons/react";
import Link from "next/link";
import { Fragment } from "react";

interface RouteData extends IRoutes {
  onClick?: () => void;
}

const Routes = ({ href, title, icon, onClick }: RouteData) => {
  return (
    <>
      <li className="select-none">
        {href ? (
          <Link href={href} className="flex items-center gap-2">
            {icon} {title}
          </Link>
        ) : (
          <span
            className="flex items-center cursor-pointer justify-between"
            onClick={onClick}
          >
            <span className="flex items-center gap-2">
              {icon} {title}
            </span>
            <span className="mr-4">
              <CaretRight />
            </span>
          </span>
        )}
      </li>
      <hr />
    </>
  );
};

export const NestedRoutes = ({
  routes,
  onToggleOpen,
}: {
  routes: IRoutes[];
  onToggleOpen: (title: string) => void;
}) => {
  return (
    <ul className="space-y-2 ml-2 py-2">
      {routes.map((route) => (
        <Fragment key={route.title}>
          {route.children ? (
            <Routes
              title={route.title}
              icon={route.icon}
              href={route.href}
              onClick={() => onToggleOpen(route.title)}
            />
          ) : (
            <Routes href={route.href} title={route.title} icon={route.icon} />
          )}
          {route.children && route.open ? (
            <li className="ml-8">
              <NestedRoutes
                routes={route.children}
                onToggleOpen={onToggleOpen}
              />
            </li>
          ) : null}
        </Fragment>
      ))}
    </ul>
  );
};
