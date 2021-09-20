import { Box, Typography } from "@material-ui/core";
import { array, option } from "fp-ts";
import { constant, pipe } from "fp-ts/function";
import { useState } from "react";
import { FormattedMessage } from "react-intl";
import { Player, PlayerData } from "../domain";
import { SelectPlayer } from "./SelectPlayer";
import { Option } from "fp-ts/Option";
import { Reader } from "fp-ts/Reader";
import { ConfirmationDialog } from "./Common/ConfirmationDialog";
import { useFormatRole } from "../utils";

type Props = {
  playersData: PlayerData[];
  playersDiedThisNight: Player[];
  onHealedByHealer: Reader<Player, void>;
};

export function HealerNight(props: Props) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Option<Player>>(
    option.none
  );

  const { formatName } = useFormatRole();

  return (
    <Box display="flex" width={1} flexDirection="column">
      <Typography variant="h6">
        <FormattedMessage id={formatName("healer")} />
      </Typography>
      {pipe(
        props.playersData,
        array.findFirst((v) => v.roleId === "healer"),
        option.fold(
          constant(
            <Typography variant="h6">
              <FormattedMessage id="game.night.roleNotPresent" />
            </Typography>
          ),
          (healer) =>
            healer.alive ? (
              <Box
                display="flex"
                width={1}
                alignItems="center"
                flexDirection="column"
              >
                <Typography variant="h4">
                  <FormattedMessage id="role.healer.name" />
                  {`: ${healer.player.name}`}
                </Typography>
                <Typography variant="h6">
                  <FormattedMessage id="game.night.healer.action" />
                </Typography>

                <SelectPlayer
                  players={pipe(
                    props.playersDiedThisNight,
                    array.filter((p) => p.name !== healer.player.name)
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
                        <FormattedMessage id="game.night.healer.confirmation.title" />
                      }
                      content={
                        <FormattedMessage
                          id="game.night.healer.confirmation.content"
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
                        props.onHealedByHealer(v);
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
