import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { useGame } from "@/contexts/GameContext";
import { PvpRival, PvpRecord, getMatchmakingPool, calculateEloChange, getRankForElo } from "@/lib/pvpData";
import { SKILLS } from "@/lib/gameData";

interface PvpBattleState {
  active: boolean;
  rival: PvpRival | null;
  rivalHp: number;
  playerHp: number;
  playerTurn: boolean;
  combatLog: string[];
  damageNumbers: { id: number; value: number; type: "damage" | "heal" | "crit"; target: "player" | "rival" }[];
  result: "none" | "win" | "loss";
  eloChange: number;
  betAmount: number;
}

interface PvpContextType {
  record: PvpRecord;
  matchmaking: PvpRival[];
  battle: PvpBattleState;
  refreshMatchmaking: () => void;
  startPvpBattle: (rivalId: string, betAmount: number) => void;
  pvpAttack: (skillType: "basic" | "heal" | "special") => void;
  leavePvpArena: () => void;
}

const PvpContext = createContext<PvpContextType | null>(null);

export function usePvp() {
  const ctx = useContext(PvpContext);
  if (!ctx) throw new Error("usePvp must be inside PvpProvider");
  return ctx;
}

let dmgId = 0;

const INITIAL_BATTLE: PvpBattleState = {
  active: false, rival: null, rivalHp: 0, playerHp: 0,
  playerTurn: true, combatLog: [], damageNumbers: [],
  result: "none", eloChange: 0, betAmount: 0,
};

