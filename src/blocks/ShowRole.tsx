import { Box, Button, Grid, Typography } from "@material-ui/core";
import { array, option } from "fp-ts";
import { constant, pipe } from "fp-ts/function";
import { IO } from "fp-ts/IO";
import { useState } from "react";
import { FormattedMessage } from "react-intl";
import { Player, Role } from "../domain";
import { RoleCard } from "./RoleCard";

type Props = {
  playerRoles: { player: Player; role: Role }[];
  onStartGame: IO<void>;
};

export function ShowRole(props: Props) {
  const [index, setIndex] = useState(0);

  const currentPlayerRole = pipe(props.playerRoles, array.lookup(index));

  const minLimit = index === 0;
  const maxLimit = index === props.playerRoles.length;

  return (
    <Box display="flex" width={1} alignItems="center" flexDirection="column">
      <Box mt={2}>
        <Typography variant="h5">
          <FormattedMessage id="game.showRole.title" />
        </Typography>
      </Box>
      <Box mt={2}>
        {pipe(
          currentPlayerRole,
          option.fold(
            constant(
              <Typography variant="h6">
                <FormattedMessage id="game.showRole.finish" />
              </Typography>
            ),
            (playerRole) => (
              <Box display="flex" flexDirection="column" alignItems="center">
                <Box mb={2}>
                  <Typography variant="h6">{playerRole.player.name}</Typography>
                </Box>
                <Box display="flex" width={1}>
                  <RoleCard role={playerRole.role} />
                </Box>
              </Box>
            )
          )
        )}
      </Box>

      <Box mt={2}>
        <Grid container spacing={2}>
          {!minLimit && (
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                onClick={() => (index > 0 ? setIndex(index - 1) : {})}
              >
                <FormattedMessage id="prev" />
              </Button>
            </Grid>
          )}
          {!maxLimit && (
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setIndex(index + 1)}
              >
                <FormattedMessage id="next" />
              </Button>
            </Grid>
          )}
          {maxLimit && (
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                onClick={props.onStartGame}
              >
                <FormattedMessage id="start" />
              </Button>
            </Grid>
          )}
        </Grid>
      </Box>
    </Box>
  );
}
