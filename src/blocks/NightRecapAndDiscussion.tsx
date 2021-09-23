import { Box, Button, Typography } from "@material-ui/core";
import { constant, pipe } from "fp-ts/function";
import { nonEmptyArray, option } from "fp-ts";
import { FormattedMessage } from "react-intl";
import { Player } from "../domain";
import { IO } from "fp-ts/IO";

type Props = {
  playerKilled: Player[];
  newsFromInn: boolean;
  newsFromBard: boolean;
  onProceedWithVoting: IO<void>;
};

export function NightRecapAndDiscussion(props: Props) {
  return (
    <Box display="flex" width={1} alignItems="center" flexDirection="column">
      <Box mt={2}>
        <Typography variant="h5">
          <FormattedMessage id="game.nightRecapAndDiscussion.title" />
        </Typography>
      </Box>
      <Box mt={2} width={1} flexDirection="column">
        <Typography variant="h5">
          <FormattedMessage id="game.nightRecapAndDiscussion.playerKilled" />
        </Typography>
        {pipe(
          props.playerKilled,
          nonEmptyArray.fromArray,
          option.fold(
            constant(
              <Typography variant="h5">
                <FormattedMessage id="game.nightRecapAndDiscussion.noPlayerKilled" />
              </Typography>
            ),
            (players) => <span>{players.map((p) => p.name).join(", ")}</span>
          )
        )}

        {props.newsFromInn && (
          <Typography variant="h5">
            <FormattedMessage id="game.nightRecapAndDiscussion.newsFromInn" />
          </Typography>
        )}
        {props.newsFromBard && (
          <Typography variant="h5">
            <FormattedMessage id="game.nightRecapAndDiscussion.newsFromBard" />
          </Typography>
        )}
      </Box>
      <Button
        variant="contained"
        color="primary"
        onClick={props.onProceedWithVoting}
      >
        <FormattedMessage id="start" />
      </Button>
    </Box>
  );
}
