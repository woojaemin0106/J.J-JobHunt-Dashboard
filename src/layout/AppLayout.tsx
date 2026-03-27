import React from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { ui } from "../utils/ui";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={ui.page}>
      <div className={ui.shell}>
        <aside className={ui.sidebar}>
          <Sidebar />
        </aside>

        <div className={ui.main}>
          <header className={ui.header}>
            <Header />
          </header>
          <main className={ui.content}>{children}</main>
        </div>
      </div>
    </div>
  );
}
