import React, { useState } from "react";
import DashboardLayout from "../../partials/DashboardLayout";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useNavigate } from "react-router-dom";


export default function MouldMaintenanceHistory() {
  const dummyChartData = [
    { date: "10-Nov-25", plan: 6, actual: 4 },
    { date: "11-Nov-25", plan: 6, actual: 5 },
    { date: "12-Nov-25", plan: 6, actual: 5 },
    { date: "13-Nov-25", plan: 6, actual: 4 },
    { date: "14-Nov-25", plan: 6, actual: 5 },
    { date: "15-Nov-25", plan: 6, actual: 5 },
    { date: "16-Nov-25", plan: 6, actual: 4 },
    { date: "17-Nov-25", plan: 6, actual: 5 },
    { date: "18-Nov-25", plan: 6, actual: 5 },
  ];

  const stats = [
    { label: "Average Time of PM", value: 240 },
    { label: "Max Time of PM", value: 320 },
    { label: "Min Time of PM", value: 120 },
    { label: "Total No of PM", value: 32 },
    { label: "On Time PM", value: 52 },
    { label: "Delayed PM", value: 2 },
  ];

  const [rangeStart, setRangeStart] = useState("");
  const [rangeEnd, setRangeEnd] = useState("");
const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="p-6 w-full text-gray-800">

        {/* TOP SECTION */}
        <div className="flex flex-wrap items-center justify-between bg-white p-4 rounded-xl shadow mb-6">

          {/* BUTTONS */}
          <div className="flex gap-3 flex-wrap">
            <button className="px-6 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 shadow">
              PM
            </button>
            <button
  className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 shadow"
  onClick={() => navigate("/HCHistory")}
>
  HC
</button>
            <button className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 shadow" onClick={() => navigate("/MouldBreakdownHistory")}>
              Breakdown
            </button>
            <button className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 shadow" onClick={() => navigate("/MouldSparePartHistory")}>
              Spare Part
            </button>
          </div>

          {/* DATE FILTER */}
          <div className="flex items-center gap-4 mt-4 sm:mt-0">
            <div>
              <label className="block text-sm font-semibold">Start Date</label>
              <input
                type="date"
                className="border px-3 py-2 rounded-lg shadow-sm w-40"
                value={rangeStart}
                onChange={(e) => setRangeStart(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold">End Date</label>
              <input
                type="date"
                className="border px-3 py-2 rounded-lg shadow-sm w-40"
                value={rangeEnd}
                onChange={(e) => setRangeEnd(e.target.value)}
              />
            </div>

            <button
              className="bg-gray-900 text-white px-4 mt-5 py-2 rounded-lg shadow hover:bg-gray-700"
              onClick={() => console.log("Apply clicked")}
            >
              Apply
            </button>
          </div>
        </div>

        {/* TITLE */}
        <h2 className="text-center text-3xl font-bold mb-6 text-gray-900 tracking-wide">
          Mould Preventive Maintenance
        </h2>

        {/* CHART */}
        <div className="w-full h-80 bg-white rounded-xl shadow-md p-5 mb-10">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dummyChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="plan" fill="#1E3A8A" radius={[4, 4, 0, 0]} />
              <Bar dataKey="actual" fill="#F97316" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-5 mb-10">
          {stats.map((s, idx) => (
            <div
              key={idx}
              className="bg-blue-700 text-white p-5 rounded-2xl shadow-lg text-center"
            >
              <p className="font-semibold text-sm">{s.label}</p>
              <div className="bg-white text-blue-800 mt-4 rounded-lg py-4 text-3xl font-extrabold shadow">
                {s.value}
              </div>
            </div>
          ))}
        </div>

        {/* TABLE TITLE */}
        <h3 className="bg-gray-200 text-center text-lg p-3 rounded-lg font-semibold shadow mb-3">
          Mould Preventive Maintenance Details
        </h3>

        {/* TABLE */}
        <div className="overflow-auto rounded-lg shadow-lg border">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-blue-900 text-white text-xs uppercase">
              <tr>
                {[
                  "UID",
                  "Eq. ID",
                  "Mould ID",
                  "Mould Life",
                  "Mould Actual Life",
                  "PM Warning",
                  "Next PM Due Date",
                  "Next PM Warning Date",
                  "Mould Life Status",
                  "Mould PM Status",
                  "Mould Status",
                ].map((h, i) => (
                  <th key={i} className="px-4 py-3 border">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {[...Array(5)].map((_, i) => (
                <tr key={i} className="text-center odd:bg-gray-100 even:bg-white hover:bg-gray-200 cursor-pointer">
                  {[...Array(11)].map((_, j) => (
                    <td key={j} className="border px-3 py-3">
                      Dummy
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
