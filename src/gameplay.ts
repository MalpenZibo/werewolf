import { array, eq, option, record, nonEmptyArray } from "fp-ts";
import { pipe } from "fp-ts/function";
import { Player, PlayerData, Role, RoleId, roles } from "./domain";
import { Option } from "fp-ts/Option";
import { NonEmptyArray } from "fp-ts/NonEmptyArray";

function shuffle<T>(array: T[]): T[] {
  let currentIndex = array.length,
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

function fitnessShuffle<T>(
  getFitness: (t: T) => number
): (collection: T[]) => T[] {
  return (collection: T[]): T[] => {
    let currentIndex = 0;
    let shuffleArray: T[] = [...collection];
    while (currentIndex < shuffleArray.length) {
      const startIndex = currentIndex;
      const totalFitness = pipe(
        shuffleArray,
        array.reduceWithIndex(0, (i, a, b) =>
          i >= startIndex ? a + getFitness(b) : a
        )
      );
      const slice = Math.floor(Math.random() * totalFitness);

      let fitnessSoFar = 0;
      for (let i = currentIndex; i < shuffleArray.length; i++) {
        fitnessSoFar += getFitness(shuffleArray[i]);
        if (fitnessSoFar > slice) {
          const t = shuffleArray[currentIndex];
          shuffleArray[currentIndex] = shuffleArray[i];
          shuffleArray[i] = t;
        }
      }
      currentIndex += 1;
    }
    return shuffleArray;
  };
}

export function generatePlayersData(players: Player[]): PlayerData[] {
  const wolfNumber = Math.floor(players.length / 4) - 1;

  const shuffledPlayers = pipe(players, shuffle);

  let playerRoles: { player: Player; roleId: RoleId }[] = [];
  pipe(
    shuffledPlayers.pop(),
    option.fromNullable,
    option.fold(
      () => {},
      (p) => playerRoles.push({ player: p, roleId: roles.primaryWolf.id })
    )
  );
  pipe(
    shuffledPlayers.pop(),
    option.fromNullable,
    option.fold(
      () => {},
      (p) => playerRoles.push({ player: p, roleId: roles.seer.id })
    )
  );

  const wolfRoles = pipe(
    [roles.secondaryWolf, roles.youngWolf, roles.traitor],
    fitnessShuffle((t) => t.fitness)
  );
  for (let i = 0; i < wolfNumber; i++) {
    pipe(
      shuffledPlayers.pop(),
      option.fromNullable,
      option.fold(
        () => {},
        (p) => playerRoles.push({ player: p, roleId: wolfRoles[i].id })
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
    fitnessShuffle(([, t]) => t.fitness)
  );

  pipe(
    shuffledPlayers,
    array.map((p) =>
      pipe(
        otherRoles.pop(),
        option.fromNullable,
        option.fold(
          () => {},
          ([, r]) => playerRoles.push({ player: p, roleId: r.id })
        )
      )
    )
  );

  return pipe(
    playerRoles,
    shuffle,
    array.map((v) => ({ ...v, alive: true }))
  );
}

export const wolves: RoleId[] = ["primaryWolf", "secondaryWolf", "youngWolf"];

type NightTurn = "seer" | "wolves" | "wizard" | "medium" | "witch" | "healer";
export const nightTurns: NightTurn[] = [
  "seer",
  "wolves",
  "wizard",
  "medium",
  "witch",
  "healer",
];

export function foldShowRoleAction(match: {
  whenWolves: (traitor: Option<Player>) => JSX.Element;
  whenMonk: (missingRoles: Option<NonEmptyArray<Role>>) => JSX.Element;
  whenPriest: (sinner: Option<Player>) => JSX.Element;
}): (data: {
  roleId: RoleId;
  playersData: PlayerData[];
}) => JSX.Element | undefined {
  return (data: { roleId: RoleId; playersData: PlayerData[] }) => {
    const { roleId, playersData } = data;
    if (
      pipe(
        wolves,
        array.findFirst((v) => v === roleId),
        option.isSome
      )
    ) {
      return match.whenWolves(
        pipe(
          playersData,
          array.findFirst((v) => v.roleId === "traitor"),
          option.map((v) => v.player)
        )
      );
    }

    if (roleId === "monk") {
      return match.whenMonk(
        pipe(
          roles,
          record.toArray,
          array.map(([, r]) => r),
          array.difference<Role>(eq.fromEquals((a, b) => a.id === b.id))(
            pipe(
              playersData,
              array.map((pr) => roles[pr.roleId])
            )
          ),
          shuffle,
          (missingRole): Option<NonEmptyArray<Role>> => {
            if (missingRole.length === 0) {
              return option.none;
            }

            return pipe(
              missingRole,
              array.filterWithIndex((i) => i < 2),
              nonEmptyArray.fromArray
            );
          }
        )
      );
    }

    if (roleId === "priest") {
      return match.whenPriest(
        pipe(
          playersData,
          array.findFirstMap((v) =>
            v.roleId === "sinner" ? option.some(v.player) : option.none
          )
        )
      );
    }

    return;
  };
}

export function foldNightAction(match: {
  whenSeer: () => JSX.Element;
  whenWolves: () => JSX.Element;
  whenWizard: () => JSX.Element;
  whenMedium: () => JSX.Element;
  whenWitch: () => JSX.Element;
  whenHealer: () => JSX.Element;
}): (turn: NightTurn) => JSX.Element {
  return (turn: NightTurn) => {
    switch (turn) {
      case "seer":
        return match.whenSeer();
      case "wolves":
        return match.whenWolves();
      case "wizard":
        return match.whenWizard();
      case "medium":
        return match.whenMedium();
      case "witch":
        return match.whenWitch();
      case "healer":
        return match.whenHealer();
    }
  };
}
