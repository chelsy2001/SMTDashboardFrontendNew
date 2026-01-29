import React, { useState, useMemo } from "react";
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
import DashboardLayout from "../partials/DashboardLayout";

export default function Home() {
  // ----- dummy date labels -----
  const dateLabels = [
    "10-Nov-25",
    "11-Nov-25",
    "12-Nov-25",
    "13-Nov-25",
    "14-Nov-25",
    "15-Nov-25",
    "16-Nov-25",
    "17-Nov-25",
    "18-Nov-25",
  ];

  // ----- PM Plan vs Actual -----
  const pmPlanActual = dateLabels.map((d, i) => ({
    date: d,
    plan: 6,
    actual: [4, 5, 5, 4, 5, 5, 4, 5, 5][i],
  }));

  // ----- HC Plan vs Actual (same structure) -----
  const hcPlanActual = pmPlanActual.map((d) => ({ ...d }));

  // ----- Breakdown Data -----
  const breakdownData = [
    { cause: "Hydraulic Leak", occurrence: 4, duration: 120 },
    { cause: "Sensor Fault", occurrence: 3, duration: 95 },
    { cause: "Cooling Failure", occurrence: 5, duration: 150 },
    { cause: "Clamp Issue", occurrence: 2, duration: 70 },
  ];

  // ----- Breakdown Table -----
  const breakdownTable = [
    {
      machine: "Machine A",
      mould: "M-101",
      cause: "Hydraulic Leak",
      occurrence: 4,
      duration: "120 min",
      date: "18-Nov-2025",
      shift: "A",
    },
    {
      machine: "Machine B",
      mould: "M-102",
      cause: "Sensor Fault",
      occurrence: 3,
      duration: "95 min",
      date: "17-Nov-2025",
      shift: "B",
    },
  ];

  // ----- PM Table -----
  const pmTable = [
    {
      mouldName: "M-101",
      equipment: "Machine A",
      nextPmDue: "25-Nov-2025",
      nextPmWarning: "20-Nov-2025",
      pmStatus: "Pending",
      productionDate: "18-Nov-2025",
      shift: "A",
      statusColor: "red",
    },
    {
      mouldName: "M-102",
      equipment: "Machine B",
      nextPmDue: "28-Nov-2025",
      nextPmWarning: "23-Nov-2025",
      pmStatus: "Scheduled",
      productionDate: "17-Nov-2025",
      shift: "B",
      statusColor: "yellow",
    },
    {
      mouldName: "M-102",
      equipment: "Machine B",
      nextPmDue: "28-Nov-2025",
      nextPmWarning: "23-Nov-2025",
      pmStatus: "Scheduled",
      productionDate: "17-Nov-2025",
      shift: "B",
      statusColor: "yellow",
    },
    {
      mouldName: "M-102",
      equipment: "Machine B",
      nextPmDue: "28-Nov-2025",
      nextPmWarning: "23-Nov-2025",
      pmStatus: "Scheduled",
      productionDate: "17-Nov-2025",
      shift: "B",
      statusColor: "yellow",
    },
    {
      mouldName: "M-102",
      equipment: "Machine B",
      nextPmDue: "28-Nov-2025",
      nextPmWarning: "23-Nov-2025",
      pmStatus: "Scheduled",
      productionDate: "17-Nov-2025",
      shift: "B",
      statusColor: "yellow",
    },
    {
      mouldName: "M-102",
      equipment: "Machine B",
      nextPmDue: "28-Nov-2025",
      nextPmWarning: "23-Nov-2025",
      pmStatus: "Scheduled",
      productionDate: "17-Nov-2025",
      shift: "B",
      statusColor: "yellow",
    },
    {
      mouldName: "M-102",
      equipment: "Machine B",
      nextPmDue: "28-Nov-2025",
      nextPmWarning: "23-Nov-2025",
      pmStatus: "Scheduled",
      productionDate: "17-Nov-2025",
      shift: "B",
      statusColor: "yellow",
    },
    {
      mouldName: "M-102",
      equipment: "Machine B",
      nextPmDue: "28-Nov-2025",
      nextPmWarning: "23-Nov-2025",
      pmStatus: "Scheduled",
      productionDate: "17-Nov-2025",
      shift: "B",
      statusColor: "yellow",
    },
    {
      mouldName: "M-102",
      equipment: "Machine B",
      nextPmDue: "28-Nov-2025",
      nextPmWarning: "23-Nov-2025",
      pmStatus: "Scheduled",
      productionDate: "17-Nov-2025",
      shift: "B",
      statusColor: "yellow",
    },
  ];

  // ----- HC Table -----
  const hcTable = [
    {
      mouldName: "M-101",
      equipment: "Machine A",
      nextDue: "--",
      warning: "--",
      status: "OK",
      productionDate: "18-Nov-2025",
      shift: "A",
      healthColor: "#86efac",
    },
  ];

  // ----- Spare Part Table -----
  const sparePartTable = [
    {
      mouldId: "M-101",
      category: "Hydraulic",
      partName: "Hydraulic Seal",
      availableQty: 12,
      usedQty: 3,
      location: "Rack A2",
    },
    {
      mouldId: "M-102",
      category: "Cooling",
      partName: "Cooling Nozzle",
      availableQty: 20,
      usedQty: 5,
      location: "Rack B1",
    },
  ];
function getCurrentShift() {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 14) return "A";
  if (hour >= 14 && hour < 22) return "B";
  return "C";
}

