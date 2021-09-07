import { array, option, record } from "fp-ts";
import { pipe } from "fp-ts/function";
import { Player, Role, roles } from "./domain";

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

export function assignRoleToPlayers(
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
    fitnessShuffle((t) => t.fitness)
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
          ([, r]) => playerRoles.push({ player: p, role: r })
        )
      )
    )
  );

  return pipe(playerRoles, shuffle);
}
