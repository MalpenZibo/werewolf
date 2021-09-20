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
  | { view: "showRole"; gameData: GameData }
  | {
      view: "night";
      gameData: GameData;
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
      const gameData: GameData = {
        phase: "showRole",
        playersData,
        nightNumber: 0,
        farmerTurnedIntoWolves: [],
        healerUseHisAbility: false,
      };
      setValue("gameData", GameData, gameData);
      return {
        view: "showRole",
        gameData: gameData,
      };
    case "startNight":
      if (state.view === "showRole") {
        const gameData: GameData = {
          ...state.gameData,
          phase: "night",
        };
        setValue("gameData", GameData, gameData);
        return {
          view: "night",
          gameData: gameData,
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
        return match.whenShowRole(state.gameData.playersData);
      case "night":
        return match.whenNight(
          state.gameData.playersData,
          state.gameData.nightNumber
        );
    }
  };
}
