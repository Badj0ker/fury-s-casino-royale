import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GameProvider } from "@/contexts/GameContext";
import GameLayout from "@/components/GameLayout";
import Dashboard from "@/pages/Dashboard";
import WorldMapPage from "@/pages/WorldMapPage";
import BattlePage from "@/pages/BattlePage";
import BossEventPage from "@/pages/BossEventPage";
import QuestsPage from "@/pages/QuestsPage";
import InventoryPage from "@/pages/InventoryPage";
import NotFound from "./pages/NotFound";
import DungeonPage from "@/pages/DungeonPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <GameProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<GameLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/world-map" element={<WorldMapPage />} />
              <Route path="/battle" element={<BattlePage />} />
              <Route path="/boss-event" element={<BossEventPage />} />
              <Route path="/quests" element={<QuestsPage />} />
              <Route path="/inventory" element={<InventoryPage />} />
              <Route path="/dungeon/:dungeonId" element={<DungeonPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </GameProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
