// ============ TYPES ============
export interface PlayerStats {
  name: string;
  level: number;
  xp: number;
  xpToNext: number;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  gold: number;
  bfg: number;
  critChance: number;
}

export interface Skill {
  id: string;
  name: string;
  icon: string;
  type: "attack" | "heal" | "special";
  damage?: number;
  heal?: number;
  cooldown: number;
  description: string;
}

export interface Enemy {
  id: string;
  name: string;
  emoji: string;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  role: "tank" | "dps" | "healer" | "elite" | "boss";
  xpReward: number;
  goldReward: number;
  abilities?: string[];
}

export interface Zone {
  id: string;
  name: string;
  icon: string;
  description: string;
  requiredLevel: number;
  enemies: Enemy[];
  unlocked: boolean;
  completed: boolean;
  progress: number;
  maxProgress: number;
  bgColor: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  type: "daily" | "story";
  progress: number;
  maxProgress: number;
  xpReward: number;
  goldReward: number;
  completed: boolean;
  claimed: boolean;
}

export interface InventoryItem {
  id: string;
  name: string;
  icon: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  type: "weapon" | "armor" | "accessory" | "consumable";
  stats: Record<string, number>;
  equipped: boolean;
}

export type StatusEffect = {
  id: string;
  name: string;
  icon: string;
  duration: number;
  type: "dot" | "buff" | "debuff";
};

// ============ DEFAULT DATA ============

export const DEFAULT_PLAYER: PlayerStats = {
  name: "Lucky Ace",
  level: 5,
  xp: 340,
  xpToNext: 500,
  hp: 85,
  maxHp: 100,
  attack: 18,
  defense: 12,
  gold: 1250,
  bfg: 420,
  critChance: 8,
};

export const SKILLS: Skill[] = [
  { id: "basic", name: "Card Strike", icon: "🃏", type: "attack", damage: 15, cooldown: 0, description: "Basic attack with a sharp card" },
  { id: "heal", name: "Lucky Charm", icon: "🍀", type: "heal", heal: 25, cooldown: 3, description: "Recover HP with luck" },
  { id: "special1", name: "Jackpot Slam", icon: "🎰", type: "special", damage: 30, cooldown: 4, description: "Hit the jackpot for massive damage" },
  { id: "special2", name: "Royal Flush", icon: "👑", type: "special", damage: 45, cooldown: 6, description: "Ultimate hand — devastating blow" },
];

export const ZONES: Zone[] = [
  {
    id: "slot-alley",
    name: "Slot Alley",
    icon: "🎰",
    description: "The noisy entrance. Token thieves and slot jockeys lurk here.",
    requiredLevel: 1,
    enemies: [
      { id: "token-thief", name: "Token Thief", emoji: "🦝", hp: 40, maxHp: 40, attack: 8, defense: 3, role: "dps", xpReward: 20, goldReward: 15 },
      { id: "slot-jockey", name: "Slot Jockey", emoji: "🤖", hp: 55, maxHp: 55, attack: 6, defense: 6, role: "tank", xpReward: 25, goldReward: 20 },
      { id: "chip-runner", name: "Chip Runner", emoji: "🏃", hp: 35, maxHp: 35, attack: 12, defense: 2, role: "dps", xpReward: 22, goldReward: 18 },
      { id: "jackpot-jinx", name: "Jackpot Jinx", emoji: "🧿", hp: 120, maxHp: 120, attack: 14, defense: 8, role: "elite", xpReward: 60, goldReward: 50, abilities: ["Lucky Block"] },
    ],
    unlocked: true,
    completed: false,
    progress: 6,
    maxProgress: 10,
    bgColor: "from-primary/20 to-card",
  },
  {
    id: "poker-parlor",
    name: "Poker Parlor",
    icon: "🃏",
    description: "Where bluffs are deadly. Card sharks and dealers await.",
    requiredLevel: 5,
    enemies: [
      { id: "card-shark", name: "Card Shark", emoji: "🦈", hp: 65, maxHp: 65, attack: 14, defense: 5, role: "dps", xpReward: 35, goldReward: 30 },
      { id: "bluff-master", name: "Bluff Master", emoji: "🎭", hp: 50, maxHp: 50, attack: 10, defense: 4, role: "healer", xpReward: 30, goldReward: 25, abilities: ["Misdirect"] },
      { id: "poker-face", name: "Poker Face", emoji: "😐", hp: 80, maxHp: 80, attack: 11, defense: 9, role: "tank", xpReward: 40, goldReward: 35 },
      { id: "blackjack-dealer", name: "Blackjack Dealer", emoji: "🎩", hp: 180, maxHp: 180, attack: 18, defense: 10, role: "boss", xpReward: 100, goldReward: 80, abilities: ["Double Down", "House Edge"] },
    ],
    unlocked: true,
    completed: false,
    progress: 2,
    maxProgress: 10,
    bgColor: "from-mana/20 to-card",
  },
  {
    id: "high-roller",
    name: "High Roller Lounge",
    icon: "🎲",
    description: "High stakes, high danger. Dice demons rule here.",
    requiredLevel: 10,
    enemies: [
      { id: "dice-demon", name: "Dice Demon", emoji: "👹", hp: 90, maxHp: 90, attack: 18, defense: 7, role: "dps", xpReward: 50, goldReward: 45 },
      { id: "roulette-spinner", name: "Roulette Spinner", emoji: "🎡", hp: 110, maxHp: 110, attack: 15, defense: 12, role: "tank", xpReward: 55, goldReward: 50 },
      { id: "croupier", name: "The Croupier", emoji: "🤵", hp: 250, maxHp: 250, attack: 22, defense: 14, role: "boss", xpReward: 150, goldReward: 120, abilities: ["Spin of Fate", "All In"] },
    ],
    unlocked: false,
    completed: false,
    progress: 0,
    maxProgress: 10,
    bgColor: "from-secondary/20 to-card",
  },
  {
    id: "vip-vault",
    name: "VIP Vault",
    icon: "💎",
    description: "Only the elite enter. Guarded by the deadliest foes.",
    requiredLevel: 15,
    enemies: [
      { id: "vault-guard", name: "Vault Guardian", emoji: "🛡️", hp: 140, maxHp: 140, attack: 20, defense: 18, role: "tank", xpReward: 70, goldReward: 60 },
      { id: "gold-golem", name: "Gold Golem", emoji: "🗿", hp: 200, maxHp: 200, attack: 25, defense: 20, role: "elite", xpReward: 90, goldReward: 80 },
    ],
    unlocked: false,
    completed: false,
    progress: 0,
    maxProgress: 10,
    bgColor: "from-accent/20 to-card",
  },
  {
    id: "fury-penthouse",
    name: "FURY's Penthouse",
    icon: "👑",
    description: "The final showdown. FURY awaits at the top.",
    requiredLevel: 20,
    enemies: [
      { id: "fury-boss", name: "FURY", emoji: "🦝", hp: 500, maxHp: 500, attack: 35, defense: 25, role: "boss", xpReward: 500, goldReward: 1000, abilities: ["Rage Mode", "House Always Wins", "Fury Slash"] },
    ],
    unlocked: false,
    completed: false,
    progress: 0,
    maxProgress: 1,
    bgColor: "from-primary/30 to-accent/20",
  },
];

