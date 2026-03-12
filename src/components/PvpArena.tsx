import { useEffect, useState } from "react";
import { usePvp } from "@/contexts/PvpContext";
import { useGame } from "@/contexts/GameContext";
import { SKILLS } from "@/lib/gameData";
import { getRankInfo, RANK_THRESHOLDS } from "@/lib/pvpData";
import battleBg from "@/assets/battle-bg-casino.png";

export default function PvpArena() {
  const { player } = useGame();
  const { record, matchmaking, battle, refreshMatchmaking, startPvpBattle, pvpAttack, leavePvpArena } = usePvp();
  const [betAmount, setBetAmount] = useState(0);
  const [selectedRival, setSelectedRival] = useState<string | null>(null);

  useEffect(() => {
    if (matchmaking.length === 0) refreshMatchmaking();
  }, [matchmaking.length, refreshMatchmaking]);

  const rankInfo = getRankInfo(record.rank);

  // ====== BATTLE VIEW ======
  if (battle.active || battle.result !== "none") {
    const rival = battle.rival!;
    const rivalRank = getRankInfo(rival.rank);
    const rivalHpPct = (battle.rivalHp / rival.maxHp) * 100;
    const playerHpPct = (battle.playerHp / player.maxHp) * 100;

    return (
      <div className="animate-fade-in space-y-4">
        {/* Battle header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">{rankInfo.icon}</span>
            <span className="font-display text-sm font-bold">{record.elo} ELO</span>
          </div>
          <span className="font-display text-xs text-muted-foreground">PVP ARENA</span>
          <div className="flex items-center gap-2">
            <span className="font-display text-sm font-bold">{rival.elo} ELO</span>
            <span className="text-xl">{rivalRank.icon}</span>
          </div>
        </div>

        {/* Battle scene */}
        <div
          className="relative rounded-xl overflow-hidden h-64 bg-cover bg-center flex items-end"
          style={{ backgroundImage: `url(${battleBg})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
          <div className="absolute inset-0 border-2 border-primary/20 rounded-xl" />

          <div className="relative z-10 w-full p-4 flex justify-between items-end">
            {/* Player */}
            <div className="text-center">
              <p className="font-display text-sm mb-1 text-health">{player.name}</p>
              <div className="text-4xl mb-1">🃏</div>
              <div className="w-28 h-2 rounded-full bg-muted overflow-hidden">
                <div className="bar-health h-full rounded-full transition-all duration-300" style={{ width: `${playerHpPct}%` }} />
              </div>
              <p className="text-xs font-mono text-health mt-0.5">{battle.playerHp}/{player.maxHp}</p>
              {battle.damageNumbers.filter(d => d.target === "player").map(d => (
                <span key={d.id} className={`absolute damage-float font-mono font-bold text-lg ${d.type === "heal" ? "text-health" : "text-primary"}`}>
                  {d.type === "heal" ? `+${d.value}` : `-${d.value}`}
                </span>
              ))}
            </div>

            <div className="text-primary font-display text-xl neon-text-red">VS</div>

            {/* Rival */}
            <div className="text-center relative">
              <p className="font-display text-sm mb-1 text-primary">{rival.name}</p>
              <div className={`text-4xl mb-1 ${battle.damageNumbers.some(d => d.target === "rival") ? "shake" : ""}`}>
                {rival.emoji}
              </div>
              <div className="w-28 h-2 rounded-full bg-muted overflow-hidden">
                <div className="bar-enemy-hp h-full rounded-full transition-all duration-300" style={{ width: `${rivalHpPct}%` }} />
              </div>
              <p className="text-xs font-mono text-primary mt-0.5">{battle.rivalHp}/{rival.maxHp}</p>
              <span className="text-[10px] font-bold">{rivalRank.icon} {rival.rank.toUpperCase()}</span>
              {battle.damageNumbers.filter(d => d.target === "rival").map(d => (
                <span key={d.id} className={`absolute -top-4 left-1/2 -translate-x-1/2 font-mono font-bold ${d.type === "crit" ? "text-secondary text-xl crit-glow" : "text-primary text-lg"} damage-float`}>
                  -{d.value}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Result overlay */}
        {battle.result !== "none" && (
          <div className={`card-game p-6 text-center ${battle.result === "win" ? "glow-border-gold" : "glow-border-red"}`}>
            <p className="font-display text-2xl font-bold mb-2">
              {battle.result === "win" ? "🏆 VICTORY!" : "💀 DEFEAT"}
            </p>
            <p className={`font-mono text-sm ${battle.eloChange >= 0 ? "text-health" : "text-primary"}`}>
              {battle.eloChange >= 0 ? "+" : ""}{battle.eloChange} ELO
            </p>
            {battle.result === "win" && battle.betAmount > 0 && (
              <p className="text-secondary font-mono text-sm mt-1">+{battle.betAmount * 2} Gold won! 🪙</p>
            )}
            {battle.result === "loss" && battle.betAmount > 0 && (
              <p className="text-muted-foreground font-mono text-sm mt-1">-{battle.betAmount} Gold lost</p>
            )}
            <button onClick={leavePvpArena} className="btn-attack mt-4 px-6 py-2 rounded-lg text-sm">
              Back to Arena
            </button>
          </div>
        )}

        {/* Skills */}
        {battle.result === "none" && (
          <div className="grid grid-cols-4 gap-2">
            {SKILLS.map(skill => {
              const btnClass = skill.type === "attack" ? "btn-attack" : skill.type === "heal" ? "btn-heal" : "btn-special";
              return (
                <button
                  key={skill.id}
                  onClick={() => pvpAttack(skill.type === "attack" ? (skill.id === "basic" ? "basic" : "special") : skill.type)}
                  disabled={!battle.playerTurn || battle.playerHp <= 0}
                  className={`${btnClass} py-3 px-2 rounded-lg text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105`}
                >
                  <span className="text-xl block">{skill.icon}</span>
                  <span className="text-xs block mt-1">{skill.name}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Combat log */}
        <div className="card-game p-3 max-h-32 overflow-y-auto">
          <h4 className="font-display text-xs text-muted-foreground mb-1">Combat Log</h4>
          {battle.combatLog.slice(-6).map((msg, i) => (
            <p key={i} className={`text-xs font-mono py-0.5 ${msg.includes("CRIT") ? "text-secondary font-bold" : msg.includes("defeated") || msg.includes("VICTORY") ? "text-health font-bold" : msg.includes("defeated by") ? "text-primary font-bold" : "text-muted-foreground"}`}>
              {msg}
            </p>
          ))}
        </div>
      </div>
    );
  }

  // ====== LOBBY VIEW ======
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Arena header */}
      <div className="card-game p-6 text-center glow-border-red">
        <h2 className="font-display text-2xl font-bold neon-text-red mb-2">⚔️ PVP Arena</h2>
        <p className="text-muted-foreground text-sm">Fight shadow versions of real players</p>
      </div>

      {/* Player rank card */}
      <div className="card-game p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{rankInfo.icon}</span>
            <div>
              <p className={`font-display text-sm font-bold ${rankInfo.color}`}>{record.rank.toUpperCase().replace("-", " ")}</p>
              <p className="font-mono text-xs text-muted-foreground">{record.elo} ELO</p>
            </div>
          </div>
          <div className="text-right text-xs font-mono">
            <p className="text-health">W: {record.wins}</p>
            <p className="text-primary">L: {record.losses}</p>
            <p className="text-secondary">🔥 Streak: {record.winStreak}</p>
          </div>
        </div>
        {/* ELO progress bar to next rank */}
        {(() => {
          const currentRankIdx = RANK_THRESHOLDS.findIndex(r => r.rank === record.rank);
          const nextRank = RANK_THRESHOLDS[currentRankIdx + 1];
          if (!nextRank) return <p className="text-xs text-center text-secondary font-display">👑 Maximum Rank Achieved</p>;
          const currentMin = RANK_THRESHOLDS[currentRankIdx].minElo;
          const pct = ((record.elo - currentMin) / (nextRank.minElo - currentMin)) * 100;
          return (
            <div>
              <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                <span>{RANK_THRESHOLDS[currentRankIdx].icon} {currentMin}</span>
                <span>{nextRank.icon} {nextRank.minElo}</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div className="bar-xp h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(100, pct)}%` }} />
              </div>
            </div>
          );
        })()}
      </div>

      {/* Matchmaking */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display text-lg font-bold">Find Opponent</h3>
          <button onClick={refreshMatchmaking} className="btn-attack px-3 py-1.5 rounded-lg text-xs">
            🔄 Refresh
          </button>
        </div>

        {matchmaking.length === 0 ? (
          <div className="card-game p-8 text-center">
            <p className="text-muted-foreground text-sm">Press Refresh to find opponents</p>
          </div>
        ) : (
          <div className="space-y-2">
            {matchmaking.map(rival => {
              const ri = getRankInfo(rival.rank);
              const isSelected = selectedRival === rival.id;
              return (
                <button
                  key={rival.id}
                  onClick={() => setSelectedRival(isSelected ? null : rival.id)}
                  className={`card-game w-full p-3 text-left transition-all ${isSelected ? "glow-border-red" : "hover:glow-border-red"}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{rival.emoji}</span>
                      <div>
                        <p className="font-display text-sm font-semibold">{rival.name}</p>
                        <p className="text-xs text-muted-foreground">Lv.{rival.level} · {ri.icon} {rival.rank.toUpperCase().replace("-", " ")} · {rival.elo} ELO</p>
                      </div>
                    </div>
                    <div className="text-right text-xs font-mono">
                      <p>⚔️ {rival.attack} 🛡️ {rival.defense}</p>
                      <p className="text-muted-foreground">{rival.wins}W/{rival.losses}L</p>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="mt-3 pt-3 border-t border-border">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                        <span>Items: {rival.equippedItems.join(", ")}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">Bet:</span>
                          {[0, 50, 100, 250].map(amt => (
                            <button
                              key={amt}
                              onClick={(e) => { e.stopPropagation(); setBetAmount(amt); }}
                              className={`px-2 py-1 rounded text-xs font-mono transition-all ${betAmount === amt ? "bg-secondary text-secondary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
                            >
                              {amt === 0 ? "Free" : `${amt}🪙`}
                            </button>
                          ))}
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); startPvpBattle(rival.id, betAmount); }}
                          disabled={betAmount > player.gold}
                          className="btn-attack px-4 py-1.5 rounded-lg text-xs ml-auto disabled:opacity-40"
                        >
                          ⚔️ Fight!
                        </button>
                      </div>
                      {betAmount > player.gold && (
                        <p className="text-xs text-primary mt-1">Not enough gold!</p>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
