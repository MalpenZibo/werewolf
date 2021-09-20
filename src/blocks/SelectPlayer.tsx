import { Player } from "../domain";
import { Avatar, Box, Chip, Grid } from "@material-ui/core";
import { Reader } from "fp-ts/Reader";

type Props = {
  players: Player[];
  onSelected: Reader<Player, void>;
};

export function SelectPlayer(props: Props) {
  return (
    <Box display="flex" width={1} flexDirection="column" m={4}>
      <Grid container justifyContent="center" alignItems="center" spacing={2}>
        {props.players.map((player) => {
          return (
            <Grid
              key={player.name}
              justifyContent="center"
              alignItems="center"
              container
              item
              xs={4}
              sm={3}
              md={2}
              lg={1}
            >
              <Chip
                label={player.name}
                avatar={<Avatar>{player.name[0]}</Avatar>}
                clickable
                color="primary"
                onClick={() => props.onSelected(player)}
                variant="outlined"
              />
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