export const QUESTS: Quest[] = [
  { id: "d1", title: "Lucky Streak", description: "Win 3 battles in Slot Alley", type: "daily", progress: 2, maxProgress: 3, xpReward: 50, goldReward: 30, completed: false, claimed: false },
  { id: "d2", title: "Gold Rush", description: "Collect 100 gold from battles", type: "daily", progress: 75, maxProgress: 100, xpReward: 40, goldReward: 50, completed: false, claimed: false },
  { id: "d3", title: "Card Counter", description: "Use 5 special abilities", type: "daily", progress: 5, maxProgress: 5, xpReward: 60, goldReward: 40, completed: true, claimed: false },
  { id: "s1", title: "The House Always Wins", description: "Clear Slot Alley completely", type: "story", progress: 6, maxProgress: 10, xpReward: 200, goldReward: 150, completed: false, claimed: false },
  { id: "s2", title: "Bluff Called", description: "Defeat the Blackjack Dealer", type: "story", progress: 0, maxProgress: 1, xpReward: 300, goldReward: 200, completed: false, claimed: false },
  { id: "s3", title: "The Rise of FURY", description: "Reach FURY's Penthouse", type: "story", progress: 0, maxProgress: 1, xpReward: 1000, goldReward: 500, completed: false, claimed: false },
];

export const INVENTORY: InventoryItem[] = [
  { id: "i1", name: "Lucky Dice", icon: "🎲", rarity: "common", type: "accessory", stats: { critChance: 2 }, equipped: false },
  { id: "i2", name: "Dealer's Blade", icon: "🗡️", rarity: "rare", type: "weapon", stats: { attack: 5 }, equipped: true },
  { id: "i3", name: "Chip Shield", icon: "🛡️", rarity: "rare", type: "armor", stats: { defense: 4 }, equipped: true },
  { id: "i4", name: "Golden Card", icon: "✨", rarity: "epic", type: "weapon", stats: { attack: 8, critChance: 3 }, equipped: false },
  { id: "i5", name: "FURY's Token", icon: "🦝", rarity: "legendary", type: "accessory", stats: { attack: 5, defense: 5, critChance: 5 }, equipped: false },
  { id: "i6", name: "Health Potion", icon: "🧪", rarity: "common", type: "consumable", stats: { hp: 30 }, equipped: false },
  { id: "i7", name: "Slot Coin", icon: "🪙", rarity: "common", type: "consumable", stats: { gold: 50 }, equipped: false },
  { id: "i8", name: "Poker Visor", icon: "🕶️", rarity: "rare", type: "armor", stats: { defense: 3, critChance: 2 }, equipped: false },
];

export function getRandomEnemy(zone: Zone): Enemy {
  const pool = zone.enemies;
  const roll = Math.random();
  if (roll < 0.1 && pool.some(e => e.role === "elite" || e.role === "boss")) {
    return { ...pool.find(e => e.role === "elite" || e.role === "boss")! };
  }
  if (roll < 0.3 && pool.some(e => e.role !== "dps")) {
    const nonDps = pool.filter(e => e.role !== "dps" && e.role !== "boss" && e.role !== "elite");
    if (nonDps.length > 0) return { ...nonDps[Math.floor(Math.random() * nonDps.length)] };
  }
  const commons = pool.filter(e => e.role === "dps" || e.role === "tank" || e.role === "healer");
  if (commons.length === 0) return { ...pool[0] };
  return { ...commons[Math.floor(Math.random() * commons.length)] };
}
