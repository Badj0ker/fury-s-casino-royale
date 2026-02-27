import { useGame } from "@/contexts/GameContext";
import { useNavigate } from "react-router-dom";
import worldMapBg from "@/assets/world-map-bg.png";

export default function WorldMap() {
  const { zones, player, startBattle } = useGame();
  const navigate = useNavigate();

  const handleZoneClick = (zoneId: string) => {
    const zone = zones.find(z => z.id === zoneId);
    if (!zone?.unlocked) return;
    startBattle(zoneId);
    navigate("/battle");
  };

  return (
    <div className="animate-fade-in">
      <h1 className="font-display text-3xl font-bold mb-2 neon-text-red">World Map</h1>
      <p className="text-muted-foreground mb-6">Navigate the casino underworld</p>

      {/* Map background */}
      <div className="relative rounded-xl overflow-hidden mb-6">
        <img src={worldMapBg} alt="Casino World Map" className="w-full h-64 object-cover rounded-xl" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      {/* Zone Cards */}
      <div className="space-y-3">
        {zones.map((zone, i) => {
          const isLocked = !zone.unlocked;
          const progressPct = (zone.progress / zone.maxProgress) * 100;

          return (
            <button
              key={zone.id}
              onClick={() => handleZoneClick(zone.id)}
              disabled={isLocked}
              className={`w-full card-game p-4 flex items-center gap-4 transition-all text-left ${
                isLocked ? "opacity-40 cursor-not-allowed" : "hover:glow-border-gold cursor-pointer"
              }`}
              style={{ animationDelay: `${i * 0.1}s`, animationFillMode: "both", animation: "fade-in-up 0.5s ease-out" }}
            >
              <span className="text-3xl">{zone.icon}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-sm font-bold">{zone.name}</h3>
                  {isLocked && <span className="text-xs bg-muted px-2 py-0.5 rounded text-muted-foreground">🔒 Lv. {zone.requiredLevel}</span>}
                  {zone.completed && <span className="text-xs text-health">✅ Cleared</span>}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{zone.description}</p>
                {!isLocked && (
                  <div className="mt-2">
                    <div className="flex justify-between text-[10px] text-muted-foreground mb-0.5">
                      <span>Progress</span>
                      <span>{zone.progress}/{zone.maxProgress}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <div className="bar-xp h-full rounded-full transition-all duration-500" style={{ width: `${progressPct}%` }} />
                    </div>
                  </div>
                )}
              </div>
              <div className="text-xs text-muted-foreground">
                <p>{zone.enemies.length} enemies</p>
                <p className="text-secondary">{zone.enemies.reduce((a, e) => a + e.goldReward, 0)}🪙 avg</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
