import { Box, Card, CardContent, Grid, Typography } from "@material-ui/core";
import { Role } from "../domain";
import { DarkAuraIcon } from "../Icons/DarkAuraIcon";
import { MysticalIcon } from "../Icons/MysticalIcon";
import { useFormatRole } from "../utils";

type Props = {
  role: Role;
};

export function RoleCard(props: Props) {
  const { formatName, formatDescription } = useFormatRole();
  return (
    <Grid item xs={12} sm={6} md={4} lg={3}>
      <Card>
        <CardContent>
          <Box display="flex" width={1} flexDirection="row">
            <Box display="flex" width={1}>
              <Typography gutterBottom variant="h5">
                {formatName(props.role.id)}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center">
              {props.role.aura === "dark" && <DarkAuraIcon />}
              {props.role.mystical && <MysticalIcon />}
            </Box>
          </Box>
          <Typography variant="body2" color="textSecondary">
            {formatDescription(props.role.id)}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
}
