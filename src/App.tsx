import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GameProvider } from "@/contexts/GameContext";
import { CoopProvider } from "@/contexts/CoopContext";
import GameLayout from "@/components/GameLayout";
import Dashboard from "@/pages/Dashboard";
import WorldMapPage from "@/pages/WorldMapPage";
import BattlePage from "@/pages/BattlePage";
import BossEventPage from "@/pages/BossEventPage";
import QuestsPage from "@/pages/QuestsPage";
import InventoryPage from "@/pages/InventoryPage";
import NotFound from "./pages/NotFound";
import DungeonPage from "@/pages/DungeonPage";
import DungeonsPage from "@/pages/DungeonsPage";
import CoopDungeonsPage from "@/pages/CoopDungeonsPage";
import CoopBattlePage from "@/pages/CoopBattlePage";
import PvpArenaPage from "@/pages/PvpArenaPage";
import { PvpProvider } from "@/contexts/PvpContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <GameProvider>
        <CoopProvider>
          <PvpProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<GameLayout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/world-map" element={<WorldMapPage />} />
                <Route path="/battle" element={<BattlePage />} />
                <Route path="/dungeons" element={<DungeonsPage />} />
                <Route path="/coop-dungeons" element={<CoopDungeonsPage />} />
                <Route path="/boss-event" element={<BossEventPage />} />
                <Route path="/quests" element={<QuestsPage />} />
                <Route path="/inventory" element={<InventoryPage />} />
                <Route path="/dungeon/:dungeonId" element={<DungeonPage />} />
                <Route path="/coop/:dungeonId" element={<CoopBattlePage />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </CoopProvider>
      </GameProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
