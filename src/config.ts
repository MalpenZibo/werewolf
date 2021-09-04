import { either } from "fp-ts";
import * as t from "io-ts";
import { pipe } from "fp-ts/function";
import { failure } from "io-ts/lib/PathReporter";
export type BuildConfig = {};

const BuildConfigCodec = t.type({}, "BuildConfig");

export const buildConfig: BuildConfig = pipe(
  BuildConfigCodec.decode(process.env),
  either.fold(
    (errors) => {
      throw new Error(failure(errors).join("\n"));
    },
    (_): BuildConfig => ({})
  )
);
