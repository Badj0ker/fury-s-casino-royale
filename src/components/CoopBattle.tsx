import { useCoop } from "@/contexts/CoopContext";
import { useNavigate, useParams } from "react-router-dom";
import { COOP_DUNGEONS } from "@/lib/coopData";
import { SKILLS } from "@/lib/gameData";
import { useEffect, useState } from "react";

export default function CoopBattle() {
  const { dungeonId } = useParams<{ dungeonId: string }>();
  const { coop, startCoop, coopAttack, coopSelectTarget, coopNextRoom, leaveCoop } = useCoop();
  const navigate = useNavigate();
  const [introStep, setIntroStep] = useState(0);

  const dgData = COOP_DUNGEONS.find(d => d.id === dungeonId);

  useEffect(() => {
    if (dungeonId && !coop.active && !coop.completed && !coop.failed) {
      setIntroStep(1);
      setTimeout(() => setIntroStep(2), 800);
      setTimeout(() => setIntroStep(3), 1600);
      setTimeout(() => { setIntroStep(0); startCoop(dungeonId); }, 2400);
    }
  }, [dungeonId]);

  if (!dgData) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Co-op dungeon not found</p>
        <button onClick={() => navigate("/coop-dungeons")} className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg">Back</button>
      </div>
    );
  }

  // Intro
  if (introStep > 0) {
    return (
      <div className="fixed inset-0 bg-background z-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          {introStep >= 1 && <p className="text-muted-foreground animate-fade-in text-sm">Assembling party...</p>}
          {introStep >= 2 && <h1 className="font-display text-4xl font-bold neon-text-red animate-fade-in">{dgData.icon} {dgData.name}</h1>}
          {introStep >= 3 && <p className="text-secondary animate-fade-in text-lg">{dgData.rooms.length} Rooms • Co-op Mode</p>}
        </div>
      </div>
    );
  }

  // Completed
  if (coop.completed) {
    return (
      <div className="animate-fade-in text-center py-12">
        <h1 className="font-display text-4xl font-bold neon-text-red mb-4">🎉 Co-op Cleared!</h1>
        <p className="text-xl text-secondary mb-2">{dgData.name}</p>
        <div className="card-game p-6 max-w-md mx-auto mt-6 space-y-3">
          <p className="text-secondary text-lg">🪙 {coop.goldEarned} Gold</p>
          <p className="text-muted-foreground">Rooms: {coop.roomsCleared}/{dgData.rooms.length}</p>
        </div>
        <div className="flex gap-3 justify-center mt-8">
          <button onClick={() => { leaveCoop(); navigate("/coop-dungeons"); }} className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-bold">Back</button>
          <button onClick={() => { leaveCoop(); startCoop(dgData.id); }} className="px-6 py-3 bg-card border border-border rounded-lg font-bold hover:border-primary/50">Again</button>
        </div>
      </div>
    );
  }

  // Failed
  if (coop.failed) {
    return (
      <div className="animate-fade-in text-center py-12">
        <h1 className="font-display text-4xl font-bold text-destructive mb-4">💀 Party Wiped</h1>
        <p className="text-muted-foreground mb-6">Reached Room {coop.currentRoom + 1}/{dgData.rooms.length}</p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => { leaveCoop(); navigate("/coop-dungeons"); }} className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-bold">Back</button>
          <button onClick={() => { leaveCoop(); startCoop(dgData.id); }} className="px-6 py-3 bg-card border border-border rounded-lg font-bold hover:border-primary/50">Retry</button>
        </div>
      </div>
    );
  }

  if (!coop.active) return null;

  const room = dgData.rooms[coop.currentRoom];
  const allEnemiesDead = coop.enemies.every(e => e.hp <= 0);
  const currentTurnMember = coop.party[coop.currentTurnIndex];
  const isPlayerTurn = currentTurnMember?.isPlayer && currentTurnMember?.hp > 0;
  const aliveEnemies = coop.enemies.filter(e => e.hp > 0);

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h1 className="font-display text-xl font-bold neon-text-red">{dgData.icon} {dgData.name}</h1>
          <p className="text-xs text-muted-foreground">Room {coop.currentRoom + 1}/{dgData.rooms.length} — {room?.name} {room?.isBoss ? "⚠️ BOSS" : ""}</p>
        </div>
        <button onClick={() => { leaveCoop(); navigate("/coop-dungeons"); }} className="text-xs text-muted-foreground hover:text-foreground">← Flee</button>
      </div>

      {/* Room progress */}
      <div className="flex gap-1 mb-4">
        {dgData.rooms.map((_, i) => (
          <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${
            i < coop.roomsCleared ? "bg-primary" : i === coop.currentRoom ? "bg-secondary animate-pulse" : "bg-muted"
          }`} />
        ))}
      </div>

      {/* ===== TOP-DOWN BATTLE ARENA ===== */}
      <div className="card-game p-4 mb-4">
        {/* Enemies (top rows) */}
        <div className="mb-6">
          <p className="text-[10px] text-muted-foreground mb-2 uppercase tracking-wider">Enemies</p>
          <div className="grid grid-cols-4 gap-2">
            {coop.enemies.map((enemy, idx) => {
              const isDead = enemy.hp <= 0;
              const aliveIdx = aliveEnemies.indexOf(enemy);
              const isSelected = aliveIdx === coop.selectedTarget && !isDead;
              return (
                <button
                  key={enemy.id}
                  onClick={() => !isDead && coopSelectTarget(aliveIdx)}
                  disabled={isDead || !isPlayerTurn}
                  className={`relative p-2 rounded-lg border text-center transition-all ${
                    isDead ? "opacity-20 border-border" :
                    isSelected ? "border-secondary glow-border-gold bg-secondary/10" :
                    "border-border hover:border-muted-foreground"
                  } ${enemy.role === "boss" ? "col-span-2" : ""}`}
                >
                  <span className={`text-2xl ${enemy.role === "boss" ? "text-3xl" : ""}`}>{enemy.emoji}</span>
                  <p className="text-[9px] font-bold truncate mt-1">{enemy.name}</p>
                  {!isDead && (
                    <div className="mt-1">
                      <div className="h-1 rounded-full bg-muted overflow-hidden">
                        <div className={`h-full rounded-full transition-all ${enemy.role === "boss" ? "bg-destructive" : "bar-hp"}`}
                          style={{ width: `${(enemy.hp / enemy.maxHp) * 100}%` }} />
                      </div>
                      <p className="text-[8px] text-muted-foreground">{enemy.hp}/{enemy.maxHp}</p>
                    </div>
                  )}
                  {isDead && <p className="text-[9px] text-destructive">💀</p>}
                  {/* Damage numbers */}
                  {coop.damageNumbers.filter(d => d.targetId === enemy.id).map(d => (
                    <span key={d.id} className={`absolute top-0 left-1/2 -translate-x-1/2 font-bold text-xs animate-bounce ${d.type === "crit" ? "text-secondary" : "text-destructive"}`}>
                      -{d.value}
                    </span>
                  ))}
                </button>
              );
            })}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-dashed border-border my-3 relative">
          <span className="absolute left-1/2 -translate-x-1/2 -top-2.5 bg-card px-2 text-[9px] text-muted-foreground uppercase">vs</span>
        </div>

        {/* Party (bottom) */}
        <div>
          <p className="text-[10px] text-muted-foreground mb-2 uppercase tracking-wider">Your Party</p>
          <div className="grid grid-cols-4 gap-2">
            {coop.party.map((member, idx) => {
              const isDead = member.hp <= 0;
              const isTurn = idx === coop.currentTurnIndex && !allEnemiesDead;
              return (
                <div
                  key={member.id}
                  className={`relative p-2 rounded-lg border text-center transition-all ${
                    isDead ? "opacity-30 border-border" :
                    isTurn ? "border-primary glow-border-red bg-primary/10" :
                    "border-border"
                  }`}
                >
                  <span className="text-2xl">{member.emoji}</span>
                  <p className="text-[9px] font-bold truncate mt-1">{member.name}</p>
                  {member.isPlayer && <p className="text-[8px] text-primary">YOU</p>}
                  <div className="mt-1">
                    <div className="h-1 rounded-full bg-muted overflow-hidden">
                      <div className="bar-hp h-full rounded-full transition-all" style={{ width: `${(member.hp / member.maxHp) * 100}%` }} />
                    </div>
                    <p className="text-[8px] text-muted-foreground">{member.hp}/{member.maxHp}</p>
                  </div>
                  {isDead && <p className="text-[9px] text-destructive">💀</p>}
                  {isTurn && !isDead && <p className="text-[8px] text-primary animate-pulse font-bold">⬆ TURN</p>}
                  {/* Damage numbers */}
                  {coop.damageNumbers.filter(d => d.targetId === member.id).map(d => (
                    <span key={d.id} className={`absolute top-0 left-1/2 -translate-x-1/2 font-bold text-xs animate-bounce ${d.type === "heal" ? "text-health" : "text-destructive"}`}>
                      {d.type === "heal" ? "+" : "-"}{d.value}
                    </span>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Combat Log */}
      <div className="card-game p-3 mb-4 max-h-28 overflow-y-auto">
        <h3 className="text-[10px] font-bold text-muted-foreground mb-1">Combat Log</h3>
        {coop.combatLog.slice(-6).map((msg, i) => (
          <p key={i} className={`text-[10px] ${msg.includes("CRIT") ? "text-secondary font-bold" : msg.includes("cleared") || msg.includes("🎉") ? "text-health" : "text-muted-foreground"}`}>{msg}</p>
        ))}
      </div>

      {/* Actions */}
      {allEnemiesDead ? (
        <div className="text-center">
          <p className="text-health font-bold mb-3">✅ Room cleared!</p>
          <button onClick={coopNextRoom}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-display font-bold hover:opacity-90">
            {coop.currentRoom + 1 >= dgData.rooms.length ? "🎁 Claim Rewards" : `➡️ Next Room (${coop.currentRoom + 2}/${dgData.rooms.length})`}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-2">
          {SKILLS.map(skill => (
            <button key={skill.id}
              onClick={() => coopAttack(skill.type === "attack" ? "basic" : skill.type === "heal" ? "heal" : "special")}
              disabled={!isPlayerTurn}
              className={`card-game p-3 text-center transition-all ${isPlayerTurn ? "hover:glow-border-gold cursor-pointer" : "opacity-50 cursor-not-allowed"}`}>
              <span className="text-xl">{skill.icon}</span>
              <p className="text-[10px] font-bold mt-1">{skill.name}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
