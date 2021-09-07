import { Player } from "../domain";
import * as t from "io-ts";
import { getValue } from "../localStorage";
import { useState } from "react";
import { constant, pipe } from "fp-ts/function";
import { array, option } from "fp-ts";
import { Avatar, Box, Button, Chip, Grid, Typography } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import { Reader } from "fp-ts/Reader";

type Props = {
  onNext: Reader<Player[], void>;
};

const minAmount = 4;

export function SelectPlayers(props: Props) {
  const [players, setPlayers] = useState(
    pipe(
      getValue("players", t.array(Player)),
      option.map((players) =>
        pipe(
          players,
          array.map((p) => ({ player: p, selected: false }))
        )
      )
    )
  );

  const amount = pipe(
    players,
    option.map(
      (p) =>
        pipe(
          p,
          array.filter((v) => v.selected)
        ).length
    ),
    option.getOrElse(constant(0))
  );

  return (
    <Box display="flex" width={1} flexDirection="column" m={4}>
      <Typography variant="h6">
        <FormattedMessage
          id="game.players.playerNumber"
          values={{
            amount,
            minAmount,
          }}
        />
      </Typography>
      <Box display="flex" width={1} flexDirection="column" m={4}>
        {pipe(
          players,
          option.fold(
            constant(
              <Typography variant="h3">
                <FormattedMessage id="game.players.noPlayersDefined" />
              </Typography>
            ),
            (players) => (
              <Grid
                container
                justifyContent="center"
                alignItems="center"
                spacing={2}
              >
                {players.map((value) => {
                  return (
                    <Grid
                      key={value.player.name}
                      justifyContent="center"
                      alignItems="center"
                      container
                      item
                      xs={4}
                      sm={3}
                      md={2}
                      lg={1}
                    >
                      <Chip
                        label={value.player.name}
                        avatar={<Avatar>{value.player.name[0]}</Avatar>}
                        clickable
                        color="primary"
                        onClick={() =>
                          setPlayers(
                            pipe(
                              players,
                              array.findIndex(
                                (p) => p.player.name === value.player.name
                              ),
                              option.chain((index) =>
                                pipe(
                                  players,
                                  array.modifyAt(index, (p) => ({
                                    ...p,
                                    selected: !p.selected,
                                  }))
                                )
                              )
                            )
                          )
                        }
                        variant={value.selected ? "default" : "outlined"}
                      />
                    </Grid>
                  );
                })}
              </Grid>
            )
          )
        )}
      </Box>

      <Button
        variant="contained"
        color="primary"
        onClick={() =>
          props.onNext(
            pipe(
              players,
              option.map((players) =>
                pipe(
                  players,
                  array.filterMap((p) =>
                    p.selected ? option.some(p.player) : option.none
                  )
                )
              ),
              option.getOrElse<Player[]>(constant([]))
            )
          )
        }
        disabled={amount < minAmount}
      >
        <FormattedMessage id="next" />
      </Button>
    </Box>
  );
}
