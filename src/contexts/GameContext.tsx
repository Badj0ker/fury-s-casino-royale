import React, { createContext, useContext, useState, useCallback, ReactNode, useMemo } from "react";
import { PlayerStats, Enemy, Zone, Quest, InventoryItem, GameMap, Dungeon, DungeonRoom, DEFAULT_PLAYER, QUESTS, INVENTORY, getRandomEnemy } from "@/lib/gameData";
import { GAME_MAPS, DUNGEONS } from "@/lib/mapData";

interface BattleState {
  active: boolean;
  enemy: Enemy | null;
  zoneId: string | null;
  combatLog: string[];
  playerTurn: boolean;
  damageNumbers: { id: number; value: number; type: "damage" | "heal" | "crit"; target: "player" | "enemy" }[];
}

interface DungeonState {
  active: boolean;
  dungeonId: string | null;
  currentRoom: number;
  enemy: Enemy | null;
  playerTurn: boolean;
  combatLog: string[];
  damageNumbers: { id: number; value: number; type: "damage" | "heal" | "crit"; target: "player" | "enemy" }[];
  roomsCleared: number;
  goldEarned: number;
  completed: boolean;
  failed: boolean;
}

interface GameContextType {
  player: PlayerStats;
  maps: GameMap[];
  currentMapId: string;
  zones: Zone[];
  quests: Quest[];
  inventory: InventoryItem[];
  battle: BattleState;
  dungeon: DungeonState;
  dungeons: Dungeon[];
  switchMap: (mapId: string) => void;
  startBattle: (zoneId: string) => void;
  playerAttack: (skillType: "basic" | "heal" | "special") => void;
  claimQuest: (questId: string) => void;
  equipItem: (itemId: string) => void;
  startDungeon: (dungeonId: string) => void;
  dungeonAttack: (skillType: "basic" | "heal" | "special") => void;
  dungeonNextRoom: () => void;
  leaveDungeon: () => void;
}

const GameContext = createContext<GameContextType | null>(null);

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be inside GameProvider");
  return ctx;
}

let dmgIdCounter = 0;

const INITIAL_DUNGEON: DungeonState = {
  active: false, dungeonId: null, currentRoom: 0, enemy: null,
  playerTurn: true, combatLog: [], damageNumbers: [],
  roomsCleared: 0, goldEarned: 0, completed: false, failed: false,
};

