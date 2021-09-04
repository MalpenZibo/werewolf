import {
  AppBar,
  Box,
  IconButton,
  Toolbar,
  Typography,
} from "@material-ui/core";
import ArrowBackSharp from "@material-ui/icons/ArrowBackSharp";
import { FormattedMessage } from "react-intl";
import { locations, useRouter } from "../routing";

export function Roles() {
  const router = useRouter();

  return (
    <Box display="flex" width={1} flexDirection="column" alignItems="center">
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => router.navigateTo(locations.home)}
          >
            <ArrowBackSharp />
          </IconButton>
          <Box display="flex" width={1}>
            <Typography variant="h6">
              <FormattedMessage id="role" />
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
