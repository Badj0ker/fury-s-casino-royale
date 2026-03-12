// ============ PVP ARENA TYPES & DATA ============

export type PvpRank = "bronze" | "silver" | "gold" | "platinum" | "diamond" | "fury-legend";

export interface PvpRival {
  id: string;
  name: string;
  emoji: string;
  level: number;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  critChance: number;
  rank: PvpRank;
  elo: number;
  wins: number;
  losses: number;
  equippedItems: string[];
  aiStyle: "aggressive" | "balanced" | "defensive";
}

export interface PvpRecord {
  elo: number;
  rank: PvpRank;
  wins: number;
  losses: number;
  winStreak: number;
  bestStreak: number;
  seasonGold: number;
}

export const RANK_THRESHOLDS: { rank: PvpRank; minElo: number; icon: string; color: string }[] = [
  { rank: "bronze", minElo: 0, icon: "🥉", color: "text-orange-400" },
  { rank: "silver", minElo: 1000, icon: "🥈", color: "text-gray-300" },
  { rank: "gold", minElo: 1200, icon: "🥇", color: "text-secondary" },
  { rank: "platinum", minElo: 1400, icon: "💠", color: "text-cyan-400" },
  { rank: "diamond", minElo: 1600, icon: "💎", color: "text-blue-400" },
  { rank: "fury-legend", minElo: 1900, icon: "👑", color: "text-primary" },
];

export function getRankForElo(elo: number): PvpRank {
  for (let i = RANK_THRESHOLDS.length - 1; i >= 0; i--) {
    if (elo >= RANK_THRESHOLDS[i].minElo) return RANK_THRESHOLDS[i].rank;
  }
  return "bronze";
}

export function getRankInfo(rank: PvpRank) {
  return RANK_THRESHOLDS.find(r => r.rank === rank)!;
}

