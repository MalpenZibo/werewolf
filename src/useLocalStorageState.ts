import { either, json, option } from "fp-ts";
import { flow, pipe } from "fp-ts/function";
import { Type } from "io-ts";
import { failure } from "io-ts/lib/PathReporter";
import { useState } from "react";

export function useLocalStorageState<T, TT>(
  key: string,
  codec: Type<T, TT>,
  value: T
): [T, (value: T) => void] {
  const setLocalStorage = (value: T) =>
    pipe(
      value,
      codec.encode,
      json.stringify,
      either.bimap(
        (e) => {
          console.error(e);
          return e;
        },
        (encodedValue) => localStorage.setItem(key, encodedValue)
      )
    );

  const initValues = pipe(
    localStorage.getItem(key),
    option.fromNullable,
    option.chain(
      flow(
        json.parse,
        either.mapLeft((e) => {
          console.error("Json parse error: ", e);
          return e;
        }),
        either.chainW(
          flow(
            codec.decode,
            either.mapLeft((e) => {
              console.error("Decoding error: ", failure(e).join("\n"));
              return e;
            })
          )
        ),
        option.fromEither
      )
    ),
    option.getOrElse(() => {
      setLocalStorage(value);
      return value;
    })
  );

  const [reactState, setReactState] = useState(initValues);

  const setState = (value: T) =>
    pipe(
      setLocalStorage(value),
      either.fold(
        () => {},
        () => setReactState(value)
      )
    );

  return [reactState, setState];
}
