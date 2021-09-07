import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import { IO } from "fp-ts/IO";
import { FormattedMessage } from "react-intl";

type Props = {
  open: boolean;
  title: string;
  content: string;
  onConfirm: IO<void>;
  onCancel: IO<void>;
  confirmLabel?: string;
  cancelLabel?: string;
};

export function ConfirmationDialog(props: Props) {
  return (
    <Dialog open={props.open} onClose={props.onCancel}>
      <DialogTitle>
        <FormattedMessage id={props.title} />
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          <FormattedMessage id={props.content} />
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={props.onCancel} color="primary">
          <FormattedMessage
            id={props.cancelLabel ? props.cancelLabel : "cancel"}
          />
        </Button>
        <Button onClick={props.onConfirm} color="primary">
          <FormattedMessage
            id={props.confirmLabel ? props.confirmLabel : "ok"}
          />
        </Button>
      </DialogActions>
    </Dialog>
  );
}
