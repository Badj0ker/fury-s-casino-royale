import { Enemy } from "./gameData";

// ============ CO-OP TYPES ============
export interface PartyMember {
  id: string;
  name: string;
  emoji: string;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  isPlayer: boolean;
}

export interface CoopEnemy extends Enemy {
  position: { row: number; col: number };
}

export interface CoopRoom {
  roomNumber: number;
  enemies: CoopEnemy[];
  isBoss: boolean;
  name: string;
}

export interface CoopDungeon {
  id: string;
  name: string;
  icon: string;
  description: string;
  requiredLevel: number;
  rooms: CoopRoom[];
  goldReward: [number, number];
  itemDropChance: number;
}

// ============ PARTY MEMBERS (NPC allies) ============
export const PARTY_POOL: Omit<PartyMember, "hp" | "maxHp" | "attack" | "defense">[] = [
  { id: "npc-razor", name: "Razor", emoji: "🗡️", isPlayer: false },
  { id: "npc-blitz", name: "Blitz", emoji: "⚡", isPlayer: false },
  { id: "npc-shade", name: "Shade", emoji: "🌑", isPlayer: false },
];

export function buildPartyMember(npc: typeof PARTY_POOL[0], playerLevel: number): PartyMember {
  return {
    ...npc,
    hp: 60 + playerLevel * 8,
    maxHp: 60 + playerLevel * 8,
    attack: 10 + playerLevel * 1.5,
    defense: 5 + playerLevel * 0.8,
  };
}

// ============ HELPER ============
function coopEnemy(
  name: string, emoji: string, role: Enemy["role"],
  baseLv: number, room: number,
  row: number, col: number,
  abilities?: string[]
): CoopEnemy {
  const s = 1 + room * 0.18;
  return {
    id: `${name.toLowerCase().replace(/[\s']/g, "-")}-r${room}`,
    name, emoji,
    hp: Math.floor((35 + baseLv * 8) * s),
    maxHp: Math.floor((35 + baseLv * 8) * s),
    attack: Math.floor((6 + baseLv * 1.2) * s),
    defense: Math.floor((2 + baseLv * 0.6) * s),
    role,
    xpReward: Math.floor((15 + baseLv * 4) * s),
    goldReward: Math.floor((10 + baseLv * 3) * s),
    abilities,
    position: { row, col },
  };
}

function bossEnemy(
  name: string, emoji: string,
  baseLv: number, room: number,
  row: number, col: number,
  abilities: string[]
): CoopEnemy {
  const s = 1 + room * 0.2;
  return {
    id: `${name.toLowerCase().replace(/[\s']/g, "-")}-boss`,
    name, emoji,
    hp: Math.floor((120 + baseLv * 20) * s),
    maxHp: Math.floor((120 + baseLv * 20) * s),
    attack: Math.floor((12 + baseLv * 2.5) * s),
    defense: Math.floor((6 + baseLv * 1.2) * s),
    role: "boss",
    xpReward: Math.floor((80 + baseLv * 12) * s),
    goldReward: Math.floor((60 + baseLv * 8) * s),
    abilities,
    position: { row, col },
  };
}

