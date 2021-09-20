import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  IconButton,
  Typography,
} from "@material-ui/core";
import { Player } from "../domain";
import DeleteIcon from "@material-ui/icons/Delete";
import { IO } from "fp-ts//IO";
import { useState } from "react";
import { ConfirmationDialog } from "./Common/ConfirmationDialog";
import { FormattedMessage } from "react-intl";

type Props = {
  player: Player;
  onDelete: IO<void>;
};

export function PlayerCard(props: Props) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  return (
    <Grid item xs={6} sm={4} md={3} lg={2}>
      <Card>
        <CardMedia></CardMedia>
        <CardContent>
          <Typography gutterBottom variant="h5">
            {props.player.name}
          </Typography>
        </CardContent>
        <CardActions disableSpacing>
          <IconButton
            aria-label="delete"
            onClick={() => setDeleteDialogOpen(true)}
          >
            <DeleteIcon />
          </IconButton>
        </CardActions>
      </Card>
      <ConfirmationDialog
        open={deleteDialogOpen}
        title={<FormattedMessage id="player.delete.confirmDialog.title" />}
        content={<FormattedMessage id="player.delete.confirmDialog.content" />}
        onConfirm={() => {
          setDeleteDialogOpen(false);
          props.onDelete();
        }}
        onCancel={() => setDeleteDialogOpen(false)}
      />
    </Grid>
  );
}
