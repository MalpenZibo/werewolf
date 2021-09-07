import { Box, Button, Grid } from "@material-ui/core";
import { array, option } from "fp-ts";
import { constant, pipe } from "fp-ts/function";
import { IO } from "fp-ts/IO";
import { useState } from "react";
import { FormattedMessage } from "react-intl";

type Props<T> = {
  collection: T[];
  lastScreen: JSX.Element;
  content: (e: T) => JSX.Element;
  onProceed: IO<void>;
};

export function Stepper<T>(props: Props<T>) {
  const [index, setIndex] = useState(0);

  const currentElement = pipe(props.collection, array.lookup(index));

  const minLimit = index === 0;
  const maxLimit = index === props.collection.length;

  return (
    <Box display="flex" width={1} alignItems="center" flexDirection="column">
      <Box mt={2}>
        {pipe(
          currentElement,
          option.fold(constant(props.lastScreen), props.content)
        )}
      </Box>

      <Box mt={2}>
        <Grid container spacing={2}>
          {!minLimit && (
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                onClick={() => (index > 0 ? setIndex(index - 1) : {})}
              >
                <FormattedMessage id="prev" />
              </Button>
            </Grid>
          )}
          {!maxLimit && (
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setIndex(index + 1)}
              >
                <FormattedMessage id="next" />
              </Button>
            </Grid>
          )}
          {maxLimit && (
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                onClick={props.onProceed}
              >
                <FormattedMessage id="start" />
              </Button>
            </Grid>
          )}
        </Grid>
      </Box>
    </Box>
  );
}
