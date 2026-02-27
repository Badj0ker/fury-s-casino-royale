import { useGame } from "@/contexts/GameContext";

const rarityStyles: Record<string, string> = {
  common: "rarity-common",
  rare: "rarity-rare",
  epic: "rarity-epic",
  legendary: "rarity-legendary",
};

const rarityLabels: Record<string, string> = {
  common: "Common",
  rare: "Rare",
  epic: "Epic",
  legendary: "Legendary",
};

export default function InventoryGrid() {
  const { inventory, equipItem } = useGame();

  return (
    <div className="animate-fade-in">
      <h1 className="font-display text-3xl font-bold mb-2 neon-text-purple">Inventory</h1>
      <p className="text-muted-foreground mb-6">Manage your loot</p>

      <div className="grid grid-cols-4 gap-3">
        {inventory.map((item, i) => (
          <div
            key={item.id}
            className={`card-game border-2 ${rarityStyles[item.rarity]} p-3 text-center relative group cursor-pointer hover:scale-105 transition-all`}
            onClick={() => equipItem(item.id)}
            style={{ animationDelay: `${i * 0.05}s`, animationFillMode: "both", animation: "fade-in-up 0.3s ease-out" }}
          >
            {item.equipped && (
              <span className="absolute top-1 right-1 text-[10px] bg-primary text-primary-foreground px-1 rounded font-bold">E</span>
            )}
            <span className="text-3xl block mb-1">{item.icon}</span>
            <p className="text-xs font-semibold truncate">{item.name}</p>
            <p className={`text-[10px] ${item.rarity === "legendary" ? "text-legendary" : item.rarity === "epic" ? "text-epic" : item.rarity === "rare" ? "text-rare" : "text-common"}`}>
              {rarityLabels[item.rarity]}
            </p>

            {/* Tooltip on hover */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-popover border border-border rounded-lg p-3 text-left min-w-[160px] hidden group-hover:block z-50 shadow-xl">
              <p className="font-display text-xs font-bold mb-1">{item.name}</p>
              <p className="text-[10px] text-muted-foreground capitalize mb-1">{item.type}</p>
              {Object.entries(item.stats).map(([key, val]) => (
                <p key={key} className="text-[10px] text-health">+{val} {key}</p>
              ))}
              {item.type !== "consumable" && (
                <p className="text-[10px] text-muted-foreground mt-1 border-t border-border pt-1">
                  Click to {item.equipped ? "unequip" : "equip"}
                </p>
              )}
            </div>
          </div>
        ))}

        {/* Empty slots */}
        {Array.from({ length: Math.max(0, 20 - inventory.length) }).map((_, i) => (
          <div key={`empty-${i}`} className="card-game border border-dashed border-border/50 p-3 text-center opacity-30 aspect-square flex items-center justify-center">
            <span className="text-xs text-muted-foreground">Empty</span>
          </div>
        ))}
      </div>
    </div>
  );
}
