import { array } from "fp-ts";
import { GameData, Player, Role } from "../domain";
import { assignRoleToPlayers } from "../gameplay";
import { setValue } from "../localStorage";
import { pipe } from "fp-ts/function";

type State =
  | {
      view: "selectPlayers";
    }
  | { view: "showRole"; playerRoles: { player: Player; role: Role }[] };

type Action = {
  type: "assignRoleToPlayer";
  payload: Player[];
};

export function reducer(_state: State, action: Action): State {
  switch (action.type) {
    case "assignRoleToPlayer":
      const playerRoles = assignRoleToPlayers(action.payload);
      setValue("gameData", GameData, {
        playersRole: pipe(
          playerRoles,
          array.map((v) => ({ player: v.player, roleId: v.role.id }))
        ),
      });
      return {
        view: "showRole",
        playerRoles: playerRoles,
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
