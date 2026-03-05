import { NavLink, useLocation } from "react-router-dom";
import { useGame } from "@/contexts/GameContext";
import furyMascot from "@/assets/fury-mascot.png";

const navItems = [
  { path: "/", label: "Dashboard", icon: "🏠" },
  { path: "/world-map", label: "World Map", icon: "🗺️" },
  { path: "/battle", label: "Battle", icon: "⚔️" },
  { path: "/dungeons", label: "Dungeons", icon: "🏰" },
  { path: "/boss-event", label: "Boss Raid", icon: "👑" },
  { path: "/quests", label: "Quests", icon: "📜" },
  { path: "/inventory", label: "Inventory", icon: "🎒" },
];

export default function GameSidebar() {
  const { player } = useGame();
  const location = useLocation();

  return (
    <aside className="w-64 h-screen bg-sidebar border-r border-sidebar-border flex flex-col fixed left-0 top-0 z-50">
      {/* Logo */}
      <div className="p-4 border-b border-sidebar-border flex items-center gap-3">
        <img src={furyMascot} alt="FURY" className="w-10 h-10 rounded-full ring-2 ring-primary" />
        <div>
          <h1 className="font-display text-sm font-bold text-primary neon-text-red">FURYLAND</h1>
          <p className="text-xs text-muted-foreground">Quest</p>
        </div>
      </div>

      {/* Player Mini */}
      <div className="p-4 border-b border-sidebar-border">
        <p className="font-display text-sm text-foreground">{player.name}</p>
        <p className="text-xs text-muted-foreground">Level {player.level}</p>
        <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
          <div className="bar-xp h-full rounded-full transition-all duration-700" style={{ width: `${(player.xp / player.xpToNext) * 100}%` }} />
        </div>
        <div className="flex justify-between mt-2 text-xs">
          <span className="text-secondary font-mono">🪙 {player.gold}</span>
          <span className="text-accent font-mono">💎 {player.bfg}</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={() => {
              const isActive = location.pathname === item.path;
              return `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground glow-border-red border"
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`;
            }}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <p className="text-xs text-muted-foreground text-center">Powered by BetFury</p>
      </div>
    </aside>
  );
}