export function PvpProvider({ children }: { children: ReactNode }) {
  const { player } = useGame();
  const [record, setRecord] = useState<PvpRecord>({
    elo: 950, rank: "bronze", wins: 0, losses: 0,
    winStreak: 0, bestStreak: 0, seasonGold: 0,
  });
  const [matchmaking, setMatchmaking] = useState<PvpRival[]>([]);
  const [battle, setBattle] = useState<PvpBattleState>(INITIAL_BATTLE);

  const refreshMatchmaking = useCallback(() => {
    setMatchmaking(getMatchmakingPool(player.level, record.elo));
  }, [player.level, record.elo]);

  const addDmg = useCallback((value: number, type: "damage" | "heal" | "crit", target: "player" | "rival") => {
    const id = ++dmgId;
    setBattle(prev => ({ ...prev, damageNumbers: [...prev.damageNumbers, { id, value, type, target }] }));
    setTimeout(() => {
      setBattle(prev => ({ ...prev, damageNumbers: prev.damageNumbers.filter(d => d.id !== id) }));
    }, 1000);
  }, []);

  const rivalAiTurn = useCallback((rival: PvpRival, currentRivalHp: number) => {
    setTimeout(() => {
      // AI decision based on style
      const hpPct = currentRivalHp / rival.maxHp;
      let action: "attack" | "heal" | "special" = "attack";

      if (rival.aiStyle === "aggressive") {
        action = Math.random() < 0.3 ? "special" : "attack";
      } else if (rival.aiStyle === "defensive") {
        if (hpPct < 0.4 && Math.random() < 0.5) action = "heal";
        else action = Math.random() < 0.2 ? "special" : "attack";
      } else {
        if (hpPct < 0.3 && Math.random() < 0.4) action = "heal";
        else action = Math.random() < 0.25 ? "special" : "attack";
      }

      if (action === "heal") {
        const healAmt = 20 + Math.floor(Math.random() * 15);
        const newHp = Math.min(rival.maxHp, currentRivalHp + healAmt);
        addDmg(healAmt, "heal", "rival");
        setBattle(prev => ({
          ...prev, rivalHp: newHp, playerTurn: true,
          combatLog: [...prev.combatLog, `${rival.name} heals for ${healAmt} HP!`],
        }));
        return;
      }

      const baseDmg = action === "special" ? rival.attack * 2 : rival.attack;
      const isCrit = Math.random() * 100 < rival.critChance;
      const dmg = Math.max(1, Math.floor((baseDmg - player.defense + Math.floor(Math.random() * 6) - 3) * (isCrit ? 1.5 : 1)));
      addDmg(dmg, isCrit ? "crit" : "damage", "player");

      const skillName = action === "special" ? "Special Attack" : "Attack";
      const logMsg = isCrit
        ? `💥 ${rival.name} CRITS with ${skillName} for ${dmg}!`
        : `${rival.name} uses ${skillName} for ${dmg} damage!`;

      setBattle(prev => {
        const newPlayerHp = Math.max(0, prev.playerHp - dmg);
        if (newPlayerHp <= 0) {
          // Player loses
          const eloChange = calculateEloChange(record.elo, rival.elo, false);
          setTimeout(() => {
            setRecord(r => ({
              ...r,
              elo: Math.max(0, r.elo + eloChange),
              rank: getRankForElo(Math.max(0, r.elo + eloChange)),
              losses: r.losses + 1,
              winStreak: 0,
            }));
          }, 500);
          return {
            ...prev, playerHp: 0, playerTurn: false,
            result: "loss", eloChange,
            combatLog: [...prev.combatLog, logMsg, `💀 You have been defeated by ${rival.name}!`],
          };
        }
        return { ...prev, playerHp: newPlayerHp, playerTurn: true, combatLog: [...prev.combatLog, logMsg] };
      });
    }, 800);
  }, [player.defense, record.elo, addDmg]);

  const startPvpBattle = useCallback((rivalId: string, betAmount: number) => {
    const rival = matchmaking.find(r => r.id === rivalId);
    if (!rival) return;
    setBattle({
      active: true, rival, rivalHp: rival.hp, playerHp: player.hp,
      playerTurn: true, combatLog: [`⚔️ PvP Match: You vs ${rival.name}!`, `${rival.name} is a ${rival.aiStyle} fighter. Watch out!`],
      damageNumbers: [], result: "none", eloChange: 0, betAmount,
    });
  }, [matchmaking, player.hp]);

  const pvpAttack = useCallback((skillType: "basic" | "heal" | "special") => {
    if (!battle.playerTurn || !battle.rival || battle.result !== "none") return;
    setBattle(prev => ({ ...prev, playerTurn: false }));

    const rival = battle.rival;

    if (skillType === "heal") {
      const healAmt = 25 + Math.floor(Math.random() * 10);
      const newHp = Math.min(player.maxHp, battle.playerHp + healAmt);
      addDmg(healAmt, "heal", "player");
      setBattle(prev => ({
        ...prev, playerHp: newHp,
        combatLog: [...prev.combatLog, `🍀 You heal for ${healAmt} HP!`],
      }));
      rivalAiTurn(rival, battle.rivalHp);
      return;
    }

    const baseDmg = skillType === "special" ? player.attack * 2 : player.attack;
    const isCrit = Math.random() * 100 < player.critChance;
    const dmg = Math.max(1, Math.floor((baseDmg - rival.defense + Math.floor(Math.random() * 6) - 3) * (isCrit ? 1.5 : 1)));
    const newRivalHp = Math.max(0, battle.rivalHp - dmg);
    addDmg(dmg, isCrit ? "crit" : "damage", "rival");
    const logMsg = isCrit ? `💥 CRITICAL HIT! You deal ${dmg} damage!` : `You deal ${dmg} damage!`;

    if (newRivalHp <= 0) {
      const eloChange = calculateEloChange(record.elo, rival.elo, true);
      const goldWon = battle.betAmount * 2;
      setRecord(r => ({
        ...r,
        elo: r.elo + eloChange,
        rank: getRankForElo(r.elo + eloChange),
        wins: r.wins + 1,
        winStreak: r.winStreak + 1,
        bestStreak: Math.max(r.bestStreak, r.winStreak + 1),
        seasonGold: r.seasonGold + goldWon,
      }));
      setBattle(prev => ({
        ...prev, rivalHp: 0, playerTurn: false,
        result: "win", eloChange,
        combatLog: [...prev.combatLog, logMsg, `🏆 You defeated ${rival.name}! +${eloChange} ELO${goldWon > 0 ? ` +${goldWon} Gold` : ""}`],
      }));
    } else {
      setBattle(prev => ({ ...prev, rivalHp: newRivalHp, combatLog: [...prev.combatLog, logMsg] }));
      rivalAiTurn(rival, newRivalHp);
    }
  }, [battle, player, record.elo, addDmg, rivalAiTurn]);

  const leavePvpArena = useCallback(() => setBattle(INITIAL_BATTLE), []);

  return (
    <PvpContext.Provider value={{ record, matchmaking, battle, refreshMatchmaking, startPvpBattle, pvpAttack, leavePvpArena }}>
      {children}
    </PvpContext.Provider>
  );
}
