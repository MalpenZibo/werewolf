import { Box, Typography } from "@material-ui/core";
import { IO } from "fp-ts/IO";
import { constant, pipe } from "fp-ts/function";
import { FormattedMessage } from "react-intl";
import { PlayerData, roles } from "../domain";
import { foldShowRoleAction } from "../gameplay";
import { Stepper } from "./Common/Stepper";
import { RoleCard } from "./RoleCard";
import { array, option } from "fp-ts";

type Props = {
  playersData: PlayerData[];
  onStartGame: IO<void>;
};

export function ShowRole(props: Props) {
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
          collection={props.playersData}
          content={(playerData) => (
            <Box display="flex" flexDirection="column" alignItems="center">
              <Box mb={2}>
                <Typography variant="h6">{playerData.player.name}</Typography>
              </Box>
              <Box display="flex" width={1}>
                <RoleCard role={roles[playerData.roleId]} />
              </Box>
              {pipe(
                { roleId: playerData.roleId, playersData: props.playersData },
                foldShowRoleAction({
                  whenWolves: option.fold(
                    constant(
                      <Box mb={2}>
                        <Typography variant="h6">
                          <FormattedMessage id="game.showRole.noTraitor" />
                        </Typography>
                      </Box>
                    ),
                    (traitor) => (
                      <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                      >
                        <Box mb={2}>
                          <Typography variant="h6">
                            <FormattedMessage
                              id="game.showRole.traitor"
                              values={{ name: traitor.name }}
                            />
                          </Typography>
                        </Box>
                        <Box display="flex" width={1}>
                          <RoleCard role={roles.traitor} />
                        </Box>
                      </Box>
                    )
                  ),
                  whenMonk: option.fold(
                    constant(
                      <Box mb={2}>
                        <Typography variant="h6">
                          <FormattedMessage id="game.showRole.noMissingRole" />
                        </Typography>
                      </Box>
                    ),
                    (missingRoles) => (
                      <Box mb={2}>
                        <Typography variant="h6">
                          <FormattedMessage
                            id="game.showRole.missingRole"
                            values={{ amount: missingRoles.length }}
                          />
                        </Typography>
                        {pipe(
                          missingRoles,
                          array.map((r) => (
                            <Box display="flex" width={1} mt={2}>
                              <RoleCard role={r} />
                            </Box>
                          ))
                        )}
                      </Box>
                    )
                  ),
                  whenPriest: option.fold(
                    constant(
                      <Box mb={2}>
                        <Typography variant="h6">
                          <FormattedMessage id="game.showRole.noSinner" />
                        </Typography>
                      </Box>
                    ),
                    (sinner) => (
                      <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                      >
                        <Box mb={2}>
                          <Typography variant="h6">
                            <FormattedMessage
                              id="game.showRole.sinner"
                              values={{ name: sinner.name }}
                            />
                          </Typography>
                        </Box>
                        <Box display="flex" width={1}>
                          <RoleCard role={roles.sinner} />
                        </Box>
                      </Box>
                    )
                  ),
                })
              )}
            </Box>
          )}
          onProceed={props.onStartGame}
        />
      </Box>
    </Box>
  );
}
