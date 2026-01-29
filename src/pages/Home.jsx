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
  <div className={`bg-white  rounded-xl shadow ${className}`}>
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
        <span className="text-sm text-gray-500 font-medium">
          Date Range
        </span>
        <input
          type="date"
          className="px-2 py-1 text-sm rounded-md border"
        />
        <span className="text-gray-400">→</span>
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
    <Card>
      <CardContent className="text-center">
        <p className="text-m text-black font-semibold">{title}</p>
        <p className="text-2xl font-bold text-black">{value}</p>
      </CardContent>
    </Card>
  </motion.div>
);

const TrendChart = ({ title, color = "#219ae0" }) => (
  <Card className="mb-4">
    <CardContent>
      <h3 className="font-semibold mb-3 text-black text-center">
        {title}
      </h3>

      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={trendData}>
          <defs>
            <linearGradient id={`fill-${title}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.8} />
              <stop offset="95%" stopColor={color} stopOpacity={0.1} />
            </linearGradient>
          </defs>

          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />

          <Area
            type="monotone"
            dataKey="OEE"
            stroke={color}
            fill={`url(#fill-${title})`}
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);
const KpiBar = ({ label, value, color }) => (
  <div>
    <div className="flex justify-between text-xs mb-1">
      <span className="text-gray-600">{label}</span>
      <span className="font-semibold">{value.toFixed(1)}%</span>
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
        <Card className="h-full">
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
  color = "#a0b7ea",
}) => {
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
      <div className="text-center -mt-20">
        <p className="text-xl font-bold">{value}%</p>
        <p className="text-xs text-gray-500">{label}</p>
      </div>
    </div>
  );
};

const SectionHeader = ({ title }) => (
  <div className="flex items-center gap-3 mb-4">
    <div className="h-6 w-1 bg-blue-600 rounded"></div>
    <h1 className="text-xl font-bold text-gray-800">
      {title}
    </h1>
  </div>
);
/* ================== MAIN PAGE ================== */
export default function SMTDashboard() {
  
  return (
    <DashboardLayout>
    <div className="p-6 space-y-8 bg-gray-100 min-h-screen">
      {/* <h1 className="text-2xl font-bold">
        Plant Performance – Current Shift
      </h1> */}

      {/* Filters */}
      <FilterBar />

     {/* SMT & Assembly Summary */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {["SMT", "Assembly"].map((sec) => (
    <Card key={sec}>
      <CardContent className="space-y-12">
        <h2 className="text-lg font-bold text-black text-center">{sec} OEE Summary</h2>

        {/* OEE + A P Q */}
        <div className="flex items-center justify-between gap-6">
          {/* BIG OEE */}
          <CircularChart
            value={82}
            label="OEE"
            size={180}
            strokeWidth={18}
            color="#eb5625"
          />

          {/* A P Q SMALL */}
          <div className="flex gap-4">
            <CircularChart value={88} label="A" size={110} color="#a36d16" />
            <CircularChart value={76} label="P" size={110} color="#f59e0b" />
            <CircularChart value={92} label="Q" size={110} color="#19d65e" />
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
    <TrendChart title="SMT OEE Trend" color="#2563eb" />
    <TrendChart title="Availability" color="#16a34a" />
    <TrendChart title="Performance" color="#f59e0b" />
    <TrendChart title="Quality" color="#22c55e" />
  </div>
</div>

{/* Assembly Trends */}
<div className="space-y-4">
  <SectionHeader title="Assembly Trends" />

  <div className="gap-6">
    <TrendChart title="Assembly OEE Trend" color="#93a6ce" />
    <TrendChart title="Availability" color="#16a34a" />
    <TrendChart title="Performance" color="#f59e0b" />
    <TrendChart title="Quality" color="#22c55e" />
  </div>
</div>


      {/* SMT Line OLE */}
      <div className="flex items-center gap-3 mb-4">
  <div className="h-6 w-1 bg-blue-600 rounded"></div>
  <h2 className="text-xl font-bold text-gray-800">
    SMT Line OLE
  </h2>

</div>
  <LineOLESection />
    </div>
    </DashboardLayout>
  );
}