function formatDate(d) {
  return new Date(d).toISOString().split("T")[0];
}

function getLast7Days() {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(formatDate(d));
  }
  return days;
}

function getMonthDays() {
  const result = [];
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const total = new Date(year, month + 1, 0).getDate();

  for (let i = 1; i <= total; i++) {
    const d = new Date(year, month, i);
    result.push(formatDate(d));
  }

  return result;
}

  // ----- UI States -----
  const [filter, setFilter] = useState("week");
  const [rangeStart, setRangeStart] = useState("");
  const [rangeEnd, setRangeEnd] = useState("");

 const displayedPm = useMemo(() => {
  const today = formatDate(new Date());
  const currentShift = getCurrentShift();

  if (filter === "shift") {
    return pmPlanActual.filter((x) => x.date === today);
  }

  if (filter === "day") {
    return pmPlanActual.filter((x) => x.date === today);
  }

  if (filter === "week") {
    const last7 = getLast7Days();
    return pmPlanActual.filter((x) => last7.includes(formatDate(x.date)));
  }

  if (filter === "month") {
    const monthDays = getMonthDays();
    return pmPlanActual.filter((x) => monthDays.includes(formatDate(x.date)));
  }

  if (filter === "range" && rangeStart && rangeEnd) {
    const start = new Date(rangeStart);
    const end = new Date(rangeEnd);

    return pmPlanActual.filter((x) => {
      const d = new Date(x.date);
      return d >= start && d <= end;
    });
  }

  return pmPlanActual;
}, [filter, rangeStart, rangeEnd]);

