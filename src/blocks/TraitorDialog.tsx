import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
} from "@material-ui/core";
import { IO } from "fp-ts/IO";
import { FormattedMessage } from "react-intl";
import { Player } from "../domain";

type Props = {
  player: Player;
  onClose: IO<void>;
};

export function TraitorDialog(props: Props) {
  return (
    <Dialog open={true}>
      <DialogTitle>
        <FormattedMessage
          id="farmerDeadDialog.title"
          values={{ name: props.player.name }}
        />
      </DialogTitle>
      <DialogContent>
        <Box display="flex" width={1} flexDirection="column">
          <Typography variant="h6">
            <FormattedMessage
              id="traitorDialog.showWolves"
              values={{ name: props.player.name }}
            />
          </Typography>
          <Button onClick={props.onClose} color="primary">
            <FormattedMessage id="close" />
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
