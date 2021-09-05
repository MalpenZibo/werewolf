import {
  AppBar,
  Box,
  createStyles,
  Fab,
  Grid,
  IconButton,
  makeStyles,
  Theme,
  Toolbar,
  Typography,
} from "@material-ui/core";
import ArrowBackSharp from "@material-ui/icons/ArrowBackSharp";
import { FormattedMessage } from "react-intl";
import { Player } from "../domain";
import { locations, useRouter } from "../routing";
import { useLocalStorageState } from "../useLocalStorageState";
import * as t from "io-ts";
import { PlayerCard } from "../blocks/PlayerCard";
import { array } from "fp-ts";
import { pipe } from "fp-ts/function";
import AddIcon from "@material-ui/icons/Add";
import { PlayerForm } from "../blocks/PlayerForm";
import { useState } from "react";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fab: {
      position: "absolute",
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    },
  })
);

export function Players() {
  const classes = useStyles();
  const router = useRouter();

  const [players, setPlayers] = useLocalStorageState(
    "players",
    t.array(Player),
    []
  );

  const [playerFormOpen, setPlayerFormOpen] = useState(false);

  return (
    <Box display="flex" width={1} flexDirection="column" alignItems="center">
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => router.navigateTo(locations.home)}
          >
            <ArrowBackSharp />
          </IconButton>
          <Box display="flex" width={1}>
            <Typography variant="h6">
              <FormattedMessage id="players" />
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        display="flex"
        m={2}
        width={1}
        flexDirection="row"
        alignItems="center"
      >
        <Grid
          container
          direction="row"
          spacing={2}
          justifyContent="center"
          alignItems="center"
        >
          {players.map((p) => (
            <PlayerCard
              player={p}
              onDelete={() =>
                setPlayers(
                  pipe(
                    players,
                    array.filter((m) => m.name !== p.name)
                  )
                )
              }
            />
          ))}
        </Grid>
        <Fab
          color="primary"
          aria-label="add"
          className={classes.fab}
          onClick={() => setPlayerFormOpen(true)}
        >
          <AddIcon />
        </Fab>
        {playerFormOpen && (
          <PlayerForm
            open={playerFormOpen}
            title="player.form.label.title"
            playerNames={pipe(
              players,
              array.map((p) => p.name)
            )}
            onCancel={() => setPlayerFormOpen(false)}
            onConfirm={(name) => {
              setPlayers([...players, { name }]);
              setPlayerFormOpen(false);
            }}
          />
        )}
      </Box>
    </Box>
  );
}
