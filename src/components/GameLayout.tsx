import { Outlet } from "react-router-dom";
import GameSidebar from "./GameSidebar";

export default function GameLayout() {
  return (
    <div className="flex min-h-screen">
      <GameSidebar />
      <main className="flex-1 ml-64 p-6 max-w-5xl">
        <Outlet />
      </main>
    </div>
  );
}
