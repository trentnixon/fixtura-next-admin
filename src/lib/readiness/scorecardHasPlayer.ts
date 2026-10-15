function namedCell(value: unknown): boolean {
  return typeof value === "string" && value.trim() !== "" && value.trim() !== "-";
}

function namedRow(rows: unknown): boolean {
  if (!Array.isArray(rows)) return false;
  return rows.some((row) => Array.isArray(row) && namedCell(row[0]));
}

function namedLegacyPlayer(player: unknown): boolean {
  if (player == null || typeof player !== "object") return false;
  const name = "name" in player && typeof player.name === "string" ? player.name : "";
  const alternate = "player" in player && typeof player.player === "string" ? player.player : "";
  return name.trim() !== "" || alternate.trim() !== "";
}

function cardHasPlayer(card: unknown): boolean {
  if (card == null || typeof card !== "object") return false;

  if ("battingRows" in card && namedRow(card.battingRows)) return true;
  if ("bowlingRows" in card && namedRow(card.bowlingRows)) return true;

  const players = [
    ...("batting" in card && Array.isArray(card.batting) ? card.batting : []),
    ...("bowling" in card && Array.isArray(card.bowling) ? card.bowling : []),
  ];
  return players.some(namedLegacyPlayer);
}

export function scorecardHasPlayer(scorecards: object | null | undefined): boolean {
  if (scorecards == null) return false;
  return Object.values(scorecards).some(cardHasPlayer);
}
