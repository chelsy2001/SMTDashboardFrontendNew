import React, { useState } from "react";
import DashboardLayout from "../partials/DashboardLayout";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

/* ================== DUMMY DATA ================== */
const fourMDataDuration = [
  { name: "Man", value: 30 },
  { name: "Machine", value: 50 },
  { name: "Material", value: 20 },
  { name: "Method", value: 15 },
];

const fourMDataOccurrence = [
  { name: "Man", value: 5 },
  { name: "Machine", value: 9 },
  { name: "Material", value: 3 },
  { name: "Method", value: 2 },
];

const assemblyLines = {
  "Assembly Line 1": ["Station X", "Station Y"],
  "Assembly Line 2": ["Station Z"],
};

const smtLines = {
  "SMT Line 1": ["Station A", "Station B"],
  "SMT Line 2": ["Station C", "Station D"],
};

const tmpDuration = [
  { name: "Tool", value: 25 },
  { name: "Method", value: 40 },
  { name: "Process", value: 18 },
];

const tmpOccurrence = [
  { name: "Tool", value: 4 },
  { name: "Method", value: 7 },
  { name: "Process", value: 3 },
];

/* ================== COMMON UI ================== */
const Card = ({ children }) => (
  <div className="bg-white rounded-xl shadow">{children}</div>
);

const CardContent = ({ children }) => (
  <div className="p-4">{children}</div>
);

/* ================== FILTER BAR ================== */
const FilterBar = () => {
  const filters = ["Shift", "Day", "Week", "Month"];

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl shadow">
      <div className="flex gap-2">
        {filters.map((f, i) => (
          <button
            key={f}
            className={`px-4 py-2 rounded-lg text-sm font-medium
              ${i === 0 ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}
            `}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <input type="date" className="border rounded px-2 py-1 text-sm" />
        <input type="date" className="border rounded px-2 py-1 text-sm" />
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

/* ================== ANALYSIS ================== */
const M4DowntimeAnalysis = () => (
  <>
    <SectionHeader title="M4 Downtime Analysis" />
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="bg-white rounded-xl shadow">
        <CardContent>
          <h4 className="font-bold mb-2 text-black text-center">Duration Wise</h4>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={fourMDataDuration}>
              <XAxis dataKey="name" tick={{ fill: "#000", fontWeight: 300 , fontSize: 14 }}/>
              <YAxis tick={{ fill: "#000", fontWeight: 300 , fontSize: 14 }} />
              <Tooltip contentStyle={{ color: 'black' }}/>
              <Bar dataKey="value" fill="#60a5fa" radius={[6, 6, 0, 0]}/>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="bg-white rounded-xl shadow">
        <CardContent>
          <h4 className="font-bold mb-2 text-black text-center">Occurrence Wise</h4>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={fourMDataOccurrence}>
              <XAxis dataKey="name" tick={{ fill: "#000", fontWeight: 300 , fontSize: 14 }}/>
              <YAxis tick={{ fill: "#000", fontWeight: 300 , fontSize: 14 }} />
              <Tooltip contentStyle={{ color: 'black' }}/>
              <Bar dataKey="value" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  </>
);

const TPMDowntimeAnalysis = () => (
  <>
    <SectionHeader title="TPM Downtime Analysis" />
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="bg-white rounded-xl shadow">
        <CardContent>
          <h4 className="font-bold mb-2 text-black text-center">Duration Wise</h4>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={tmpDuration} layout="vertical">
              <XAxis type="number" tick={{ fill: "#000", fontWeight: 300 , fontSize: 14 }}/>
              <YAxis type="category" dataKey="name" tick={{ fill: "#000", fontWeight: 300 , fontSize: 14 }} />
              <Tooltip contentStyle={{ color: 'black' }}/>
              <Bar dataKey="value" fill="#60a5fa" radius={[6, 6, 0, 0]}/>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="bg-white rounded-xl shadow">
        <CardContent>
          <h4 className="font-bold mb-2 text-black text-center">Occurrence Wise</h4>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={tmpOccurrence} layout="vertical">
              <XAxis type="number" tick={{ fill: "#000", fontWeight: 300 , fontSize: 14 }}/>
              <YAxis type="category" dataKey="name" tick={{ fill: "#000", fontWeight: 300 , fontSize: 14 }} />
              <Tooltip contentStyle={{ color: 'black' }}/>
              <Bar dataKey="value" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  </>
);

/* ================== HEADER ================== */
const SectionHeader = ({ title }) => (
  <div className="flex items-center gap-3 mb-4">
    <div className="h-12 w-1.5 bg-blue-600 rounded"></div>
    <span className="text-xl md:text-2xl lg:text-3xl font-bold tracking-wide text-gray-900">
      {title}
    </span>
  </div>
);

/* ================== MAIN PAGE ================== */
const Downtime = () => {
  const [activeLineType, setActiveLineType] = useState("SMT");

  return (
    <DashboardLayout>
      <div className="p-6 space-y-8 bg-gray-100 min-h-screen">
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
            <M4DowntimeAnalysis />
            <TPMDowntimeAnalysis />
          </>
        )}

        {activeLineType === "ASSEMBLY" && (
          <>
            <M4DowntimeAnalysis />
             <TPMDowntimeAnalysis />
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Downtime;
