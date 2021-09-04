import { end, format, lit, parse, Route, zero } from "fp-ts-routing";
import { initializeRouter, Routing } from "./Router/RouterProvider";

interface Home {
  readonly _tag: "Home";
}

interface Roles {
  readonly _tag: "Roles";
}

interface Game {
  readonly _tag: "Game";
}

interface Players {
  readonly _tag: "Players";
}

export type Location = Home | Roles | Game | Players;

const home: Home = { _tag: "Home" };
const roles: Roles = { _tag: "Roles" };
const game: Game = { _tag: "Game" };
const players: Players = { _tag: "Players" };

export const locations = {
  home,
  roles,
  game,
  players,
};

const defaults = end;
const rolesMatch = lit("roles").then(end);
const gameMatch = lit("game").then(end);
const playersMatch = lit("players").then(end);

const router = zero<Location>()
  .alt(defaults.parser.map(() => home))
  .alt(rolesMatch.parser.map(() => roles))
  .alt(gameMatch.parser.map(() => game))
  .alt(playersMatch.parser.map(() => players));

function parseLocation(s: string): Location {
  return parse(router, Route.parse(s), home);
}

function formatLocation(l: Location): string {
  switch (l._tag) {
    case "Home":
      return format(defaults.formatter, l);
    case "Roles":
      return format(rolesMatch.formatter, l);
    case "Game":
      return format(gameMatch.formatter, l);
    case "Players":
      return format(playersMatch.formatter, l);
  }
}

export const routing: Routing<Location> = {
  formatLocation,
  parseLocation,
};

export const { RouterProvider, useRouter } = initializeRouter<Location>();
