import CharacterSheet from "@/components/CharacterSheet";
import { useGame } from "@/contexts/GameContext";
import { useNavigate } from "react-router-dom";
import furyMascot from "@/assets/fury-mascot.png";

export default function Dashboard() {
  const { player, zones, quests } = useGame();
  const navigate = useNavigate();
  const activeQuests = quests.filter(q => !q.claimed && !q.completed).length;
  const claimable = quests.filter(q => q.completed && !q.claimed).length;

  return (
    <div className="animate-fade-in">
      {/* Hero Banner */}
      <div className="card-game p-6 mb-6 relative overflow-hidden">
        <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20">
          <img src={furyMascot} alt="" className="w-40 h-40" />
        </div>
        <div className="relative z-10">
          <h1 className="font-display text-3xl font-bold neon-text-red mb-1">Welcome back, {player.name}!</h1>
          <p className="text-muted-foreground">The casino awaits your next move.</p>
          <div className="flex gap-3 mt-4">
            <button onClick={() => navigate("/battle")} className="btn-attack px-5 py-2 rounded-lg text-sm hover:scale-105 transition-transform">
              ⚔️ Enter Battle
            </button>
            <button onClick={() => navigate("/world-map")} className="bg-muted text-foreground px-5 py-2 rounded-lg text-sm font-display font-semibold hover:bg-muted/80 transition-colors">
              🗺️ World Map
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Character Sheet */}
        <div className="lg:col-span-2">
          <CharacterSheet />
        </div>

        {/* Quick Stats */}
        <div className="space-y-4">
          {/* Quests Summary */}
          <div className="card-game p-4 animate-fade-in-up" style={{ animationDelay: "0.2s", animationFillMode: "both" }}>
            <h3 className="font-display text-sm font-bold mb-3 text-secondary neon-text-gold">📜 Quests</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Active</span>
                <span className="font-mono font-bold">{activeQuests}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Claimable</span>
                <span className="font-mono font-bold text-health">{claimable}</span>
              </div>
            </div>
            {claimable > 0 && (
              <button onClick={() => navigate("/quests")} className="w-full mt-3 bg-secondary text-secondary-foreground py-1.5 rounded-lg text-xs font-bold hover:scale-105 transition-transform font-display">
                Claim Rewards!
              </button>
            )}
          </div>

          {/* Zone Progress */}
          <div className="card-game p-4 animate-fade-in-up" style={{ animationDelay: "0.3s", animationFillMode: "both" }}>
            <h3 className="font-display text-sm font-bold mb-3 text-accent neon-text-purple">🗺️ Zones</h3>
            <div className="space-y-2">
              {zones.map(zone => (
                <div key={zone.id} className="flex items-center gap-2">
                  <span className="text-sm">{zone.icon}</span>
                  <div className="flex-1">
                    <div className="flex justify-between text-xs">
                      <span className={zone.unlocked ? "" : "text-muted-foreground"}>{zone.name}</span>
                      <span className="font-mono text-muted-foreground">{zone.progress}/{zone.maxProgress}</span>
                    </div>
                    <div className="h-1 rounded-full bg-muted overflow-hidden mt-0.5">
                      <div className="bar-xp h-full rounded-full" style={{ width: `${(zone.progress / zone.maxProgress) * 100}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Daily Modifier */}
          <div className="card-game p-4 glow-border-gold animate-fade-in-up" style={{ animationDelay: "0.4s", animationFillMode: "both" }}>
            <h3 className="font-display text-sm font-bold mb-1 text-secondary">🎲 Daily Modifier</h3>
            <p className="text-xs text-foreground">Double XP in Slot Alley!</p>
            <p className="text-[10px] text-muted-foreground mt-1">Resets in 14h 23m</p>
          </div>
        </div>
      </div>
    </div>
  );
}
