import { React, useState } from "react";
import DashboardLayout from "../partials/DashboardLayout";
import { useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { useEffect, useRef } from "react";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Factory } from "lucide-react";
import Slider from "react-slick";
import { LineChart, Line, CartesianGrid, Legend } from "recharts";
import { TrendingUp, Target, Clock, CheckCircle, XCircle } from "lucide-react";
/* ================== LOCAL CARD COMPONENT ================== */
const Card = ({ children, className = "" }) => (
  <div className={`  rounded-xl shadow ${className}`}>{children}</div>
);
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

const CardContent = ({ children, className = "" }) => (
  <div className={`p-4 ${className}`}>{children}</div>
);

const RejectionReason = () => (
  <>
    <SectionHeader title=" Rejection Reason Analysis" />
    <div className=" gap-6">
      <Card className="bg-white rounded-xl shadow">
        <CardContent>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={rejectionReasonData} layout="vertical">
              <XAxis type="number" tick={{ fill: "#000", fontWeight: 300, fontSize: 14 }} />
              <YAxis type="category" dataKey="name" tick={{ fill: "#000", fontWeight: 300, fontSize: 14 }} />
              <Tooltip contentStyle={{ color: 'black' }} />
              <Bar dataKey="value" fill="#60a5fa" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  </>
);

