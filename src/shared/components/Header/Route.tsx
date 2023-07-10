import {IRoutes} from "@/shared/interfaces/RoutesData";
import {CaretRight} from "@phosphor-icons/react";
import Link from "next/link";
import {Fragment} from "react";

interface RouteData extends IRoutes {
  onClick?: () => void;
  onClose?: () => void;
}

const Routes = ({href, title, icon, onClick, onClose, open}: RouteData) => {
  return (
    <>
      <li className="select-none">
        {href ? (
          <Link
            href={href}
            className="flex items-center gap-2"
            onClick={onClose}
          >
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
              <CaretRight
                className={`${open ? "rotate-90" : ""} transition-all`}
              />
            </span>
          </span>
        )}
      </li>
      <hr/>
    </>
  );
};

export const NestedRoutes = ({
                               routes,
                               onToggleOpen,
                               onClose,
                             }: {
  routes: IRoutes[];
  onToggleOpen: (title: string) => void;
  onClose?: () => void;
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
              onClick={() => {
                onToggleOpen(route.title);
              }}
              open={route.open}
            />
          ) : (
            <Routes
              href={route.href}
              title={route.title}
              icon={route.icon}
              onClose={onClose}
            />
          )}
          {route.children && route.open ? (
            <li className="ml-8">
              <NestedRoutes
                routes={route.children}
                onToggleOpen={onToggleOpen}
                onClose={onClose}
              />
            </li>
          ) : null}
        </Fragment>
      ))}
    </ul>
  );
};
