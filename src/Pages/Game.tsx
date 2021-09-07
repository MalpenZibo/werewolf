import {
  AppBar,
  Box,
  IconButton,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { ArrowBackSharp } from "@material-ui/icons";
import { constant, pipe } from "fp-ts/function";
import { useReducer } from "react";
import { FormattedMessage } from "react-intl";
import { SelectPlayers } from "../blocks/SelectPlayers";
import { ShowRole } from "../blocks/ShowRole";
import { locations, useRouter } from "../routing";
import { foldStatus, reducer } from "./GameState";

export function Game() {
  const router = useRouter();

  const [state, dispatch] = useReducer(reducer, { view: "selectPlayers" });

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
            whenSelectPlayers: constant(
              <SelectPlayers
                onNext={(players) =>
                  dispatch({ type: "assignRoleToPlayer", payload: players })
                }
              />
            ),
            whenShowRole: (playerRoles) => (
              <ShowRole playerRoles={playerRoles} />
            ),
          })
        )}
      </Box>
    </Box>
  );
}
