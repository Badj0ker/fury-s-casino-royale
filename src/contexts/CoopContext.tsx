import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { useGame } from "./GameContext";
import { CoopDungeon, CoopEnemy, PartyMember, COOP_DUNGEONS, PARTY_POOL, buildPartyMember } from "@/lib/coopData";
import { SKILLS } from "@/lib/gameData";

interface CoopState {
  active: boolean;
  dungeonId: string | null;
  currentRoom: number;
  enemies: CoopEnemy[];
  party: PartyMember[];
  selectedTarget: number; // index into enemies
  currentTurnIndex: number; // index into party (whose turn)
  combatLog: string[];
  damageNumbers: { id: number; value: number; type: "damage" | "heal" | "crit"; targetId: string }[];
  roomsCleared: number;
  goldEarned: number;
  completed: boolean;
  failed: boolean;
}

interface CoopContextType {
  coop: CoopState;
  coopDungeons: CoopDungeon[];
  startCoop: (dungeonId: string) => void;
  coopAttack: (skillType: "basic" | "heal" | "special") => void;
  coopSelectTarget: (index: number) => void;
  coopNextRoom: () => void;
  leaveCoop: () => void;
}

const CoopContext = createContext<CoopContextType | null>(null);

export function useCoop() {
  const ctx = useContext(CoopContext);
  if (!ctx) throw new Error("useCoop must be inside CoopProvider");
  return ctx;
}

let dmgId = 0;

const INITIAL: CoopState = {
  active: false, dungeonId: null, currentRoom: 0,
  enemies: [], party: [], selectedTarget: 0, currentTurnIndex: 0,
  combatLog: [], damageNumbers: [],
  roomsCleared: 0, goldEarned: 0, completed: false, failed: false,
};

