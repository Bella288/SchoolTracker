import React, { useState, useEffect } from "react";
import { loadData, saveData } from "./storage";
import { v4 as uuidv4 } from "uuid";

function getCurrentPeriod(schedule) {
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  for (const period of schedule) {
    const [startHour, startMin] = period.startTime.split(":").map(Number);
    const [endHour, endMin] = period.endTime.split(":").map(Number);
    const start = startHour * 60 + startMin;
    const end = endHour * 60 + endMin;
    if (nowMinutes >= start && nowMinutes < end) {
      return {
        ...period,
        timeLeft: end - nowMinutes,
      };
    }
  }
  return null;
}

export default function Schedule() {
  const [schedule, setSchedule] = useState(loadData("schedule", []));
  const [form, setForm] = useState({
    period: "",
    startTime: "",
    endTime: "",
  });
  const [current, setCurrent] = useState(getCurrentPeriod(schedule));

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent(getCurrentPeriod(schedule));
    }, 1000 * 15);
    return () => clearInterval(interval);
  }, [schedule]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleAddPeriod(e) {
    e.preventDefault();
    const newPeriod = {
      ...form,
      id: uuidv4(),
    };
    const updated = [...schedule, newPeriod];
    setSchedule(updated);
    saveData("schedule", updated);
    setForm({
      period: "",
      startTime: "",
      endTime: "",
    });
  }

  function handleDelete(id) {
    const updated = schedule.filter(p => p.id !== id);
    setSchedule(updated);
    saveData("schedule", updated);
  }

  return (
    <>
      <h1>Bell Schedule</h1>
      <form onSubmit={handleAddPeriod}>
        <label>Period Name</label>
        <input
          name="period"
          value={form.period}
          onChange={handleChange}
          required
        />
        <label>Start Time (HH:MM)</label>
        <input
          name="startTime"
          value={form.startTime}
          onChange={handleChange}
          placeholder="08:00"
          required
        />
        <label>End Time (HH:MM)</label>
        <input
          name="endTime"
          value={form.endTime}
          onChange={handleChange}
          placeholder="08:45"
          required
        />
        <button type="submit">Add Period</button>
      </form>
      <h2>Today's Schedule</h2>
      {schedule.length === 0 ? (
        <div>No schedule periods added.</div>
      ) : (
        <div>
          {schedule.map(p => {
            const isCurrent = current && p.id === current.id;
            return (
              <div
                className={`period-row${isCurrent ? " pulsate" : ""}`}
                key={p.id}
              >
                <span>
                  {p.period} ({p.startTime} - {p.endTime})
                </span>
                <span>
                  {isCurrent
                    ? `In session: ${current.timeLeft} min left`
                    : ""}
                  <button
                    style={{ marginLeft: 10 }}
                    onClick={() => handleDelete(p.id)}
                  >
                    Delete
                  </button>
                </span>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
