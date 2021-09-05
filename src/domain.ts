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
}

const primaryWolf: Role = {
  id: "primaryWolf",
  aura: "dark",
  mystical: false,
  faction: "wolf",
};
const secondaryWolf: Role = {
  id: "secondaryWolf",
  aura: "dark",
  mystical: false,
  faction: "wolf",
};
const youngWolf: Role = {
  id: "youngWolf",
  aura: "dark",
  mystical: false,
  faction: "wolf",
};
const traitor: Role = {
  id: "traitor",
  aura: "light",
  mystical: false,
  faction: "wolf",
};
const seer: Role = {
  id: "seer",
  aura: "light",
  mystical: true,
  faction: "village",
};
const wizard: Role = {
  id: "wizard",
  aura: "light",
  mystical: true,
  faction: "village",
};
const medium: Role = {
  id: "medium",
  aura: "light",
  mystical: true,
  faction: "village",
};
const witch: Role = {
  id: "witch",
  aura: "light",
  mystical: true,
  faction: "village",
};
const healer: Role = {
  id: "healer",
  aura: "light",
  mystical: true,
  faction: "village",
};
const farmer: Role = {
  id: "farmer",
  aura: "light",
  mystical: false,
  faction: "village",
};
const innkeeper: Role = {
  id: "innkeeper",
  aura: "light",
  mystical: false,
  faction: "village",
};
const bard: Role = {
  id: "bard",
  aura: "light",
  mystical: false,
  faction: "village",
};
const monk: Role = {
  id: "monk",
  aura: "light",
  mystical: false,
  faction: "village",
};
const heremit: Role = {
  id: "heremit",
  aura: "light",
  mystical: false,
  faction: "village",
};
const priest: Role = {
  id: "priest",
  aura: "light",
  mystical: false,
  faction: "village",
};
const sinner: Role = {
  id: "sinner",
  aura: "dark",
  mystical: false,
  faction: "village",
};
const madman: Role = {
  id: "madman",
  aura: "light",
  mystical: false,
  faction: "general",
};
const jester: Role = {
  id: "jester",
  aura: "light",
  mystical: false,
  faction: "general",
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

export type RoleId =
  | "primaryWolf"
  | "secondaryWolf"
  | "youngWolf"
  | "traitor"
  | "seer"
  | "wizard"
  | "medium"
  | "witch"
  | "healer"
  | "farmer"
  | "innkeeper"
  | "bard"
  | "monk"
  | "heremit"
  | "priest"
  | "sinner"
  | "madman"
  | "jester";

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
