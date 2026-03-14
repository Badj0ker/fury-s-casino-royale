import { Zone, Enemy, GameMap, Dungeon, DungeonRoom } from "./gameData";
import { ZONES } from "./gameData";

// ============ HELPER ============
function scaleEnemy(name: string, emoji: string, role: Enemy["role"], baseLv: number, room: number, abilities?: string[]): Enemy {
  const s = 1 + room * 0.25;
  return {
    id: name.toLowerCase().replace(/[\s']/g, "-"),
    name, emoji,
    hp: Math.floor((40 + baseLv * 10) * s),
    maxHp: Math.floor((40 + baseLv * 10) * s),
    attack: Math.floor((8 + baseLv * 1.5) * s),
    defense: Math.floor((3 + baseLv * 0.8) * s),
    role,
    xpReward: Math.floor((20 + baseLv * 5) * s),
    goldReward: Math.floor((15 + baseLv * 4) * s),
    abilities,
  };
}

// ============ MAP 2: RIAN'S ROYAL STRIP ============
const RIAN_ZONES: Zone[] = [
  {
    id: "vera-lounge", name: "Vera's Velvet Lounge", icon: "🍸",
    description: "An elegant cocktail lounge where charm is the deadliest weapon.",
    requiredLevel: 1,
    enemies: [
      { id: "cocktail-waitress", name: "Cocktail Waitress", emoji: "🍹", hp: 38, maxHp: 38, attack: 7, defense: 3, role: "dps", xpReward: 18, goldReward: 12 },
      { id: "velvet-bouncer", name: "Velvet Bouncer", emoji: "🕴️", hp: 55, maxHp: 55, attack: 5, defense: 7, role: "tank", xpReward: 22, goldReward: 18 },
      { id: "lounge-singer", name: "Lounge Singer", emoji: "🎤", hp: 30, maxHp: 30, attack: 4, defense: 2, role: "healer", xpReward: 20, goldReward: 15, abilities: ["Lullaby"] },
      { id: "velvet-vip", name: "Velvet VIP", emoji: "💃", hp: 110, maxHp: 110, attack: 13, defense: 7, role: "elite", xpReward: 55, goldReward: 45, abilities: ["Champagne Splash"] },
    ],
    unlocked: true, completed: false, progress: 0, maxProgress: 10, bgColor: "from-pink-500/20 to-card",
  },
  {
    id: "badjoker-bluff", name: "BadJoker's Bluff Room", icon: "🃏",
    description: "Where every hand is a trick and nothing is what it seems.",
    requiredLevel: 5,
    enemies: [
      { id: "joker-trickster", name: "Joker Trickster", emoji: "🤹", hp: 60, maxHp: 60, attack: 13, defense: 4, role: "dps", xpReward: 32, goldReward: 28 },
      { id: "marked-deck", name: "Marked Deck Master", emoji: "🎴", hp: 50, maxHp: 50, attack: 10, defense: 5, role: "dps", xpReward: 28, goldReward: 22 },
      { id: "shell-hustler", name: "Shell Game Hustler", emoji: "🐚", hp: 45, maxHp: 45, attack: 8, defense: 3, role: "healer", xpReward: 25, goldReward: 20, abilities: ["Misdirect"] },
      { id: "badjoker-boss", name: "BadJoker", emoji: "🤡", hp: 170, maxHp: 170, attack: 17, defense: 9, role: "boss", xpReward: 90, goldReward: 75, abilities: ["Wild Card", "Joker's Gambit"] },
    ],
    unlocked: true, completed: false, progress: 0, maxProgress: 10, bgColor: "from-purple-500/20 to-card",
  },
  {
    id: "brian-pit", name: "Brian's Betting Pit", icon: "📊",
    description: "A ruthless underground ring where odds are always stacked.",
    requiredLevel: 10,
    enemies: [
      { id: "pit-runner", name: "Pit Runner", emoji: "🏃", hp: 85, maxHp: 85, attack: 17, defense: 6, role: "dps", xpReward: 45, goldReward: 40 },
      { id: "odds-maker", name: "Odds Maker", emoji: "📊", hp: 105, maxHp: 105, attack: 13, defense: 11, role: "tank", xpReward: 50, goldReward: 42 },
      { id: "bookie", name: "The Bookie", emoji: "📒", hp: 70, maxHp: 70, attack: 10, defense: 5, role: "healer", xpReward: 40, goldReward: 35, abilities: ["Fix the Odds"] },
      { id: "brian-enforcer", name: "Brian's Enforcer", emoji: "💪", hp: 180, maxHp: 180, attack: 20, defense: 12, role: "elite", xpReward: 80, goldReward: 65, abilities: ["Debt Collection"] },
    ],
    unlocked: false, completed: false, progress: 0, maxProgress: 10, bgColor: "from-orange-500/20 to-card",
  },
  {
    id: "emma-crystal", name: "Emma's Crystal Table", icon: "💎",
    description: "A dazzling high-stakes table where fortunes are won and lost.",
    requiredLevel: 15,
    enemies: [
      { id: "crystal-croupier", name: "Crystal Croupier", emoji: "💎", hp: 130, maxHp: 130, attack: 19, defense: 14, role: "dps", xpReward: 65, goldReward: 55 },
      { id: "diamond-guard", name: "Diamond Guard", emoji: "🛡️", hp: 160, maxHp: 160, attack: 15, defense: 18, role: "tank", xpReward: 70, goldReward: 58 },
      { id: "gem-enchantress", name: "Gem Enchantress", emoji: "✨", hp: 100, maxHp: 100, attack: 12, defense: 8, role: "healer", xpReward: 55, goldReward: 48, abilities: ["Crystal Heal"] },
      { id: "crystal-golem", name: "Crystal Golem", emoji: "🗿", hp: 220, maxHp: 220, attack: 24, defense: 20, role: "elite", xpReward: 95, goldReward: 80, abilities: ["Diamond Shatter"] },
    ],
    unlocked: false, completed: false, progress: 0, maxProgress: 10, bgColor: "from-cyan-400/20 to-card",
  },
  {
    id: "rian-royal", name: "Rian's Royal Casino", icon: "👑",
    description: "The House King's domain. Only legends make it this far.",
    requiredLevel: 20,
    enemies: [
      { id: "royal-guard", name: "Royal Guard", emoji: "⚜️", hp: 180, maxHp: 180, attack: 22, defense: 18, role: "tank", xpReward: 85, goldReward: 70 },
      { id: "casino-enforcer", name: "Casino Enforcer", emoji: "🔱", hp: 150, maxHp: 150, attack: 28, defense: 14, role: "dps", xpReward: 80, goldReward: 68 },
      { id: "rian-boss", name: "Rian the House King", emoji: "👑", hp: 480, maxHp: 480, attack: 34, defense: 24, role: "boss", xpReward: 450, goldReward: 900, abilities: ["Royal Decree", "King's Gambit", "House Always Wins"] },
    ],
    unlocked: false, completed: false, progress: 0, maxProgress: 1, bgColor: "from-yellow-500/20 to-card",
  },
];

// ============ MAP 3: STEVE'S UNDERWORLD ============
const STEVE_ZONES: Zone[] = [
  {
    id: "sahil-spin", name: "Sahil's Spin Zone", icon: "🎡",
    description: "A neon-lit spin palace where luck changes with every rotation.",
    requiredLevel: 1,
    enemies: [
      { id: "spin-monkey", name: "Spin Monkey", emoji: "🐒", hp: 42, maxHp: 42, attack: 9, defense: 3, role: "dps", xpReward: 20, goldReward: 14 },
      { id: "wheel-watcher", name: "Wheel Watcher", emoji: "👁️", hp: 58, maxHp: 58, attack: 6, defense: 7, role: "tank", xpReward: 24, goldReward: 19 },
      { id: "lucky-spinner", name: "Lucky Spinner", emoji: "🌀", hp: 32, maxHp: 32, attack: 5, defense: 2, role: "healer", xpReward: 18, goldReward: 15, abilities: ["Spin Heal"] },
      { id: "spin-master", name: "Spin Master", emoji: "🎯", hp: 115, maxHp: 115, attack: 14, defense: 8, role: "elite", xpReward: 58, goldReward: 48, abilities: ["Wheel of Misfortune"] },
    ],
    unlocked: true, completed: false, progress: 0, maxProgress: 10, bgColor: "from-green-500/20 to-card",
  },
  {
    id: "maica-corner", name: "Maica's Lucky Corner", icon: "🍀",
    description: "A mystical corner where fortune favors the bold.",
    requiredLevel: 5,
    enemies: [
      { id: "fortune-teller", name: "Fortune Teller", emoji: "🔮", hp: 48, maxHp: 48, attack: 9, defense: 4, role: "healer", xpReward: 28, goldReward: 22, abilities: ["Foresight"] },
      { id: "lucky-cat", name: "Lucky Cat", emoji: "🐱", hp: 62, maxHp: 62, attack: 14, defense: 5, role: "dps", xpReward: 33, goldReward: 28 },
      { id: "charm-dealer", name: "Charm Dealer", emoji: "🧿", hp: 55, maxHp: 55, attack: 11, defense: 6, role: "dps", xpReward: 30, goldReward: 24 },
      { id: "maica-guardian", name: "Maica's Guardian", emoji: "🦋", hp: 175, maxHp: 175, attack: 16, defense: 10, role: "boss", xpReward: 95, goldReward: 78, abilities: ["Lucky Charm", "Fortune's Favor"] },
    ],
    unlocked: true, completed: false, progress: 0, maxProgress: 10, bgColor: "from-emerald-400/20 to-card",
  },
  {
    id: "turkish-roulette", name: "Turkish's Roulette Ring", icon: "🎰",
    description: "A deadly roulette arena where every spin could be your last.",
    requiredLevel: 10,
    enemies: [
      { id: "roulette-rat", name: "Roulette Rat", emoji: "🐀", hp: 88, maxHp: 88, attack: 18, defense: 7, role: "dps", xpReward: 48, goldReward: 42 },
      { id: "ball-chaser", name: "Ball Chaser", emoji: "🏐", hp: 75, maxHp: 75, attack: 15, defense: 5, role: "dps", xpReward: 42, goldReward: 36 },
      { id: "table-master", name: "Table Master", emoji: "🎲", hp: 110, maxHp: 110, attack: 14, defense: 12, role: "tank", xpReward: 52, goldReward: 44 },
      { id: "turkish-hitman", name: "Turkish's Hitman", emoji: "🔫", hp: 185, maxHp: 185, attack: 21, defense: 13, role: "elite", xpReward: 82, goldReward: 68, abilities: ["Russian Roulette"] },
    ],
    unlocked: false, completed: false, progress: 0, maxProgress: 10, bgColor: "from-red-500/20 to-card",
  },
  {
    id: "priyanka-diamond", name: "Priyanka's Diamond Deck", icon: "💠",
    description: "A glittering palace where only diamond hands survive.",
    requiredLevel: 15,
    enemies: [
      { id: "diamond-dealer-2", name: "Diamond Dealer", emoji: "💎", hp: 135, maxHp: 135, attack: 20, defense: 15, role: "dps", xpReward: 68, goldReward: 58 },
      { id: "sapphire-guard", name: "Sapphire Guard", emoji: "🔷", hp: 165, maxHp: 165, attack: 16, defense: 19, role: "tank", xpReward: 72, goldReward: 60 },
      { id: "ruby-enchantress", name: "Ruby Enchantress", emoji: "❤️‍🔥", hp: 105, maxHp: 105, attack: 13, defense: 9, role: "healer", xpReward: 58, goldReward: 50, abilities: ["Ruby Shield"] },
      { id: "diamond-titan", name: "Diamond Titan", emoji: "⚔️", hp: 230, maxHp: 230, attack: 25, defense: 21, role: "elite", xpReward: 98, goldReward: 82, abilities: ["Diamond Storm"] },
    ],
    unlocked: false, completed: false, progress: 0, maxProgress: 10, bgColor: "from-blue-400/20 to-card",
  },
  {
    id: "steve-banhammer", name: "Steve's Banhammer Arena", icon: "🔨",
    description: "The final arena. Steve wields the Banhammer with no mercy.",
    requiredLevel: 20,
    enemies: [
      { id: "ban-enforcer", name: "Ban Enforcer", emoji: "⛔", hp: 190, maxHp: 190, attack: 23, defense: 19, role: "tank", xpReward: 88, goldReward: 72 },
      { id: "timeout-agent", name: "Timeout Agent", emoji: "⏰", hp: 155, maxHp: 155, attack: 29, defense: 15, role: "dps", xpReward: 82, goldReward: 70 },
      { id: "steve-boss", name: "Steve the Banhammer", emoji: "🔨", hp: 520, maxHp: 520, attack: 36, defense: 26, role: "boss", xpReward: 500, goldReward: 1000, abilities: ["BANHAMMER", "Permanent Ban", "Timeout Slam"] },
    ],
    unlocked: false, completed: false, progress: 0, maxProgress: 1, bgColor: "from-red-600/20 to-card",
  },
];

// ============ MAP 4: DIANA'S SHADOW SYNDICATE (Lv 40+) ============
const SHADOW_ZONES: Zone[] = [
  {
    id: "jessica-phantom", name: "Jessica's Phantom Gate", icon: "👻",
    description: "Jessica guards the entrance to Diana's empire. Only the elite survive.",
    requiredLevel: 40,
    enemies: [
      { id: "phantom-sentry", name: "Phantom Sentry", emoji: "👁️‍🗨️", hp: 450, maxHp: 450, attack: 55, defense: 35, role: "tank", xpReward: 280, goldReward: 220 },
      { id: "shadow-stalker", name: "Shadow Stalker", emoji: "🥷", hp: 380, maxHp: 380, attack: 68, defense: 28, role: "dps", xpReward: 300, goldReward: 240 },
      { id: "void-whisperer", name: "Void Whisperer", emoji: "🌑", hp: 320, maxHp: 320, attack: 45, defense: 22, role: "healer", xpReward: 260, goldReward: 200, abilities: ["Dark Mend"] },
      { id: "jessica-boss", name: "Jessica the Phantom", emoji: "💀", hp: 650, maxHp: 650, attack: 72, defense: 40, role: "elite", xpReward: 450, goldReward: 380, abilities: ["Phase Shift", "Soul Drain"] },
    ],
    unlocked: false, completed: false, progress: 0, maxProgress: 10, bgColor: "from-violet-600/20 to-card",
  },
  {
    id: "ivy-neon", name: "Ivy's Neon Abyss", icon: "💜",
    description: "Ivy's hidden neon casino where lights mask deadly traps.",
    requiredLevel: 42,
    enemies: [
      { id: "neon-assassin", name: "Neon Assassin", emoji: "⚡", hp: 400, maxHp: 400, attack: 72, defense: 30, role: "dps", xpReward: 320, goldReward: 260 },
      { id: "abyss-dealer", name: "Abyss Dealer", emoji: "🃏", hp: 480, maxHp: 480, attack: 58, defense: 38, role: "tank", xpReward: 340, goldReward: 270 },
      { id: "glitch-hacker", name: "Glitch Hacker", emoji: "🖥️", hp: 350, maxHp: 350, attack: 50, defense: 25, role: "healer", xpReward: 290, goldReward: 230, abilities: ["System Hack"] },
      { id: "ivy-boss", name: "Ivy the Neon Queen", emoji: "👾", hp: 720, maxHp: 720, attack: 78, defense: 44, role: "boss", xpReward: 500, goldReward: 420, abilities: ["Neon Storm", "Overload"] },
    ],
    unlocked: false, completed: false, progress: 0, maxProgress: 10, bgColor: "from-purple-600/20 to-card",
  },
  {
    id: "triss-crimson", name: "Triss's Crimson Vault", icon: "🔴",
    description: "Triss rules the blood-red corridors that guard unimaginable riches.",
    requiredLevel: 44,
    enemies: [
      { id: "crimson-knight", name: "Crimson Knight", emoji: "🛡️", hp: 550, maxHp: 550, attack: 62, defense: 45, role: "tank", xpReward: 360, goldReward: 300 },
      { id: "blood-dealer", name: "Blood Dealer", emoji: "🩸", hp: 420, maxHp: 420, attack: 78, defense: 32, role: "dps", xpReward: 380, goldReward: 310 },
      { id: "vault-wraith", name: "Vault Wraith", emoji: "👤", hp: 380, maxHp: 380, attack: 55, defense: 28, role: "healer", xpReward: 320, goldReward: 260, abilities: ["Crimson Heal"] },
      { id: "triss-boss", name: "Triss the Crimson", emoji: "🗿", hp: 800, maxHp: 800, attack: 85, defense: 48, role: "elite", xpReward: 550, goldReward: 460, abilities: ["Blood Rage", "Crimson Slam"] },
    ],
    unlocked: false, completed: false, progress: 0, maxProgress: 10, bgColor: "from-red-700/20 to-card",
  },
  {
    id: "noa-eclipse", name: "Noa's Eclipse Pit", icon: "🌘",
    description: "Noa's betting pit where fortunes vanish into darkness.",
    requiredLevel: 47,
    enemies: [
      { id: "eclipse-broker", name: "Eclipse Broker", emoji: "📉", hp: 500, maxHp: 500, attack: 80, defense: 38, role: "dps", xpReward: 420, goldReward: 350 },
      { id: "dark-enforcer", name: "Dark Enforcer", emoji: "⚫", hp: 600, maxHp: 600, attack: 68, defense: 50, role: "tank", xpReward: 440, goldReward: 370 },
      { id: "shade-medic", name: "Shade Medic", emoji: "💊", hp: 420, maxHp: 420, attack: 52, defense: 30, role: "healer", xpReward: 380, goldReward: 300, abilities: ["Shadow Mend"] },
      { id: "noa-boss", name: "Noa the Eclipse", emoji: "🌑", hp: 900, maxHp: 900, attack: 92, defense: 52, role: "elite", xpReward: 600, goldReward: 500, abilities: ["Total Eclipse", "Gravity Well"] },
    ],
    unlocked: false, completed: false, progress: 0, maxProgress: 10, bgColor: "from-gray-800/20 to-card",
  },
  {
    id: "diana-throne", name: "Diana's Shadow Throne", icon: "🖤",
    description: "Diana the Shadow Queen awaits. None have returned alive.",
    requiredLevel: 50,
    enemies: [
      { id: "syndicate-elite", name: "Syndicate Elite", emoji: "⚔️", hp: 650, maxHp: 650, attack: 88, defense: 48, role: "dps", xpReward: 500, goldReward: 420 },
      { id: "shadow-colossus", name: "Shadow Colossus", emoji: "🗿", hp: 800, maxHp: 800, attack: 72, defense: 58, role: "tank", xpReward: 520, goldReward: 440 },
      { id: "diana-boss", name: "Diana the Shadow Queen", emoji: "🖤", hp: 1800, maxHp: 1800, attack: 110, defense: 65, role: "boss", xpReward: 2000, goldReward: 3000, abilities: ["Shadow Dominion", "Syndicate's Wrath", "Eternal Darkness", "Death Gambit"] },
    ],
    unlocked: false, completed: false, progress: 0, maxProgress: 1, bgColor: "from-violet-900/20 to-card",
  },
];

// ============ MAP 5: EMILY'S INFERNO COLOSSEUM (Lv 50+) ============
const INFERNO_ZONES: Zone[] = [
  {
    id: "ari-molten", name: "Ari's Molten Gates", icon: "🔥",
    description: "Ari guards the burning entrance. Magma flows like rivers of gold.",
    requiredLevel: 50,
    enemies: [
      { id: "lava-golem", name: "Lava Golem", emoji: "🗿", hp: 700, maxHp: 700, attack: 82, defense: 55, role: "tank", xpReward: 520, goldReward: 440 },
      { id: "flame-striker", name: "Flame Striker", emoji: "🔥", hp: 550, maxHp: 550, attack: 98, defense: 38, role: "dps", xpReward: 560, goldReward: 470 },
      { id: "ember-shaman", name: "Ember Shaman", emoji: "🧙", hp: 480, maxHp: 480, attack: 65, defense: 35, role: "healer", xpReward: 480, goldReward: 400, abilities: ["Flame Ward"] },
      { id: "ari-boss", name: "Ari the Gatekeeper", emoji: "👹", hp: 950, maxHp: 950, attack: 105, defense: 58, role: "elite", xpReward: 700, goldReward: 600, abilities: ["Magma Eruption", "Scorched Earth"] },
    ],
    unlocked: false, completed: false, progress: 0, maxProgress: 10, bgColor: "from-orange-700/20 to-card",
  },
  {
    id: "lily-obsidian", name: "Lily's Obsidian Casino", icon: "🖤",
    description: "Lily's casino carved from volcanic glass. Every chip is forged in fire.",
    requiredLevel: 52,
    enemies: [
      { id: "obsidian-croupier", name: "Obsidian Croupier", emoji: "🎰", hp: 620, maxHp: 620, attack: 92, defense: 42, role: "dps", xpReward: 580, goldReward: 490 },
      { id: "magma-bouncer", name: "Magma Bouncer", emoji: "🛡️", hp: 780, maxHp: 780, attack: 78, defense: 60, role: "tank", xpReward: 600, goldReward: 500 },
      { id: "ash-healer", name: "Ash Healer", emoji: "🌋", hp: 520, maxHp: 520, attack: 60, defense: 38, role: "healer", xpReward: 520, goldReward: 430, abilities: ["Volcanic Mend"] },
      { id: "lily-boss", name: "Lily the Obsidian Queen", emoji: "♠️", hp: 1100, maxHp: 1100, attack: 112, defense: 62, role: "boss", xpReward: 800, goldReward: 680, abilities: ["Glass Shatter", "Obsidian Cage"] },
    ],
    unlocked: false, completed: false, progress: 0, maxProgress: 10, bgColor: "from-gray-900/20 to-card",
  },
  {
    id: "camilla-dragon", name: "Camilla's Dragon Den", icon: "🐉",
    description: "Camilla tames ancient dragons. The stakes are beyond mortal comprehension.",
    requiredLevel: 55,
    enemies: [
      { id: "drake-guard", name: "Drake Guard", emoji: "🐲", hp: 850, maxHp: 850, attack: 95, defense: 58, role: "tank", xpReward: 650, goldReward: 550 },
      { id: "wyrm-dealer", name: "Wyrm Dealer", emoji: "🐍", hp: 700, maxHp: 700, attack: 108, defense: 45, role: "dps", xpReward: 680, goldReward: 570 },
      { id: "dragon-mystic", name: "Dragon Mystic", emoji: "✨", hp: 600, maxHp: 600, attack: 72, defense: 40, role: "healer", xpReward: 600, goldReward: 500, abilities: ["Dragon's Blessing"] },
      { id: "camilla-boss", name: "Camilla the Dragon Tamer", emoji: "🐉", hp: 1400, maxHp: 1400, attack: 120, defense: 68, role: "elite", xpReward: 900, goldReward: 780, abilities: ["Dragon Breath", "Wing Gust"] },
    ],
    unlocked: false, completed: false, progress: 0, maxProgress: 10, bgColor: "from-amber-700/20 to-card",
  },
  {
    id: "max-hellfire", name: "Max's Hellfire Arena", icon: "⚔️",
    description: "Max's ultimate fighting pit. Champions burn or rise.",
    requiredLevel: 58,
    enemies: [
      { id: "hellfire-champion", name: "Hellfire Champion", emoji: "🏆", hp: 900, maxHp: 900, attack: 115, defense: 52, role: "dps", xpReward: 750, goldReward: 630 },
      { id: "inferno-warden", name: "Inferno Warden", emoji: "🔱", hp: 1000, maxHp: 1000, attack: 90, defense: 68, role: "tank", xpReward: 780, goldReward: 650 },
      { id: "flame-oracle", name: "Flame Oracle", emoji: "🔮", hp: 650, maxHp: 650, attack: 78, defense: 42, role: "healer", xpReward: 680, goldReward: 560, abilities: ["Infernal Vision"] },
      { id: "max-boss", name: "Max the Hellfire King", emoji: "😈", hp: 1600, maxHp: 1600, attack: 130, defense: 72, role: "elite", xpReward: 1000, goldReward: 850, abilities: ["Hellfire Storm", "Arena Crush", "Burning Chains"] },
    ],
    unlocked: false, completed: false, progress: 0, maxProgress: 10, bgColor: "from-red-900/20 to-card",
  },
  {
    id: "emily-throne", name: "Emily's Inferno Throne", icon: "👑🔥",
    description: "Emily the Eternal Flame. The final challenge for legends only.",
    requiredLevel: 60,
    enemies: [
      { id: "throne-guardian", name: "Throne Guardian", emoji: "⚜️", hp: 1100, maxHp: 1100, attack: 110, defense: 70, role: "tank", xpReward: 900, goldReward: 750 },
      { id: "inferno-blade", name: "Inferno Blade", emoji: "🗡️", hp: 900, maxHp: 900, attack: 135, defense: 55, role: "dps", xpReward: 920, goldReward: 780 },
      { id: "emily-boss", name: "Emily the Eternal Flame", emoji: "👑🔥", hp: 3000, maxHp: 3000, attack: 160, defense: 85, role: "boss", xpReward: 5000, goldReward: 8000, abilities: ["Eternal Inferno", "God's Wrath", "Molten Apocalypse", "Flame Rebirth", "World Ender"] },
    ],
    unlocked: false, completed: false, progress: 0, maxProgress: 1, bgColor: "from-orange-900/30 to-card",
  },
];

// ============ GAME MAPS ============
export const GAME_MAPS: GameMap[] = [
  { id: "fury-strip", name: "FURY's Strip", icon: "🦝", description: "The original casino strip ruled by FURY the raccoon.", zones: ZONES },
  { id: "rian-strip", name: "Rian's Royal Strip", icon: "👑", description: "An opulent casino empire ruled by the House King.", zones: RIAN_ZONES },
  { id: "steve-underworld", name: "Steve's Underworld", icon: "🔨", description: "A brutal underground circuit controlled by the Banhammer.", zones: STEVE_ZONES },
  { id: "shadow-syndicate", name: "Diana's Shadow Syndicate", icon: "🖤", description: "Diana's hidden criminal empire cloaked in darkness. Level 40+ only.", zones: SHADOW_ZONES },
  { id: "inferno-colosseum", name: "Emily's Inferno Colosseum", icon: "🔥", description: "Emily's ultimate endgame arena forged in hellfire. Level 50+ only.", zones: INFERNO_ZONES },
];

// ============ DUNGEONS ============
// Map 1 dungeons
function makeDungeon(
  id: string, name: string, icon: string, zoneId: string, mapId: string,
  reqLv: number, goldRange: [number, number], dropChance: number,
  enemyDefs: [string, string, Enemy["role"]][], bossName: string, bossEmoji: string, bossAbilities?: string[]
): Dungeon {
  const rooms: DungeonRoom[] = enemyDefs.map(([n, e, r], i) => ({
    roomNumber: i + 1,
    enemy: scaleEnemy(n, e, r, reqLv, i),
    isBoss: false,
  }));
  rooms.push({
    roomNumber: 5,
    enemy: scaleEnemy(bossName, bossEmoji, "boss", reqLv, 4, bossAbilities),
    isBoss: true,
  });
  return { id, name, icon, zoneId, mapId, requiredLevel: reqLv, rooms: rooms.slice(0, 5), itemDropChance: dropChance, goldReward: goldRange };
}

export const DUNGEONS: Dungeon[] = [
  // MAP 1 DUNGEONS
  makeDungeon("ken-tunnel", "Ken's Token Tunnel", "🪙", "slot-alley", "fury-strip", 3, [30, 80], 8,
    [["Token Rat", "🐀", "dps"], ["Slot Gremlin", "👾", "dps"], ["Coin Golem", "🪙", "tank"], ["Token Hoarder", "🐿️", "elite"]],
    "Ken the Collector", "🎖️", ["Token Storm"]),
  makeDungeon("psyco-crypt", "Psyco's Card Crypt", "🃏", "poker-parlor", "fury-strip", 7, [50, 120], 10,
    [["Crypt Dealer", "💀", "dps"], ["Ghost Gambler", "👻", "dps"], ["Phantom Pit Boss", "🌑", "tank"], ["Shadow Ace", "🂡", "elite"]],
    "Psyco the Mad Dealer", "🤪", ["Psycho Shuffle", "Mind Game"]),
  makeDungeon("anatoli-vault", "Anatoli's Secret Vault", "🏦", "high-roller", "fury-strip", 12, [80, 180], 12,
    [["Vault Rat", "🐁", "dps"], ["Safe Cracker", "🔓", "dps"], ["Gold Sentinel", "🤖", "tank"], ["Laser Grid", "⚡", "elite"]],
    "Anatoli the Vault Keeper", "🧔", ["Lockdown", "Vault Slam"]),
  makeDungeon("smoki-backroom", "Smoki's Backroom", "🚬", "vip-vault", "fury-strip", 17, [120, 250], 15,
    [["Backroom Thug", "🥊", "dps"], ["Smoke Screen", "💨", "healer"], ["Cigar Boss", "🫅", "tank"], ["Shadow Dealer", "🕶️", "elite"]],
    "Smoki the Kingpin", "😤", ["Smoke Bomb", "Backroom Deal"]),
  makeDungeon("josh-gambit", "Josh's Final Gambit", "🎯", "fury-penthouse", "fury-strip", 22, [200, 500], 18,
    [["Elite Guard", "🛡️", "tank"], ["Penthouse Sniper", "🎯", "dps"], ["VIP Assassin", "🗡️", "dps"], ["Max the Enforcer", "💪", "elite"]],
    "Josh the Strategist", "🧠", ["Master Plan", "All In", "Final Gambit"]),

  // MAP 2 DUNGEONS
  makeDungeon("andrea-powder", "Andrea's Powder Room", "💄", "vera-lounge", "rian-strip", 3, [25, 70], 8,
    [["Powder Puff", "🧁", "dps"], ["Mirror Guard", "🪞", "tank"], ["Perfume Cloud", "💨", "healer"], ["Vanity Shade", "👤", "dps"]],
    "Andrea the Glamorous", "💅", ["Dazzle"]),
  makeDungeon("bobin-trick", "Bobin's Trick Chamber", "🎪", "badjoker-bluff", "rian-strip", 7, [45, 110], 10,
    [["Trick Rabbit", "🐇", "dps"], ["Card Phantom", "🎭", "dps"], ["Box Trap", "📦", "tank"], ["Disappearing Act", "💫", "healer"]],
    "Bobin the Illusionist", "🎩", ["Vanishing Act", "Trick Shot"]),
  makeDungeon("osmar-ring", "Osmar's Underground Ring", "🥊", "brian-pit", "rian-strip", 12, [75, 170], 12,
    [["Ring Rat", "🐀", "dps"], ["Cage Fighter", "🦁", "dps"], ["Corner Man", "🧤", "healer"], ["Arya the Wildcard", "🃏", "elite"]],
    "Osmar the Pitfighter", "🥷", ["Ring Slam", "Cage Match"]),
  makeDungeon("jhazzy-mirror", "Jhazzy's Mirror Hall", "🪞", "emma-crystal", "rian-strip", 17, [110, 240], 15,
    [["Mirror Shard", "🔮", "dps"], ["Reflection", "👥", "dps"], ["Crystal Warden", "🏛️", "tank"], ["Prism Witch", "🌈", "healer"]],
    "Jhazzy the Reflector", "✨", ["Mirror Match", "Crystal Prison"]),
  makeDungeon("pablo-crypt", "Pablo's VIP Crypt", "⚰️", "rian-royal", "rian-strip", 22, [180, 450], 18,
    [["Crypt Knight", "⚔️", "tank"], ["Gold Wraith", "👻", "dps"], ["Jayson the Shadow", "🌑", "elite"], ["Bone Dealer", "💀", "dps"]],
    "Pablo the Underboss", "🫅", ["VIP Strike", "Dead Man's Hand", "Crypt Curse"]),

  // MAP 3 DUNGEONS
  makeDungeon("fier-cellar", "Fier's Slot Cellar", "🎰", "sahil-spin", "steve-underworld", 3, [28, 75], 8,
    [["Cellar Creep", "🕷️", "dps"], ["Rusty Slot", "🤖", "tank"], ["Coin Bug", "🪲", "dps"], ["Dusty Dealer", "🧹", "healer"]],
    "Fier the Firestarter", "🔥", ["Ignite"]),
  makeDungeon("mariusz-den", "Mariusz's Dice Den", "🎲", "maica-corner", "steve-underworld", 7, [48, 115], 10,
    [["Dice Imp", "👹", "dps"], ["Loaded Die", "🎲", "dps"], ["Roll Master", "🎯", "tank"], ["Brother the Lookout", "👁️", "healer"]],
    "Mariusz the Dice Lord", "🎩", ["Loaded Roll", "Snake Eyes"]),
  makeDungeon("diego-wheel", "Diego's Wheel Room", "🎡", "turkish-roulette", "steve-underworld", 12, [78, 175], 12,
    [["Wheel Phantom", "👻", "dps"], ["Spin Trap", "🌀", "tank"], ["Baptiste the Spinner", "🎡", "elite"], ["Wheel Gremlin", "👾", "dps"]],
    "Diego the Wheelmaster", "🎪", ["Death Spin", "Wheel Lock"]),
  makeDungeon("dustin-jewel", "Dustin's Jewel Vault", "💠", "priyanka-diamond", "steve-underworld", 17, [115, 245], 15,
    [["Gem Guardian", "🛡️", "tank"], ["Ruby Thief", "🔴", "dps"], ["Sapphire Shade", "🔵", "dps"], ["Emerald Healer", "🟢", "healer"]],
    "Dustin the Gem Lord", "💍", ["Gem Barrage", "Jewel Shield"]),
  makeDungeon("smoki-last", "Smoki's Last Stand", "💀", "steve-banhammer", "steve-underworld", 22, [190, 480], 18,
    [["Ban Bot", "🤖", "tank"], ["Mute Agent", "🤐", "dps"], ["Timeout Ghost", "⏳", "elite"], ["Kick Enforcer", "🦵", "dps"]],
    "The Final Moderator", "⚖️", ["Supreme Ban", "Account Wipe", "Final Judgment"]),

  // MAP 4 DUNGEONS (Shadow Syndicate)
  makeDungeon("phantom-catacombs", "Phantom Catacombs", "💀", "phantom-gate", "shadow-syndicate", 41, [400, 900], 20,
    [["Crypt Phantom", "👻", "dps"], ["Shadow Sentinel", "🛡️", "tank"], ["Void Walker", "🌑", "dps"], ["Dark Siphon", "💊", "healer"]],
    "The Phantom King", "👁️‍🗨️", ["Phase Strike", "Soul Harvest"]),
  makeDungeon("neon-mainframe", "Neon Mainframe", "🖥️", "neon-abyss", "shadow-syndicate", 43, [500, 1100], 22,
    [["Glitch Drone", "🤖", "dps"], ["Firewall Golem", "🧱", "tank"], ["Data Leech", "🦠", "healer"], ["Virus Prime", "👾", "elite"]],
    "The System Admin", "🖥️", ["System Crash", "Overwrite", "Reboot"]),
  makeDungeon("crimson-depths", "Crimson Depths", "🩸", "crimson-vault", "shadow-syndicate", 45, [600, 1300], 24,
    [["Blood Golem", "🗿", "tank"], ["Crimson Blade", "🗡️", "dps"], ["Scarlet Witch", "🧙", "healer"], ["Red Colossus", "⚔️", "elite"]],
    "The Crimson Overlord", "🩸", ["Blood Storm", "Crimson Barrier"]),
  makeDungeon("eclipse-sanctum", "Eclipse Sanctum", "🌘", "eclipse-pit", "shadow-syndicate", 48, [700, 1500], 26,
    [["Eclipse Shade", "🌑", "dps"], ["Gravity Titan", "🗿", "tank"], ["Dark Oracle", "🔮", "healer"], ["Void Reaver", "⚫", "elite"]],
    "Eclipse Arbiter", "🌘", ["Singularity", "Event Horizon", "Dark Matter"]),
  makeDungeon("syndicate-core", "Syndicate Core", "🖤", "syndicate-throne", "shadow-syndicate", 50, [900, 2000], 30,
    [["Core Guardian", "🛡️", "tank"], ["Shadow Assassin", "🥷", "dps"], ["Void Mender", "💜", "healer"], ["Syndicate General", "⚔️", "elite"]],
    "The Shadow Sovereign", "🖤", ["Absolute Darkness", "Syndicate's End", "Shadow Apocalypse", "Void Collapse"]),

  // MAP 5 DUNGEONS (Inferno Colosseum)
  makeDungeon("magma-tunnels", "Magma Tunnels", "🌋", "molten-gates", "inferno-colosseum", 51, [800, 1800], 22,
    [["Magma Worm", "🐛", "dps"], ["Lava Shield", "🛡️", "tank"], ["Ember Sprite", "✨", "healer"], ["Volcanic Brute", "🗿", "elite"]],
    "Magma Titan", "🌋", ["Lava Surge", "Eruption"]),
  makeDungeon("obsidian-vault", "Obsidian Vault", "♠️", "obsidian-casino", "inferno-colosseum", 53, [900, 2000], 24,
    [["Glass Shard Golem", "💎", "tank"], ["Obsidian Striker", "⚫", "dps"], ["Ash Enchanter", "🧹", "healer"], ["Dark Glass Titan", "🖤", "elite"]],
    "The Obsidian Emperor", "♠️", ["Glass Storm", "Mirror Break", "Obsidian Prison"]),
  makeDungeon("dragon-hoard", "Dragon's Hoard", "🐉", "dragon-den", "inferno-colosseum", 56, [1100, 2500], 28,
    [["Hatchling", "🐣", "dps"], ["Drake Sentinel", "🐲", "tank"], ["Wyrm Sage", "🧙", "healer"], ["Ancient Wyrm", "🐍", "elite"]],
    "The Dragon Lord", "🐉", ["Dragon Fire", "Ancient Roar", "Treasure Guard"]),
  makeDungeon("hellfire-gauntlet", "Hellfire Gauntlet", "⚔️", "hellfire-arena", "inferno-colosseum", 59, [1300, 3000], 30,
    [["Hellfire Knight", "⚔️", "tank"], ["Inferno Assassin", "🔥", "dps"], ["Flame Priest", "🔮", "healer"], ["Demon General", "😈", "elite"]],
    "The Hellfire King", "👑", ["Apocalypse Flame", "Hellfire Chains", "Demon's Wrath"]),
  makeDungeon("ignis-sanctum", "Ignis Sanctum", "👑🔥", "inferno-throne", "inferno-colosseum", 60, [2000, 5000], 35,
    [["Eternal Flame Guard", "🔥", "tank"], ["God's Blade", "⚡", "dps"], ["Divine Healer", "✨", "healer"], ["Celestial Judge", "⚖️", "elite"]],
    "Ignis Reborn", "👑🔥", ["World Fire", "Divine Judgment", "Eternal Rebirth", "Final Cataclysm"]),
];