// 20 pre-generated rivals simulating real players
export const RIVAL_POOL: PvpRival[] = [
  { id: "r1", name: "xShadowDealerx", emoji: "🎭", level: 4, hp: 90, maxHp: 90, attack: 15, defense: 10, critChance: 6, rank: "bronze", elo: 850, wins: 12, losses: 15, equippedItems: ["Rusty Blade", "Leather Vest"], aiStyle: "aggressive" },
  { id: "r2", name: "LuckyLucy77", emoji: "🍀", level: 5, hp: 100, maxHp: 100, attack: 17, defense: 11, critChance: 8, rank: "bronze", elo: 920, wins: 18, losses: 14, equippedItems: ["Lucky Dice", "Chip Shield"], aiStyle: "balanced" },
  { id: "r3", name: "CardCounter99", emoji: "🃏", level: 5, hp: 95, maxHp: 95, attack: 19, defense: 9, critChance: 10, rank: "silver", elo: 1020, wins: 25, losses: 18, equippedItems: ["Dealer's Blade", "Poker Visor"], aiStyle: "aggressive" },
  { id: "r4", name: "TankMaster_GG", emoji: "🛡️", level: 6, hp: 130, maxHp: 130, attack: 14, defense: 18, critChance: 4, rank: "silver", elo: 1080, wins: 30, losses: 22, equippedItems: ["Iron Shield", "Heavy Armor"], aiStyle: "defensive" },
  { id: "r5", name: "AceHighRoller", emoji: "♠️", level: 6, hp: 105, maxHp: 105, attack: 20, defense: 12, critChance: 9, rank: "silver", elo: 1150, wins: 35, losses: 20, equippedItems: ["Golden Card", "Chip Shield"], aiStyle: "balanced" },
  { id: "r6", name: "NeonViper420", emoji: "🐍", level: 7, hp: 110, maxHp: 110, attack: 22, defense: 13, critChance: 11, rank: "gold", elo: 1220, wins: 42, losses: 25, equippedItems: ["Venom Fang", "Shadow Cloak"], aiStyle: "aggressive" },
  { id: "r7", name: "CasinoQueen", emoji: "👑", level: 7, hp: 115, maxHp: 115, attack: 18, defense: 16, critChance: 7, rank: "gold", elo: 1280, wins: 38, losses: 24, equippedItems: ["Royal Scepter", "Diamond Ring"], aiStyle: "balanced" },
  { id: "r8", name: "BluffKing2024", emoji: "😏", level: 8, hp: 120, maxHp: 120, attack: 21, defense: 14, critChance: 12, rank: "gold", elo: 1350, wins: 50, losses: 28, equippedItems: ["Trickster's Dagger", "Poker Visor"], aiStyle: "defensive" },
  { id: "r9", name: "SlotDestroyer", emoji: "🎰", level: 8, hp: 108, maxHp: 108, attack: 24, defense: 11, critChance: 14, rank: "platinum", elo: 1420, wins: 55, losses: 30, equippedItems: ["Jackpot Hammer", "Lucky Charm"], aiStyle: "aggressive" },
  { id: "r10", name: "DiamondDiva", emoji: "💎", level: 9, hp: 125, maxHp: 125, attack: 23, defense: 15, critChance: 10, rank: "platinum", elo: 1480, wins: 60, losses: 32, equippedItems: ["Crystal Blade", "Diamond Armor"], aiStyle: "balanced" },
  { id: "r11", name: "RouletteRuler", emoji: "🎡", level: 9, hp: 130, maxHp: 130, attack: 20, defense: 19, critChance: 8, rank: "platinum", elo: 1550, wins: 65, losses: 35, equippedItems: ["Fortune Wheel", "Iron Wall"], aiStyle: "defensive" },
  { id: "r12", name: "xVenomAcex", emoji: "☠️", level: 10, hp: 118, maxHp: 118, attack: 26, defense: 13, critChance: 15, rank: "diamond", elo: 1620, wins: 72, losses: 33, equippedItems: ["Death Card", "Shadow Cloak"], aiStyle: "aggressive" },
  { id: "r13", name: "ChipLord_Pro", emoji: "🪙", level: 10, hp: 135, maxHp: 135, attack: 22, defense: 17, critChance: 11, rank: "diamond", elo: 1680, wins: 78, losses: 36, equippedItems: ["Golden Gauntlet", "Chip Armor"], aiStyle: "balanced" },
  { id: "r14", name: "SilentBlade_X", emoji: "🗡️", level: 11, hp: 122, maxHp: 122, attack: 28, defense: 14, critChance: 16, rank: "diamond", elo: 1750, wins: 85, losses: 38, equippedItems: ["Phantom Edge", "Shadow Vest"], aiStyle: "aggressive" },
  { id: "r15", name: "IronFortress", emoji: "🏰", level: 11, hp: 150, maxHp: 150, attack: 19, defense: 22, critChance: 6, rank: "diamond", elo: 1820, wins: 80, losses: 40, equippedItems: ["Tower Shield", "Fortress Plate"], aiStyle: "defensive" },
  { id: "r16", name: "FuryHunter01", emoji: "🔥", level: 12, hp: 140, maxHp: 140, attack: 27, defense: 18, critChance: 13, rank: "fury-legend", elo: 1920, wins: 100, losses: 42, equippedItems: ["Fury Blade", "FURY's Token"], aiStyle: "balanced" },
  { id: "r17", name: "DarkJoker666", emoji: "🤡", level: 13, hp: 145, maxHp: 145, attack: 30, defense: 16, critChance: 17, rank: "fury-legend", elo: 1980, wins: 110, losses: 45, equippedItems: ["Joker's Wild", "Chaos Cloak"], aiStyle: "aggressive" },
  { id: "r18", name: "QueenOfAces", emoji: "♥️", level: 14, hp: 155, maxHp: 155, attack: 28, defense: 20, critChance: 14, rank: "fury-legend", elo: 2050, wins: 120, losses: 48, equippedItems: ["Royal Flush Blade", "Crown Armor"], aiStyle: "balanced" },
  { id: "r19", name: "TheHouseEdge", emoji: "🏛️", level: 15, hp: 165, maxHp: 165, attack: 25, defense: 24, critChance: 12, rank: "fury-legend", elo: 2150, wins: 130, losses: 50, equippedItems: ["House Edge", "Vault Guard"], aiStyle: "defensive" },
  { id: "r20", name: "xFURYx_GOD", emoji: "🦝", level: 20, hp: 200, maxHp: 200, attack: 35, defense: 25, critChance: 18, rank: "fury-legend", elo: 2400, wins: 200, losses: 55, equippedItems: ["FURY's Wrath", "FURY's Token", "Crown of Fury"], aiStyle: "aggressive" },
];

export function getMatchmakingPool(playerLevel: number, playerElo: number): PvpRival[] {
  return RIVAL_POOL.filter(r => {
    const levelDiff = Math.abs(r.level - playerLevel);
    const eloDiff = Math.abs(r.elo - playerElo);
    return levelDiff <= 3 && eloDiff <= 400;
  }).slice(0, 5);
}

export function calculateEloChange(playerElo: number, rivalElo: number, won: boolean): number {
  const K = 32;
  const expected = 1 / (1 + Math.pow(10, (rivalElo - playerElo) / 400));
  const actual = won ? 1 : 0;
  return Math.round(K * (actual - expected));
}
