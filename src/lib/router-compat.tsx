// Thin adapter so the imported pages keep their original link/navigation API
// while running on TanStack Router.
import {
  Link as TLink,
  Navigate as TNavigate,
  useLocation as tUseLocation,
  useNavigate as tUseNavigate,
  useParams as tUseParams,
  useSearch,
} from "@tanstack/react-router";
import type { ReactNode, MouseEventHandler, CSSProperties } from "react";

function split(to: string) {
  const [path, query] = to.split("?");
  const search = query ? Object.fromEntries(new URLSearchParams(query)) : undefined;
  return { path, search };
}

type LinkProps = {
  to: string;
  className?: string | undefined;
  style?: CSSProperties | undefined;
  children?: ReactNode;
  onClick?: MouseEventHandler<HTMLAnchorElement> | undefined;
  [key: string]: unknown;
};

export function Link({ to, ...rest }: LinkProps) {
  const { path, search } = split(to);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const L = TLink as any;
  return <L to={path} search={search} {...rest} />;
}

type NavLinkProps = {
  to: string;
  style?: CSSProperties | undefined;
  onClick?: MouseEventHandler<HTMLAnchorElement> | undefined;
  className?: string | ((s: { isActive: boolean }) => string);
  children?: ReactNode | ((s: { isActive: boolean }) => ReactNode);
  end?: boolean;
};

export function NavLink({ to, className, children, end, ...rest }: NavLinkProps) {
  const { pathname } = tUseLocation();
  const { path } = split(to);
  const isActive = end || path === "/" ? pathname === path : pathname === path || pathname.startsWith(path + "/");
  return (
    <Link
      to={to}
      className={typeof className === "function" ? className({ isActive }) : className}
      {...rest}
    >
      {typeof children === "function" ? children({ isActive }) : children}
    </Link>
  );
}

export function Navigate({ to, replace }: { to: string; replace?: boolean }) {
  const { path, search } = split(to);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const N = TNavigate as any;
  return <N to={path} search={search} replace={replace} />;
}

export function useParams<T extends Record<string, string | undefined>>() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (tUseParams as any)({ strict: false }) as T;
}

export function useLocation() {
  const loc = tUseLocation();
  return { pathname: loc.pathname, search: loc.searchStr, hash: loc.hash };
}

export function useNavigate() {
  const navigate = tUseNavigate();
  return (to: string, opts?: { replace?: boolean }) => {
    const { path, search } = split(to);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    navigate({ to: path, search: search ?? {}, replace: opts?.replace } as any);
  };
}

export function useSearchParams() {
  const raw = useSearch({ strict: false }) as Record<string, unknown>;
  const { pathname } = tUseLocation();
  const navigate = tUseNavigate();
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(raw ?? {})) if (v !== undefined && v !== null) params.set(k, String(v));
  const setSearchParams = (
    next: URLSearchParams | Record<string, string>,
    opts?: { replace?: boolean },
  ) => {
    const obj = next instanceof URLSearchParams ? Object.fromEntries(next) : next;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    navigate({ to: pathname, search: obj, replace: opts?.replace } as any);
  };
  return [params, setSearchParams] as const;
}
