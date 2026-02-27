import { useState, useEffect, useCallback } from "react";
import { useGame } from "@/contexts/GameContext";
import furyMascot from "@/assets/fury-mascot.png";

interface BossPhase {
  name: string;
  threshold: number; // percentage of HP
  color: string;
  ability: string;
  emoji: string;
}

const BOSS_PHASES: BossPhase[] = [
  { name: "Phase 1 — The Deal", threshold: 100, color: "hsl(var(--primary))", ability: "Card Storm", emoji: "🃏" },
  { name: "Phase 2 — Double Down", threshold: 60, color: "hsl(var(--accent))", ability: "House Edge", emoji: "🎰" },
  { name: "Phase 3 — FURY MODE", threshold: 30, color: "hsl(var(--secondary))", ability: "All In Rage", emoji: "🔥" },
];

const FAKE_LEADERBOARD = [
  { name: "AceHigh77", damage: 12450 },
  { name: "LuckyStrike", damage: 9830 },
  { name: "CardCounter", damage: 8210 },
  { name: "BluffKing", damage: 7600 },
  { name: "JackpotJoe", damage: 5990 },
];

const BOSS_MAX_HP = 250000;
const WEEKLY_RESET_HOURS = 47; // fake hours remaining

export default function BossEvent() {
  const { player } = useGame();

  const [showIntro, setShowIntro] = useState(true);
  const [introStep, setIntroStep] = useState(0);
  const [bossHp, setBossHp] = useState(BOSS_MAX_HP * 0.72);
  const [communityDamage, setCommunityDamage] = useState(BOSS_MAX_HP * 0.28);
  const [playerDamage, setPlayerDamage] = useState(1340);
  const [isAttacking, setIsAttacking] = useState(false);
  const [damageFloats, setDamageFloats] = useState<{ id: number; value: number }[]>([]);
  const [shaking, setShaking] = useState(false);

  const bossHpPct = (bossHp / BOSS_MAX_HP) * 100;
  const currentPhase = BOSS_PHASES.slice().reverse().find(p => bossHpPct <= p.threshold) || BOSS_PHASES[0];

  // Cinematic intro sequence
  useEffect(() => {
    if (!showIntro) return;
    const timers = [
      setTimeout(() => setIntroStep(1), 600),
      setTimeout(() => setIntroStep(2), 1800),
      setTimeout(() => setIntroStep(3), 3200),
      setTimeout(() => setIntroStep(4), 4500),
    ];
    return () => timers.forEach(clearTimeout);
  }, [showIntro]);

  const dismissIntro = useCallback(() => {
    setShowIntro(false);
  }, []);

  const attackBoss = useCallback(() => {
    if (isAttacking) return;
    setIsAttacking(true);
    setShaking(true);

    const baseDmg = player.attack * 3 + Math.floor(Math.random() * 20);
    const isCrit = Math.random() * 100 < player.critChance;
    const dmg = Math.floor(baseDmg * (isCrit ? 2 : 1));

    const floatId = Date.now();
    setDamageFloats(prev => [...prev, { id: floatId, value: dmg }]);

    setBossHp(prev => Math.max(0, prev - dmg));
    setCommunityDamage(prev => prev + dmg);
    setPlayerDamage(prev => prev + dmg);

    setTimeout(() => setShaking(false), 400);
    setTimeout(() => {
      setDamageFloats(prev => prev.filter(d => d.id !== floatId));
    }, 1200);
    setTimeout(() => setIsAttacking(false), 1000);
  }, [isAttacking, player.attack, player.critChance]);

  // ======= CINEMATIC INTRO =======
  if (showIntro) {
    return (
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 cursor-pointer"
        onClick={introStep >= 3 ? dismissIntro : undefined}
      >
        {/* Ambient glow */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-20"
            style={{
              background: "radial-gradient(circle, hsl(0 100% 50% / 0.4), transparent 70%)",
              animation: "pulse-glow 3s ease-in-out infinite",
            }}
          />
        </div>

        <div className="relative text-center space-y-6">
          {/* Step 1: Screen darkens, title */}
          {introStep >= 1 && (
            <div className="animate-fade-in">
              <p className="text-xs tracking-[0.4em] uppercase text-muted-foreground font-display mb-2">
                Weekly Boss Raid
              </p>
              <div className="w-24 h-px mx-auto bg-gradient-to-r from-transparent via-primary to-transparent" />
            </div>
          )}

          {/* Step 2: Boss avatar */}
          {introStep >= 2 && (
            <div className="animate-scale-in">
              <div className="relative w-32 h-32 mx-auto">
                <img
                  src={furyMascot}
                  alt="FURY"
                  className="w-full h-full rounded-full object-cover ring-4 ring-primary"
                  style={{ boxShadow: "0 0 40px hsl(0 100% 50% / 0.5), 0 0 80px hsl(0 100% 50% / 0.2)" }}
                />
                <div className="absolute -top-2 -right-2 text-3xl animate-bounce">👑</div>
              </div>
            </div>
          )}

          {/* Step 3: Name reveal */}
          {introStep >= 3 && (
            <div className="animate-fade-in space-y-2">
              <h1 className="font-display text-5xl font-black text-primary neon-text-red tracking-wider">
                FURY
              </h1>
              <p className="font-display text-lg text-secondary neon-text-gold">
                The House Always Wins
              </p>
            </div>
          )}

          {/* Step 4: Call to action */}
          {introStep >= 4 && (
            <div className="animate-fade-in mt-8">
              <p className="text-sm text-muted-foreground animate-pulse">
                Click anywhere to enter the raid
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ======= BOSS RAID UI =======
  const hours = WEEKLY_RESET_HOURS;
  const mins = 24;

  return (
    <div className="animate-fade-in space-y-4">
      {/* Header with timer */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-primary neon-text-red">
            👑 Weekly Boss Raid
          </h2>
          <p className="text-xs text-muted-foreground">Community event — deal damage together!</p>
        </div>
        <div className="card-game px-4 py-2 text-center">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Resets in</p>
          <p className="font-mono font-bold text-secondary text-lg neon-text-gold">
            {hours}h {mins}m
          </p>
        </div>
      </div>

      {/* Boss Panel */}
      <div className="card-game overflow-hidden relative">
        {/* Phase indicator banner */}
        <div
          className="px-4 py-2 flex items-center justify-between text-sm font-display"
          style={{ background: `linear-gradient(90deg, ${currentPhase.color}33, transparent)` }}
        >
          <span className="flex items-center gap-2">
            <span className="text-lg">{currentPhase.emoji}</span>
            <span className="font-bold">{currentPhase.name}</span>
          </span>
          <span className="text-xs text-muted-foreground">
            Ability: <span className="text-foreground font-semibold">{currentPhase.ability}</span>
          </span>
        </div>

        {/* Boss visual */}
        <div className="relative p-6 flex flex-col items-center">
          {/* Background glow */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              background: `radial-gradient(circle at 50% 60%, ${currentPhase.color}, transparent 70%)`,
            }}
          />

          {/* Damage floats */}
          {damageFloats.map(d => (
            <span
              key={d.id}
              className="absolute top-8 left-1/2 -translate-x-1/2 text-primary font-mono font-black text-2xl damage-float z-20"
            >
              -{d.value}
            </span>
          ))}

          {/* Boss avatar */}
          <div className={`relative z-10 ${shaking ? "shake" : ""}`}>
            <div className="w-28 h-28 relative">
              <img
                src={furyMascot}
                alt="FURY Boss"
                className="w-full h-full rounded-full object-cover ring-4 ring-primary/50"
                style={{ boxShadow: `0 0 30px ${currentPhase.color}55` }}
              />
              {bossHpPct <= 30 && (
                <div className="absolute inset-0 rounded-full animate-pulse"
                  style={{ boxShadow: "0 0 20px hsl(0 100% 50% / 0.4)" }}
                />
              )}
            </div>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-card border border-border rounded-full px-2 py-0.5">
              <span className="text-xs font-mono text-primary font-bold">FURY</span>
            </div>
          </div>

          {/* Phase markers */}
          <div className="flex gap-2 mt-4 mb-2">
            {BOSS_PHASES.map((phase, i) => (
              <div
                key={i}
                className={`px-2 py-0.5 rounded-full text-[10px] font-display font-bold border transition-all ${
                  currentPhase.name === phase.name
                    ? "border-primary bg-primary/20 text-foreground scale-110"
                    : bossHpPct <= phase.threshold && bossHpPct > (BOSS_PHASES[i + 1]?.threshold ?? 0)
                      ? "border-muted-foreground/30 text-muted-foreground"
                      : "border-border text-muted-foreground/40"
                }`}
              >
                {phase.emoji} {phase.name.split("—")[0].trim()}
              </div>
            ))}
          </div>
        </div>

        {/* Full-width HP Bar */}
        <div className="px-4 pb-4">
          <div className="flex justify-between text-xs mb-1">
            <span className="font-mono text-muted-foreground">
              Boss HP
            </span>
            <span className="font-mono font-bold text-primary">
              {Math.floor(bossHp).toLocaleString()} / {BOSS_MAX_HP.toLocaleString()}
            </span>
          </div>
          <div className="w-full h-5 rounded-full bg-muted overflow-hidden relative border border-border">
            {/* Phase threshold markers */}
            {BOSS_PHASES.filter(p => p.threshold < 100).map(p => (
              <div
                key={p.threshold}
                className="absolute top-0 bottom-0 w-px bg-foreground/20 z-10"
                style={{ left: `${p.threshold}%` }}
              />
            ))}
            {/* HP fill */}
            <div
              className="h-full rounded-full transition-all duration-500 relative overflow-hidden"
              style={{
                width: `${bossHpPct}%`,
                background: `linear-gradient(90deg, ${currentPhase.color}, hsl(0 70% 55%))`,
              }}
            >
              {/* Animated shine */}
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3) 50%, transparent)",
                  animation: "shine 2s ease-in-out infinite",
                }}
              />
            </div>
          </div>
          <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
            <span>0%</span>
            <span className="text-accent">30% — Rage</span>
            <span className="text-primary">60% — Phase 2</span>
            <span>100%</span>
          </div>
        </div>
      </div>

      {/* Attack button */}
      <div className="flex justify-center">
        <button
          onClick={attackBoss}
          disabled={isAttacking}
          className="btn-attack py-4 px-10 rounded-xl text-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ boxShadow: "0 0 30px hsl(0 100% 60% / 0.3)" }}
        >
          <span className="text-2xl mr-2">⚔️</span>
          Deal Damage
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="card-game p-3 text-center">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Community Damage</p>
          <p className="font-mono font-bold text-primary text-lg neon-text-red">
            {Math.floor(communityDamage).toLocaleString()}
          </p>
        </div>
        <div className="card-game p-3 text-center">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Your Damage</p>
          <p className="font-mono font-bold text-secondary text-lg neon-text-gold">
            {playerDamage.toLocaleString()}
          </p>
        </div>
        <div className="card-game p-3 text-center">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Your Rank</p>
          <p className="font-mono font-bold text-accent text-lg neon-text-purple">
            #6
          </p>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="card-game p-4">
        <h3 className="font-display text-sm font-bold mb-3 flex items-center gap-2">
          <span>🏆</span> Top Damage Leaderboard
        </h3>
        <div className="space-y-2">
          {FAKE_LEADERBOARD.map((entry, i) => (
            <div
              key={i}
              className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm ${
                i === 0
                  ? "bg-secondary/10 border border-secondary/30"
                  : i < 3
                    ? "bg-muted/50"
                    : "bg-transparent"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`font-mono font-bold text-xs w-5 ${
                  i === 0 ? "text-secondary" : i < 3 ? "text-foreground" : "text-muted-foreground"
                }`}>
                  #{i + 1}
                </span>
                <span className={i === 0 ? "font-semibold text-secondary" : ""}>{entry.name}</span>
              </div>
              <span className="font-mono text-xs text-primary">{entry.damage.toLocaleString()} dmg</span>
            </div>
          ))}
          {/* Player entry */}
          <div className="flex items-center justify-between px-3 py-2 rounded-lg text-sm border border-primary/30 bg-primary/5">
            <div className="flex items-center gap-3">
              <span className="font-mono font-bold text-xs w-5 text-primary">#6</span>
              <span className="font-semibold text-primary">{player.name} (You)</span>
            </div>
            <span className="font-mono text-xs text-primary">{playerDamage.toLocaleString()} dmg</span>
          </div>
        </div>
      </div>
    </div>
  );
}