export function GameProvider({ children }: { children: ReactNode }) {
  const [player, setPlayer] = useState<PlayerStats>(DEFAULT_PLAYER);
  const [maps, setMaps] = useState<GameMap[]>(GAME_MAPS);
  const [currentMapId, setCurrentMapId] = useState("fury-strip");
  const [quests, setQuests] = useState<Quest[]>(QUESTS);
  const [inventory, setInventory] = useState<InventoryItem[]>(INVENTORY);
  const [battle, setBattle] = useState<BattleState>({
    active: false, enemy: null, zoneId: null, combatLog: [], playerTurn: true, damageNumbers: [],
  });
  const [dungeon, setDungeon] = useState<DungeonState>(INITIAL_DUNGEON);

  const zones = useMemo(() => {
    const map = maps.find(m => m.id === currentMapId);
    return map ? map.zones : [];
  }, [maps, currentMapId]);

  const switchMap = useCallback((mapId: string) => setCurrentMapId(mapId), []);

  const addDmgNumber = useCallback((value: number, type: "damage" | "heal" | "crit", target: "player" | "enemy", isDungeon = false) => {
    const id = ++dmgIdCounter;
    const setter = isDungeon ? setDungeon : setBattle;
    (setter as any)((prev: any) => ({ ...prev, damageNumbers: [...prev.damageNumbers, { id, value, type, target }] }));
    setTimeout(() => {
      (setter as any)((prev: any) => ({ ...prev, damageNumbers: prev.damageNumbers.filter((d: any) => d.id !== id) }));
    }, 1000);
  }, []);

  // ===== REGULAR BATTLE =====
  const startBattle = useCallback((zoneId: string) => {
    const allZones = maps.flatMap(m => m.zones);
    const zone = allZones.find(z => z.id === zoneId);
    if (!zone || !zone.unlocked) return;
    const enemy = getRandomEnemy(zone);
    setBattle({ active: true, enemy: { ...enemy }, zoneId, combatLog: [`A wild ${enemy.name} appears!`], playerTurn: true, damageNumbers: [] });
  }, [maps]);

  const enemyTurn = useCallback((currentEnemy: Enemy, isDungeon = false) => {
    setTimeout(() => {
      const dmg = Math.max(1, currentEnemy.attack - player.defense + Math.floor(Math.random() * 5) - 2);
      setPlayer(prev => ({ ...prev, hp: Math.max(0, prev.hp - dmg) }));
      addDmgNumber(dmg, "damage", "player", isDungeon);
      const setter = isDungeon ? setDungeon : setBattle;
      (setter as any)((prev: any) => ({
        ...prev,
        combatLog: [...prev.combatLog, `${currentEnemy.name} deals ${dmg} damage!`],
        playerTurn: true,
      }));
      // Check player death in dungeon
      if (isDungeon) {
        setPlayer(prev => {
          if (prev.hp - dmg <= 0) {
            setTimeout(() => setDungeon(d => ({ ...d, failed: true, active: false })), 500);
          }
          return prev;
        });
      }
    }, 800);
  }, [player.defense, addDmgNumber]);

  const winBattle = useCallback((enemy: Enemy, zoneId: string) => {
    setPlayer(prev => {
      const newXp = prev.xp + enemy.xpReward;
      const levelUp = newXp >= prev.xpToNext;
      return {
        ...prev,
        xp: levelUp ? newXp - prev.xpToNext : newXp,
        xpToNext: levelUp ? Math.floor(prev.xpToNext * 1.3) : prev.xpToNext,
        level: levelUp ? prev.level + 1 : prev.level,
        maxHp: levelUp ? prev.maxHp + 10 : prev.maxHp,
        hp: levelUp ? prev.maxHp + 10 : prev.hp,
        attack: levelUp ? prev.attack + 2 : prev.attack,
        defense: levelUp ? prev.defense + 1 : prev.defense,
        gold: prev.gold + enemy.goldReward,
      };
    });
    setMaps(prev => prev.map(m => ({
      ...m,
      zones: m.zones.map(z => z.id === zoneId ? { ...z, progress: Math.min(z.progress + 1, z.maxProgress) } : z),
    })));
    setBattle(prev => ({
      ...prev,
      combatLog: [...prev.combatLog, `${enemy.name} defeated! +${enemy.xpReward} XP +${enemy.goldReward} Gold`],
    }));
    setTimeout(() => setBattle({ active: false, enemy: null, zoneId: null, combatLog: [], playerTurn: true, damageNumbers: [] }), 2000);
  }, []);

  const playerAttack = useCallback((skillType: "basic" | "heal" | "special") => {
    if (!battle.playerTurn || !battle.enemy) return;
    setBattle(prev => ({ ...prev, playerTurn: false }));
    const enemy = { ...battle.enemy };

    if (skillType === "heal") {
      const healAmt = 25 + Math.floor(Math.random() * 10);
      setPlayer(prev => ({ ...prev, hp: Math.min(prev.maxHp, prev.hp + healAmt) }));
      addDmgNumber(healAmt, "heal", "player");
      setBattle(prev => ({ ...prev, combatLog: [...prev.combatLog, `You heal for ${healAmt} HP!`] }));
      enemyTurn(enemy);
      return;
    }

    const baseDmg = skillType === "special" ? player.attack * 2 : player.attack;
    const isCrit = Math.random() * 100 < player.critChance;
    const dmg = Math.max(1, Math.floor((baseDmg - enemy.defense + Math.floor(Math.random() * 6) - 3) * (isCrit ? 1.5 : 1)));
    enemy.hp = Math.max(0, enemy.hp - dmg);
    addDmgNumber(dmg, isCrit ? "crit" : "damage", "enemy");
    const logMsg = isCrit ? `CRITICAL HIT! You deal ${dmg} damage!` : `You deal ${dmg} damage!`;
    setBattle(prev => ({ ...prev, enemy, combatLog: [...prev.combatLog, logMsg] }));

    if (enemy.hp <= 0) {
      winBattle(enemy, battle.zoneId!);
    } else {
      enemyTurn(enemy);
    }
  }, [battle, player, addDmgNumber, enemyTurn, winBattle]);

  // ===== DUNGEON SYSTEM =====
  const startDungeon = useCallback((dungeonId: string) => {
    const dg = DUNGEONS.find(d => d.id === dungeonId);
    if (!dg || player.level < dg.requiredLevel) return;
    const firstEnemy = { ...dg.rooms[0].enemy };
    setDungeon({
      active: true, dungeonId, currentRoom: 0, enemy: firstEnemy,
      playerTurn: true, combatLog: [`🏰 Entering ${dg.name}...`, `Room 1/5 — ${firstEnemy.name} appears!`],
      damageNumbers: [], roomsCleared: 0, goldEarned: 0, completed: false, failed: false,
    });
  }, [player.level]);

  const dungeonNextRoom = useCallback(() => {
    const dg = DUNGEONS.find(d => d.id === dungeon.dungeonId);
    if (!dg) return;
    const nextRoom = dungeon.currentRoom + 1;
    if (nextRoom >= dg.rooms.length) {
      // Dungeon complete!
      const goldEarned = dg.goldReward[0] + Math.floor(Math.random() * (dg.goldReward[1] - dg.goldReward[0]));
      setPlayer(prev => ({ ...prev, gold: prev.gold + goldEarned }));
      setDungeon(prev => ({
        ...prev, completed: true, active: false, goldEarned,
        combatLog: [...prev.combatLog, `🎉 Dungeon cleared! +${goldEarned} Gold`],
      }));
      return;
    }
    const nextEnemy = { ...dg.rooms[nextRoom].enemy };
    setDungeon(prev => ({
      ...prev, currentRoom: nextRoom, enemy: nextEnemy, playerTurn: true,
      combatLog: [...prev.combatLog, `Room ${nextRoom + 1}/5 — ${nextEnemy.name} appears!${dg.rooms[nextRoom].isBoss ? " ⚠️ BOSS!" : ""}`],
    }));
  }, [dungeon.dungeonId, dungeon.currentRoom]);

  const dungeonAttack = useCallback((skillType: "basic" | "heal" | "special") => {
    if (!dungeon.playerTurn || !dungeon.enemy) return;
    setDungeon(prev => ({ ...prev, playerTurn: false }));
    const enemy = { ...dungeon.enemy };

    if (skillType === "heal") {
      const healAmt = 25 + Math.floor(Math.random() * 10);
      setPlayer(prev => ({ ...prev, hp: Math.min(prev.maxHp, prev.hp + healAmt) }));
      addDmgNumber(healAmt, "heal", "player", true);
      setDungeon(prev => ({ ...prev, combatLog: [...prev.combatLog, `You heal for ${healAmt} HP!`] }));
      enemyTurn(enemy, true);
      return;
    }

    const baseDmg = skillType === "special" ? player.attack * 2 : player.attack;
    const isCrit = Math.random() * 100 < player.critChance;
    const dmg = Math.max(1, Math.floor((baseDmg - enemy.defense + Math.floor(Math.random() * 6) - 3) * (isCrit ? 1.5 : 1)));
    enemy.hp = Math.max(0, enemy.hp - dmg);
    addDmgNumber(dmg, isCrit ? "crit" : "damage", "enemy", true);
    const logMsg = isCrit ? `CRITICAL HIT! You deal ${dmg} damage!` : `You deal ${dmg} damage!`;

    if (enemy.hp <= 0) {
      const dg = DUNGEONS.find(d => d.id === dungeon.dungeonId)!;
      const roomGold = enemy.goldReward;
      setPlayer(prev => {
        const newXp = prev.xp + enemy.xpReward;
        const levelUp = newXp >= prev.xpToNext;
        return {
          ...prev,
          xp: levelUp ? newXp - prev.xpToNext : newXp,
          xpToNext: levelUp ? Math.floor(prev.xpToNext * 1.3) : prev.xpToNext,
          level: levelUp ? prev.level + 1 : prev.level,
          maxHp: levelUp ? prev.maxHp + 10 : prev.maxHp,
          hp: levelUp ? prev.maxHp + 10 : prev.hp,
          attack: levelUp ? prev.attack + 2 : prev.attack,
          defense: levelUp ? prev.defense + 1 : prev.defense,
        };
      });
      setDungeon(prev => ({
        ...prev, enemy, playerTurn: false,
        roomsCleared: prev.roomsCleared + 1,
        combatLog: [...prev.combatLog, logMsg, `${enemy.name} defeated! +${enemy.xpReward} XP`],
      }));
    } else {
      setDungeon(prev => ({ ...prev, enemy, combatLog: [...prev.combatLog, logMsg] }));
      enemyTurn(enemy, true);
    }
  }, [dungeon, player, addDmgNumber, enemyTurn]);

  const leaveDungeon = useCallback(() => setDungeon(INITIAL_DUNGEON), []);

  const claimQuest = useCallback((questId: string) => {
    const quest = quests.find(q => q.id === questId);
    if (!quest || !quest.completed || quest.claimed) return;
    setQuests(prev => prev.map(q => q.id === questId ? { ...q, claimed: true } : q));
    setPlayer(prev => ({ ...prev, xp: prev.xp + quest.xpReward, gold: prev.gold + quest.goldReward }));
  }, [quests]);

  const equipItem = useCallback((itemId: string) => {
    setInventory(prev => {
      const item = prev.find(i => i.id === itemId);
      if (!item || item.type === "consumable") return prev;
      return prev.map(i => {
        if (i.id === itemId) return { ...i, equipped: !i.equipped };
        if (i.type === item.type && i.equipped) return { ...i, equipped: false };
        return i;
      });
    });
  }, []);

  return (
    <GameContext.Provider value={{
      player, maps, currentMapId, zones, quests, inventory, battle, dungeon, dungeons: DUNGEONS,
      switchMap, startBattle, playerAttack, claimQuest, equipItem,
      startDungeon, dungeonAttack, dungeonNextRoom, leaveDungeon,
    }}>
      {children}
    </GameContext.Provider>
  );
}
