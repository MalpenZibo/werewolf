import {
  AppBar,
  Box,
  IconButton,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { ArrowBackSharp } from "@material-ui/icons";
import { option } from "fp-ts";
import { constant, pipe } from "fp-ts/function";
import { useReducer } from "react";
import { FormattedMessage } from "react-intl";
import { ConfirmationDialog } from "../blocks/Common/ConfirmationDialog";
import { Night } from "../blocks/Night";
import { SelectPlayers } from "../blocks/SelectPlayers";
import { ShowRole } from "../blocks/ShowRole";
import { GameData } from "../domain";
import { getValue } from "../localStorage";
import { locations, useRouter } from "../routing";
import { foldStatus, reducer, State } from "./GameState";

export function Game() {
  const router = useRouter();

  const [state, dispatch] = useReducer(
    reducer,
    pipe(
      getValue("gameData", GameData),
      option.fold<GameData, State>(
        constant({ view: "selectPlayers" }),
        (gameData) => ({
          view: "init",
          gameData: gameData,
        })
      )
    )
  );

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
        {pipe(
          state,
          foldStatus({
            whenInit: (_gameData) => (
              <ConfirmationDialog
                open
                title="game.resumeGame.title"
                content="game.resumeGame.content"
                onConfirm={() => {}}
                onCancel={() => {
                  localStorage.removeItem("gameData");
                  dispatch({ type: "startFreshGame" });
                }}
                confirmLabel="game.resumeGame.confirm"
                cancelLabel="game.resumeGame.cancel"
              />
            ),
            whenSelectPlayers: constant(
              <SelectPlayers
                onNext={(players) =>
                  dispatch({ type: "assignRoleToPlayer", payload: players })
                }
              />
            ),
            whenShowRole: (playersData) => (
              <ShowRole
                playersData={playersData}
                onStartGame={() => dispatch({ type: "startNight" })}
              />
            ),
            whenNight: (playersData, nightNumber) => (
              <Night
                playersData={playersData}
                nightNumber={nightNumber}
                onDiscussion={() => {}}
              />
            ),
          })
        )}
      </Box>
    </Box>
  );
}
