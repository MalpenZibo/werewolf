import { useIntl } from "react-intl";
import { Faction, RoleId } from "./domain";

export function useFormatRole(): {
  formatName: (roleId: RoleId) => string;
  formatDescription: (roleId: RoleId) => string;
} {
  const { formatMessage } = useIntl();

  const formatName = (roleId: RoleId) => {
    switch (roleId) {
      case "primaryWolf":
        return formatMessage({ id: "role.primaryWolf.name" });
      case "secondaryWolf":
        return formatMessage({ id: "role.secondaryWolf.name" });
      case "youngWolf":
        return formatMessage({ id: "role.youngWolf.name" });
      case "traitor":
        return formatMessage({ id: "role.traitor.name" });
      case "seer":
        return formatMessage({ id: "role.seer.name" });
      case "wizard":
        return formatMessage({ id: "role.wizard.name" });
      case "medium":
        return formatMessage({ id: "role.medium.name" });
      case "witch":
        return formatMessage({ id: "role.witch.name" });
      case "healer":
        return formatMessage({ id: "role.healer.name" });
      case "farmer":
        return formatMessage({ id: "role.farmer.name" });
      case "innkeeper":
        return formatMessage({ id: "role.innkeeper.name" });
      case "bard":
        return formatMessage({ id: "role.bard.name" });
      case "monk":
        return formatMessage({ id: "role.monk.name" });
      case "heremit":
        return formatMessage({ id: "role.heremit.name" });
      case "priest":
        return formatMessage({ id: "role.priest.name" });
      case "sinner":
        return formatMessage({ id: "role.sinner.name" });
      case "madman":
        return formatMessage({ id: "role.madman.name" });
      case "jester":
        return formatMessage({ id: "role.jester.name" });
    }
  };

  const formatDescription = (roleId: RoleId) => {
    switch (roleId) {
      case "primaryWolf":
        return formatMessage({ id: "role.primaryWolf.description" });
      case "secondaryWolf":
        return formatMessage({ id: "role.secondaryWolf.description" });
      case "youngWolf":
        return formatMessage({ id: "role.youngWolf.description" });
      case "traitor":
        return formatMessage({ id: "role.traitor.description" });
      case "seer":
        return formatMessage({ id: "role.seer.description" });
      case "wizard":
        return formatMessage({ id: "role.wizard.description" });
      case "medium":
        return formatMessage({ id: "role.medium.description" });
      case "witch":
        return formatMessage({ id: "role.witch.description" });
      case "healer":
        return formatMessage({ id: "role.healer.description" });
      case "farmer":
        return formatMessage({ id: "role.farmer.description" });
      case "innkeeper":
        return formatMessage({ id: "role.innkeeper.description" });
      case "bard":
        return formatMessage({ id: "role.bard.description" });
      case "monk":
        return formatMessage({ id: "role.monk.description" });
      case "heremit":
        return formatMessage({ id: "role.heremit.description" });
      case "priest":
        return formatMessage({ id: "role.priest.description" });
      case "sinner":
        return formatMessage({ id: "role.sinner.description" });
      case "madman":
        return formatMessage({ id: "role.madman.description" });
      case "jester":
        return formatMessage({ id: "role.jester.description" });
    }
  };

  return { formatName, formatDescription };
}

export function useFormatFaction(): (faction: Faction) => string {
  const { formatMessage } = useIntl();

  const formatFaction = (faction: Faction) => {
    switch (faction) {
      case "general":
        return formatMessage({ id: "faction.general" });
      case "wolf":
        return formatMessage({ id: "faction.wolf" });
      case "village":
        return formatMessage({ id: "faction.village" });
    }
  };

  return formatFaction;
}
