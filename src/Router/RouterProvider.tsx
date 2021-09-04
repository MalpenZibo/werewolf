import {
  createContext,
  useEffect,
  useState,
  useContext,
  Dispatch,
  SetStateAction,
} from "react";
import { Option } from "fp-ts/Option";
import { option } from "fp-ts";

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
    const [location, setLocation] = useState(
      props.routing.parseLocation(window.location.pathname)
    );

    const handleLocationChanges = () => {
      setLocation(props.routing.parseLocation(window.location.pathname));
    };

    useEffect(() => {
      window.addEventListener("popstate", handleLocationChanges);

      return () => {
        window.removeEventListener("popstate", handleLocationChanges);
      };
    });

    return (
      <RouterContext.Provider
        value={option.some({ routing: props.routing, location, setLocation })}
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
