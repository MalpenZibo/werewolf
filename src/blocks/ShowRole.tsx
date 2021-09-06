import { Player, Role } from "../domain";

type Props = {
  playerRoles: { player: Player; role: Role }[];
};

export function ShowRole(props: Props) {
  console.log(props.playerRoles);

  return <></>;
}