const QualityHourlyChart = () => (
  <Card className="bg-white rounded-xl shadow">
    <CardContent>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={qualityHourlyData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="hour" tick={{ fill: "#000", fontWeight: 300, fontSize: 14 }} />
          <YAxis domain={[80, 100]} tick={{ fill: "#000", fontWeight: 300, fontSize: 14 }} />
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
          <XAxis dataKey="hour" tick={{ fill: "#000", fontWeight: 300, fontSize: 14 }} />
          <YAxis domain={[80, 100]} tick={{ fill: "#000", fontWeight: 300, fontSize: 14 }} />
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
const metricConfig = {
  Plan: {
    icon: Target,
    bg: "from-blue-100 to-blue-50",
    text: "text-blue-700",
  },
  Actual: {
    icon: TrendingUp,
    bg: "from-indigo-100 to-indigo-50",
    text: "text-indigo-700",
  },
  Downtime: {
    icon: Clock,
    bg: "from-amber-100 to-amber-50",
    text: "text-amber-700",
  },
  Good: {
    icon: CheckCircle,
    bg: "from-green-100 to-green-50",
    text: "text-green-700",
  },
  Bad: {
    icon: XCircle,
    bg: "from-red-100 to-red-50",
    text: "text-red-700",
  },
};

const trendData = Array.from({ length: 8 }, (_, i) => ({
  time: `H${i + 1}`,
  OEE: 70 + Math.random() * 20,
}));

/* ---------- Circular Chart ---------- */
const CircularChart = ({ value, label, size = 120, strokeWidth = 12 }) => {
  const getColor = (val) => {
    if (val >= 90) return "#16a34a";
    if (val >= 75 && val < 90) return "#f59e0b";
    return "#dc2626";
  };

  const color = getColor(value);

  const data = [
    { name: "value", value },
    { name: "rest", value: 100 - value },
  ];

  return (
    <div className="flex flex-col items-center">
      <PieChart width={size} height={size}>
        <Pie
          data={data}
          innerRadius={size / 2 - strokeWidth}
          outerRadius={size / 2}
          startAngle={90}
          endAngle={-270}
          dataKey="value"
          stroke="none"
        >
          <Cell fill={color} />
          <Cell fill="#e5e7eb" />
        </Pie>
      </PieChart>

      {/* Center Text */}
      <div className="text-center -mt-20">
        <p className="text-xl font-bold text-center" style={{ color }}>
          {value}%
        </p>
        <p className="text-xs text-gray-500 text-center">{label}</p>
      </div>
    </div>
  );
};
const MetricCard = ({ title, value }) => {
  const Icon = metricConfig[title]?.icon;
  const bg = metricConfig[title]?.bg;
  const text = metricConfig[title]?.text;

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.04 }}
      transition={{ type: "spring", stiffness: 200 }}
    >
      <Card
        className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${bg} border`}
      >
        <CardContent className="flex flex-col items-center justify-center py-6 space-y-2">
          {/* Icon */}
          <div className="p-3 rounded-xl bg-white shadow">
            {Icon && <Icon size={22} className={text} />}
          </div>

          {/* Value */}
          <p className={`text-2xl font-bold ${text}`}>{value}</p>

          {/* Label */}
          <p className="text-sm font-medium text-gray-600">{title}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const TrendChart = ({
  title,
  data,
  dataKey,
  color = "#93c5fd",
  filterType,
}) => {

  const isHourly =
    filterType === "SHIFT" || filterType === "DAY";

  const formatHour = (utcString) => {
    const date = new Date(utcString);

    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB");
  };

  return (
    <Card className="mb-4 bg-white rounded-xl shadow-sm border">
      <CardContent>
        <h3 className="font-bold mb-3 text-black text-center">
          {title}
        </h3>

        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="label"
              interval={0}
              angle={-45}
              textAnchor="end"
              height={60}
            />

            <YAxis domain={[0, 100]} />

            <Tooltip
              formatter={(value) => `${value}%`}
              labelFormatter={(label) =>
                isHourly ? formatHour(label) : formatDate(label)
              }
            />

            <Area
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              fill={color}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};


const KpiBar = ({ label, value, color }) => (
  <div>
    <div className="flex justify-between text-xs mb-1">
      <span className="text-black font-medium">{label}</span>
      <span className="font-semibold text-black">{value.toFixed(1)}%</span>
    </div>
    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.8 }}
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
      />
    </div>
  </div>
);

const SectionHeader = ({ title }) => (
  <div className="flex items-center gap-3 mb-4">
    <div className="h-12 w-1.5 bg-blue-600 rounded"></div>
    <span className="text-xl md:text-2xl lg:text-3xl font-bold tracking-wide text-gray-900">
      {title}
    </span>
  </div>
);

/* ================== COMPONENTS ================== */
const FilterBar = ({
  filterType,
  setFilterType,
  shift,
  setShift,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}) => {

  const filters = ["Shift", "Day", "Week", "Month"];

  const [selectedShift, setSelectedShift] = useState("");

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl shadow">

      {/* LEFT – Time Filters + Shift Dropdown */}
      <div className="flex items-center gap-3">

        {/* Time Buttons */}
        <div className="flex gap-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => {
                setFilterType(f.toUpperCase());
                setStartDate("");
                setEndDate("");
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition
      ${filterType === f.toUpperCase()
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }
    `}
            >
              {f}
            </button>
          ))}
        </div>

        {/* 🔥 Shift Dropdown */}
        <select
          value={shift}
          onChange={(e) => setShift(e.target.value)}
          className="px-4 py-2 rounded-lg text-sm border bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">ALL</option>
          <option value="A">Shift A</option>
          <option value="B">Shift B</option>
          <option value="C">Shift C</option>
        </select>

      </div>

      {/* RIGHT – Date Range */}
      <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border">
        <span className="text-sm text-black font-medium">Start Date:</span>
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="px-2 py-1 text-sm rounded-md border" />

        <span className="text-sm text-black font-medium">End Date:</span>
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="px-2 py-1 text-sm rounded-md border" />
      </div>
    </div>
  );
};


