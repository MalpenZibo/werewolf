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
import { Aura, Player } from "../../domain";

type Props = {
  open: boolean;
  player: Player;
  aura: Aura;
  onClose: IO<void>;
};

export function ShowAuraDialog(props: Props) {
  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <DialogTitle>
        <FormattedMessage
          id="showAuraDialog.title"
          values={{ name: props.player.name }}
        />
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          <FormattedMessage id={props.aura === "dark" ? "dark" : "light"} />
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={props.onClose} color="primary">
          <FormattedMessage id="close" />
        </Button>
      </DialogActions>
    </Dialog>
  );
}
