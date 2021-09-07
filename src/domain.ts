import { array, record } from "fp-ts";
import * as S from "fp-ts/string";
import { pipe } from "fp-ts/function";
import * as t from "io-ts";
import { NonEmptyString } from "io-ts-types/NonEmptyString";

export interface Role {
  readonly id: RoleId;
  readonly aura: Aura;
  readonly mystical: boolean;
  readonly faction: Faction;
  readonly fitness: number;
}

const primaryWolf: Role = {
  id: "primaryWolf",
  aura: "dark",
  mystical: false,
  faction: "wolf",
  fitness: 100,
};
const secondaryWolf: Role = {
  id: "secondaryWolf",
  aura: "dark",
  mystical: false,
  faction: "wolf",
  fitness: 75,
};
const youngWolf: Role = {
  id: "youngWolf",
  aura: "dark",
  mystical: false,
  faction: "wolf",
  fitness: 50,
};
const traitor: Role = {
  id: "traitor",
  aura: "light",
  mystical: false,
  faction: "wolf",
  fitness: 30,
};
const seer: Role = {
  id: "seer",
  aura: "light",
  mystical: true,
  faction: "village",
  fitness: 100,
};
const wizard: Role = {
  id: "wizard",
  aura: "light",
  mystical: true,
  faction: "village",
  fitness: 30,
};
const medium: Role = {
  id: "medium",
  aura: "light",
  mystical: true,
  faction: "village",
  fitness: 30,
};
const witch: Role = {
  id: "witch",
  aura: "light",
  mystical: true,
  faction: "village",
  fitness: 50,
};
const healer: Role = {
  id: "healer",
  aura: "light",
  mystical: true,
  faction: "village",
  fitness: 40,
};
const farmer: Role = {
  id: "farmer",
  aura: "light",
  mystical: false,
  faction: "village",
  fitness: 400,
};
const innkeeper: Role = {
  id: "innkeeper",
  aura: "light",
  mystical: false,
  faction: "village",
  fitness: 50,
};
const bard: Role = {
  id: "bard",
  aura: "light",
  mystical: false,
  faction: "village",
  fitness: 50,
};
const monk: Role = {
  id: "monk",
  aura: "light",
  mystical: false,
  faction: "village",
  fitness: 20,
};
const heremit: Role = {
  id: "heremit",
  aura: "light",
  mystical: false,
  faction: "village",
  fitness: 20,
};
const priest: Role = {
  id: "priest",
  aura: "light",
  mystical: false,
  faction: "village",
  fitness: 40,
};
const sinner: Role = {
  id: "sinner",
  aura: "dark",
  mystical: false,
  faction: "village",
  fitness: 40,
};
const madman: Role = {
  id: "madman",
  aura: "light",
  mystical: false,
  faction: "general",
  fitness: 20,
};
const jester: Role = {
  id: "jester",
  aura: "light",
  mystical: false,
  faction: "general",
  fitness: 20,
};

export const roles = {
  primaryWolf,
  secondaryWolf,
  youngWolf,
  traitor,
  seer,
  wizard,
  medium,
  witch,
  healer,
  farmer,
  innkeeper,
  bard,
  monk,
  heremit,
  priest,
  sinner,
  madman,
  jester,
};

const RoleId = t.keyof({
  primaryWolf: true,
  secondaryWolf: true,
  youngWolf: true,
  traitor: true,
  seer: true,
  wizard: true,
  medium: true,
  witch: true,
  healer: true,
  farmer: true,
  innkeeper: true,
  bard: true,
  monk: true,
  heremit: true,
  priest: true,
  sinner: true,
  madman: true,
  jester: true,
});
export type RoleId = t.TypeOf<typeof RoleId>;

export type Faction = "village" | "general" | "wolf";

export type Aura = "light" | "dark";

export const factions = pipe(
  roles,
  record.toArray,
  array.map(([, r]) => r.faction),
  array.uniq<Faction>(S.Eq)
);

export const Player = t.type({
  name: NonEmptyString,
});
export type Player = t.TypeOf<typeof Player>;

const PlayerRole = t.type({
  player: Player,
  roleId: RoleId,
});

export const GameData = t.type({
  playersRole: t.array(PlayerRole),
});
