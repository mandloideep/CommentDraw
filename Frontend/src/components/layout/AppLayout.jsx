import { Outlet } from "react-router-dom";
import { AppHeader } from "./";
import { useState } from "react";

function AppLayout() {
  const [navigationLocked, setNavigationLocked] = useState(false);

  return (
    <div className="flex flex-col lg:flex-row h-screen w-screen overflow-hidden bg-paper dark:bg-ink text-ink dark:text-paper relative">
      <AppHeader navigationLocked={navigationLocked} />

      <main className="flex-1 h-full overflow-y-auto">
        <Outlet context={{ setNavigationLocked }} />
      </main>
    </div>
  );
}

export default AppLayout;