export function CoopProvider({ children }: { children: ReactNode }) {
  const { player } = useGame();
  const [coop, setCoop] = useState<CoopState>(INITIAL);

  const addDmg = useCallback((value: number, type: "damage" | "heal" | "crit", targetId: string) => {
    const id = ++dmgId;
    setCoop(prev => ({ ...prev, damageNumbers: [...prev.damageNumbers, { id, value, type, targetId }] }));
    setTimeout(() => setCoop(prev => ({ ...prev, damageNumbers: prev.damageNumbers.filter(d => d.id !== id) })), 900);
  }, []);

  const startCoop = useCallback((dungeonId: string) => {
    const dg = COOP_DUNGEONS.find(d => d.id === dungeonId);
    if (!dg || player.level < dg.requiredLevel) return;

    const playerMember: PartyMember = {
      id: "player", name: player.name, emoji: "🧑‍💼",
      hp: player.hp, maxHp: player.maxHp,
      attack: player.attack, defense: player.defense,
      isPlayer: true,
    };
    const npcParty = PARTY_POOL.map(npc => buildPartyMember(npc, player.level));
    const party = [playerMember, ...npcParty];
    const firstRoom = dg.rooms[0];

    setCoop({
      active: true, dungeonId, currentRoom: 0,
      enemies: firstRoom.enemies.map(e => ({ ...e })),
      party,
      selectedTarget: 0, currentTurnIndex: 0,
      combatLog: [`⚔️ Co-op: ${dg.name}`, `Room 1/${dg.rooms.length} — ${firstRoom.name}`, `${firstRoom.enemies.length} enemies!`],
      damageNumbers: [], roomsCleared: 0, goldEarned: 0, completed: false, failed: false,
    });
  }, [player]);

  const doEnemyTurns = useCallback((state: CoopState): CoopState => {
    let newState = { ...state, party: state.party.map(p => ({ ...p })), combatLog: [...state.combatLog] };

    for (const enemy of newState.enemies) {
      if (enemy.hp <= 0) continue;
      // Pick random alive party member
      const alive = newState.party.filter(p => p.hp > 0);
      if (alive.length === 0) break;
      const target = alive[Math.floor(Math.random() * alive.length)];
      const dmg = Math.max(1, enemy.attack - target.defense + Math.floor(Math.random() * 5) - 2);
      target.hp = Math.max(0, target.hp - dmg);
      addDmg(dmg, "damage", target.id);
      newState.combatLog.push(`${enemy.emoji} ${enemy.name} → ${target.emoji} ${target.name} for ${dmg} dmg`);
    }

    // Check party wipe
    if (newState.party.every(p => p.hp <= 0)) {
      newState.failed = true;
      newState.active = false;
      newState.combatLog.push("💀 Party wiped!");
    }

    newState.currentTurnIndex = 0;
    return newState;
  }, [addDmg]);

  const advanceTurn = useCallback((state: CoopState): CoopState => {
    // Find next alive party member
    let next = state.currentTurnIndex + 1;
    while (next < state.party.length && state.party[next].hp <= 0) next++;

    if (next >= state.party.length) {
      // All party members acted → enemy turns
      return doEnemyTurns(state);
    }

    // NPC auto-attack
    const npc = state.party[next];
    if (!npc.isPlayer) {
      const aliveEnemies = state.enemies.filter(e => e.hp > 0);
      if (aliveEnemies.length === 0) return { ...state, currentTurnIndex: next };

      const target = aliveEnemies[Math.floor(Math.random() * aliveEnemies.length)];
      const isCrit = Math.random() < 0.1;
      const dmg = Math.max(1, Math.floor((npc.attack - target.defense + Math.floor(Math.random() * 6) - 3) * (isCrit ? 1.5 : 1)));
      target.hp = Math.max(0, target.hp - dmg);
      addDmg(dmg, isCrit ? "crit" : "damage", target.id);

      const newEnemies = state.enemies.map(e => e.id === target.id ? { ...target } : e);
      const log = isCrit
        ? `${npc.emoji} ${npc.name} CRIT → ${target.emoji} ${target.name} for ${dmg}!`
        : `${npc.emoji} ${npc.name} → ${target.emoji} ${target.name} for ${dmg}`;

      const newState = {
        ...state,
        enemies: newEnemies,
        currentTurnIndex: next,
        combatLog: [...state.combatLog, log],
      };

      // Check if all enemies dead
      if (newEnemies.every(e => e.hp <= 0)) {
        return newState; // room cleared, UI will show next button
      }

      // Continue to next turn after delay
      return advanceTurn(newState);
    }

    return { ...state, currentTurnIndex: next };
  }, [doEnemyTurns, addDmg]);

  const coopAttack = useCallback((skillType: "basic" | "heal" | "special") => {
    setCoop(prev => {
      if (prev.failed || prev.completed) return prev;
      const turnMember = prev.party[prev.currentTurnIndex];
      if (!turnMember || !turnMember.isPlayer || turnMember.hp <= 0) return prev;

      let newState = { ...prev, party: prev.party.map(p => ({ ...p })), enemies: prev.enemies.map(e => ({ ...e })), combatLog: [...prev.combatLog] };

      if (skillType === "heal") {
        const healAmt = 25 + Math.floor(Math.random() * 10);
        const me = newState.party[newState.currentTurnIndex];
        me.hp = Math.min(me.maxHp, me.hp + healAmt);
        addDmg(healAmt, "heal", me.id);
        newState.combatLog.push(`${me.emoji} ${me.name} heals for ${healAmt} HP!`);
      } else {
        const aliveEnemies = newState.enemies.filter(e => e.hp > 0);
        if (aliveEnemies.length === 0) return prev;
        const targetIdx = Math.min(prev.selectedTarget, aliveEnemies.length - 1);
        const target = aliveEnemies[targetIdx];

        const baseDmg = skillType === "special" ? player.attack * 2 : player.attack;
        const isCrit = Math.random() * 100 < player.critChance;
        const dmg = Math.max(1, Math.floor((baseDmg - target.defense + Math.floor(Math.random() * 6) - 3) * (isCrit ? 1.5 : 1)));
        target.hp = Math.max(0, target.hp - dmg);
        addDmg(dmg, isCrit ? "crit" : "damage", target.id);

        // Update enemy in array
        newState.enemies = newState.enemies.map(e => e.id === target.id ? { ...target } : e);
        const logMsg = isCrit ? `🧑‍💼 CRITICAL → ${target.emoji} ${target.name} for ${dmg}!` : `🧑‍💼 You → ${target.emoji} ${target.name} for ${dmg}`;
        newState.combatLog.push(logMsg);
      }

      // Check if all enemies dead
      if (newState.enemies.every(e => e.hp <= 0)) {
        newState.roomsCleared = prev.roomsCleared + 1;
        newState.combatLog.push("✅ Room cleared!");
        return newState;
      }

      // Advance to next turn
      return advanceTurn(newState);
    });
  }, [player, addDmg, advanceTurn]);

  const coopSelectTarget = useCallback((index: number) => {
    setCoop(prev => ({ ...prev, selectedTarget: index }));
  }, []);

  const coopNextRoom = useCallback(() => {
    setCoop(prev => {
      const dg = COOP_DUNGEONS.find(d => d.id === prev.dungeonId);
      if (!dg) return prev;
      const nextRoom = prev.currentRoom + 1;
      if (nextRoom >= dg.rooms.length) {
        const gold = dg.goldReward[0] + Math.floor(Math.random() * (dg.goldReward[1] - dg.goldReward[0]));
        return {
          ...prev, completed: true, active: false, goldEarned: gold,
          combatLog: [...prev.combatLog, `🎉 Co-op dungeon cleared! +${gold} Gold`],
        };
      }
      const room = dg.rooms[nextRoom];
      return {
        ...prev,
        currentRoom: nextRoom,
        enemies: room.enemies.map(e => ({ ...e })),
        selectedTarget: 0,
        currentTurnIndex: 0,
        combatLog: [...prev.combatLog, `Room ${nextRoom + 1}/${dg.rooms.length} — ${room.name}${room.isBoss ? " ⚠️ BOSS!" : ""}`],
      };
    });
  }, []);

  const leaveCoop = useCallback(() => setCoop(INITIAL), []);

  return (
    <CoopContext.Provider value={{ coop, coopDungeons: COOP_DUNGEONS, startCoop, coopAttack, coopSelectTarget, coopNextRoom, leaveCoop }}>
      {children}
    </CoopContext.Provider>
  );
}
