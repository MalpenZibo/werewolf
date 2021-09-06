import {
  createContext,
  useEffect,
  useState,
  useContext,
  Dispatch,
  SetStateAction,
} from "react";
import { Option } from "fp-ts/Option";
import { array, option, string, nonEmptyArray } from "fp-ts";
import { constant, pipe } from "fp-ts/function";

interface ILocation {
  readonly _tag: string;
}

interface ILocationFoldable<K extends string> {
  readonly _tag: K;
}

export function foldLocation<
  K extends string,
  T extends ILocationFoldable<K>,
  R
>(
  matches: {
    [L in T["_tag"]]: (args: Omit<Extract<T, { _tag: L }>, "_tag">) => R;
  }
): (location: T) => R {
  return (location) => matches[location._tag](location as any);
}

export type Routing<T extends ILocation> = {
  formatLocation: (l: T) => string;
  parseLocation: (s: string) => T;
};

type Props<T extends ILocation> = {
  routing: Routing<T>;
  basepath: Option<string>;
  children: JSX.Element;
};

export function initializeRouter<T extends ILocation>() {
  const RouterContext = createContext<
    Option<{
      routing: Routing<T>;
      location: T;
      setLocation: Dispatch<SetStateAction<T>>;
    }>
  >(option.none);

  const RouterProvider = (props: Props<T>) => {
    const skipN = pipe(
      props.basepath,
      option.map((b) => b.split("/").length + 1),
      option.getOrElse(constant(0))
    );

    const getPathname = () =>
      "/" +
      pipe(
        window.location.pathname,
        string.split("/"),
        nonEmptyArray.fromReadonlyNonEmptyArray,
        array.dropLeft(skipN)
      ).join("/");

    const [location, setLocation] = useState(
      props.routing.parseLocation(getPathname())
    );

    const handleLocationChanges = () => {
      setLocation(props.routing.parseLocation(getPathname()));
    };

    useEffect(() => {
      window.addEventListener("popstate", handleLocationChanges);

      return () => {
        window.removeEventListener("popstate", handleLocationChanges);
      };
    });

    const formatLocation = (l: T) => {
      const formatted = props.routing.formatLocation(l);
      return (
        pipe(
          props.basepath,
          option.map((b) => "/" + b),
          option.getOrElse(constant(""))
        ) + formatted
      );
    };

    const internalRouting = {
      parseLocation: props.routing.parseLocation,
      formatLocation,
    };

    return (
      <RouterContext.Provider
        value={option.some({ routing: internalRouting, location, setLocation })}
      >
        {props.children}
      </RouterContext.Provider>
    );
  };

  const useRouter = () => {
    const ctx = useContext(RouterContext);

    if (option.isNone(ctx)) {
      throw new Error("RouterContext not provided");
    }

    const navigateTo = (location: T) => {
      const newLocation = ctx.value.routing.formatLocation(location);
      console.log(newLocation);
      window.history.pushState(null, "", newLocation);
      window.scrollTo(0, 0);
      ctx.value.setLocation(location);
    };

    const back = () => {
      window.history.back();
    };

    return { current: ctx.value.location, navigateTo, back };
  };

  return { RouterProvider, useRouter };
}
