import React, { useState } from "react";

import DashboardLayout from "../partials/DashboardLayout";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
  Legend
} from "recharts";
import { motion } from "framer-motion";

// ================== Dummy Data ==================

const assemblyLines = {
  "Assembly Line 1": ["Station X", "Station Y"],
  "Assembly Line 2": ["Station Z"],
};

const smtLines = {
  "SMT Line 1": ["Station A", "Station B"],
  "SMT Line 2": ["Station C", "Station D"],
};

const qualityHourlyData = [
  { hour: "08", expected: 95, actual: 92 },
  { hour: "09", expected: 95, actual: 90 },
  { hour: "10", expected: 95, actual: 94 },
  { hour: "11", expected: 95, actual: 91 },
  { hour: "12", expected: 95, actual: 93 },
];
const qualityHourlyData2 = [
  { hour: "08", TotalPart: 95, RejectedPart: 92 },
  { hour: "09", TotalPart: 95, RejectedPart: 90 },
  { hour: "10", TotalPart: 95, RejectedPart: 94 },
  { hour: "11", TotalPart: 95, RejectedPart: 91 },
  { hour: "12", TotalPart: 95, RejectedPart: 93 },
];

const rejectionReasonData = [
  { name: "Tool", value: 25 },
  { name: "Method", value: 40 },
  { name: "Process", value: 18 },
  { name: "Material", value: 18 },
  { name: "Other", value: 10 },
  { name: "ABC", value: 20 },
  { name: "DEF", value: 30 },
  { name: "XYZ", value: 35 },
];

/* ================== COMMON UI ================== */
const Card = ({ children }) => (
  <div className="bg-white rounded-xl shadow">{children}</div>
);

const CardContent = ({ children }) => (
  <div className="p-4">{children}</div>
);

