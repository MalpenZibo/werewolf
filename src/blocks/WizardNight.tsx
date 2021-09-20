import { Box, Typography } from "@material-ui/core";
import { array, option } from "fp-ts";
import { constant, pipe } from "fp-ts/function";
import { useState } from "react";
import { FormattedMessage } from "react-intl";
import { Player, PlayerData, roles } from "../domain";
import { SelectPlayer } from "./SelectPlayer";
import { Option } from "fp-ts/Option";
import { ShowAuraDialog } from "./Common/ShowAuraDialog";
import { ShowMysticalDialog } from "./Common/ShowMysticalDialog";

type Props = {
  playersData: PlayerData[];
};

export function WizardNight(props: Props) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Option<Player>>(
    option.none
  );

  return (
    <Box display="flex" width={1} flexDirection="column">
      {pipe(
        props.playersData,
        array.findFirst((v) => v.roleId === "wizard"),
        option.fold(
          constant(
            <Typography variant="h6">
              <FormattedMessage id="game.night.roleNotPresent" />
            </Typography>
          ),
          (wizard) =>
            wizard.alive ? (
              <Box
                display="flex"
                width={1}
                alignItems="center"
                flexDirection="column"
              >
                <Typography variant="h4">
                  <FormattedMessage id="role.wizard.name" />
                  {`: ${wizard.player.name}`}
                </Typography>
                <Typography variant="h6">
                  <FormattedMessage id="game.night.wizard.action" />
                </Typography>

                <SelectPlayer
                  players={pipe(
                    props.playersData,
                    array.filterMap((v) =>
                      v.roleId !== "wizard" && v.alive
                        ? option.some(v.player)
                        : option.none
                    )
                  )}
                  onSelected={(p) => {
                    setSelectedPlayer(option.some(p));
                    setDialogOpen(true);
                  }}
                />
                {pipe(
                  selectedPlayer,
                  option.chain((p) =>
                    pipe(
                      props.playersData,
                      array.findFirstMap((v) =>
                        v.player.name === p.name
                          ? option.some({
                              player: v.player,
                              mystical: roles[v.roleId].mystical,
                            })
                          : option.none
                      )
                    )
                  ),
                  option.map((v) => (
                    <ShowMysticalDialog
                      open={dialogOpen}
                      player={v.player}
                      mystical={v.mystical}
                      onClose={() => {
                        setSelectedPlayer(option.none);
                        setDialogOpen(false);
                      }}
                    />
                  )),
                  option.toNullable
                )}
              </Box>
            ) : (
              <Box display="flex" width={1} flexDirection="column">
                <Typography variant="h6">
                  <FormattedMessage id="game.night.roleDied" />
                </Typography>
              </Box>
            )
        )
      )}
    </Box>
  );
}
