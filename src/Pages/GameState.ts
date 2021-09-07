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
  | { view: "showRole"; playerRoles: { player: Player; role: Role }[] }
  | {
      view: "night";
      playerRoles: { player: Player; role: Role }[];
      nightNumber: number;
    };

type Action =
  | { type: "startFreshGame" }
  | {
      type: "assignRoleToPlayer";
      payload: Player[];
    }
  | {
      type: "startNight";
    };

export function reducer(state: State, action: Action): State {
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
        nightNumber: 0,
      });
      return {
        view: "showRole",
        playerRoles: playerRoles,
      };
    case "startNight":
      if (state.view === "showRole") {
        setValue("gameData", GameData, {
          phase: "showRole",
          playersRole: pipe(
            state.playerRoles,
            array.map((v) => ({ player: v.player, roleId: v.role.id }))
          ),
          nightNumber: 0,
        });
        return {
          view: "night",
          playerRoles: state.playerRoles,
          nightNumber: 0,
        };
      } else {
        return state;
      }
  }
}

export function foldStatus(match: {
  whenInit: (gameData: GameData) => JSX.Element;
  whenSelectPlayers: () => JSX.Element;
  whenShowRole: (playerRoles: { player: Player; role: Role }[]) => JSX.Element;
  whenNight: (
    playerRoles: { player: Player; role: Role }[],
    nightNumber: number
  ) => JSX.Element;
}): (state: State) => JSX.Element {
  return (state) => {
    switch (state.view) {
      case "init":
        return match.whenInit(state.gameData);
      case "selectPlayers":
        return match.whenSelectPlayers();
      case "showRole":
        return match.whenShowRole(state.playerRoles);
      case "night":
        return match.whenNight(state.playerRoles, state.nightNumber);
    }
  };
}
