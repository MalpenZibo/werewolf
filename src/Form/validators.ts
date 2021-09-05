import { useIntl } from "react-intl";
import { Validator, validators } from "@buildo/formo";
import { constant, pipe } from "fp-ts/function";
import { array, either, option } from "fp-ts";
import { NonEmptyString } from "io-ts-types/NonEmptyString";

export const nonBlankString = (
  errorMessage: string
): Validator<string, NonEmptyString, string> =>
  validators.validator(
    either.fromPredicate(
      (s): s is NonEmptyString => s.trim().length > 0,
      constant(errorMessage)
    )
  );

export const uniqueString =
  (
    errorMessage: string
  ): ((
    collection: NonEmptyString[]
  ) => Validator<string, NonEmptyString, string>) =>
  (collection: NonEmptyString[]) =>
    validators.validator(
      either.fromPredicate(
        (s): s is NonEmptyString =>
          pipe(
            collection,
            array.findFirst((p) => p === s),
            option.isNone
          ),
        constant(errorMessage)
      )
    );

export function useValidators() {
  const intl = useIntl();

  const defined = <T>() =>
    validators.defined<T, string>(
      intl.formatMessage({ id: "form.validators.defined" })
    );

  const definedNoExtract = <T>() =>
    validators.definedNoExtract<T, string>(
      intl.formatMessage({ id: "form.validators.defined" })
    );

  const nonBlankStringInternal = nonBlankString(
    intl.formatMessage({ id: "form.validators.nonBlankString" })
  );

  const uniqueStringInternal = uniqueString(
    intl.formatMessage({ id: "form.validators.uniqueString" })
  );

  return {
    nonBlankString: nonBlankStringInternal,
    uniqueString: uniqueStringInternal,
    defined,
    definedNoExtract,
  };
}
