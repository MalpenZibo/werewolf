import { Aura, GameData, Player, PlayerData } from "../domain";
import { generatePlayersData } from "../gameplay";
import { setValue } from "../localStorage";
import { Option } from "fp-ts/Option";
import { pipe, constant, constFalse } from "fp-ts/function";
import { array, option } from "fp-ts";

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
    }
  | {
      view: "nightRecapAndDiscussion";
      gameData: GameData;
      newsFromBard: boolean;
      newsFromInn: boolean;
      playerKilled: Player[];
    };

type Action =
  | { type: "startFreshGame" }
  | {
      type: "assignRoleToPlayer";
      payload: Player[];
    }
  | {
      type: "startNight";
    }
  | {
      type: "endNight";
      payload: {
        killedPlayers: Player[];
        farmerIntoWolf: Option<Player>;
        healerUseHisAbility: boolean;
        findAura: Option<Aura>;
      };
    }
  | {
      type: "resumeGame";
      payload: GameData;
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
        nightNumber: 1,
        farmerTurnedIntoWolves: [],
        healerUseHisAbility: false,
        lastTurn: option.none,
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
    case "endNight":
      if (state.view === "night") {
        const gameData: GameData = {
          ...state.gameData,
          playersData: pipe(
            state.gameData.playersData,
            array.map((pd) =>
              pipe(
                action.payload.killedPlayers,
                array.findFirst((p) => p.name === pd.player.name),
                option.fold(
                  constant(pd),
                  constant({
                    ...pd,
                    alive: false,
                    killedDuringNightNumber: state.gameData.nightNumber,
                  })
                )
              )
            )
          ),
          healerUseHisAbility: action.payload.healerUseHisAbility,
          farmerTurnedIntoWolves: pipe(
            action.payload.farmerIntoWolf,
            option.fold(
              constant([...state.gameData.farmerTurnedIntoWolves]),
              (farmerIntoWolf) => [
                ...state.gameData.farmerTurnedIntoWolves,
                farmerIntoWolf,
              ]
            )
          ),
          nightNumber: state.gameData.nightNumber + 1,
          lastTurn: option.some({
            killedDuringNight: action.payload.killedPlayers,
            findAura: action.payload.findAura,
            killedDuringDay: option.none,
          }),
          phase: "nightRecapAndDiscussion",
        };
        setValue("gameData", GameData, gameData);
        return {
          view: "nightRecapAndDiscussion",
          gameData: gameData,
          playerKilled: action.payload.killedPlayers,
          newsFromBard: pipe(
            state.gameData.playersData,
            array.findFirst((p) => p.roleId === "bard"),
            option.map(() =>
              pipe(
                action.payload.findAura,
                option.fold(constFalse, (a) => a === "light")
              )
            ),
            option.getOrElse(constFalse)
          ),
          newsFromInn: pipe(
            state.gameData.playersData,
            array.findFirst((p) => p.roleId === "innkeeper"),
            option.map(() =>
              pipe(
                action.payload.findAura,
                option.fold(constFalse, (a) => a === "dark")
              )
            ),
            option.getOrElse(constFalse)
          ),
        };
      } else {
        return state;
      }
    case "resumeGame":
      switch (action.payload.phase) {
        case "showRole":
          return {
            view: "showRole",
            gameData: action.payload,
          };
        case "night":
          return {
            view: "night",
            gameData: action.payload,
          };
        case "nightRecapAndDiscussion":
          return {
            view: "nightRecapAndDiscussion",
            gameData: action.payload,
            playerKilled: pipe(
              action.payload.lastTurn,
              option.map((l) => l.killedDuringNight),
              option.getOrElse<Player[]>(constant([]))
            ),
            newsFromBard: pipe(
              action.payload.playersData,
              array.findFirst((p) => p.roleId === "bard"),
              option.map(() =>
                pipe(
                  action.payload.lastTurn,
                  option.chain((l) => l.findAura),
                  option.fold(constFalse, (a) => a === "light")
                )
              ),
              option.getOrElse(constFalse)
            ),
            newsFromInn: pipe(
              action.payload.playersData,
              array.findFirst((p) => p.roleId === "innkeeper"),
              option.map(() =>
                pipe(
                  action.payload.lastTurn,
                  option.chain((l) => l.findAura),
                  option.fold(constFalse, (a) => a === "dark")
                )
              ),
              option.getOrElse(constFalse)
            ),
          };
      }
      return state;
  }
}

export function foldStatus(match: {
  whenInit: (gameData: GameData) => JSX.Element;
  whenSelectPlayers: () => JSX.Element;
  whenShowRole: (playerRoles: PlayerData[]) => JSX.Element;
  whenNight: (playerRoles: PlayerData[], nightNumber: number) => JSX.Element;
  whenNightRecapAndDiscussion: (
    playerKilled: Player[],
    newsFromInn: boolean,
    newsFromBard: boolean
  ) => JSX.Element;
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
      case "nightRecapAndDiscussion":
        return match.whenNightRecapAndDiscussion(
          state.playerKilled,
          state.newsFromInn,
          state.newsFromBard
        );
    }
  };
}
