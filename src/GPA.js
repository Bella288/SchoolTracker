import React from "react";
import { loadData } from "./storage";

function calculateGPA(classes, assignments) {
  let totalPoints = 0;
  let totalEarned = 0;
  let weightedTotal = 0;
  let weightedEarned = 0;
  let countedClasses = 0;

  classes.forEach(c => {
    const classAssignments = assignments
      .filter(a => a.classId === c.id && a.done && a.grade !== null && a.points);

    if (classAssignments.length === 0) return;

    let classTotal = 0;
    let classEarned = 0;

    if (c.categoryWeights) {
      let categoryTotals = {};
      let categoryEarned = {};
      Object.keys(c.categoryWeights).forEach(cat => {
        categoryTotals[cat] = 0;
        categoryEarned[cat] = 0;
      });
      classAssignments.forEach(a => {
        if (a.category && categoryTotals[a.category] !== undefined) {
          categoryTotals[a.category] += Number(a.points);
          categoryEarned[a.category] += Number(a.grade);
        }
      });
      let weightedScore = 0;
      Object.entries(c.categoryWeights).forEach(([cat, wt]) => {
        if (categoryTotals[cat] > 0) {
          weightedScore += (categoryEarned[cat] / categoryTotals[cat]) * wt;
        }
      });
      weightedTotal += 100;
      weightedEarned += weightedScore;
    } else {
      classAssignments.forEach(a => {
        classTotal += Number(a.points);
        classEarned += Number(a.grade);
      });
      totalPoints += classTotal;
      totalEarned += classEarned;
    }
    countedClasses += 1;
  });

  const rollingGPA =
    totalPoints > 0 ? ((totalEarned / totalPoints) * 4).toFixed(2) : "N/A";
  const weightedGPA =
    weightedTotal > 0 ? ((weightedEarned / weightedTotal) * 4).toFixed(2) : "N/A";

  return { rollingGPA, weightedGPA };
}

export default function GPA() {
  const classes = loadData("classes", []);
  const assignments = loadData("assignments", []);
  const { rollingGPA, weightedGPA } = calculateGPA(classes, assignments);

  return (
    <>
      <h1>GPA Tracker</h1>
      <div className="gpa-summary">
        <div>
          <div>Rolling GPA</div>
          <div className="gpa-value">{rollingGPA}</div>
        </div>
        <div>
          <div>Weighted GPA</div>
          <div className="gpa-value">{weightedGPA}</div>
        </div>
      </div>
      <h2>Grades by Class</h2>
      {classes.length === 0 ? (
        <div>No classes yet.</div>
      ) : (
        <table className="details-table">
          <thead>
            <tr>
              <th>Class</th>
              <th>Average (%)</th>
              <th>GPA</th>
            </tr>
          </thead>
          <tbody>
            {classes.map(c => {
              const classAssignments = assignments.filter(
                a => a.classId === c.id && a.done && a.grade !== null && a.points
              );
              if (classAssignments.length === 0) {
                return (
                  <tr key={c.id}>
                    <td>{c.name}</td>
                    <td colSpan={2}>No grades yet</td>
                  </tr>
                );
              }
              let avg = 0;
              if (c.categoryWeights) {
                let categoryTotals = {};
                let categoryEarned = {};
                Object.keys(c.categoryWeights).forEach(cat => {
                  categoryTotals[cat] = 0;
                  categoryEarned[cat] = 0;
                });
                classAssignments.forEach(a => {
                  if (a.category && categoryTotals[a.category] !== undefined) {
                    categoryTotals[a.category] += Number(a.points);
                    categoryEarned[a.category] += Number(a.grade);
                  }
                });
                let weightedScore = 0;
                Object.entries(c.categoryWeights).forEach(([cat, wt]) => {
                  if (categoryTotals[cat] > 0) {
                    weightedScore += (categoryEarned[cat] / categoryTotals[cat]) * wt;
                  }
                });
                avg = weightedScore;
              } else {
                const pts = classAssignments.reduce(
                  (acc, a) => acc + Number(a.points),
                  0
                );
                const earned = classAssignments.reduce(
                  (acc, a) => acc + Number(a.grade),
                  0
                );
                avg = pts > 0 ? (earned / pts) * 100 : 0;
              }
              const classGPA = ((avg / 100) * 4).toFixed(2);
              return (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td>{avg.toFixed(1)}</td>
                  <td>{classGPA}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </>
  );
}
