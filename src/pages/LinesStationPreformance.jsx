import { React, useState, useEffect } from "react";
import DashboardLayout from "../partials/DashboardLayout";
import { useLocation } from "react-router-dom";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;
import { motion } from "framer-motion";
import { Factory } from "lucide-react";
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
import Slider from "react-slick";
import { LineChart, Line, CartesianGrid, Legend } from "recharts";
import { TrendingUp, Target, Clock, CheckCircle, XCircle } from "lucide-react";
/* ================== LOCAL CARD COMPONENT ================== */
const Card = ({ children, className = "" }) => (
  <div className={`  rounded-xl shadow ${className}`}>{children}</div>
);
const CardContent = ({ children, className = "" }) => (
  <div className={`p-4 ${className}`}>{children}</div>
);

const RejectionReason = ({ data = [], loading }) => {
  if (loading) return <div className="text-center py-6">Loading Rejection Data...</div>;
  if (!data || data.length === 0) return <div className="text-center py-6">No Rejection Data Available</div>;
  return (
  <>
    <SectionHeader title=" Rejection Reason Analysis" />
    <div className=" gap-6">
      <Card className="bg-white rounded-xl shadow">
        <CardContent>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data} layout="vertical">
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
};

const QualityHourlyChart = ({ data = [], loading }) => {
  if (loading) return <div className="text-center py-6">Loading Plan vs Actual...</div>;
  if (!data || data.length === 0) return <div className="text-center py-6">No Plan vs Actual Data</div>;
  return (
  <Card className="bg-white rounded-xl shadow">
    <CardContent>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
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
};

const QualityHourlyChart2 = ({ data = [], loading }) => {
  if (loading) return <div className="text-center py-6">Loading Good vs Rejection...</div>;
  if (!data || data.length === 0) return <div className="text-center py-6">No Good vs Rejection Data</div>;
  return (
  <Card className="bg-white rounded-xl shadow">
    <CardContent>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
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
};
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

/* ---------- Circular Chart ---------- */
const CircularChart = ({ value, label, size = 120, strokeWidth = 12 }) => {
  // const getColor = (val) => {
  //   if (val >=75 ) return "#dc2626"; // red
  //   if (val >= 76 && val <= 90) return "#f59e0b"; // yellow
  //   return "#16a34a"; // green
  // };
  const getColor = (val) => {
    if (val >= 90 ) return "#16a34a";
    if (val >=75 && val < 90) return "#f59e0b";
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
  dataKey = "OEE",
  data = [],
  color = "#93c5fd",
  light = false,
  loading,
}) => {
  const gradientId = `gradient-${title.replace(/\s+/g, "")}`;
  if (loading) return <div className="text-center py-6">Loading {title}...</div>;
  if (!data || data.length === 0) return <div className="text-center py-6">No {title} Data</div>;

  return (
    <Card className="mb-4 bg-white rounded-xl shadow-sm border">
      <CardContent>
        <h3 className="font-bold mb-3 text-black text-center">
          {title}
        </h3>

        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={color}
                  stopOpacity={light ? 0.45 : 0.8}
                />
                <stop
                  offset="95%"
                  stopColor={color}
                  stopOpacity={light ? 0.05 : 0.15}
                />
              </linearGradient>
            </defs>

            <XAxis dataKey="time" tick={{ fill: "#000", fontWeight: 300 , fontSize: 14 }}/>
            <YAxis domain={[0, 100]} tick={{ fill: "#000", fontWeight: 300 , fontSize: 14 }}/>
            <Tooltip contentStyle={{ color: 'black' }} />

            <Area
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              fill={`url(#${gradientId})`}
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
  const filters = ["SHIFT", "DAY", "WEEK", "MONTH"];

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl shadow">

      <div className="flex items-center gap-3">

        <div className="flex gap-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilterType(f.toUpperCase())}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition
      ${filterType === f.toUpperCase()
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"}
    `}
            >
              {f}
            </button>
          ))}
        </div>

        <select
          value={shift}
          onChange={(e) => setShift(e.target.value)}
          className="px-3 py-2 rounded-lg text-sm border bg-gray-100"
        >
          <option value="">ALL</option>
          <option value="A">Shift A</option>
          <option value="B">Shift B</option>
          <option value="C">Shift C</option>
        </select>
      </div>

      <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border">
        <span className="text-sm font-medium">Start:</span>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />

        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>
    </div>
  );
};



const StationSummary = ({ oeeData, loading }) => {
  if (loading) return <div className="text-center py-8">Loading Station OEE...</div>;
  const d = oeeData || {};
  const oee = Number(d.OEEPct ?? d.OEE ?? 0);
  const avail = Number(d.AvailabilityPct ?? d.A ?? 0);
  const perf = Number(d.PerformancePct ?? d.P ?? 0);
  const qual = Number(d.QualityPct ?? d.Q ?? 0);
  const plan = d.Plan ?? d.PlanQty ?? "0";
  const actual = d.Actual ?? d.ActualQty ?? "0";
  const downtime = d.Downtime ?? d.DowntimeMin ?? "0";
  const good = d.Good ?? d.GoodQty ?? "0";
  const bad = d.Bad ?? d.BadQty ?? "0";

  return (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <Card className="bg-white rounded-xl shadow">
      <CardContent className="p-6space-y-10">
        <h3 className="text-lg font-bold text-gray-800 text-center">
          Station OEE (A, P, Q)
        </h3>
        <div className="flex justify-between items-center">
          <CircularChart value={oee} label="OEE" size={180} strokeWidth={18} />
          <div className="flex gap-6">
            <CircularChart value={avail} label="A" size={110} />
            <CircularChart value={perf} label="P" size={110} />
            <CircularChart value={qual} label="Q" size={110} />
          </div>
        </div>
      </CardContent>
    </Card>

    <Card className="bg-white rounded-2xl shadow">
      <CardContent className="space-y-4">
        <h3 className="text-lg font-bold text-gray-800 text-center">
          Production Summary
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <MetricCard title="Plan" value={String(plan)} />
          <MetricCard title="Actual" value={String(actual)} />
          <MetricCard title="Downtime" value={String(downtime)} />
          <MetricCard title="Good" value={String(good)} />
          <MetricCard title="Bad" value={String(bad)} />
        </div>
      </CardContent>
    </Card>
  </div>
  );
};



const M4DowntimeAnalysis = ({ durationData = [], occurrenceData = [], loading }) => {
  if (loading) return <div className="text-center py-6">Loading 4M Loss...</div>;
  return (
  <div className="space-y-4">
    <SectionHeader title="Station 4M Downtime Analysis" />

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="bg-white rounded-xl shadow">
        <CardContent>
          <h4 className="font-bold mb-2 text-black text-center">Duration Wise</h4>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={durationData}>
              <XAxis dataKey="name" tick={{ fill: "#000", fontWeight: 300 , fontSize: 14 }}/>
              <YAxis tick={{ fill: "#000", fontWeight: 300 , fontSize: 14 }}/>
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
            <BarChart data={occurrenceData}>
              <XAxis dataKey="name" tick={{ fill: "#000", fontWeight: 300 , fontSize: 14 }}/>
              <YAxis tick={{ fill: "#000", fontWeight: 300 , fontSize: 14 }}/>
              <Tooltip contentStyle={{ color: 'black' }} />
              <Bar dataKey="value" fill="#f59e0b" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  </div>
  );
};

const TPMDowntimeAnalysis = ({ durationData = [], occurrenceData = [], loading }) => {
  const renderChart = (data, title, color) => {
    const sortedData = [...data].sort((a, b) => b.value - a.value);
    const chartHeight = Math.max(sortedData.length * 42, 280);

    return (
      <Card className="bg-white rounded-xl shadow-lg border border-gray-100">
        <CardContent className="p-6">
          <h4 className="font-semibold text-gray-800 text-center mb-4">{title}</h4>
          <div className="overflow-y-auto overflow-x-hidden" style={{ maxHeight: "400px" }}>
            <div style={{ height: chartHeight, minHeight: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={sortedData}
                  layout="vertical"
                  margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
                >
                  <XAxis type="number" tick={{ fill: "#374151", fontSize: 12 }} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={130}
                    tick={{ fill: "#374151", fontSize: 12 }}
                    tickFormatter={(val) => (val && val.length > 24 ? `${val.substring(0, 24)}...` : val)}
                  />
                  <Tooltip contentStyle={{ color: "black", maxWidth: 280 }} />
                  <Bar dataKey="value" fill={color} radius={[0, 8, 8, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (loading) return <div className="text-center py-6">Loading TPM Loss...</div>;
  return (
    <div className="space-y-4">
      <SectionHeader title="Station TPM Downtime Analysis" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {renderChart(durationData, "Duration Wise (Minutes)", "#60a5fa")}
        {renderChart(occurrenceData, "Occurrence Wise (Count)", "#f59e0b")}
      </div>
    </div>
  );
};

const LinesStationPreformance = () => {
  const location = useLocation();
  const lineId = location.state?.lineId;
  const stationId = location.state?.stationId;
  const stationName = location.state?.stationName;

  const [filterType, setFilterType] = useState("SHIFT");
  const [shift, setShift] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [oeeData, setOeeData] = useState(null);
  const [trendData, setTrendData] = useState([]);
  const [planActualData, setPlanActualData] = useState([]);
  const [goodRejectData, setGoodRejectData] = useState([]);
  const [m4DurationData, setM4DurationData] = useState([]);
  const [m4OccurrenceData, setM4OccurrenceData] = useState([]);
  const [tpmDurationData, setTpmDurationData] = useState([]);
  const [tpmOccurrenceData, setTpmOccurrenceData] = useState([]);
  const [rejectionReasonData, setRejectionReasonData] = useState([]);

  const [loadingOEE, setLoadingOEE] = useState(false);
  const [loadingTrend, setLoadingTrend] = useState(false);
  const [loadingQuality, setLoadingQuality] = useState(false);
  const [loadingM4, setLoadingM4] = useState(false);
  const [loadingTPM, setLoadingTPM] = useState(false);
  const [loadingRejection, setLoadingRejection] = useState(false);

  const buildParams = () => {
    const params = { LineID: lineId, StationID: stationId, FilterType: filterType };
    if (shift) params.Shift = shift;
    if (startDate) params.StartDate = startDate;
    if (endDate) params.EndDate = endDate;
    return params;
  };

  const fetchStationLevelOEE = async () => {
    if (!lineId || !stationId) return;
    try {
      setLoadingOEE(true);
      const params = buildParams();
      const res = await axios.get(`${BASE_URL}/smtStation/SMTStationLevelOEE`, { params });
      const data = res.data?.data ?? res.data;
      setOeeData(Array.isArray(data) && data[0] ? data[0] : data);
    } catch (err) {
      console.error("SMT Station Level OEE error:", err);
    } finally {
      setLoadingOEE(false);
    }
  };

  const fetchStationHourlyAPQOEE = async () => {
    if (!lineId || !stationId) return;
    try {
      setLoadingTrend(true);
      const params = { LineID: lineId, StationID: stationId, FilterType: filterType };
      if (shift) params.Shift = shift;
      const res = await axios.get(`${BASE_URL}/smtStation/SMTStationHourlyAPQOEE`, { params });
      const data = res.data?.data ?? res.data ?? [];
      const formatted = Array.isArray(data)
        ? data.map((item, i) => {
            // Get actual date/time from API - check multiple possible field names
            let timeValue = item.TimeSlot ?? item.HourSlot ?? item.Hour ?? item.HourNo ?? `H${i + 1}`;
            
            // If we have a date field (for WEEK/MONTH), format it properly
            if (filterType === "WEEK" || filterType === "MONTH") {
              timeValue = item.Date ?? item.ProdDate ?? timeValue;
              // Format date to show only date portion
              if (typeof timeValue === 'string' && timeValue.includes(' ')) {
                timeValue = timeValue.split(' ')[0];
              }
              if (typeof timeValue === 'string' && timeValue.match(/^\d{4}-\d{2}-\d{2}/)) {
                try {
                  const date = new Date(timeValue);
                  if (!isNaN(date.getTime())) {
                    const day = date.getDate();
                    const month = date.getMonth() + 1;
                    timeValue = `${day}/${month}`;
                  }
                } catch (e) {}
              }
            }
            
            return {
              time: timeValue,
              OEE: item.OEEPct ?? 0,
              Availability: item.AvailabilityPct ?? 0,
              Performance: item.PerformancePct ?? 0,
              Quality: item.QualityPct ?? 0,
            };
          })
        : [];
      setTrendData(formatted);
    } catch (err) {
      console.error("SMT Station Hourly APQ OEE error:", err);
    } finally {
      setLoadingTrend(false);
    }
  };

  const fetch4MLoss = async () => {
    if (!lineId || !stationId) return;
    try {
      setLoadingM4(true);
      const params = buildParams();
      const res = await axios.get(`${BASE_URL}/smtStation/SMTStation4MLoss`, { params });
      const data = res.data?.data ?? res.data ?? [];
      if (Array.isArray(data)) {
        setM4DurationData(data.map((item) => ({ name: item.LossType ?? item.LossName, value: item.TotalDuration ?? 0 })));
        setM4OccurrenceData(data.map((item) => ({ name: item.LossType ?? item.LossName, value: item.Occurrence ?? 0 })));
      }
    } catch (err) {
      console.error("4M Loss error:", err);
    } finally {
      setLoadingM4(false);
    }
  };

  const fetchTPMLoss = async () => {
    if (!lineId || !stationId) return;
    try {
      setLoadingTPM(true);
      const body = buildParams();
      const res = await axios.post(`${BASE_URL}/smtStation/SMTStationTPMLossAnalysis`, body);
      const data = res.data?.data ?? res.data ?? [];
      if (Array.isArray(data)) {
        setTpmDurationData(data.map((item) => ({ name: item.LossName ?? item.LossType, value: item.DurationMin ?? 0 })));
        setTpmOccurrenceData(data.map((item) => ({ name: item.LossName ?? item.LossType, value: item.OccurrenceCount ?? item.Occurrence ?? 0 })));
      }
    } catch (err) {
      console.error("TPM Loss error:", err);
    } finally {
      setLoadingTPM(false);
    }
  };

  const fetchGoodVsRejection = async () => {
    if (!lineId || !stationId) return;
    try {
      setLoadingQuality(true);
      const body = buildParams();
      const res = await axios.post(`${BASE_URL}/smtStation/SMTStationHourlyGoodVsRejection`, body);
      const data = res.data?.data ?? res.data ?? [];
      const formatted = Array.isArray(data)
        ? data.map((item, i) => {
            // Get actual date/time from API - check multiple possible field names
            let hourValue = item.TimeSlot ?? item.HourSlot ?? item.Hour ?? item.HourNo ?? `H${i + 1}`;
            
            // If we have a date field (for WEEK/MONTH), format it properly
            if (filterType === "WEEK" || filterType === "MONTH") {
              hourValue = item.Date ?? item.ProdDate ?? hourValue;
              // Format date to show only date portion
              if (typeof hourValue === 'string' && hourValue.includes(' ')) {
                hourValue = hourValue.split(' ')[0];
              }
              if (typeof hourValue === 'string' && hourValue.match(/^\d{4}-\d{2}-\d{2}/)) {
                try {
                  const date = new Date(hourValue);
                  if (!isNaN(date.getTime())) {
                    const day = date.getDate();
                    const month = date.getMonth() + 1;
                    hourValue = `${day}/${month}`;
                  }
                } catch (e) {}
              }
            }
            
            return {
              hour: hourValue,
              TotalPart: item.GoodQty ?? item.TotalQty ?? 0,
              RejectedPart: item.RejectionQty ?? item.BadQty ?? 0,
            };
          })
        : [];
      setGoodRejectData(formatted);
    } catch (err) {
      console.error("Good vs Rejection error:", err);
    } finally {
      setLoadingQuality(false);
    }
  };

  const fetchPlanVsActual = async () => {
    if (!lineId || !stationId) return;
    try {
      setLoadingQuality(true);
      const body = buildParams();
      const res = await axios.post(`${BASE_URL}/smtStation/SMTStationHourlyPlanVsActual`, body);
      const data = res.data?.data ?? res.data ?? [];
      const formatted = Array.isArray(data)
        ? data.map((item, i) => {
            // Get actual date/time from API - check multiple possible field names
            let hourValue = item.TimeSlot ?? item.HourSlot ?? item.Hour ?? item.HourNo ?? `H${i + 1}`;
            
            // If we have a date field (for WEEK/MONTH), format it properly
            if (filterType === "WEEK" || filterType === "MONTH") {
              hourValue = item.Date ?? item.ProdDate ?? hourValue;
              // Format date to show only date portion
              if (typeof hourValue === 'string' && hourValue.includes(' ')) {
                hourValue = hourValue.split(' ')[0];
              }
              if (typeof hourValue === 'string' && hourValue.match(/^\d{4}-\d{2}-\d{2}/)) {
                try {
                  const date = new Date(hourValue);
                  if (!isNaN(date.getTime())) {
                    const day = date.getDate();
                    const month = date.getMonth() + 1;
                    hourValue = `${day}/${month}`;
                  }
                } catch (e) {}
              }
            }
            
            return {
              hour: hourValue,
              expected: item.PlanQty ?? item.Plan ?? 0,
              actual: item.ActualQty ?? item.Actual ?? 0,
            };
          })
        : [];
      setPlanActualData(formatted);
    } catch (err) {
      console.error("Plan vs Actual error:", err);
    } finally {
      setLoadingQuality(false);
    }
  };

  const fetchRejectionReason = async () => {
    if (!lineId || !stationId) return;
    try {
      setLoadingRejection(true);
      const body = buildParams();
      const res = await axios.post(`${BASE_URL}/smtStation/SMTStationRejectionReasonCount`, body);
      const data = res.data?.data ?? res.data ?? [];
      const formatted = Array.isArray(data)
        ? data.map((item) => ({
            name: item.ReasonName ?? item.LossName ?? item.RejectionReason ?? "",
            value: item.TotalCount ?? item.Count ?? item.RejectionCount ?? 0,
          }))
        : [];
      setRejectionReasonData(formatted);
    } catch (err) {
      console.error("Rejection Reason error:", err);
    } finally {
      setLoadingRejection(false);
    }
  };

  useEffect(() => {
    if (!lineId || !stationId) return;
    fetchStationLevelOEE();
    fetchStationHourlyAPQOEE();
    fetch4MLoss();
    fetchTPMLoss();
    fetchGoodVsRejection();
    fetchPlanVsActual();
    fetchRejectionReason();
  }, [lineId, stationId, filterType, shift, startDate, endDate]);

  const hasStationContext = lineId != null && stationId != null;

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
        {stationName}
      </h2>
    </div>
  </div>
</div>

        {!hasStationContext ? (
          <div className="text-center py-12 text-gray-500">
            Please select a station from the Lines Performance page to view station details.
          </div>
        ) : (
          <>
        <StationSummary oeeData={oeeData} loading={loadingOEE} />

        <div className="space-y-4">
          <SectionHeader title="Station Trends" />
          <div className="gap-6">
            <TrendChart title="OEE Trend" dataKey="OEE" data={trendData} color="#93c5fd" light loading={loadingTrend} />
            <TrendChart title="Availability" dataKey="Availability" data={trendData} color="#9b83b4" loading={loadingTrend} />
            <TrendChart title="Performance" dataKey="Performance" data={trendData} color="#acb5e0" loading={loadingTrend} />
            <TrendChart title="Quality" dataKey="Quality" data={trendData} color="#c52281" loading={loadingTrend} />
          </div>
        </div>

        <M4DowntimeAnalysis durationData={m4DurationData} occurrenceData={m4OccurrenceData} loading={loadingM4} />
        <TPMDowntimeAnalysis durationData={tpmDurationData} occurrenceData={tpmOccurrenceData} loading={loadingTPM} />

        <SectionHeader title="Station Quality Planned vs Actual" />
        <QualityHourlyChart data={planActualData} loading={loadingQuality} />
        <SectionHeader title="Station Total Parts vs Rejection Part" />
        <QualityHourlyChart2 data={goodRejectData} loading={loadingQuality} />
        <RejectionReason data={rejectionReasonData} loading={loadingRejection} />
          </>
        )}
           
      </div>
    </DashboardLayout>
  );
};

export default LinesStationPreformance;
