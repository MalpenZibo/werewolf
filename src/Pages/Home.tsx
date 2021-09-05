import { Box, Button } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import { locations, useRouter } from "../routing";

export function Home() {
  const router = useRouter();

  return (
    <Box display="flex" width={1} flexDirection="column" alignItems="center">
      <h1>Welcome</h1>

      <Button
        variant="contained"
        color="primary"
        onClick={() => router.navigateTo(locations.roles)}
      >
        <FormattedMessage id="role" />
      </Button>

      <Button
        variant="contained"
        color="primary"
        onClick={() => router.navigateTo(locations.players)}
      >
        <FormattedMessage id="players" />
      </Button>
    </Box>
  );
}
