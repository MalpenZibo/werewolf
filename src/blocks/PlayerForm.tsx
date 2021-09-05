import { useFormo, validators } from "@buildo/formo";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";
import { IO } from "fp-ts/IO";
import { Reader } from "fp-ts/Reader";
import { NonEmptyString } from "io-ts-types/lib/NonEmptyString";
import { FormattedMessage, useIntl } from "react-intl";
import { TextField } from "../Form/TextField";
import { useValidators } from "../Form/validators";
import { taskEither } from "fp-ts";

type Props = {
  open: boolean;
  title: string;
  playerNames: NonEmptyString[];
  onConfirm: Reader<NonEmptyString, void>;
  onCancel: IO<void>;
};

export function PlayerForm(props: Props) {
  const { formatMessage } = useIntl();
  const { nonBlankString, uniqueString } = useValidators();

  const { fieldProps, handleSubmit } = useFormo(
    {
      initialValues: {
        name: "",
      },
      fieldValidators: () => ({
        name: validators.inParallel(
          nonBlankString,
          uniqueString(props.playerNames)
        ),
      }),
    },
    {
      onSubmit: (values) =>
        taskEither.fromIO(() => props.onConfirm(values.name)),
    }
  );

  return (
    <Dialog open={props.open} fullWidth onClose={props.onCancel}>
      <DialogTitle>
        <FormattedMessage id={props.title} />
      </DialogTitle>
      <DialogContent>
        <TextField
          label={formatMessage({
            id: "player.form.label.name",
          })}
          placeholder=""
          {...fieldProps("name")}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onCancel} color="primary">
          <FormattedMessage id="cancel" />
        </Button>
        <Button onClick={handleSubmit} color="primary">
          <FormattedMessage id="ok" />
        </Button>
      </DialogActions>
    </Dialog>
  );
}
