import { useEffect, useState } from "react";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

import "../styles/Recruiterpage.css";

export default function RecruiterAnalytics() {

  /* ✅ REQUIRED STATES */
  const [statusData, setStatusData] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);
  const [applicants, setApplicants] = useState([]);

  /* ✅ FETCH REAL DATA */
  useEffect(() => {
    fetch("https://skill-learn-job.onrender.com/recruiter-analytics")
      .then(res => res.json())
      .then(data => {
        setStatusData(data.status || []);
        setPerformanceData(data.performance || []);
        setApplicants(data.recentApplicants || []);
      })
      .catch(() => {
        console.log("API error");
      });
  }, []);

  const COLORS = ["#22c55e", "#ef4444", "#facc15"];

  return (
    <div className="analytics-wrapper">

      <h2 className="analytics-title">Recruiter Analytics Dashboard</h2>

      <div className="analytics-grid-2">

        {/* PIE */}
        <div className="chart-card">
          <h3>Application Status</h3>

          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={statusData} dataKey="value" outerRadius={90} label>
                {statusData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>


        {/* LINE */}
        <div className="chart-card">
          <h3>Monthly Applications</h3>

          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="apps"
                stroke="#3b82f6"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>


      {/* TABLE */}
      <div className="table-card">
        <h3>Recent Applicants</h3>

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {applicants.map((a, i) => (
              <tr key={i}>
                <td>{a.name}</td>
                <td>{a.role}</td>
                <td className={`status ${a.status?.toLowerCase()}`}>
                  {a.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
