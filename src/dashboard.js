import React from "react";
import { loadData } from "./storage";

function getUpcomingAssignments(classes, assignments) {
  const now = new Date();
  return assignments
    .filter(a => !a.done)
    .map(a => {
      const classInfo = classes.find(c => c.id === a.classId);
      const due = new Date(a.dueDate);
      let status = "";
      if (due < now) status = "missing";
      else if ((due - now) / (1000 * 60 * 60 * 24) < 2) status = "soon";
      return {
        ...a,
        className: classInfo ? classInfo.name : "",
        status,
        due,
      };
    })
    .sort((a, b) => a.due - b.due);
}

export default function Dashboard() {
  const classes = loadData("classes", []);
  const assignments = loadData("assignments", []);
  const upcoming = getUpcomingAssignments(classes, assignments);

  return (
    <>
      <h1>Dashboard</h1>
      <h2>Upcoming & Missing Assignments</h2>
      {upcoming.length === 0 ? (
        <div>No upcoming assignments!</div>
      ) : (
        upcoming.map(a => (
          <div
            className={`assignment-row ${a.status}`}
            key={a.id}
            style={{ marginBottom: 8 }}
          >
            <span className="assignment-status">
              {a.status === "missing" ? "❌" : a.status === "soon" ? "⚠️" : ""}
            </span>
            <span>
              <b>{a.name}</b> ({a.className})<br />
              <span>
                Due: {a.due.toLocaleString()}{" "}
                {a.link && (
                  <a className="link" href={a.link} target="_blank" rel="noreferrer">
                    [Link]
                  </a>
                )}
              </span>
            </span>
            <span>
              <span>
                {a.points && <>({a.points} pts)</>}
              </span>
            </span>
          </div>
        ))
      )}
      <h2>Assignments Marked Done</h2>
      {assignments.filter(a => a.done).length === 0 ? (
        <div>No assignments marked as done.</div>
      ) : (
        assignments
          .filter(a => a.done)
          .sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate))
          .map(a => {
            const classInfo = classes.find(c => c.id === a.classId);
            return (
              <div className="assignment-row done" key={a.id}>
                <span>{a.name} ({classInfo ? classInfo.name : ""})</span>
                <span>Grade: {a.grade ?? "Pending"}</span>
                <span>Due: {new Date(a.dueDate).toLocaleString()}</span>
              </div>
            );
          })
      )}
    </>
  );
}
