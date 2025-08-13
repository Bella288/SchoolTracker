import React, { useState } from "react";
import { loadData, saveData } from "./storage";
import { v4 as uuidv4 } from "uuid";

export default function Classes() {
  const [classes, setClasses] = useState(loadData("classes", []));
  const [form, setForm] = useState({
    name: "",
    period: "",
    teacher: "",
    room: "",
    details: "",
    categoryWeights: "",
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleAddClass(e) {
    e.preventDefault();
    const newClass = {
      ...form,
      id: uuidv4(),
      categoryWeights: form.categoryWeights
        ? JSON.parse(form.categoryWeights)
        : null,
    };
    const updated = [...classes, newClass];
    setClasses(updated);
    saveData("classes", updated);
    setForm({
      name: "",
      period: "",
      teacher: "",
      room: "",
      details: "",
      categoryWeights: "",
    });
  }

  function handleDelete(id) {
    const updated = classes.filter(c => c.id !== id);
    setClasses(updated);
    saveData("classes", updated);
  }

  return (
    <>
      <h1>Classes</h1>
      <form onSubmit={handleAddClass}>
        <label>Class Name</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <label>Period</label>
        <input
          name="period"
          value={form.period}
          onChange={handleChange}
        />
        <label>Teacher</label>
        <input
          name="teacher"
          value={form.teacher}
          onChange={handleChange}
        />
        <label>Room Number</label>
        <input
          name="room"
          value={form.room}
          onChange={handleChange}
        />
        <label>Additional Details</label>
        <textarea
          name="details"
          value={form.details}
          onChange={handleChange}
        />
        <label>
          Category Weights (JSON: {"{\"Homework\":40,\"Tests\":60}"})
        </label>
        <input
          name="categoryWeights"
          value={form.categoryWeights}
          onChange={handleChange}
          placeholder='{"Homework":40,"Tests":60}'
        />
        <button type="submit">Add Class</button>
      </form>
      <h2>Your Classes</h2>
      {classes.length === 0 ? (
        <div>No classes yet.</div>
      ) : (
        <table className="details-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Period</th>
              <th>Teacher</th>
              <th>Room</th>
              <th>Details</th>
              <th>Weights</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {classes.map(c => (
              <tr key={c.id}>
                <td>{c.name}</td>
                <td>{c.period}</td>
                <td>{c.teacher}</td>
                <td>{c.room}</td>
                <td>{c.details}</td>
                <td>
                  {c.categoryWeights
                    ? Object.entries(c.categoryWeights)
                        .map(([cat, wt]) => `${cat}: ${wt}%`)
                        .join(", ")
                    : "None"}
                </td>
                <td>
                  <button onClick={() => handleDelete(c.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
