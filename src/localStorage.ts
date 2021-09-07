import { Type } from "io-ts";
import { Option } from "fp-ts/Option";
import { flow, pipe } from "fp-ts/function";
import { either, json, option } from "fp-ts";
import { failure } from "io-ts/lib/PathReporter";
import { Either } from "fp-ts/Either";

export function getValue<T, TT>(key: string, codec: Type<T, TT>): Option<T> {
  return pipe(
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
    )
  );
}

export function setValue<T, TT>(
  key: string,
  codec: Type<T, TT>,
  value: T
): Either<unknown, void> {
  return pipe(
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
}
