import { useGame } from "@/contexts/GameContext";
import { useNavigate } from "react-router-dom";
import worldMapBg from "@/assets/world-map-bg.png";
import worldMapRian from "@/assets/world-map-rian.png";
import worldMapSteve from "@/assets/world-map-steve.png";

const MAP_BACKGROUNDS: Record<string, string> = {
  "fury-strip": worldMapBg,
  "rian-strip": worldMapRian,
  "steve-underworld": worldMapSteve,
};

// Zone positions on each map (percentage-based)
const ZONE_POSITIONS: Record<string, { top: string; left: string }[]> = {
  "fury-strip": [
    { top: "75%", left: "15%" },
    { top: "58%", left: "38%" },
    { top: "42%", left: "62%" },
    { top: "28%", left: "40%" },
    { top: "12%", left: "72%" },
  ],
  "rian-strip": [
    { top: "78%", left: "20%" },
    { top: "60%", left: "55%" },
    { top: "45%", left: "25%" },
    { top: "30%", left: "60%" },
    { top: "10%", left: "45%" },
  ],
  "steve-underworld": [
    { top: "76%", left: "55%" },
    { top: "58%", left: "20%" },
    { top: "42%", left: "65%" },
    { top: "25%", left: "35%" },
    { top: "8%", left: "55%" },
  ],
};

// SVG path connections between zones
function getPathD(positions: { top: string; left: string }[]) {
  return positions.map((p, i) => {
    const x = parseFloat(p.left);
    const y = parseFloat(p.top);
    return `${i === 0 ? "M" : "L"} ${x} ${y}`;
  }).join(" ");
}

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
  const positions = ZONE_POSITIONS[currentMapId] || ZONE_POSITIONS["fury-strip"];

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

      {/* Interactive Visual Map */}
      <div className="relative rounded-xl overflow-hidden mb-6 border border-border" style={{ height: "420px" }}>
        <img
          src={MAP_BACKGROUNDS[currentMapId] || worldMapBg}
          alt={currentMap.name}
          className="w-full h-full object-cover"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-background/40" />

        {/* Connection paths (SVG) */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path
            d={getPathD(positions)}
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="0.4"
            strokeDasharray="1.5 1"
            opacity="0.5"
          />
          {/* Glow path */}
          <path
            d={getPathD(positions)}
            fill="none"
            stroke="hsl(var(--secondary))"
            strokeWidth="0.2"
            strokeDasharray="1.5 1"
            opacity="0.3"
          />
        </svg>

        {/* Zone markers */}
        {zones.map((zone, i) => {
          const pos = positions[i];
          if (!pos) return null;
          const isLocked = !zone.unlocked;
          const progressPct = (zone.progress / zone.maxProgress) * 100;

          return (
            <button
              key={zone.id}
              onClick={() => handleZoneClick(zone.id)}
              disabled={isLocked}
              className="absolute group"
              style={{
                top: pos.top,
                left: pos.left,
                transform: "translate(-50%, -50%)",
              }}
            >
              {/* Glow pulse for unlocked */}
              {!isLocked && (
                <div className="absolute inset-0 -m-3 rounded-full bg-primary/20 animate-pulse" />
              )}

              {/* Node circle */}
              <div
                className={`relative w-12 h-12 rounded-full flex items-center justify-center text-xl border-2 transition-all ${
                  isLocked
                    ? "bg-muted/80 border-muted-foreground/30 opacity-50 cursor-not-allowed"
                    : zone.completed
                    ? "bg-card border-health shadow-[0_0_12px_hsl(var(--health)/0.5)]"
                    : "bg-card border-primary shadow-[0_0_12px_hsl(var(--primary)/0.4)] hover:scale-110 hover:shadow-[0_0_20px_hsl(var(--primary)/0.6)] cursor-pointer"
                }`}
              >
                {isLocked ? "🔒" : zone.icon}
              </div>

              {/* Label */}
              <div
                className={`absolute left-1/2 -translate-x-1/2 mt-1 whitespace-nowrap px-2 py-1 rounded-md text-[10px] font-display font-bold transition-all ${
                  isLocked
                    ? "bg-muted/70 text-muted-foreground"
                    : "bg-card/90 text-foreground border border-border group-hover:border-primary/50"
                }`}
              >
                {zone.name}
                {isLocked && <span className="ml-1 text-muted-foreground">Lv.{zone.requiredLevel}</span>}
                {!isLocked && !zone.completed && (
                  <div className="mt-1 h-1 rounded-full bg-muted overflow-hidden w-16 mx-auto">
                    <div className="bar-xp h-full rounded-full" style={{ width: `${progressPct}%` }} />
                  </div>
                )}
                {zone.completed && <span className="ml-1 text-health">✅</span>}
              </div>
            </button>
          );
        })}

        {/* Map title overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background/60 to-transparent p-4">
          <h2 className="font-display text-lg font-bold">{currentMap.icon} {currentMap.name}</h2>
          <p className="text-xs text-muted-foreground">{currentMap.description}</p>
        </div>
      </div>

      {/* Zone Cards + Dungeons list below */}
      <h3 className="font-display text-lg font-bold mb-3 text-secondary">Zones & Dungeons</h3>
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