// ============ 5 CO-OP DUNGEONS ============
export const COOP_DUNGEONS: CoopDungeon[] = [
  {
    id: "coop-neon-sewers",
    name: "Neon Sewers",
    icon: "🟢",
    description: "Dark tunnels beneath the Strip. Rats and worse lurk in packs.",
    requiredLevel: 5,
    goldReward: [80, 200],
    itemDropChance: 12,
    rooms: [
      { roomNumber: 1, name: "Entrance Tunnel", isBoss: false, enemies: [
        coopEnemy("Sewer Rat", "🐀", "dps", 5, 0, 0, 0),
        coopEnemy("Pipe Lurker", "🕷️", "dps", 5, 0, 0, 2),
        coopEnemy("Drain Crawler", "🦎", "dps", 5, 0, 1, 1),
      ]},
      { roomNumber: 2, name: "Flooded Chamber", isBoss: false, enemies: [
        coopEnemy("Toxic Slime", "🟢", "tank", 5, 1, 0, 0),
        coopEnemy("Sewer Gator", "🐊", "dps", 5, 1, 0, 2),
        coopEnemy("Drain Rat", "🐀", "dps", 5, 1, 1, 1),
      ]},
      { roomNumber: 3, name: "Pipe Junction", isBoss: false, enemies: [
        coopEnemy("Pipe Brute", "👹", "tank", 5, 2, 0, 1),
        coopEnemy("Toxic Sprayer", "💚", "dps", 5, 2, 0, 0),
        coopEnemy("Sewer Witch", "🧙", "healer", 5, 2, 0, 2),
        coopEnemy("Tunnel Thief", "🦝", "dps", 5, 2, 1, 1),
      ]},
      { roomNumber: 4, name: "Toxic Reservoir", isBoss: false, enemies: [
        coopEnemy("Acid Elemental", "🧪", "elite", 5, 3, 0, 0),
        coopEnemy("Mutant Rat", "🐀", "dps", 5, 3, 0, 2),
        coopEnemy("Sludge Golem", "🗿", "tank", 5, 3, 1, 0),
        coopEnemy("Toxic Bat", "🦇", "dps", 5, 3, 1, 2),
      ]},
      { roomNumber: 5, name: "Drain Crossroads", isBoss: false, enemies: [
        coopEnemy("Tunnel Guard", "🛡️", "tank", 5, 4, 0, 0),
        coopEnemy("Pipe Snake", "🐍", "dps", 5, 4, 0, 2),
        coopEnemy("Waste Crawler", "🪱", "dps", 5, 4, 1, 1),
      ]},
      { roomNumber: 6, name: "Corroded Hall", isBoss: false, enemies: [
        coopEnemy("Rust Elemental", "⚙️", "elite", 5, 5, 0, 1),
        coopEnemy("Corroded Guard", "🤖", "tank", 5, 5, 0, 0),
        coopEnemy("Acid Spitter", "🫧", "dps", 5, 5, 0, 2),
        coopEnemy("Drain Phantom", "👻", "dps", 5, 5, 1, 1),
      ]},
      { roomNumber: 7, name: "Sewer King's Lair", isBoss: true, enemies: [
        bossEnemy("Sewer King", "👑🐊", 5, 6, 0, 1, ["Toxic Wave", "Sewer Slam"]),
        coopEnemy("Royal Rat", "🐀", "dps", 5, 6, 0, 0),
        coopEnemy("Royal Rat", "🐀", "dps", 5, 6, 0, 2),
      ]},
    ],
  },
  {
    id: "coop-crimson-casino",
    name: "Crimson Casino",
    icon: "🔴",
    description: "An abandoned casino overtaken by rogue dealers and ghosts.",
    requiredLevel: 8,
    goldReward: [120, 300],
    itemDropChance: 15,
    rooms: [
      { roomNumber: 1, name: "Ruined Lobby", isBoss: false, enemies: [
        coopEnemy("Broken Slot", "🎰", "tank", 8, 0, 0, 0),
        coopEnemy("Ghost Patron", "👻", "dps", 8, 0, 0, 2),
        coopEnemy("Dust Devil", "🌪️", "dps", 8, 0, 1, 1),
      ]},
      { roomNumber: 2, name: "Haunted Card Room", isBoss: false, enemies: [
        coopEnemy("Phantom Dealer", "🎭", "dps", 8, 1, 0, 0),
        coopEnemy("Cursed Cards", "🃏", "dps", 8, 1, 0, 2),
        coopEnemy("Card Golem", "🗿", "tank", 8, 1, 1, 1),
      ]},
      { roomNumber: 3, name: "Craps Pit", isBoss: false, enemies: [
        coopEnemy("Dice Imp", "👹", "dps", 8, 2, 0, 0),
        coopEnemy("Lucky Ghost", "🍀", "healer", 8, 2, 0, 1),
        coopEnemy("Pit Fiend", "😈", "elite", 8, 2, 0, 2),
        coopEnemy("Chip Rat", "🐀", "dps", 8, 2, 1, 1),
      ]},
      { roomNumber: 4, name: "VIP Corridor", isBoss: false, enemies: [
        coopEnemy("Crimson Guard", "🛡️", "tank", 8, 3, 0, 0),
        coopEnemy("Velvet Assassin", "🗡️", "dps", 8, 3, 0, 2),
        coopEnemy("Shadow Waiter", "🕴️", "dps", 8, 3, 1, 0),
        coopEnemy("Ghost Bouncer", "👻", "tank", 8, 3, 1, 2),
      ]},
      { roomNumber: 5, name: "Roulette Chamber", isBoss: false, enemies: [
        coopEnemy("Roulette Phantom", "🎡", "elite", 8, 4, 0, 1),
        coopEnemy("Spin Wraith", "🌀", "dps", 8, 4, 0, 0),
        coopEnemy("Number Ghost", "🔢", "dps", 8, 4, 0, 2),
      ]},
      { roomNumber: 6, name: "Broken Jackpot Hall", isBoss: false, enemies: [
        coopEnemy("Jackpot Spirit", "✨", "elite", 8, 5, 0, 0),
        coopEnemy("Coin Swarm", "🪙", "dps", 8, 5, 0, 2),
        coopEnemy("Slot Phantom", "🎰", "tank", 8, 5, 1, 0),
        coopEnemy("Gold Wisp", "💛", "healer", 8, 5, 1, 2),
      ]},
      { roomNumber: 7, name: "Manager's Office", isBoss: false, enemies: [
        coopEnemy("Office Guard", "🛡️", "tank", 8, 6, 0, 0),
        coopEnemy("Paper Shredder", "📄", "dps", 8, 6, 0, 2),
        coopEnemy("Safe Cracker", "🔓", "dps", 8, 6, 1, 1),
      ]},
      { roomNumber: 8, name: "The Crimson Throne", isBoss: true, enemies: [
        bossEnemy("Crimson King", "🫅", 8, 7, 0, 1, ["Crimson Fury", "House Edge", "Blood Bet"]),
        coopEnemy("Crimson Knight", "⚔️", "elite", 8, 7, 0, 0),
        coopEnemy("Crimson Knight", "⚔️", "elite", 8, 7, 0, 2),
      ]},
    ],
  },
  {
    id: "coop-shadow-vault",
    name: "Shadow Vault",
    icon: "🟣",
    description: "Deep within the Underworld, a vault of cursed riches awaits.",
    requiredLevel: 12,
    goldReward: [200, 450],
    itemDropChance: 18,
    rooms: [
      { roomNumber: 1, name: "Vault Entrance", isBoss: false, enemies: [
        coopEnemy("Shadow Sentry", "🕶️", "tank", 12, 0, 0, 0),
        coopEnemy("Dark Scout", "🦇", "dps", 12, 0, 0, 2),
        coopEnemy("Void Wisp", "🟣", "dps", 12, 0, 1, 1),
      ]},
      { roomNumber: 2, name: "Trap Corridor", isBoss: false, enemies: [
        coopEnemy("Trap Spider", "🕷️", "dps", 12, 1, 0, 0),
        coopEnemy("Dart Shooter", "🎯", "dps", 12, 1, 0, 2),
        coopEnemy("Stone Guard", "🗿", "tank", 12, 1, 1, 0),
        coopEnemy("Poison Fang", "🐍", "dps", 12, 1, 1, 2),
      ]},
      { roomNumber: 3, name: "Treasury", isBoss: false, enemies: [
        coopEnemy("Gold Mimic", "📦", "elite", 12, 2, 0, 1),
        coopEnemy("Cursed Coin", "🪙", "dps", 12, 2, 0, 0),
        coopEnemy("Jewel Guardian", "💎", "tank", 12, 2, 0, 2),
      ]},
      { roomNumber: 4, name: "Shadow Crossing", isBoss: false, enemies: [
        coopEnemy("Shadow Stalker", "🌑", "dps", 12, 3, 0, 0),
        coopEnemy("Void Walker", "👤", "dps", 12, 3, 0, 2),
        coopEnemy("Dark Mage", "🧙", "healer", 12, 3, 1, 1),
        coopEnemy("Shadow Brute", "👹", "tank", 12, 3, 1, 0),
      ]},
      { roomNumber: 5, name: "Cursed Gallery", isBoss: false, enemies: [
        coopEnemy("Living Painting", "🖼️", "elite", 12, 4, 0, 0),
        coopEnemy("Frame Ghost", "👻", "dps", 12, 4, 0, 2),
        coopEnemy("Art Golem", "🗿", "tank", 12, 4, 1, 1),
      ]},
      { roomNumber: 6, name: "Ritual Chamber", isBoss: false, enemies: [
        coopEnemy("Cultist", "🧙", "healer", 12, 5, 0, 0),
        coopEnemy("Dark Acolyte", "😈", "dps", 12, 5, 0, 2),
        coopEnemy("Ritual Guard", "🛡️", "tank", 12, 5, 1, 0),
        coopEnemy("Summoned Imp", "👹", "dps", 12, 5, 1, 2),
      ]},
      { roomNumber: 7, name: "Inner Sanctum", isBoss: false, enemies: [
        coopEnemy("Elite Shadow", "🌑", "elite", 12, 6, 0, 0),
        coopEnemy("Void Sentinel", "🤖", "tank", 12, 6, 0, 2),
        coopEnemy("Dark Archer", "🏹", "dps", 12, 6, 1, 1),
      ]},
      { roomNumber: 8, name: "Vault Core", isBoss: false, enemies: [
        coopEnemy("Core Guardian", "⚙️", "elite", 12, 7, 0, 0),
        coopEnemy("Vault Wraith", "👻", "dps", 12, 7, 0, 2),
        coopEnemy("Diamond Sentinel", "💎", "tank", 12, 7, 1, 0),
        coopEnemy("Core Wisp", "✨", "healer", 12, 7, 1, 2),
      ]},
      { roomNumber: 9, name: "Shadow Lord's Chamber", isBoss: true, enemies: [
        bossEnemy("Shadow Lord", "🌑👑", 12, 8, 0, 1, ["Shadow Storm", "Void Drain", "Dark Eclipse"]),
        coopEnemy("Shadow Guard", "🛡️", "elite", 12, 8, 0, 0),
        coopEnemy("Shadow Guard", "🛡️", "elite", 12, 8, 0, 2),
        coopEnemy("Dark Healer", "🧙", "healer", 12, 8, 1, 1),
      ]},
    ],
  },
  {
    id: "coop-golden-palace",
    name: "Golden Palace",
    icon: "🟡",
    description: "Rian's secret golden palace. Only the strongest survive.",
    requiredLevel: 16,
    goldReward: [350, 700],
    itemDropChance: 22,
    rooms: [
      { roomNumber: 1, name: "Golden Gates", isBoss: false, enemies: [
        coopEnemy("Gold Sentry", "⚜️", "tank", 16, 0, 0, 0),
        coopEnemy("Palace Scout", "👁️", "dps", 16, 0, 0, 2),
        coopEnemy("Golden Imp", "👹", "dps", 16, 0, 1, 1),
      ]},
      { roomNumber: 2, name: "Grand Foyer", isBoss: false, enemies: [
        coopEnemy("Marble Golem", "🗿", "tank", 16, 1, 0, 0),
        coopEnemy("Crystal Mage", "🔮", "healer", 16, 1, 0, 2),
        coopEnemy("Foyer Guard", "🛡️", "tank", 16, 1, 1, 0),
        coopEnemy("Gold Assassin", "🗡️", "dps", 16, 1, 1, 2),
      ]},
      { roomNumber: 3, name: "Banquet Hall", isBoss: false, enemies: [
        coopEnemy("Poisoned Chef", "🧑‍🍳", "dps", 16, 2, 0, 0),
        coopEnemy("Wine Elemental", "🍷", "healer", 16, 2, 0, 2),
        coopEnemy("Table Mimic", "📦", "elite", 16, 2, 1, 1),
      ]},
      { roomNumber: 4, name: "Trophy Room", isBoss: false, enemies: [
        coopEnemy("Living Trophy", "🏆", "elite", 16, 3, 0, 0),
        coopEnemy("Armor Stand", "🛡️", "tank", 16, 3, 0, 2),
        coopEnemy("Ghost Champion", "👻", "dps", 16, 3, 1, 0),
        coopEnemy("Trophy Keeper", "🔑", "dps", 16, 3, 1, 2),
      ]},
      { roomNumber: 5, name: "Gold Vault", isBoss: false, enemies: [
        coopEnemy("Vault Titan", "🗿", "tank", 16, 4, 0, 1),
        coopEnemy("Gold Elemental", "✨", "elite", 16, 4, 0, 0),
        coopEnemy("Coin Swarm", "🪙", "dps", 16, 4, 0, 2),
      ]},
      { roomNumber: 6, name: "Royal Library", isBoss: false, enemies: [
        coopEnemy("Book Golem", "📚", "tank", 16, 5, 0, 0),
        coopEnemy("Spell Weaver", "🧙", "healer", 16, 5, 0, 2),
        coopEnemy("Paper Storm", "📄", "dps", 16, 5, 1, 0),
        coopEnemy("Ink Phantom", "🖋️", "dps", 16, 5, 1, 2),
      ]},
      { roomNumber: 7, name: "Throne Antechamber", isBoss: false, enemies: [
        coopEnemy("Royal Guard", "⚜️", "elite", 16, 6, 0, 0),
        coopEnemy("Shield Bearer", "🛡️", "tank", 16, 6, 0, 2),
        coopEnemy("Royal Mage", "🧙", "healer", 16, 6, 1, 1),
      ]},
      { roomNumber: 8, name: "Inner Chambers", isBoss: false, enemies: [
        coopEnemy("Golden Knight", "⚔️", "elite", 16, 7, 0, 0),
        coopEnemy("Palace Phantom", "👻", "dps", 16, 7, 0, 2),
        coopEnemy("Crown Sentinel", "👑", "tank", 16, 7, 1, 0),
        coopEnemy("Royal Assassin", "🗡️", "dps", 16, 7, 1, 2),
      ]},
      { roomNumber: 9, name: "Golden Hall", isBoss: false, enemies: [
        coopEnemy("Hall Guardian", "🗿", "tank", 16, 8, 0, 1),
        coopEnemy("Gold Wraith", "✨", "dps", 16, 8, 0, 0),
        coopEnemy("Gilded Mage", "🧙", "healer", 16, 8, 0, 2),
      ]},
      { roomNumber: 10, name: "The Golden Throne", isBoss: true, enemies: [
        bossEnemy("Golden Emperor", "👑✨", 16, 9, 0, 1, ["Imperial Decree", "Golden Wrath", "Crown Smash", "Gilded Shield"]),
        coopEnemy("Imperial Guard", "⚜️", "elite", 16, 9, 0, 0),
        coopEnemy("Imperial Guard", "⚜️", "elite", 16, 9, 0, 2),
        coopEnemy("Court Healer", "🧙", "healer", 16, 9, 1, 0),
        coopEnemy("Court Assassin", "🗡️", "dps", 16, 9, 1, 2),
      ]},
    ],
  },
  {
    id: "coop-inferno-pit",
    name: "Inferno Pit",
    icon: "🔥",
    description: "The deepest dungeon. Fire, chaos, and the ultimate boss.",
    requiredLevel: 20,
    goldReward: [500, 1200],
    itemDropChance: 25,
    rooms: [
      { roomNumber: 1, name: "Lava Entrance", isBoss: false, enemies: [
        coopEnemy("Fire Imp", "👹", "dps", 20, 0, 0, 0),
        coopEnemy("Magma Slime", "🟠", "tank", 20, 0, 0, 2),
        coopEnemy("Ember Bat", "🦇", "dps", 20, 0, 1, 1),
      ]},
      { roomNumber: 2, name: "Lava Bridge", isBoss: false, enemies: [
        coopEnemy("Bridge Troll", "🧌", "tank", 20, 1, 0, 0),
        coopEnemy("Fire Elemental", "🔥", "dps", 20, 1, 0, 2),
        coopEnemy("Lava Snake", "🐍", "dps", 20, 1, 1, 0),
        coopEnemy("Flame Spirit", "✨", "healer", 20, 1, 1, 2),
      ]},
      { roomNumber: 3, name: "Forge Room", isBoss: false, enemies: [
        coopEnemy("Iron Golem", "🤖", "tank", 20, 2, 0, 0),
        coopEnemy("Forge Master", "🔨", "elite", 20, 2, 0, 2),
        coopEnemy("Molten Core", "🟠", "dps", 20, 2, 1, 1),
      ]},
      { roomNumber: 4, name: "Ember Caves", isBoss: false, enemies: [
        coopEnemy("Cave Spider", "🕷️", "dps", 20, 3, 0, 0),
        coopEnemy("Ember Wyrm", "🐉", "elite", 20, 3, 0, 2),
        coopEnemy("Rock Brute", "🗿", "tank", 20, 3, 1, 0),
        coopEnemy("Fire Wisp", "🔥", "healer", 20, 3, 1, 2),
      ]},
      { roomNumber: 5, name: "Obsidian Hall", isBoss: false, enemies: [
        coopEnemy("Obsidian Guard", "🛡️", "tank", 20, 4, 0, 0),
        coopEnemy("Dark Flame", "🌑", "dps", 20, 4, 0, 2),
        coopEnemy("Obsidian Mage", "🧙", "healer", 20, 4, 1, 1),
      ]},
      { roomNumber: 6, name: "Fire Shrine", isBoss: false, enemies: [
        coopEnemy("Shrine Keeper", "🧙", "healer", 20, 5, 0, 0),
        coopEnemy("Fire Cultist", "😈", "dps", 20, 5, 0, 2),
        coopEnemy("Flame Sentinel", "🤖", "tank", 20, 5, 1, 0),
        coopEnemy("Infernal Imp", "👹", "dps", 20, 5, 1, 2),
      ]},
      { roomNumber: 7, name: "Demon Barracks", isBoss: false, enemies: [
        coopEnemy("Demon Warrior", "⚔️", "elite", 20, 6, 0, 0),
        coopEnemy("Demon Archer", "🏹", "dps", 20, 6, 0, 2),
        coopEnemy("Demon Shield", "🛡️", "tank", 20, 6, 1, 0),
        coopEnemy("Demon Priest", "🧙", "healer", 20, 6, 1, 2),
      ]},
      { roomNumber: 8, name: "Magma Core", isBoss: false, enemies: [
        coopEnemy("Magma Titan", "🗿", "tank", 20, 7, 0, 1),
        coopEnemy("Core Elemental", "🔥", "elite", 20, 7, 0, 0),
        coopEnemy("Lava Spawn", "🟠", "dps", 20, 7, 0, 2),
      ]},
      { roomNumber: 9, name: "Hellfire Passage", isBoss: false, enemies: [
        coopEnemy("Hellfire Knight", "⚔️", "elite", 20, 8, 0, 0),
        coopEnemy("Hellfire Mage", "🔥", "dps", 20, 8, 0, 2),
        coopEnemy("Infernal Guard", "🛡️", "tank", 20, 8, 1, 0),
        coopEnemy("Soul Stealer", "👻", "dps", 20, 8, 1, 2),
      ]},
      { roomNumber: 10, name: "Inferno Throne", isBoss: true, enemies: [
        bossEnemy("Inferno Lord", "🔥👑", 20, 9, 0, 1, ["Hellfire Nova", "Infernal Wrath", "Soul Burn", "Apocalypse"]),
        coopEnemy("Infernal Champion", "⚔️", "elite", 20, 9, 0, 0),
        coopEnemy("Infernal Champion", "⚔️", "elite", 20, 9, 0, 2),
        coopEnemy("Infernal Priest", "🧙", "healer", 20, 9, 1, 0),
        coopEnemy("Infernal Assassin", "🗡️", "dps", 20, 9, 1, 2),
      ]},
    ],
  },
];
