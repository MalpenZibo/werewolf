import {
  Accordion,
  AccordionSummary,
  AppBar,
  Box,
  Grid,
  IconButton,
  Toolbar,
  Typography,
} from "@material-ui/core";
import ArrowBackSharp from "@material-ui/icons/ArrowBackSharp";
import ExpandMore from "@material-ui/icons/ExpandMore";
import { FormattedMessage } from "react-intl";
import { locations, useRouter } from "../routing";
import { Faction, factions, roles } from "../domain";
import { pipe } from "fp-ts/function";
import { array, record } from "fp-ts";
import { useFormatFaction } from "../utils";
import { RoleCard } from "../blocks/RoleCard";

export function Roles() {
  const router = useRouter();
  const formatFaction = useFormatFaction();

  console.log("test");

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
      <Box display="flex" width={1} flexDirection="column" alignItems="center">
        {pipe(
          factions,
          array.map((f: Faction) => (
            <Accordion key={f}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography>{formatFaction(f)}</Typography>
              </AccordionSummary>
              <Box m={2}>
                <Grid
                  container
                  direction="row"
                  spacing={2}
                  justifyContent="center"
                  alignItems="center"
                >
                  {pipe(
                    roles,
                    record.filter((r) => r.faction === f),
                    record.toArray,
                    array.map(([, r]) => <RoleCard key={r.id} role={r} />)
                  )}
                </Grid>
              </Box>
            </Accordion>
          ))
        )}
      </Box>
    </Box>
  );
}
