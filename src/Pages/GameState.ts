import { GameData, Player, PlayerData } from "../domain";
import { generatePlayersData } from "../gameplay";
import { setValue } from "../localStorage";

export type State =
  | {
      view: "init";
      gameData: GameData;
    }
  | {
      view: "selectPlayers";
    }
  | { view: "showRole"; playersData: PlayerData[] }
  | {
      view: "night";
      playersData: PlayerData[];
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
      const playersData = generatePlayersData(action.payload);
      setValue("gameData", GameData, {
        phase: "showRole",
        playersData,
        nightNumber: 0,
      });
      return {
        view: "showRole",
        playersData: playersData,
      };
    case "startNight":
      if (state.view === "showRole") {
        setValue("gameData", GameData, {
          phase: "showRole",
          playersData: state.playersData,
          nightNumber: 0,
        });
        return {
          view: "night",
          playersData: state.playersData,
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
  whenShowRole: (playerRoles: PlayerData[]) => JSX.Element;
  whenNight: (playerRoles: PlayerData[], nightNumber: number) => JSX.Element;
}): (state: State) => JSX.Element {
  return (state) => {
    switch (state.view) {
      case "init":
        return match.whenInit(state.gameData);
      case "selectPlayers":
        return match.whenSelectPlayers();
      case "showRole":
        return match.whenShowRole(state.playersData);
      case "night":
        return match.whenNight(state.playersData, state.nightNumber);
    }
  };
}
