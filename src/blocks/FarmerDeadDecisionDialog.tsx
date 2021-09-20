import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
} from "@material-ui/core";
import { IO } from "fp-ts/IO";
import { useState } from "react";
import { FormattedMessage } from "react-intl";
import { Player } from "../domain";

type Props = {
  player: Player;
  onHero: IO<void>;
  onNormal: IO<void>;
  onWolf: IO<void>;
};

export function FarmerDeadDecisionDialog(props: Props) {
  const [showWolves, setShowWolves] = useState(false);

  return (
    <Dialog open={true}>
      <DialogTitle>
        <FormattedMessage
          id="farmerDeadDialog.title"
          values={{ name: props.player.name }}
        />
      </DialogTitle>
      <DialogContent>
        {!showWolves ? (
          <Box display="flex" width={1} flexDirection="column">
            <Button onClick={props.onNormal} color="primary">
              <FormattedMessage id="farmerDeadDialog.killButton" />
            </Button>
            <Button onClick={props.onHero} color="primary">
              <FormattedMessage id="farmerDeadDialog.heroButton" />
            </Button>
            <Button onClick={() => setShowWolves(true)} color="primary">
              <FormattedMessage id="farmerDeadDialog.wolfDescendant" />
            </Button>
          </Box>
        ) : (
          <Box display="flex" width={1} flexDirection="column">
            <Typography variant="h6">
              <FormattedMessage
                id="farmerDeadDialog.showWolves"
                values={{ name: props.player.name }}
              />
            </Typography>
            <Button onClick={props.onWolf} color="primary">
              <FormattedMessage id="close" />
            </Button>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