const displayedHc = useMemo(() => displayedPm, [displayedPm]);
const filteredBreakdownTable = useMemo(() => {
  const today = formatDate(new Date());
  const currentShift = getCurrentShift();

  if (filter === "shift") {
    return breakdownTable.filter(
      (x) => formatDate(x.date) === today && x.shift === currentShift
    );
  }

  if (filter === "day") {
    return breakdownTable.filter((x) => formatDate(x.date) === today);
  }

  if (filter === "week") {
    const last7 = getLast7Days();
    return breakdownTable.filter((x) =>
      last7.includes(formatDate(x.date))
    );
  }

  if (filter === "month") {
    const monthDays = getMonthDays();
    return breakdownTable.filter((x) =>
      monthDays.includes(formatDate(x.date))
    );
  }

  if (filter === "range" && rangeStart && rangeEnd) {
    const start = new Date(rangeStart);
    const end = new Date(rangeEnd);
    return breakdownTable.filter((x) => {
      const d = new Date(x.date);
      return d >= start && d <= end;
    });
  }

  return breakdownTable;
}, [filter, rangeStart, rangeEnd]);
const filteredPmTable = useMemo(() => {
  const today = formatDate(new Date());
  const currentShift = getCurrentShift();

  if (filter === "shift") {
    return pmTable.filter(
      (x) => formatDate(x.productionDate) === today && x.shift === currentShift
    );
  }

  if (filter === "day") {
    return pmTable.filter((x) => formatDate(x.productionDate) === today);
  }

  if (filter === "week") {
    const last7 = getLast7Days();
    return pmTable.filter((x) =>
      last7.includes(formatDate(x.productionDate))
    );
  }

  if (filter === "month") {
    const monthDays = getMonthDays();
    return pmTable.filter((x) =>
      monthDays.includes(formatDate(x.productionDate))
    );
  }

  if (filter === "range") {
    const start = new Date(rangeStart);
    const end = new Date(rangeEnd);
    return pmTable.filter((x) => {
      const d = new Date(x.productionDate);
      return d >= start && d <= end;
    });
  }

  return pmTable;
}, [filter, rangeStart, rangeEnd]);


  // ----- Components -----
  const PillButton = ({ children, active, onClick }) => (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-md font-medium mr-2 text-white ${
        active ? "bg-red-600" : "bg-blue-600"
      }`}
    >
      {children}
    </button>
  );

  const StatusPill = ({ color }) => (
    <div
      className="w-8 h-8 rounded-sm"
      style={{ backgroundColor: color, border: "1px solid #333" }}
    />
  );

  return (
    <DashboardLayout>
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-9xl mx-auto">
          {/* ---- FILTERS ---- */}
          {/* Filter Buttons */}
          <div className="flex items-center mb-4">
            <PillButton active={filter === "shift"} onClick={() => setFilter("shift")}>
              Shift
            </PillButton>
            <PillButton active={filter === "day"} onClick={() => setFilter("day")}>
              Day
            </PillButton>
            <PillButton active={filter === "week"} onClick={() => setFilter("week")}>
              Week
            </PillButton>
            <PillButton active={filter === "month"} onClick={() => setFilter("month")}>
              Month
            </PillButton>

            <div className="ml-6 flex items-center">
              <span className="mr-2">Start Date</span>
              <input
                type="date"
                className="border p-1 rounded mr-4"
                value={rangeStart}
                onChange={(e) => setRangeStart(e.target.value)}
              />

              <span className="mr-2">End Date</span>
              <input
                type="date"
                className="border p-1 rounded mr-4"
                value={rangeEnd}
                onChange={(e) => setRangeEnd(e.target.value)}
              />

              <button
                className="bg-gray-800 text-white px-3 py-1 rounded"
                onClick={() => setFilter("range")}
              >
                Apply
              </button>
            </div>
          </div>
          {/* ---------------- PM + HC + BREAKDOWN + SPARE PARTS ---------------- */}
          <div className="grid grid-cols-12 gap-6">

            {/* ---------- PM CHART (full row) ---------- */}
<div className="col-span-12 bg-white shadow rounded-xl p-4 h-72">
  <h3 className="font-semibold text-center mb-2">Plant PM</h3>
  <div className="h-44">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={displayedPm}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="plan" fill="#2b6cb0" />
        <Bar dataKey="actual" fill="#dd6b20" />
      </BarChart>
    </ResponsiveContainer>
  </div>
</div>

{/* ---------- PM TABLE (full row) ---------- */}
<div className="col-span-12 bg-white shadow rounded-xl p-4 h-72 overflow-auto">
  <h3 className="font-semibold mb-2 text-center">Plant PM Status</h3>
  <table className="w-full text-sm table-fixed">
    <thead>
      <tr className="bg-blue-700 text-white">
        <th className="p-2">Mould Name</th>
        <th className="p-2">Equip</th>
        <th className="p-2">Next PM</th>
        <th className="p-2">Warning</th>
        <th className="p-2">Status</th>
        <th className="p-2">Prod Date</th>
        <th className="p-2">Shift</th>
        <th className="p-2">Badge</th>
      </tr>
    </thead>
    <tbody>
      {filteredPmTable.map((r, i) => (
        <tr key={i} className="border-b h-12">
          <td className="p-2">{r.mouldName}</td>
          <td className="p-2">{r.equipment}</td>
          <td className="p-2">{r.nextPmDue}</td>
          <td className="p-2">{r.nextPmWarning}</td>
          <td className="p-2">{r.pmStatus}</td>
          <td className="p-2">{r.productionDate}</td>
          <td className="p-2">{r.shift}</td>
          <td className="p-2">
            <StatusPill color={r.statusColor} />
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>


           {/* ---------- HC CHART (full row) ---------- */}
<div className="col-span-12 bg-white shadow rounded-xl p-4 h-72">
  <h3 className="font-semibold text-center mb-2">Plant Health Check</h3>
  <div className="h-44">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={displayedHc}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="plan" fill="#2b6cb0" />
        <Bar dataKey="actual" fill="#dd6b20" />
      </BarChart>
    </ResponsiveContainer>
  </div>
</div>

{/* ---------- HC TABLE (full row) ---------- */}
<div className="col-span-12 bg-white shadow rounded-xl p-4 h-72 overflow-auto">
  <h3 className="font-semibold mb-2 text-center">HC Table</h3>
  <table className="w-full text-sm table-fixed">
    <thead>
      <tr className="bg-blue-700 text-white">
        <th className="p-2">Mould</th>
        <th className="p-2">Equip</th>
        <th className="p-2">Next Due</th>
        <th className="p-2">Warning</th>
        <th className="p-2">Status</th>
        <th className="p-2">Prod Date</th>
        <th className="p-2">Shift</th>
      </tr>
    </thead>
    <tbody>
      {hcTable.map((r, i) => (
        <tr key={i} className="border-b h-12">
          <td className="p-2">{r.mouldName}</td>
          <td className="p-2">{r.equipment}</td>
          <td className="p-2">{r.nextDue}</td>
          <td className="p-2">{r.warning}</td>
          <td className="p-2">{r.status}</td>
          <td className="p-2">{r.productionDate}</td>
          <td className="p-2">{r.shift}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>


           {/* ---------- BREAKDOWN CHART (Full Row) ---------- */}
<div className="col-span-12 bg-white shadow-lg rounded-xl p-4 h-72">
  <h3 className="font-semibold text-center mb-2">
    Breakdown Occurrence & Duration
  </h3>

  <div className="h-44">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={breakdownData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="cause" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="occurrence" fill="#3182ce" name="Occurrence" />
        <Bar dataKey="duration" fill="#e53e3e" name="Duration (min)" />
      </BarChart>
    </ResponsiveContainer>
  </div>
</div>

{/* ---------- BREAKDOWN TABLE (Full Row) ---------- */}
<div className="col-span-12 bg-white shadow rounded-xl p-4 h-72 overflow-auto">
  <h3 className="font-semibold mb-2 text-center">Breakdown Table</h3>

  <table className="w-full text-sm">
    <thead>
      <tr className="bg-blue-700 text-white">
        <th className="p-2">Machine</th>
        <th className="p-2">Mould</th>
        <th className="p-2">Cause</th>
        <th className="p-2">Occur</th>
        <th className="p-2">Duration</th>
        <th className="p-2">Date</th>
        <th className="p-2">Shift</th>
      </tr>
    </thead>

    <tbody>
      {filteredBreakdownTable.map((r, i) => (
        <tr key={i} className="border-b h-12">
          <td className="p-2">{r.machine}</td>
          <td className="p-2">{r.mould}</td>
          <td className="p-2">{r.cause}</td>
          <td className="p-2">{r.occurrence}</td>
          <td className="p-2">{r.duration}</td>
          <td className="p-2">{r.date}</td>
          <td className="p-2">{r.shift}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>


            {/* ---------- SPARE PART TABLE ---------- */}
            <div className="col-span-12 bg-white shadow rounded-xl p-4 h-80 overflow-auto">
              <h3 className="font-semibold mb-2">Spare Part Consumption</h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-blue-700 text-white">
                    <th className="p-2">Mould ID</th>
                    <th className="p-2">Category</th>
                    <th className="p-2">Part Name</th>
                    <th className="p-2">Available Qty</th>
                    <th className="p-2">Used Qty</th>
                    <th className="p-2">Location</th>
                  </tr>
                </thead>
                <tbody>
                  {sparePartTable.map((r, i) => (
                    <tr key={i} className="border-b h-12">
                      <td className="p-2">{r.mouldId}</td>
                      <td className="p-2">{r.category}</td>
                      <td className="p-2">{r.partName}</td>
                      <td className="p-2">{r.availableQty}</td>
                      <td className="p-2">{r.usedQty}</td>
                      <td className="p-2">{r.location}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
