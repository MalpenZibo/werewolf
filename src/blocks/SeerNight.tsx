import { Box, Typography } from "@material-ui/core";
import { array, option } from "fp-ts";
import { constant, pipe } from "fp-ts/function";
import { useState } from "react";
import { FormattedMessage } from "react-intl";
import { Aura, Player, PlayerData, roles } from "../domain";
import { SelectPlayer } from "./SelectPlayer";
import { Option } from "fp-ts/Option";
import { ShowAuraDialog } from "./Common/ShowAuraDialog";
import { Reader } from "fp-ts/Reader";

type Props = {
  playersData: PlayerData[];
  onSelectedAura: Reader<Aura, void>;
};

export function SeerNight(props: Props) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Option<Player>>(
    option.none
  );

  return (
    <Box display="flex" width={1} flexDirection="column">
      {pipe(
        props.playersData,
        array.findFirst((v) => v.roleId === "seer"),
        option.fold(
          constant(
            <Typography variant="h6">
              <FormattedMessage id="game.night.roleNotPresent" />
            </Typography>
          ),
          (seer) =>
            seer.alive ? (
              <Box
                display="flex"
                width={1}
                alignItems="center"
                flexDirection="column"
              >
                <Typography variant="h4">
                  <FormattedMessage id="role.seer.name" />
                  {`: ${seer.player.name}`}
                </Typography>
                <Typography variant="h6">
                  <FormattedMessage id="game.night.seer.action" />
                </Typography>

                <SelectPlayer
                  players={pipe(
                    props.playersData,
                    array.filterMap((v) =>
                      v.roleId !== "seer" && v.alive
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
                              aura: roles[v.roleId].aura,
                            })
                          : option.none
                      )
                    )
                  ),
                  option.map((v) => (
                    <ShowAuraDialog
                      open={dialogOpen}
                      player={v.player}
                      aura={v.aura}
                      onClose={() => {
                        setSelectedPlayer(option.none);
                        setDialogOpen(false);
                        props.onSelectedAura(v.aura);
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
