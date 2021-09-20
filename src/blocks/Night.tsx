import { Box, Typography } from "@material-ui/core";
import { IO } from "fp-ts/IO";
import { FormattedMessage } from "react-intl";
import { PlayerData } from "../domain";
import { foldNightAction, nightTurns } from "../gameplay";
import { Stepper } from "./Common/Stepper";
import { SeerNight } from "./SeerNight";
import { WizardNight } from "./WizardNight";
import { WolvesNight } from "./WolvesNight";

type Props = {
  playersData: PlayerData[];
  nightNumber: number;
  onDiscussion: IO<void>;
};

export function Night(props: Props) {
  return (
    <Box display="flex" width={1} alignItems="center" flexDirection="column">
      <Box mt={2}>
        <Typography variant="h5">
          <FormattedMessage id="game.night.title" />
        </Typography>
      </Box>
      <Box mt={2} width={1}>
        <Stepper
          lastScreen={
            <Typography variant="h6">
              <FormattedMessage id="game.showRole.finish" />
            </Typography>
          }
          collection={nightTurns}
          content={foldNightAction({
            whenSeer: () => <SeerNight playersData={props.playersData} />,
            whenWolves: () => (
              <WolvesNight
                playersData={props.playersData}
                onAttackedByWolves={() => {}}
              />
            ),
            whenWizard: () => <WizardNight playersData={props.playersData} />,
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
