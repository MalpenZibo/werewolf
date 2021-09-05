import { either } from "fp-ts";
import * as t from "io-ts";
import { pipe } from "fp-ts/function";
import { failure } from "io-ts/lib/PathReporter";
import { optionFromNullable } from "io-ts-types/optionFromNullable";
import { NonEmptyString } from "io-ts-types/NonEmptyString";
import { Option } from "fp-ts/Option";

export type BuildConfig = {
  basepath: Option<NonEmptyString>;
};

const BuildConfigCodec = t.type(
  {
    REACT_APP_BASEPATH: optionFromNullable(NonEmptyString),
  },
  "BuildConfig"
);

export const buildConfig: BuildConfig = pipe(
  BuildConfigCodec.decode(process.env),
  either.fold(
    (errors) => {
      throw new Error(failure(errors).join("\n"));
    },
    (env): BuildConfig => ({
      basepath: env.REACT_APP_BASEPATH,
    })
  )
);
