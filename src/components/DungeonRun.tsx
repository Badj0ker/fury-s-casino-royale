import { useGame } from "@/contexts/GameContext";
import { useNavigate, useParams } from "react-router-dom";
import { DUNGEONS } from "@/lib/mapData";
import { SKILLS } from "@/lib/gameData";
import { useEffect, useState } from "react";

export default function DungeonRun() {
  const { dungeonId } = useParams<{ dungeonId: string }>();
  const { player, dungeon, startDungeon, dungeonAttack, dungeonNextRoom, leaveDungeon } = useGame();
  const navigate = useNavigate();
  const [introStep, setIntroStep] = useState(0);

  const dgData = DUNGEONS.find(d => d.id === dungeonId);

  useEffect(() => {
    if (dungeonId && !dungeon.active && !dungeon.completed && !dungeon.failed) {
      setIntroStep(1);
      setTimeout(() => setIntroStep(2), 800);
      setTimeout(() => setIntroStep(3), 1600);
      setTimeout(() => {
        setIntroStep(0);
        startDungeon(dungeonId);
      }, 2400);
    }
  }, [dungeonId]);

  if (!dgData) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Dungeon not found</p>
        <button onClick={() => navigate("/world-map")} className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg">Back to Map</button>
      </div>
    );
  }

  // Cinematic intro
  if (introStep > 0) {
    return (
      <div className="fixed inset-0 bg-background z-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          {introStep >= 1 && <p className="text-muted-foreground animate-fade-in text-sm">Entering dungeon...</p>}
          {introStep >= 2 && <h1 className="font-display text-4xl font-bold neon-text-red animate-fade-in">{dgData.icon} {dgData.name}</h1>}
          {introStep >= 3 && <p className="text-secondary animate-fade-in text-lg">5 Rooms • Survive or Die</p>}
        </div>
      </div>
    );
  }

  // Completed
  if (dungeon.completed) {
    const gotItem = Math.random() * 100 < dgData.itemDropChance;
    return (
      <div className="animate-fade-in text-center py-12">
        <h1 className="font-display text-4xl font-bold neon-text-red mb-4">🎉 Dungeon Cleared!</h1>
        <p className="text-xl text-secondary mb-2">{dgData.name}</p>
        <div className="card-game p-6 max-w-md mx-auto mt-6 space-y-3">
          <h3 className="font-display font-bold text-lg">Rewards</h3>
          <p className="text-secondary text-lg">🪙 {dungeon.goldEarned} Gold</p>
          <p className="text-muted-foreground">Rooms cleared: {dungeon.roomsCleared}/5</p>
          {gotItem && (
            <div className="mt-3 p-3 rounded-lg bg-accent/20 border border-accent">
              <p className="text-accent font-bold">✨ Rare Item Drop!</p>
              <p className="text-xs text-muted-foreground">A mysterious item was found...</p>
            </div>
          )}
        </div>
        <div className="flex gap-3 justify-center mt-8">
          <button onClick={() => { leaveDungeon(); navigate("/world-map"); }} className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-bold hover:opacity-90">
            Back to Map
          </button>
          <button onClick={() => { leaveDungeon(); startDungeon(dgData.id); }} className="px-6 py-3 bg-card border border-border rounded-lg font-bold hover:border-primary/50">
            Run Again
          </button>
        </div>
      </div>
    );
  }

  // Failed
  if (dungeon.failed) {
    return (
      <div className="animate-fade-in text-center py-12">
        <h1 className="font-display text-4xl font-bold text-destructive mb-4">💀 Dungeon Failed</h1>
        <p className="text-xl text-muted-foreground mb-2">{dgData.name}</p>
        <div className="card-game p-6 max-w-md mx-auto mt-6 space-y-3">
          <p className="text-muted-foreground">Reached Room {dungeon.currentRoom + 1}/5</p>
          <p className="text-sm text-muted-foreground">XP earned is kept. Gold from dungeon reward is lost.</p>
        </div>
        <div className="flex gap-3 justify-center mt-8">
          <button onClick={() => { leaveDungeon(); navigate("/world-map"); }} className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-bold hover:opacity-90">
            Back to Map
          </button>
          <button onClick={() => { leaveDungeon(); startDungeon(dgData.id); }} className="px-6 py-3 bg-card border border-border rounded-lg font-bold hover:border-primary/50">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!dungeon.active || !dungeon.enemy) return null;

  const room = dgData.rooms[dungeon.currentRoom];
  const enemyHpPct = (dungeon.enemy.hp / dungeon.enemy.maxHp) * 100;
  const playerHpPct = (player.hp / player.maxHp) * 100;
  const isEnemyDead = dungeon.enemy.hp <= 0;

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="font-display text-2xl font-bold neon-text-red">{dgData.icon} {dgData.name}</h1>
          <p className="text-sm text-muted-foreground">Room {dungeon.currentRoom + 1}/5 {room?.isBoss ? "⚠️ BOSS" : ""}</p>
        </div>
        <button onClick={() => { leaveDungeon(); navigate("/world-map"); }} className="text-xs text-muted-foreground hover:text-foreground">
          ← Flee
        </button>
      </div>

      {/* Room progress dots */}
      <div className="flex gap-2 mb-6">
        {dgData.rooms.map((r, i) => (
          <div
            key={i}
            className={`h-2 flex-1 rounded-full transition-all ${
              i < dungeon.roomsCleared ? "bg-primary" :
              i === dungeon.currentRoom ? "bg-secondary animate-pulse" :
              "bg-muted"
            }`}
          />
        ))}
      </div>

      {/* Battle Area */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {/* Player */}
        <div className="card-game p-4 text-center">
          <p className="text-2xl mb-2">🧑‍💼</p>
          <p className="font-display text-sm font-bold">{player.name}</p>
          <p className="text-xs text-muted-foreground">Lv.{player.level}</p>
          <div className="mt-2">
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div className="bar-hp h-full rounded-full transition-all duration-500" style={{ width: `${playerHpPct}%` }} />
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">{player.hp}/{player.maxHp} HP</p>
          </div>
          {/* Player damage numbers */}
          <div className="relative h-6">
            {dungeon.damageNumbers.filter(d => d.target === "player").map(d => (
              <span key={d.id} className={`absolute left-1/2 -translate-x-1/2 font-bold text-sm animate-bounce ${d.type === "heal" ? "text-health" : "text-destructive"}`}>
                {d.type === "heal" ? "+" : "-"}{d.value}
              </span>
            ))}
          </div>
        </div>

        {/* Combat Log */}
        <div className="card-game p-3 max-h-52 overflow-y-auto">
          <h3 className="font-display text-xs font-bold mb-2 text-muted-foreground">Combat Log</h3>
          <div className="space-y-1">
            {dungeon.combatLog.slice(-8).map((msg, i) => (
              <p key={i} className={`text-[11px] ${msg.includes("CRITICAL") ? "text-secondary font-bold" : msg.includes("defeated") ? "text-health" : "text-muted-foreground"}`}>
                {msg}
              </p>
            ))}
          </div>
        </div>

        {/* Enemy */}
        <div className={`card-game p-4 text-center ${isEnemyDead ? "opacity-30" : ""} ${room?.isBoss ? "glow-border-red" : ""}`}>
          <p className="text-3xl mb-2">{dungeon.enemy.emoji}</p>
          <p className="font-display text-sm font-bold">{dungeon.enemy.name}</p>
          <p className="text-xs text-muted-foreground capitalize">{dungeon.enemy.role}</p>
          <div className="mt-2">
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-500 ${room?.isBoss ? "bg-destructive" : "bar-hp"}`} style={{ width: `${enemyHpPct}%` }} />
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">{dungeon.enemy.hp}/{dungeon.enemy.maxHp} HP</p>
          </div>
          {/* Enemy damage numbers */}
          <div className="relative h-6">
            {dungeon.damageNumbers.filter(d => d.target === "enemy").map(d => (
              <span key={d.id} className={`absolute left-1/2 -translate-x-1/2 font-bold text-sm animate-bounce ${d.type === "crit" ? "text-secondary text-lg" : "text-destructive"}`}>
                -{d.value}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Skills / Next Room */}
      {isEnemyDead ? (
        <div className="text-center">
          <p className="text-health font-bold mb-3">✅ Enemy defeated!</p>
          <button
            onClick={dungeonNextRoom}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-display font-bold hover:opacity-90 transition-all"
          >
            {dungeon.currentRoom + 1 >= dgData.rooms.length ? "🎁 Claim Rewards" : `➡️ Next Room (${dungeon.currentRoom + 2}/5)`}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-2">
          {SKILLS.map(skill => (
            <button
              key={skill.id}
              onClick={() => dungeonAttack(skill.type === "attack" ? "basic" : skill.type === "heal" ? "heal" : "special")}
              disabled={!dungeon.playerTurn}
              className={`card-game p-3 text-center transition-all ${
                dungeon.playerTurn ? "hover:glow-border-gold cursor-pointer" : "opacity-50 cursor-not-allowed"
              }`}
            >
              <span className="text-xl">{skill.icon}</span>
              <p className="text-[10px] font-bold mt-1">{skill.name}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
