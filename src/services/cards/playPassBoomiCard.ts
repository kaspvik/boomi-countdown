import { passBomb } from "../gameplay/passBomb";

export async function playPassBoomiCard(
  roomId: string,
  fromPlayerId: string,
  toPlayerId: string
): Promise<void> {
  await passBomb(roomId, fromPlayerId, toPlayerId);
}
