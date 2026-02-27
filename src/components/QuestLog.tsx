import { useState } from "react";
import { useGame } from "@/contexts/GameContext";

export default function QuestLog() {
  const { quests, claimQuest } = useGame();
  const [filter, setFilter] = useState<"all" | "daily" | "story">("all");

  const filtered = quests.filter(q => filter === "all" || q.type === filter);

  return (
    <div className="animate-fade-in">
      <h1 className="font-display text-3xl font-bold mb-2 neon-text-gold">Quest Log</h1>
      <p className="text-muted-foreground mb-6">Complete quests for rewards</p>

      {/* Filter */}
      <div className="flex gap-2 mb-4">
        {(["all", "daily", "story"] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              filter === f ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {f === "all" ? "All" : f === "daily" ? "📅 Daily" : "📖 Story"}
          </button>
        ))}
      </div>

      {/* Quest Cards */}
      <div className="space-y-3">
        {filtered.map((quest, i) => {
          const pct = (quest.progress / quest.maxProgress) * 100;
          return (
            <div
              key={quest.id}
              className={`card-game p-4 transition-all ${quest.claimed ? "opacity-50" : quest.completed ? "glow-border-gold" : ""}`}
              style={{ animationDelay: `${i * 0.08}s`, animationFillMode: "both", animation: "fade-in-up 0.4s ease-out" }}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground uppercase">
                      {quest.type}
                    </span>
                    <h3 className="font-display text-sm font-bold">{quest.title}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{quest.description}</p>
                </div>
                <div className="text-right text-xs space-y-0.5">
                  <p className="text-xp">+{quest.xpReward} XP</p>
                  <p className="text-secondary">+{quest.goldReward} 🪙</p>
                </div>
              </div>
              {/* Progress */}
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${quest.completed ? "bg-health" : "bar-xp"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{quest.progress}/{quest.maxProgress}</p>
                </div>
                {quest.completed && !quest.claimed && (
                  <button
                    onClick={() => claimQuest(quest.id)}
                    className="bg-secondary text-secondary-foreground px-3 py-1 rounded-lg text-xs font-bold hover:scale-105 transition-transform font-display"
                  >
                    Claim!
                  </button>
                )}
                {quest.claimed && <span className="text-xs text-health font-bold">✅ Claimed</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
