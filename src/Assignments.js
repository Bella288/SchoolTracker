import React, { useState } from "react";
import { loadData, saveData } from "./storage";
import { v4 as uuidv4 } from "uuid";

export default function Assignments() {
  const classes = loadData("classes", []);
  const [assignments, setAssignments] = useState(loadData("assignments", []));
  const [form, setForm] = useState({
    classId: classes.length ? classes[0].id : "",
    name: "",
    link: "",
    dueDate: "",
    category: "",
    points: "",
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleAddAssignment(e) {
    e.preventDefault();
    const newAssign = {
      ...form,
      id: uuidv4(),
      done: false,
      grade: null,
    };
    const updated = [...assignments, newAssign];
    setAssignments(updated);
    saveData("assignments", updated);
    setForm({
      classId: classes.length ? classes[0].id : "",
      name: "",
      link: "",
      dueDate: "",
      category: "",
      points: "",
    });
  }

  function handleDone(id) {
    const updated = assignments.map(a =>
      a.id === id ? { ...a, done: true } : a
    );
    setAssignments(updated);
    saveData("assignments", updated);
  }

  function handleGrade(id, grade) {
    const updated = assignments.map(a =>
      a.id === id ? { ...a, grade } : a
    );
    setAssignments(updated);
    saveData("assignments", updated);
  }

  function handleDelete(id) {
    const updated = assignments.filter(a => a.id !== id);
    setAssignments(updated);
    saveData("assignments", updated);
  }

  return (
    <>
      <h1>Assignments</h1>
      <form onSubmit={handleAddAssignment}>
        <label>Class</label>
        <select
          name="classId"
          value={form.classId}
          onChange={handleChange}
          required
        >
          {classes.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <label>Name</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <label>Link</label>
        <input
          name="link"
          value={form.link}
          onChange={handleChange}
          placeholder="https://your-assignment.com"
        />
        <label>Due Date</label>
        <input
          type="datetime-local"
          name="dueDate"
          value={form.dueDate}
          onChange={handleChange}
          required
        />
        <label>Category</label>
        <input
          name="category"
          value={form.category}
          onChange={handleChange}
        />
        <label>Point Value</label>
        <input
          name="points"
          type="number"
          value={form.points}
          onChange={handleChange}
        />
        <button type="submit">Add Assignment</button>
      </form>
      <h2>Assignments</h2>
      {assignments.length === 0 ? (
        <div>No assignments yet.</div>
      ) : (
        assignments
          .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
          .map(a => {
            const classInfo = classes.find(c => c.id === a.classId);
            return (
              <div
                className={`assignment-row ${a.done ? "done" : ""}`}
                key={a.id}
              >
                <span>
                  <b>{a.name}</b> ({classInfo ? classInfo.name : ""})
                  {a.category && <> [{a.category}]</>}
                  <br />
                  Due: {new Date(a.dueDate).toLocaleString()}
                  {a.link && (
                    <a className="link" href={a.link} target="_blank" rel="noreferrer">
                      [Link]
                    </a>
                  )}
                  {a.points && <> ({a.points} pts)</>}
                </span>
                <span>
                  {!a.done ? (
                    <button onClick={() => handleDone(a.id)}>Mark Done</button>
                  ) : (
                    <>
                      <label>
                        Grade:
                        <input
                          style={{ width: 60, marginLeft: 6 }}
                          type="text"
                          value={a.grade ?? ""}
                          onChange={e => handleGrade(a.id, e.target.value)}
                          placeholder="Score"
                        />
                      </label>
                    </>
                  )}
                  <button onClick={() => handleDelete(a.id)}>Delete</button>
                </span>
              </div>
            );
          })
      )}
    </>
  );
}
