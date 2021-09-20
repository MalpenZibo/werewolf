import { Button, Dialog, DialogActions, DialogTitle } from "@material-ui/core";
import { IO } from "fp-ts/IO";
import { FormattedMessage } from "react-intl";
import { Player } from "../../domain";

type Props = {
  open: boolean;
  player: Player;
  mystical: boolean;
  onClose: IO<void>;
};

export function ShowMysticalDialog(props: Props) {
  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <DialogTitle>
        <FormattedMessage
          id={
            props.mystical
              ? "showMysticalDialog.mystical"
              : "showMysticalDialog.nonMystical"
          }
          values={{ name: props.player.name }}
        />
      </DialogTitle>
      <DialogActions>
        <Button autoFocus onClick={props.onClose} color="primary">
          <FormattedMessage id="close" />
        </Button>
      </DialogActions>
    </Dialog>
  );
}
