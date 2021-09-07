import { array } from "fp-ts";
import { GameData, Player, Role } from "../domain";
import { assignRoleToPlayers } from "../gameplay";
import { setValue } from "../localStorage";
import { pipe } from "fp-ts/function";

export type State =
  | {
      view: "init";
      gameData: GameData;
    }
  | {
      view: "selectPlayers";
    }
  | { view: "showRole"; playerRoles: { player: Player; role: Role }[] };

type Action =
  | { type: "startFreshGame" }
  | {
      type: "assignRoleToPlayer";
      payload: Player[];
    };

export function reducer(_state: State, action: Action): State {
  switch (action.type) {
    case "startFreshGame":
      return { view: "selectPlayers" };
    case "assignRoleToPlayer":
      const playerRoles = assignRoleToPlayers(action.payload);
      setValue("gameData", GameData, {
        phase: "showRole",
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
  whenInit: (gameData: GameData) => JSX.Element;
  whenSelectPlayers: () => JSX.Element;
  whenShowRole: (playerRoles: { player: Player; role: Role }[]) => JSX.Element;
}): (state: State) => JSX.Element {
  return (state) => {
    switch (state.view) {
      case "init":
        return match.whenInit(state.gameData);
      case "selectPlayers":
        return match.whenSelectPlayers();
      case "showRole":
        return match.whenShowRole(state.playerRoles);
    }
  };
}
