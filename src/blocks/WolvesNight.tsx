import { Box, Typography } from "@material-ui/core";
import { array, option, nonEmptyArray } from "fp-ts";
import { constant, pipe } from "fp-ts/function";
import { useState } from "react";
import { FormattedMessage } from "react-intl";
import { Player, PlayerData } from "../domain";
import { SelectPlayer } from "./SelectPlayer";
import { Option } from "fp-ts/Option";
import { wolves } from "../gameplay";
import { Reader } from "fp-ts/Reader";
import { ConfirmationDialog } from "./Common/ConfirmationDialog";

type Props = {
  playersData: PlayerData[];
  onAttackedByWolves: Reader<Player, void>;
  doubleTurn: boolean;
};

export function WolvesNight(props: Props) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Option<Player>>(
    option.none
  );

  return (
    <Box display="flex" width={1} flexDirection="column">
      {pipe(
        props.playersData,
        array.filter(
          (v) =>
            pipe(
              wolves,
              array.findFirst((w) => w === v.roleId),
              option.isSome
            ) && v.alive
        ),
        nonEmptyArray.fromArray,
        option.fold(
          constant(
            <Typography variant="h6">
              <FormattedMessage id="game.night.roleNotPresent" />
            </Typography>
          ),
          (wolves) => (
            <Box
              display="flex"
              width={1}
              alignItems="center"
              flexDirection="column"
            >
              <Typography variant="h4">
                <FormattedMessage id="faction.wolf" />
                {`: ${pipe(
                  wolves,
                  nonEmptyArray.map((w) => w.player.name)
                ).join(", ")}`}
              </Typography>
              <Typography variant="h6">
                <FormattedMessage
                  id={
                    props.doubleTurn
                      ? "game.night.wolves.action"
                      : "game.night.wolves.action"
                  }
                />
              </Typography>

              <SelectPlayer
                players={pipe(
                  props.playersData,
                  array.filterMap((v) =>
                    v.alive ? option.some(v.player) : option.none
                  )
                )}
                onSelected={(p) => {
                  setSelectedPlayer(option.some(p));
                  setDialogOpen(true);
                }}
              />
              {pipe(
                selectedPlayer,
                option.map((v) => (
                  <ConfirmationDialog
                    open={dialogOpen}
                    title={
                      <FormattedMessage id="game.night.wolves.confirmation.title" />
                    }
                    content={
                      <FormattedMessage
                        id="game.night.wolves.confirmation.content"
                        values={{ name: v.name }}
                      />
                    }
                    onCancel={() => {
                      setSelectedPlayer(option.none);
                      setDialogOpen(false);
                    }}
                    onConfirm={() => {
                      setSelectedPlayer(option.none);
                      setDialogOpen(false);
                      props.onAttackedByWolves(v);
                    }}
                  />
                )),
                option.toNullable
              )}
            </Box>
          )
        )
      )}
    </Box>
  );
}
