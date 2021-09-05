import { FieldProps } from "@buildo/formo";
import { TextField as InternalTextField } from "@material-ui/core";
import { nonEmptyArray, option } from "fp-ts";
import { pipe } from "fp-ts/function";
import { NonEmptyArray } from "fp-ts/NonEmptyArray";

type Props = FieldProps<string, string, NonEmptyArray<string>> & {
  placeholder: string;
};

export function TextField(props: Props) {
  return (
    <InternalTextField
      fullWidth
      label={props.label}
      defaultValue={props.placeholder}
      disabled={props.disabled}
      onChange={(e) => props.onChange(e.currentTarget.value)}
      onBlur={props.onBlur}
      value={props.value}
      name={props.name}
      error={pipe(props.issues, option.isSome)}
      helperText={pipe(
        props.issues,
        option.map((issues) => pipe(issues, nonEmptyArray.head)),
        option.toNullable
      )}
    />
  );
}
