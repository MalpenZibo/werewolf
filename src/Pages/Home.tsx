import { Box, Button, Grid, Typography } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import { locations, useRouter } from "../routing";

//Bilanciamento ruoli 1 creatura oscura ogni 4 giocatori

export function Home() {
  const router = useRouter();

  return (
    <Box display="flex" width={1} flexDirection="column" alignItems="center">
      <Typography variant="h1">
        <FormattedMessage id="appTitle" />
      </Typography>

      <Box
        mt={10}
        width={1}
        display="flex"
        alignItems="center"
        flexDirection="column"
      >
        <Grid
          container
          item
          xs={6}
          direction="column"
          justifyContent="center"
          spacing={3}
        >
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={() => router.navigateTo(locations.game)}
              fullWidth
            >
              <FormattedMessage id="game" />
            </Button>
          </Grid>

          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={() => router.navigateTo(locations.roles)}
              fullWidth
            >
              <FormattedMessage id="role" />
            </Button>
          </Grid>

          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={() => router.navigateTo(locations.players)}
              fullWidth
            >
              <FormattedMessage id="players" />
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
