import { useCoop } from "@/contexts/CoopContext";
import { useGame } from "@/contexts/GameContext";
import { useNavigate } from "react-router-dom";

export default function CoopDungeonsPage() {
  const { coopDungeons } = useCoop();
  const { player } = useGame();
  const navigate = useNavigate();

  return (
    <div className="animate-fade-in">
      <h1 className="font-display text-3xl font-bold mb-1 neon-text-red">⚔️ Co-op Dungeons</h1>
      <p className="text-muted-foreground text-sm mb-6">Party up. Multiple enemies per room. Longer runs. Bigger rewards.</p>

      <div className="grid grid-cols-1 gap-3">
        {coopDungeons.map(dg => {
          const canEnter = player.level >= dg.requiredLevel;
          return (
            <button
              key={dg.id}
              onClick={() => navigate(`/coop/${dg.id}`)}
              disabled={!canEnter}
              className={`card-game p-4 text-left transition-all ${canEnter ? "hover:glow-border-red cursor-pointer" : "opacity-40 cursor-not-allowed"}`}
            >
              <div className="flex items-center gap-4">
                <span className="text-3xl">{dg.icon}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-sm font-bold">{dg.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{dg.description}</p>
                </div>
                {!canEnter ? (
                  <span className="text-xs bg-muted px-2 py-0.5 rounded text-muted-foreground">🔒 Lv.{dg.requiredLevel}</span>
                ) : (
                  <span className="text-xs text-primary font-bold">ENTER →</span>
                )}
              </div>
              <div className="flex gap-4 mt-3 text-[10px] text-muted-foreground">
                <span>📐 {dg.rooms.length} rooms</span>
                <span>👥 4-man party</span>
                <span>✨ {dg.itemDropChance}% drop</span>
                <span>🪙 {dg.goldReward[0]}-{dg.goldReward[1]}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