const FilterBar = () => {
  const filters = ["Shift", "Day", "Week", "Month"];

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl shadow">
      {/* LEFT – Time Filters */}
      <div className="flex gap-2">
        {filters.map((f, i) => (
          <button
            key={f}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition
              ${
                i === 0
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }
            `}
          >
            {f}
          </button>
        ))}
      </div>

      {/* RIGHT – Date Range */}
      <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border">
        <span className="text-sm text-black font-medium">Start Date:</span>
        <input type="date" className="px-2 py-1 text-sm rounded-md border" />
        <span className="text-sm text-black font-medium">End Date:</span>
        <input type="date" className="px-2 py-1 text-sm rounded-md border" />
      </div>
    </div>
  );
};

/* ================== SMT / ASSEMBLY SWITCH ================== */
const LineTypeSwitch = ({ activeLineType, setActiveLineType }) => {
  return (
    <div className="inline-flex bg-white p-1 rounded-full shadow border">
      {["SMT", "ASSEMBLY"].map((type) => {
        const isActive = activeLineType === type;

        return (
          <button
            key={type}
            onClick={() => setActiveLineType(type)}
            className={`relative px-6 py-2 text-sm font-semibold rounded-full
              ${isActive ? "text-white" : "text-gray-600"}
            `}
          >
            {isActive && (
              <motion.span
                layoutId="lineSwitch"
                className="absolute inset-0 bg-blue-600 rounded-full"
              />
            )}
            <span className="relative z-10">
              {type === "SMT" ? "SMT Lines" : "Assembly Lines"}
            </span>
          </button>
        );
      })}
    </div>
  );
};
/* ================== HEADER ================== */
const SectionHeader = ({ title }) => (
  <div className="flex items-center gap-3 mb-4">
    <div className="h-12 w-1.5 bg-blue-600 rounded"></div>
    <span className="text-xl md:text-2xl lg:text-3xl font-bold tracking-wide text-gray-900">
      {title}
    </span>
  </div>
);
const QualityHourlyChart = () => (
  <Card className="bg-white rounded-xl shadow">
    <CardContent>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={qualityHourlyData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="hour" tick={{ fill: "#000", fontWeight: 300 , fontSize: 14 }} />
          <YAxis domain={[80, 100]} tick={{ fill: "#000", fontWeight: 300 , fontSize: 14 }}/>
          <Tooltip contentStyle={{ color: 'black' }} />
          <Legend />

          <Line
            type="monotone"
            dataKey="expected"
            stroke="#25c7eb"
            strokeWidth={2}
            dot={false}
          />

          <Line
            type="monotone"
            dataKey="actual"
            stroke="#3b1d82"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

const QualityHourlyChart2 = () => (
  <Card className="bg-white rounded-xl shadow">
    <CardContent>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={qualityHourlyData2}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="hour" tick={{ fill: "#000", fontWeight: 300 , fontSize: 14 }}/>
          <YAxis domain={[80, 100]} tick={{ fill: "#000", fontWeight: 300 , fontSize: 14 }}/>
          <Tooltip contentStyle={{ color: 'black' }} />
          <Legend />

          <Line
            type="monotone"
            dataKey="TotalPart"
            stroke="#9925eb"
            strokeWidth={2}
            dot={false}
          />

          <Line
            type="monotone"
            dataKey="RejectedPart"
            stroke="#16a39e"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);
/* ================== LINE / STATION FILTER ================== */
const LineStationFilter = ({ activeLineType }) => {
  const dataSource = activeLineType === "SMT" ? smtLines : assemblyLines;
  const [line, setLine] = useState("");
  const [station, setStation] = useState("");

  return (
    <div className="bg-white p-4 rounded-xl shadow flex flex-wrap items-center gap-6">
  {/* LINE */}
  <div className="flex items-center gap-3 min-w-[320px]">
    <label className="text-sm font-semibold text-gray-700 whitespace-nowrap">
      {activeLineType} Line
    </label>

    <select
      value={line}
      onChange={(e) => {
        setLine(e.target.value);
        setStation("");
      }}
      className="
        w-full
        px-4 py-2
        rounded-lg
        border border-gray-300
        text-sm text-gray-800
        bg-white
        focus:outline-none
        focus:ring-2 focus:ring-blue-500
        hover:border-blue-400
        transition
      "
    >
      <option value="">Select Line</option>
      {Object.keys(dataSource).map((l) => (
        <option key={l} value={l}>
          {l}
        </option>
      ))}
    </select>
  </div>

  {/* STATION */}
  <div className="flex items-center gap-3 min-w-[320px]">
    <label className="text-sm font-semibold text-gray-700 whitespace-nowrap">
      Station
    </label>

    <select
      value={station}
      onChange={(e) => setStation(e.target.value)}
      disabled={!line}
      className="
        w-full
        px-4 py-2
        rounded-lg
        border border-gray-300
        text-sm text-gray-800
        bg-white
        focus:outline-none
        focus:ring-2 focus:ring-blue-500
        hover:border-blue-400
        transition
        disabled:bg-gray-100
        disabled:text-gray-400
        disabled:cursor-not-allowed
      "
    >
      <option value="">Select Station</option>
      {line &&
        dataSource[line].map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
    </select>
  </div>
</div>

  );
};
const RejectionReason = () => (
  <>
    <SectionHeader title=" Rejection Reason Analysis" />
    <div className=" gap-6">
      <Card className="bg-white rounded-xl shadow">
        <CardContent>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={rejectionReasonData} layout="vertical">
              <XAxis type="number" tick={{ fill: "#000", fontWeight: 300 , fontSize: 14 }}/>
              <YAxis type="category" dataKey="name" tick={{ fill: "#000", fontWeight: 300 , fontSize: 14 }} />
              <Tooltip contentStyle={{ color: 'black' }}/>
              <Bar dataKey="value" fill="#60a5fa" radius={[6, 6, 0, 0]}/>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  </>
);
const Quality = () => {
  const [activeLineType, setActiveLineType] = useState("SMT");
  return (
    <DashboardLayout>
      <div className="pl-6 pr-6 pb-6 space-y-8 bg-gray-100 min-h-screen">
         <FilterBar />
         <div className="bg-white flex justify-between p-2 rounded-lg shadow">
          <LineStationFilter activeLineType={activeLineType} />
          <LineTypeSwitch
            activeLineType={activeLineType}
            setActiveLineType={setActiveLineType}
          />
        </div>
        {/* CONDITIONAL DATA */}
        {activeLineType === "SMT" && (
          <>
          <SectionHeader title="Quality Expected vs Actual​" />
          <QualityHourlyChart />
          <SectionHeader title="Total Parts vs Rejection Part" />
          <QualityHourlyChart2 />
          <RejectionReason />
          </>
        )}

        {activeLineType === "ASSEMBLY" && (
          <>
          <SectionHeader title="Quality Expected vs Actual​" />
          <QualityHourlyChart />
          <SectionHeader title="Total Parts vs Rejection Part" />
          <QualityHourlyChart2 />
          <RejectionReason />
          </>
        )}
      </div>
    </DashboardLayout>
  )
}

export default Quality