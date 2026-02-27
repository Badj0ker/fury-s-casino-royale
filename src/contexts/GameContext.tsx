import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { PlayerStats, Enemy, Zone, Quest, InventoryItem, DEFAULT_PLAYER, ZONES, QUESTS, INVENTORY, getRandomEnemy } from "@/lib/gameData";

interface BattleState {
  active: boolean;
  enemy: Enemy | null;
  zoneId: string | null;
  combatLog: string[];
  playerTurn: boolean;
  damageNumbers: { id: number; value: number; type: "damage" | "heal" | "crit"; target: "player" | "enemy" }[];
}

interface GameContextType {
  player: PlayerStats;
  zones: Zone[];
  quests: Quest[];
  inventory: InventoryItem[];
  battle: BattleState;
  startBattle: (zoneId: string) => void;
  playerAttack: (skillType: "basic" | "heal" | "special") => void;
  claimQuest: (questId: string) => void;
  equipItem: (itemId: string) => void;
}

const GameContext = createContext<GameContextType | null>(null);

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be inside GameProvider");
  return ctx;
}

let dmgIdCounter = 0;

export function GameProvider({ children }: { children: ReactNode }) {
  const [player, setPlayer] = useState<PlayerStats>(DEFAULT_PLAYER);
  const [zones, setZones] = useState<Zone[]>(ZONES);
  const [quests, setQuests] = useState<Quest[]>(QUESTS);
  const [inventory, setInventory] = useState<InventoryItem[]>(INVENTORY);
  const [battle, setBattle] = useState<BattleState>({
    active: false, enemy: null, zoneId: null, combatLog: [], playerTurn: true, damageNumbers: [],
  });

  const addDmgNumber = useCallback((value: number, type: "damage" | "heal" | "crit", target: "player" | "enemy") => {
    const id = ++dmgIdCounter;
    setBattle(prev => ({ ...prev, damageNumbers: [...prev.damageNumbers, { id, value, type, target }] }));
    setTimeout(() => {
      setBattle(prev => ({ ...prev, damageNumbers: prev.damageNumbers.filter(d => d.id !== id) }));
    }, 1000);
  }, []);

  const startBattle = useCallback((zoneId: string) => {
    const zone = zones.find(z => z.id === zoneId);
    if (!zone || !zone.unlocked) return;
    const enemy = getRandomEnemy(zone);
    setBattle({
      active: true,
      enemy: { ...enemy },
      zoneId,
      combatLog: [`A wild ${enemy.name} appears!`],
      playerTurn: true,
      damageNumbers: [],
    });
  }, [zones]);

  const enemyTurn = useCallback((currentEnemy: Enemy) => {
    setTimeout(() => {
      const dmg = Math.max(1, currentEnemy.attack - player.defense + Math.floor(Math.random() * 5) - 2);
      setPlayer(prev => ({ ...prev, hp: Math.max(0, prev.hp - dmg) }));
      addDmgNumber(dmg, "damage", "player");
      setBattle(prev => ({
        ...prev,
        combatLog: [...prev.combatLog, `${currentEnemy.name} deals ${dmg} damage!`],
        playerTurn: true,
      }));
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
    setZones(prev => prev.map(z => z.id === zoneId ? { ...z, progress: Math.min(z.progress + 1, z.maxProgress) } : z));
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
    <GameContext.Provider value={{ player, zones, quests, inventory, battle, startBattle, playerAttack, claimQuest, equipItem }}>
      {children}
    </GameContext.Provider>
  );
}
