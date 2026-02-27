import { useGame } from "@/contexts/GameContext";
import { SKILLS } from "@/lib/gameData";
import battleBg from "@/assets/battle-bg-casino.png";

export default function BattleArena() {
  const { player, battle, playerAttack, zones, startBattle } = useGame();

  if (!battle.active) {
    const unlockedZones = zones.filter(z => z.unlocked);
    return (
      <div className="card-game p-8 text-center animate-fade-in">
        <h2 className="font-display text-2xl font-bold mb-4">Choose Your Arena</h2>
        <p className="text-muted-foreground mb-6">Select a zone to start a random encounter</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto">
          {unlockedZones.map(zone => (
            <button
              key={zone.id}
              onClick={() => startBattle(zone.id)}
              className="card-game p-4 hover:glow-border-red transition-all text-left group"
            >
              <span className="text-2xl">{zone.icon}</span>
              <p className="font-display text-sm font-semibold mt-1">{zone.name}</p>
              <p className="text-xs text-muted-foreground">Lv. {zone.requiredLevel}+</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const enemy = battle.enemy!;
  const enemyHpPct = (enemy.hp / enemy.maxHp) * 100;
  const playerHpPct = (player.hp / player.maxHp) * 100;

  return (
    <div className="animate-fade-in">
      {/* Battle Scene */}
      <div
        className="relative rounded-xl overflow-hidden mb-4 h-64 bg-cover bg-center flex items-end"
        style={{ backgroundImage: `url(${battleBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />

        {/* Enemy display */}
        <div className="relative z-10 w-full p-4 flex justify-between items-end">
          <div className="text-center">
            <p className="font-display text-sm mb-1 text-health">You</p>
            <div className="text-4xl mb-1">🃏</div>
            <div className="w-28 h-2 rounded-full bg-muted overflow-hidden">
              <div className="bar-health h-full rounded-full transition-all duration-300" style={{ width: `${playerHpPct}%` }} />
            </div>
            <p className="text-xs font-mono text-health mt-0.5">{player.hp}/{player.maxHp}</p>
            {/* Player damage numbers */}
            {battle.damageNumbers.filter(d => d.target === "player").map(d => (
              <span key={d.id} className={`absolute damage-float font-mono font-bold text-lg ${d.type === "heal" ? "text-health" : "text-primary"}`}>
                {d.type === "heal" ? `+${d.value}` : `-${d.value}`}
              </span>
            ))}
          </div>

          <div className="text-muted-foreground font-display text-xl">VS</div>

          <div className="text-center relative">
            <p className="font-display text-sm mb-1 text-primary">{enemy.name}</p>
            <div className={`text-4xl mb-1 ${battle.damageNumbers.some(d => d.target === "enemy") ? "shake" : ""}`}>
              {enemy.emoji}
            </div>
            <div className="w-28 h-2 rounded-full bg-muted overflow-hidden">
              <div className="bar-enemy-hp h-full rounded-full transition-all duration-300" style={{ width: `${enemyHpPct}%` }} />
            </div>
            <p className="text-xs font-mono text-primary mt-0.5">{enemy.hp}/{enemy.maxHp}</p>
            {enemy.role === "boss" && <span className="text-[10px] text-secondary font-bold">👑 BOSS</span>}
            {/* Enemy damage numbers */}
            {battle.damageNumbers.filter(d => d.target === "enemy").map(d => (
              <span key={d.id} className={`absolute -top-4 left-1/2 -translate-x-1/2 font-mono font-bold ${d.type === "crit" ? "text-secondary text-xl crit-glow" : "text-primary text-lg"} damage-float`}>
                -{d.value}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Skill Buttons */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {SKILLS.map(skill => {
          const btnClass = skill.type === "attack" ? "btn-attack" : skill.type === "heal" ? "btn-heal" : "btn-special";
          return (
            <button
              key={skill.id}
              onClick={() => playerAttack(skill.type === "attack" ? (skill.id === "basic" ? "basic" : "special") : skill.type)}
              disabled={!battle.playerTurn || player.hp <= 0}
              className={`${btnClass} py-3 px-2 rounded-lg text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105`}
            >
              <span className="text-xl block">{skill.icon}</span>
              <span className="text-xs block mt-1">{skill.name}</span>
            </button>
          );
        })}
      </div>

      {/* Combat Log */}
      <div className="card-game p-3 max-h-32 overflow-y-auto">
        <h4 className="font-display text-xs text-muted-foreground mb-1">Combat Log</h4>
        {battle.combatLog.slice(-5).map((msg, i) => (
          <p key={i} className={`text-xs font-mono py-0.5 ${msg.includes("CRITICAL") ? "text-secondary font-bold" : msg.includes("defeated") ? "text-health font-bold" : "text-muted-foreground"}`}>
            {msg}
          </p>
        ))}
      </div>
    </div>
  );
}
