import { motion } from "framer-motion";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
} from "recharts";
import DashboardLayout from "../partials/DashboardLayout";
import { PieChart, Pie, Cell } from "recharts";


/* ================== LOCAL CARD COMPONENT ================== */
const Card = ({ children, className = "" }) => (
  <div className={`  rounded-xl shadow ${className}`}>
    {children}
  </div>
);

const CardContent = ({ children, className = "" }) => (
  <div className={`p-4 ${className}`}>{children}</div>
);

/* ================== DUMMY DATA ================== */
const trendData = Array.from({ length: 8 }, (_, i) => ({
  time: `H${i + 1}`,
  OEE: 70 + Math.random() * 20,
}));

const smtLines = Array.from({ length: 12 }, (_, i) => ({
  line: `Line ${i + 1}`,
  OLE: 70 + Math.random() * 20,
  A: 75 + Math.random() * 15,
  P: 70 + Math.random() * 15,
  Q: 85 + Math.random() * 10,
}));

/* ================== COMPONENTS ================== */
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
              ${i === 0
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"}
            `}
          >
            {f}
          </button>
        ))}
      </div>

      {/* RIGHT – Date Range */}
      <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border">
        <span className="text-sm text-black font-medium">
          Start Date:
        </span>
        <input
          type="date"
          className="px-2 py-1 text-sm rounded-md border"
        />
        <span className="text-sm text-black font-medium">
          End Date:
        </span>
        <input
          type="date"
          className="px-2 py-1 text-sm rounded-md border"
        />
      </div>
    </div>
  );
};


const MetricCard = ({ title, value }) => (
  <motion.div whileHover={{ scale: 1.05 }}>
    <Card className="flex items-center justify-center bg-blue-50 outline rounded-lg shadow color-black">
      <CardContent className="text-center">
        <p className="text-m text-black font-semibold">{title}</p>
        <p className=" text-lg text-black">{value}</p>
      </CardContent>
    </Card>
  </motion.div>
);

const TrendChart = ({
  title,
  color = "#93c5fd",   // light blue default
  light = false,
}) => {
  const gradientId = `gradient-${title.replace(/\s+/g, "")}`;

  return (
    <Card className="mb-4 bg-white rounded-xl shadow-sm border">
      <CardContent>
        <h3 className="font-bold mb-3 text-black text-center">
          {title}
        </h3>

        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={trendData}>
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
            <Tooltip />

            <Area
              type="monotone"
              dataKey="OEE"
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


const LineOLESection = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-5">
    {smtLines.map((l) => (
      <motion.div
        key={l.line}
        whileHover={{ y: -8, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Card className="h-full bg-white rounded-lg shadow">
          <CardContent className="space-y-3">
            {/* Line Header */}
            <div className="flex items-center justify-between">
              <p className="font-semibold text-gray-800">{l.line}</p>
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                SMT
              </span>
            </div>

            {/* KPIs */}
            <KpiBar label="OLE" value={l.OLE} color="#2563eb" />
            <KpiBar label="Availability" value={l.A} color="#16a34a" />
            <KpiBar label="Performance" value={l.P} color="#f59e0b" />
            <KpiBar label="Quality" value={l.Q} color="#22c55e" />
          </CardContent>
        </Card>
      </motion.div>
    ))}
  </div>
);

/* ---------- Circular Chart ---------- */
const CircularChart = ({
  value,
  label,
  size = 120,
  strokeWidth = 12,
}) => {
  const getColor = (val) => {
    if (val < 20) return "#dc2626";     // red
    if (val < 60) return "#f59e0b";     // yellow
    return "#16a34a";                   // green
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


const SectionHeader = ({ title }) => (
  <div className="flex items-center gap-3 mb-4">
    <div className="h-12 w-1.5 bg-blue-600 rounded"></div>
    <span className="text-xl md:text-2xl lg:text-3xl font-bold tracking-wide text-black">
      {title}
    </span>
  </div>
);

/* ================== MAIN PAGE ================== */
export default function SMTDashboard() {
  
  return (
    <DashboardLayout>
    <div className="pl-6 pr-6 pb-6 space-y-8 bg-gray-100 min-h-screen">

      {/* Filters */}
      <FilterBar />

     {/* SMT & Assembly Summary */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {["SMT", "Assembly"].map((sec) => (
    <Card key={sec} className="bg-white rounded-lg shadow">
      <CardContent className="space-y-10">
        <h2 className="text-lg font-bold text-black text-center">{sec} OEE Summary</h2>

        {/* OEE + A P Q */}
<div className="flex items-center justify-between gap-2">

  {/* BIG OEE */}
  <CircularChart
    value={82}
    label="OEE"
    size={180}
    strokeWidth={18}
  />

  {/* A P Q SMALL */}
  <div className="flex gap-8">
    <CircularChart value={18} label="A" size={110} />
    <CircularChart value={45} label="P" size={110} />
    <CircularChart value={92} label="Q" size={110} />
  </div>

</div>


        {/* Metrics */}
        <div className="grid grid-cols-5 gap-3">
          <MetricCard title="Plan" value="1200" />
          <MetricCard title="Actual" value="1100" />
          <MetricCard title="Downtime" value="45m" />
          <MetricCard title="Good" value="1050" />
          <MetricCard title="Bad" value="50" />
        </div>
      </CardContent>
    </Card>
  ))}
</div>

      {/* SMT Trends */}
<div className="space-y-4">
  <SectionHeader title="SMT Trends" />

  <div className="gap-6">
    {/* LIGHT OEE */}
    <TrendChart
      title="SMT OEE Trend"
      color="#93c5fd"   // light blue
      light
    />

    <TrendChart title="Availability" color="#9b83b4" />
    <TrendChart title="Performance" color="#acb5e0" />
    <TrendChart title="Quality" color="#c52281" />
  </div>
</div>

{/* Assembly Trends */}
<div className="space-y-4">
  <SectionHeader title="Assembly Trends" />

  <div className="gap-6">
    <TrendChart title="Assembly OEE Trend" color="#93a6ce" />
    <TrendChart title="Availability" color="#9b83b4" />
    <TrendChart title="Performance" color="#acb5e0" />
    <TrendChart title="Quality" color="#c52281" />
  </div>
</div>


      {/* SMT Line OLE */}
      <div className="flex items-center gap-3 mb-4">
 <SectionHeader title="SMT Line OLE" />

</div>
  <LineOLESection />
    </div>
    </DashboardLayout>
  );
}
