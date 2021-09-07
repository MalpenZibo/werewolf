import { either, option } from "fp-ts";
import { pipe } from "fp-ts/function";
import { Type } from "io-ts";
import { useState } from "react";
import { getValue, setValue } from "./localStorage";

export function useLocalStorageState<T, TT>(
  key: string,
  codec: Type<T, TT>,
  value: T
): [T, (value: T) => void] {
  const initValues = pipe(
    getValue(key, codec),
    option.getOrElse(() => {
      setValue(key, codec, value);
      return value;
    })
  );

  const [reactState, setReactState] = useState(initValues);

  const setState = (value: T) =>
    pipe(
      setValue(key, codec, value),
      either.fold(
        () => {},
        () => setReactState(value)
      )
    );

  return [reactState, setState];
}
