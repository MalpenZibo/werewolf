import { Box, Typography } from "@material-ui/core";
import { array, option } from "fp-ts";
import { IO } from "fp-ts/IO";
import { constant, pipe } from "fp-ts/function";
import { FormattedMessage } from "react-intl";
import { Player, PlayerData, roles } from "../domain";
import { foldNightAction, nightTurns } from "../gameplay";
import { Stepper } from "./Common/Stepper";
import { SelectPlayer } from "./SelectPlayer";
import { useState } from "react";
import { ShowAuraDialog } from "./Common/ShowAuraDialog";
import { Option } from "fp-ts/Option";

type Props = {
  playersData: PlayerData[];
  nightNumber: number;
  onDiscussion: IO<void>;
};

export function Night(props: Props) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Option<Player>>(
    option.none
  );

  return (
    <Box display="flex" width={1} alignItems="center" flexDirection="column">
      <Box mt={2}>
        <Typography variant="h5">
          <FormattedMessage id="game.showRole.title" />
        </Typography>
      </Box>
      <Box mt={2}>
        <Stepper
          lastScreen={
            <Typography variant="h6">
              <FormattedMessage id="game.showRole.finish" />
            </Typography>
          }
          collection={nightTurns}
          content={foldNightAction({
            whenSeer: () => (
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
                        <Box display="flex" width={1} flexDirection="column">
                          <Typography variant="h6">
                            <FormattedMessage id="game.showRole.finish" />
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
            ),
            whenWolves: () => <></>,
            whenWizard: () => <></>,
            whenMedium: () => <></>,
            whenWitch: () => <></>,
            whenHealer: () => <></>,
          })}
          onProceed={props.onDiscussion}
        />
      </Box>
    </Box>
  );
}
