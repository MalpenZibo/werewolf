import {
  AppBar,
  Box,
  IconButton,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { ArrowBackSharp } from "@material-ui/icons";
import { array, option, record } from "fp-ts";
import { constant, pipe } from "fp-ts/function";
import { useReducer } from "react";
import { FormattedMessage } from "react-intl";
import { SelectPlayers } from "../blocks/SelectPlayers";
import { ShowRole } from "../blocks/ShowRole";
import { Player, Role, roles } from "../domain";
import { locations, useRouter } from "../routing";

function shuffle<T>(array: T[]): T[] {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;
  let shuffleArray = [...array];
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = shuffleArray[currentIndex];
    shuffleArray[currentIndex] = shuffleArray[randomIndex];
    shuffleArray[randomIndex] = temporaryValue;
  }
  return shuffleArray;
}

function assignRoleToPlayers(
  players: Player[]
): { player: Player; role: Role }[] {
  const wolfNumber = Math.floor(players.length / 4) - 1;

  const shuffledPlayers = pipe(players, shuffle);

  let playerRoles: { player: Player; role: Role }[] = [];
  pipe(
    shuffledPlayers.pop(),
    option.fromNullable,
    option.fold(
      () => {},
      (p) => playerRoles.push({ player: p, role: roles.primaryWolf })
    )
  );
  pipe(
    shuffledPlayers.pop(),
    option.fromNullable,
    option.fold(
      () => {},
      (p) => playerRoles.push({ player: p, role: roles.seer })
    )
  );

  const wolfRoles = pipe(
    [roles.secondaryWolf, roles.youngWolf, roles.traitor],
    shuffle
  );
  for (let i = 0; i < wolfNumber; i++) {
    pipe(
      shuffledPlayers.pop(),
      option.fromNullable,
      option.fold(
        () => {},
        (p) => playerRoles.push({ player: p, role: wolfRoles[i] })
      )
    );
  }

  const otherRoles = pipe(
    roles,
    record.filter(
      (r) =>
        r.id !== "seer" &&
        r.id !== "primaryWolf" &&
        pipe(
          wolfRoles,
          array.findFirst((wr) => wr.id === r.id),
          option.isNone
        )
    ),
    record.toArray,
    shuffle
  );

  pipe(
    shuffledPlayers,
    array.map((p) =>
      pipe(
        otherRoles.pop(),
        option.fromNullable,
        option.fold(
          () => {},
          ([, r]) => playerRoles.push({ player: p, role: r })
        )
      )
    )
  );

  return pipe(playerRoles, shuffle);
}

type State =
  | {
      view: "selectPlayers";
    }
  | { view: "showRole"; playerRoles: { player: Player; role: Role }[] };

type Action = {
  type: "assignRoleToPlayer";
  payload: Player[];
};

function reducer(_state: State, action: Action): State {
  switch (action.type) {
    case "assignRoleToPlayer":
      return {
        view: "showRole",
        playerRoles: assignRoleToPlayers(action.payload),
      };
  }
}

export function foldStatus(match: {
  whenSelectPlayers: () => JSX.Element;
  whenShowRole: (playerRoles: { player: Player; role: Role }[]) => JSX.Element;
}): (state: State) => JSX.Element {
  return (state) => {
    switch (state.view) {
      case "selectPlayers":
        return match.whenSelectPlayers();
      case "showRole":
        return match.whenShowRole(state.playerRoles);
    }
  };
}

export function Game() {
  const router = useRouter();

  const [state, dispatch] = useReducer(reducer, { view: "selectPlayers" });

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
              <FormattedMessage id="players" />
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        display="flex"
        m={2}
        width={1}
        flexDirection="row"
        alignItems="center"
      >
        {pipe(
          state,
          foldStatus({
            whenSelectPlayers: constant(
              <SelectPlayers
                onNext={(players) =>
                  dispatch({ type: "assignRoleToPlayer", payload: players })
                }
              />
            ),
            whenShowRole: (playerRoles) => (
              <ShowRole playerRoles={playerRoles} />
            ),
          })
        )}
      </Box>
    </Box>
  );
}