const StationSummary = ({ lineData }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    {/* LEFT – OEE + APQ */}
    <Card className="bg-white rounded-xl shadow">
      <CardContent className="p-6space-y-10">
        <h3 className="text-lg font-bold text-gray-800 text-center">
          Line OEE (A, P, Q)
        </h3>

        <div className="flex justify-between items-center">
          <CircularChart value={lineData?.OEEPct || 0} label="OEE" size={180} strokeWidth={18} />

          <div className="flex gap-6">
            <CircularChart value={lineData?.AvailabilityPct || 0} label="A" size={110} />
            <CircularChart value={lineData?.PerformancePct || 0} label="P" size={110} />
            <CircularChart value={lineData?.QualityPct || 0} label="Q" size={110} />
          </div>
        </div>
      </CardContent>
    </Card>

    {/* RIGHT – LINE TRENDS */}
    <Card className="bg-white rounded-2xl shadow">
      <CardContent className="space-y-4">
        <h3 className="text-lg font-bold text-gray-800 text-center">
          Production Summary
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <MetricCard title="Plan" value={lineData?.PlanQty || 0} />
          <MetricCard title="Actual" value={lineData?.ActualQty || 0} />
          <MetricCard title="Downtime" value={`${lineData?.DowntimeMin || 0}m`} />
          <MetricCard title="Good" value={lineData?.GoodParts || 0} />
          <MetricCard title="Bad" value={lineData?.BadParts || 0} />
        </div>
      </CardContent>
    </Card>
  </div>
);



const downtimeData = [
  { name: "Loss 1", value: 45 },
  { name: "Loss 2", value: 30 },
  { name: "Loss 3", value: 65 },
  { name: "Loss 4", value: 20 },
];

const M4DowntimeAnalysis = () => (
  <div className="space-y-4">
    <SectionHeader title="Assembly Line M4 Downtime Analysis" />

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Duration */}
      <Card className="bg-white rounded-xl shadow">
        <CardContent>
          <h4 className="font-bold mb-2 text-black text-center">Duration Wise</h4>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={downtimeData}>
              <XAxis dataKey="name" tick={{ fill: "#000", fontWeight: 300, fontSize: 14 }} />
              <YAxis tick={{ fill: "#000", fontWeight: 300, fontSize: 14 }} />
              <Tooltip contentStyle={{ color: 'black' }} />
              <Bar dataKey="value" fill="#60a5fa" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Occurrence */}
      <Card className="bg-white rounded-xl shadow">
        <CardContent>
          <h4 className="font-bold mb-2 text-black text-center">Occurrence Wise</h4>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={downtimeData}>
              <XAxis dataKey="name" tick={{ fill: "#000", fontWeight: 300, fontSize: 14 }} />
              <YAxis tick={{ fill: "#000", fontWeight: 300, fontSize: 14 }} />
              <Tooltip contentStyle={{ color: 'black' }} />
              <Bar dataKey="value" fill="#f59e0b" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  </div>
);

const TPMDowntimeAnalysis = () => (
  <div className="space-y-4">
    <SectionHeader title="Assembly Line TPM Downtime Analysis" />

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Duration Wise */}
      <Card className="bg-white rounded-xl shadow">
        <CardContent>
          <h4 className="font-bold mb-2 text-black text-center">Duration Wise</h4>

          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={downtimeData}
              layout="vertical" // ⭐ IMPORTANT
              margin={{ left: 20 }}
            >
              <XAxis type="number" tick={{ fill: "#000", fontWeight: 300, fontSize: 14 }} />
              <YAxis type="category" dataKey="name" width={80} tick={{ fill: "#000", fontWeight: 300, fontSize: 14 }} />
              <Tooltip contentStyle={{ color: 'black' }} />
              <Bar
                dataKey="value"
                fill="#60a5fa"
                radius={[0, 6, 6, 0]} // right side rounded
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Occurrence Wise */}
      <Card className="bg-white rounded-xl shadow">
        <CardContent>
          <h4 className="font-bold mb-2 text-black text-center">Occurrence Wise</h4>

          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={downtimeData}
              layout="vertical" // ⭐ IMPORTANT
              margin={{ left: 20 }}
            >
              <XAxis type="number" tick={{ fill: "#000", fontWeight: 300, fontSize: 14 }} />
              <YAxis type="category" dataKey="name" width={80} tick={{ fill: "#000", fontWeight: 300, fontSize: 14 }} />
              <Tooltip contentStyle={{ color: 'black' }} />
              <Bar dataKey="value" fill="#f59e0b" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  </div>
);

