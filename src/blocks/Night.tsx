import { Box, Typography } from "@material-ui/core";
import { IO } from "fp-ts/IO";
import { FormattedMessage } from "react-intl";
import { Player, Role } from "../domain";
import { Stepper } from "./Common/Stepper";
import { RoleCard } from "./RoleCard";

type Props = {
  playerRoles: { player: Player; role: Role }[];
  nightNumber: number;
  onDiscussion: IO<void>;
};

export function Night(props: Props) {
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
          collection={props.playerRoles}
          content={(playerRole) => (
            <Box display="flex" flexDirection="column" alignItems="center">
              <Box mb={2}>
                <Typography variant="h6">{playerRole.player.name}</Typography>
              </Box>
              <Box display="flex" width={1}>
                <RoleCard role={playerRole.role} />
              </Box>
            </Box>
          )}
          onProceed={props.onDiscussion}
        />
      </Box>
    </Box>
  );
}
