import { useGame } from "@/contexts/GameContext";
import { useNavigate } from "react-router-dom";
import worldMapBg from "@/assets/world-map-bg.png";

export default function WorldMap() {
  const { maps, currentMapId, zones, player, startBattle, switchMap, dungeons } = useGame();
  const navigate = useNavigate();

  const handleZoneClick = (zoneId: string) => {
    const zone = zones.find(z => z.id === zoneId);
    if (!zone?.unlocked) return;
    startBattle(zoneId);
    navigate("/battle");
  };

  const handleDungeonClick = (dungeonId: string) => {
    navigate(`/dungeon/${dungeonId}`);
  };

  const currentMap = maps.find(m => m.id === currentMapId)!;

  return (
    <div className="animate-fade-in">
      <h1 className="font-display text-3xl font-bold mb-2 neon-text-red">World Map</h1>
      <p className="text-muted-foreground mb-4">Navigate the casino underworld</p>

      {/* Map Tabs */}
      <div className="flex gap-2 mb-6">
        {maps.map(m => (
          <button
            key={m.id}
            onClick={() => switchMap(m.id)}
            className={`px-4 py-2 rounded-lg font-display text-sm font-bold transition-all ${
              m.id === currentMapId
                ? "bg-primary text-primary-foreground glow-border-red"
                : "bg-card border border-border text-muted-foreground hover:border-primary/50"
            }`}
          >
            <span className="mr-2">{m.icon}</span>
            {m.name}
          </button>
        ))}
      </div>

      {/* Map description */}
      <div className="relative rounded-xl overflow-hidden mb-6">
        <img src={worldMapBg} alt="Casino World Map" className="w-full h-48 object-cover rounded-xl opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent flex items-end p-4">
          <div>
            <h2 className="font-display text-xl font-bold">{currentMap.icon} {currentMap.name}</h2>
            <p className="text-sm text-muted-foreground">{currentMap.description}</p>
          </div>
        </div>
      </div>

      {/* Zone Cards */}
      <div className="space-y-3">
        {zones.map((zone, i) => {
          const isLocked = !zone.unlocked;
          const progressPct = (zone.progress / zone.maxProgress) * 100;
          const zoneDungeons = dungeons.filter(d => d.zoneId === zone.id && d.mapId === currentMapId);

          return (
            <div key={zone.id} style={{ animationDelay: `${i * 0.1}s`, animationFillMode: "both", animation: "fade-in-up 0.5s ease-out" }}>
              <button
                onClick={() => handleZoneClick(zone.id)}
                disabled={isLocked}
                className={`w-full card-game p-4 flex items-center gap-4 transition-all text-left ${
                  isLocked ? "opacity-40 cursor-not-allowed" : "hover:glow-border-gold cursor-pointer"
                }`}
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

              {/* Dungeon buttons */}
              {!isLocked && zoneDungeons.map(dg => {
                const canEnter = player.level >= dg.requiredLevel;
                return (
                  <button
                    key={dg.id}
                    onClick={(e) => { e.stopPropagation(); handleDungeonClick(dg.id); }}
                    disabled={!canEnter}
                    className={`w-full mt-1 ml-8 card-game p-3 flex items-center gap-3 text-left text-sm transition-all ${
                      canEnter ? "hover:glow-border-red cursor-pointer border-primary/30" : "opacity-40 cursor-not-allowed"
                    }`}
                  >
                    <span className="text-xl">{dg.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-display font-bold text-xs">🏰 {dg.name}</span>
                        {!canEnter && <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground">🔒 Lv.{dg.requiredLevel}</span>}
                      </div>
                      <p className="text-[10px] text-muted-foreground">5 rooms • {dg.itemDropChance}% item drop • {dg.goldReward[0]}-{dg.goldReward[1]} 🪙</p>
                    </div>
                    <span className="text-xs text-primary font-bold">ENTER →</span>
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
