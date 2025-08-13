import React, { useState } from "react";
import Dashboard from "./Dashboard";
import Classes from "./Classes";
import Assignments from "./Assignments";
import Schedule from "./Schedule";
import GPA from "./GPA";

const TABS = [
  { id: "Dashboard", label: "Dashboard" },
  { id: "Classes", label: "Classes" },
  { id: "Assignments", label: "Assignments" },
  { id: "Schedule", label: "Schedule" },
  { id: "GPA", label: "GPA" },
];

export default function App() {
  const [tab, setTab] = useState("Dashboard");
  return (
    <>
      <nav>
        {TABS.map(t => (
          <button
            key={t.id}
            className={tab === t.id ? "active" : ""}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </nav>
      <div className="container">
        {tab === "Dashboard" && <Dashboard />}
        {tab === "Classes" && <Classes />}
        {tab === "Assignments" && <Assignments />}
        {tab === "Schedule" && <Schedule />}
        {tab === "GPA" && <GPA />}
      </div>
    </>
  );
}
