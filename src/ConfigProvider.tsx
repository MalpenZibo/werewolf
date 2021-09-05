import { option } from "fp-ts";
import { createContext, useContext } from "react";
import { Option } from "fp-ts/Option";
import { BuildConfig } from "./config";

export const BuildConfigContext = createContext<Option<BuildConfig>>(
  option.none
);

type Props = BuildConfig & {
  children: JSX.Element;
};

export function BuildConfigProvider({ basepath, children }: Props) {
  return (
    <BuildConfigContext.Provider value={option.some({ basepath })}>
      {children}
    </BuildConfigContext.Provider>
  );
}

export function useBuildConfigContext() {
  const ctx = useContext(BuildConfigContext);

  if (option.isNone(ctx)) {
    throw new Error("BuildConfigContext not provided");
  }

  return ctx.value;
}
