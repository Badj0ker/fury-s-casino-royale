import { useGame } from "@/contexts/GameContext";
import { useNavigate } from "react-router-dom";

export default function DungeonsPage() {
  const { maps, dungeons, player } = useGame();
  const navigate = useNavigate();

  return (
    <div className="animate-fade-in">
      <h1 className="font-display text-3xl font-bold mb-2 neon-text-red">🏰 Dungeons</h1>
      <p className="text-muted-foreground mb-6">Chain battles, rare loot, glory.</p>

      {maps.map(map => {
        const mapDungeons = dungeons.filter(d => d.mapId === map.id);
        if (mapDungeons.length === 0) return null;

        return (
          <div key={map.id} className="mb-6">
            <h2 className="font-display text-sm font-bold text-secondary mb-3">{map.icon} {map.name}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {mapDungeons.map(dg => {
                const canEnter = player.level >= dg.requiredLevel;
                const zone = map.zones.find(z => z.id === dg.zoneId);

                return (
                  <button
                    key={dg.id}
                    onClick={() => navigate(`/dungeon/${dg.id}`)}
                    disabled={!canEnter}
                    className={`card-game p-4 text-left transition-all ${
                      canEnter ? "hover:glow-border-red cursor-pointer" : "opacity-40 cursor-not-allowed"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{dg.icon}</span>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display text-xs font-bold truncate">{dg.name}</h3>
                        <p className="text-[10px] text-muted-foreground">
                          {zone?.icon} {zone?.name} • Lv.{dg.requiredLevel}
                        </p>
                      </div>
                      {!canEnter ? (
                        <span className="text-xs bg-muted px-2 py-0.5 rounded text-muted-foreground">🔒</span>
                      ) : (
                        <span className="text-[10px] text-primary font-bold">ENTER →</span>
                      )}
                    </div>
                    <div className="flex gap-3 mt-2 text-[10px] text-muted-foreground">
                      <span>5 rooms</span>
                      <span>✨ {dg.itemDropChance}% drop</span>
                      <span>🪙 {dg.goldReward[0]}-{dg.goldReward[1]}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