const AssemblyLinePreformance = () => {

  const location = useLocation();
  const AssemblyLineName = location.state?.AssemblyLineName;
  const lineID = location.state?.lineID;

  const BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

  const [filterType, setFilterType] = useState("SHIFT");
  const [shift, setShift] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [lineData, setLineData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [trendData, setTrendData] = useState([]);


  const fetchAssemblyLineData = async () => {
    if (!lineID) return;

    try {
      setLoading(true);

      const apiFilterType =
        startDate && endDate ? "DATERANGE" : filterType;

      const response = await axios.get(
        `${BASE_URL}/AssemblyLine/assemblyLineWise-oee-apq`,
        {
          params: {
            filterType: apiFilterType,
            lineID: lineID,
            shift: shift || null,
            startDate: startDate || null,
            endDate: endDate || null,
          },
        }
      );

      if (response.data && response.data.length > 0) {
        setLineData(response.data[0]);
      } else {
        setLineData(null);
      }
    } catch (error) {
      console.error("Error fetching line data:", error);
      setLineData(null);
    } finally {
      setLoading(false);
    }
  };
  const fetchTrendData = async () => {
    if (!lineID) return;

    try {
      const apiFilterType =
        startDate && endDate ? "DATERANGE" : filterType;

      const response = await axios.get(
        `${BASE_URL}/AssemblyLine/assemblyLineWise-oee-apq_Trend`,
        {
          params: {
            filterType: apiFilterType,
            lineID: lineID,
            shift: shift || undefined,
            startDate: startDate || undefined,
            endDate: endDate || undefined,
          },
        }
      );

      if (response.data && response.data.length > 0) {

        const formatted = response.data.map((item) => {
          let label = "";

          if (apiFilterType === "SHIFT" || apiFilterType === "DAY") {
            // 🔥 Extract HH:mm directly from string (NO timezone conversion)
            label = item.TimeStamp.substring(11, 16);
          } else {
            label = item.ProdDate.substring(0, 10);
          }

          return {
            ...item,
            label,
          };
        });

        setTrendData(formatted);
      }

    } catch (error) {
      console.error("Error fetching trend data:", error);
    }
  };


  useEffect(() => {
    fetchAssemblyLineData();
    fetchTrendData();
  }, [filterType, shift, startDate, endDate, lineID]);


  return (
    <DashboardLayout>
      <div className="pl-6 pr-6 pb-6 space-y-8 bg-gray-100 min-h-screen">
        <FilterBar
          filterType={filterType}
          setFilterType={setFilterType}
          shift={shift}
          setShift={setShift}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
        />


        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-4 bg-white px-8 py-4 rounded-2xl shadow-md border border-gray-100">
            <div className="bg-blue-100 p-3 rounded-xl">
              <Factory className="text-blue-600 w-6 h-6" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {AssemblyLineName}
              </h2>
            </div>
          </div>
        </div>



        <StationSummary lineData={lineData} />

        {/* Line Trends */}
        <div className="space-y-4">
          <SectionHeader title="Assembly Line Trends" />

          <div className="gap-6">
            {/* LIGHT OEE */}
            <TrendChart
              title="OEE Trend"
              color="#93c5fd" // light blue
              light
              data={trendData}
              dataKey="OEE"
              filterType={filterType}
            />

            <TrendChart data={trendData}
              dataKey="Availability" filterType={filterType} title="Availability" color="#9b83b4" />
            <TrendChart data={trendData}
              dataKey="Performance" filterType={filterType} title="Performance" color="#acb5e0" />
            <TrendChart data={trendData}
              dataKey="Quality" filterType={filterType} title="Quality" color="#c52281" />
          </div>
        </div>

        <M4DowntimeAnalysis />

        <TPMDowntimeAnalysis />

        <SectionHeader title="Assembly Line Quality Planned vs Actual​" />
        <QualityHourlyChart />
        <SectionHeader title="Assembly Line Total Parts vs Rejection Part" />
        <QualityHourlyChart2 />
        <RejectionReason />

      </div>
    </DashboardLayout>
  );
};

export default AssemblyLinePreformance;
