import { useGame } from "@/contexts/GameContext";
import { SKILLS } from "@/lib/gameData";
import furyMascot from "@/assets/fury-mascot.png";

export default function CharacterSheet() {
  const { player } = useGame();

  const stats = [
    { label: "Attack", value: player.attack, icon: "⚔️", color: "text-primary" },
    { label: "Defense", value: player.defense, icon: "🛡️", color: "text-mana" },
    { label: "Crit %", value: player.critChance, icon: "💥", color: "text-secondary" },
    { label: "Gold", value: player.gold, icon: "🪙", color: "text-secondary" },
    { label: "BFG", value: player.bfg, icon: "💎", color: "text-accent" },
  ];

  return (
    <div className="card-game p-6 animate-fade-in-up" style={{ animationDelay: "0.1s", animationFillMode: "both" }}>
      <div className="flex items-center gap-4 mb-6">
        <div className="relative">
          <img src={furyMascot} alt="Avatar" className="w-16 h-16 rounded-xl ring-2 ring-primary" />
          <span className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground text-xs font-bold px-1.5 py-0.5 rounded-full font-mono">
            {player.level}
          </span>
        </div>
        <div className="flex-1">
          <h2 className="font-display text-lg font-bold">{player.name}</h2>
          <p className="text-sm text-muted-foreground mb-2">Casino Raider</p>
          {/* HP Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-health">HP</span>
              <span className="font-mono text-health">{player.hp}/{player.maxHp}</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div className="bar-health h-full rounded-full transition-all duration-500" style={{ width: `${(player.hp / player.maxHp) * 100}%` }} />
            </div>
          </div>
          {/* XP Bar */}
          <div className="space-y-1 mt-1">
            <div className="flex justify-between text-xs">
              <span className="text-xp">XP</span>
              <span className="font-mono text-xp">{player.xp}/{player.xpToNext}</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div className="bar-xp h-full rounded-full transition-all duration-700" style={{ width: `${(player.xp / player.xpToNext) * 100}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-5 gap-2 mb-5">
        {stats.map(s => (
          <div key={s.label} className="text-center p-2 rounded-lg bg-muted/50">
            <span className="text-lg">{s.icon}</span>
            <p className={`font-mono font-bold text-sm ${s.color}`}>{s.value}</p>
            <p className="text-[10px] text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Skills */}
      <h3 className="font-display text-sm font-semibold mb-2 text-muted-foreground">Skills</h3>
      <div className="grid grid-cols-2 gap-2">
        {SKILLS.map(skill => (
          <div key={skill.id} className="flex items-center gap-2 p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
            <span className="text-xl">{skill.icon}</span>
            <div>
              <p className="text-xs font-semibold">{skill.name}</p>
              <p className="text-[10px] text-muted-foreground">{skill.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
