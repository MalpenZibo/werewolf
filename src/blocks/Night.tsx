import { Box, Typography } from "@material-ui/core";
import { array, option, number, ord } from "fp-ts";
import { constant, constNull, pipe } from "fp-ts/function";
import { Reader } from "fp-ts/Reader";
import { useState } from "react";
import { FormattedMessage } from "react-intl";
import { Player, PlayerData } from "../domain";
import {
  firstNightTurns,
  foldNightAction,
  nightTurns,
  wolves,
  wolvesHierarchy,
} from "../gameplay";
import { Stepper } from "./Common/Stepper";
import { HealerNight } from "./HealerNight";
import { MediumNight } from "./MediumNight";
import { SeerNight } from "./SeerNight";
import { WitchNight } from "./WitchNight";
import { WizardNight } from "./WizardNight";
import { WolvesNight } from "./WolvesNight";
import { Option } from "fp-ts/Option";
import { FarmerDeadDecisionDialog } from "./FarmerDeadDecisionDialog";
import { TraitorDialog } from "./TraitorDialog";

type Props = {
  playersData: PlayerData[];
  nightNumber: number;
  wolvesDoubleAttack: boolean;
  onNightResult: Reader<
    {
      killedPlayers: Player[];
      farmerIntoWolf: Option<Player>;
      healerUseHisAbility: boolean;
    },
    void
  >;
};

export function Night(props: Props) {
  const [killedPlayers, setKilledPlayers] = useState<Player[]>([]);
  const [showFarmerDecision, setShowFarmerDecision] = useState<Option<Player>>(
    option.none
  );
  const [showTraitorDialog, setShowTraitorDialog] = useState<Option<Player>>(
    option.none
  );
  const [farmerIntoWolf, setFarmerIntoWolf] = useState<Option<Player>>(
    option.none
  );
  const [healerUseHisAbility, setHealerUseHisAbility] = useState(false);

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
          collection={props.nightNumber === 1 ? firstNightTurns : nightTurns}
          content={foldNightAction({
            whenSeer: () => <SeerNight playersData={props.playersData} />,
            whenWolves: () => (
              <Box display="flex" width={1} flexDirection="column">
                <WolvesNight
                  playersData={pipe(
                    props.playersData,
                    array.filter((p) =>
                      pipe(
                        killedPlayers,
                        array.findFirst((pa) => pa.name === p.player.name),
                        option.isNone
                      )
                    )
                  )}
                  doubleTurn={props.wolvesDoubleAttack}
                  onAttackedByWolves={(pa) => {
                    const heremit = pipe(
                      props.playersData,
                      array.findFirst((p) => p.roleId === "heremit"),
                      option.chain((p) =>
                        pa.name === p.player.name ? option.some(p) : option.none
                      )
                    );

                    const traitor = pipe(
                      props.playersData,
                      array.findFirst((p) => p.roleId === "traitor"),
                      option.chain((p) =>
                        pa.name === p.player.name ? option.some(p) : option.none
                      )
                    );

                    const farmer = pipe(
                      props.playersData,
                      array.findFirst(
                        (p) => p.roleId === "farmer1" || p.roleId === "farmer2"
                      ),
                      option.chain((p) =>
                        pa.name === p.player.name ? option.some(p) : option.none
                      )
                    );

                    if (option.isNone(heremit)) {
                      pipe(
                        farmer,
                        option.fold(
                          () =>
                            pipe(
                              traitor,
                              option.fold(
                                () => setKilledPlayers([...killedPlayers, pa]),
                                (farmer) =>
                                  setShowTraitorDialog(
                                    option.some(farmer.player)
                                  )
                              )
                            ),
                          (farmer) =>
                            setShowFarmerDecision(option.some(farmer.player))
                        )
                      );
                    }
                  }}
                />
                {pipe(
                  showFarmerDecision,
                  option.fold(constNull, (farmer) => (
                    <FarmerDeadDecisionDialog
                      player={farmer}
                      onHero={() => {
                        const bestWolf = pipe(
                          props.playersData,
                          array.filter(
                            (v) =>
                              pipe(
                                wolves,
                                array.findFirst((w) => w === v.roleId),
                                option.isSome
                              ) && v.alive
                          ),
                          array.sortBy([
                            pipe(
                              number.Ord,
                              ord.contramap((p: PlayerData) =>
                                wolvesHierarchy(p.roleId)
                              )
                            ),
                          ]),
                          array.head
                        );
                        setKilledPlayers([
                          ...killedPlayers,
                          farmer,
                          ...pipe(
                            bestWolf,
                            option.fold(constant([]), (wolf) => [wolf.player])
                          ),
                        ]);
                        setShowFarmerDecision(option.none);
                      }}
                      onNormal={() => {
                        setKilledPlayers([...killedPlayers, farmer]);
                        setShowFarmerDecision(option.none);
                      }}
                      onWolf={() => {
                        setFarmerIntoWolf(option.some(farmer));
                        setShowFarmerDecision(option.none);
                      }}
                    />
                  ))
                )}
                {pipe(
                  showTraitorDialog,
                  option.fold(constNull, (traitor) => (
                    <TraitorDialog
                      player={traitor}
                      onClose={() => setShowTraitorDialog(option.none)}
                    />
                  ))
                )}
              </Box>
            ),
            whenWizard: () => <WizardNight playersData={props.playersData} />,
            whenMedium: () => <MediumNight playersData={props.playersData} />,
            whenWitch: () => (
              <WitchNight
                playersData={props.playersData}
                onProtectedByWitch={(t) =>
                  setKilledPlayers(
                    pipe(
                      killedPlayers,
                      array.filter((p) => p.name !== t.name)
                    )
                  )
                }
              />
            ),
            whenHealer: () => (
              <HealerNight
                playersData={props.playersData}
                playersDiedThisNight={killedPlayers}
                onHealedByHealer={(t) => {
                  setKilledPlayers(
                    pipe(
                      killedPlayers,
                      array.filter((pa) => pa.name !== t.name)
                    )
                  );
                  setHealerUseHisAbility(true);
                }}
              />
            ),
          })}
          onProceed={() =>
            props.onNightResult({
              killedPlayers,
              farmerIntoWolf,
              healerUseHisAbility,
            })
          }
        />
      </Box>
    </Box>
  );
}
