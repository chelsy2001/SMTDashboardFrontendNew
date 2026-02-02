import { React, useState } from "react";
import DashboardLayout from "../partials/DashboardLayout";

import { motion } from "framer-motion";

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
    if (val < 20) return "#dc2626"; // red
    if (val < 60) return "#f59e0b"; // yellow
    return "#16a34a"; // green
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
  color = "#93c5fd", // light blue default
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
            <Tooltip contentStyle={{ color: 'black' }} />

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

const SectionHeader = ({ title }) => (
  <div className="flex items-center gap-3 mb-4">
    <div className="h-12 w-1.5 bg-blue-600 rounded"></div>
    <span className="text-xl md:text-2xl lg:text-3xl font-bold tracking-wide text-gray-900">
      {title}
    </span>
  </div>
);

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

const LineSelector = () => {
  const [activeLine, setActiveLine] = useState(5);

  const sliderSettings = {
    dots: false,
    infinite: false,
    speed: 400,
    slidesToShow: 6,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <Arrow direction="right" />,
    prevArrow: <Arrow direction="left" />,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 4 } },
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className="bg-white rounded-2xl shadow px-10 py-4">
      {/* Header */}
      <div className=" text-center mb-4">
        <h3 className="font-semibold text-black text-lg text-center">
          Line Selection
        </h3>
      </div>

      {/* Slider */}
      <div className="relative">
        <Slider {...sliderSettings}>
          {Array.from({ length: 12 }).map((_, i) => {
            const line = i + 1;
            const isActive = activeLine === line;

            return (
              <div key={line} className="px-3">
                <motion.button
                  onClick={() => setActiveLine(line)}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className={`
                    w-full py-2.5 rounded-full text-sm font-semibold
                    border transition-all duration-300
                    ${
                      isActive
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-transparent shadow-lg"
                        : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-blue-50"
                    }
                  `}
                >
                  Line {line}
                </motion.button>
              </div>
            );
          })}
        </Slider>
      </div>
    </div>
  );
};
const Arrow = ({ onClick, direction }) => (
  <button
    onClick={onClick}
    className={`
      absolute top-1/2 -translate-y-1/2 z-10
      ${direction === "left" ? "-left-8" : "-right-9"}
      w-10 h-10 rounded-full
      bg-white shadow-md border border-gray-200
      flex items-center justify-center
      hover:bg-blue-50 transition
    `}
  >
    <span className="text-blue-600 text-xl font-bold">
      {direction === "left" ? "‹" : "›"}
    </span>
  </button>
);


const LineSummary = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    {/* LEFT – OEE + APQ */}
    <Card className="bg-white rounded-xl shadow">
      <CardContent className="p-6space-y-10">
        <h3 className="text-lg font-bold text-gray-800 text-center">
          Line OEE (A, P, Q)
        </h3>

        <div className="flex justify-between items-center">
          <CircularChart value={78} label="OEE" size={180} strokeWidth={18} />

          <div className="flex gap-6">
            <CircularChart value={65} label="A" size={110} />
            <CircularChart value={72} label="P" size={110} />
            <CircularChart value={92} label="Q" size={110} />
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
          <MetricCard title="Plan" value="1200" />
          <MetricCard title="Actual" value="1100" />
          <MetricCard title="Downtime" value="45m" />
          <MetricCard title="Good" value="1050" />
          <MetricCard title="Bad" value="50" />
        </div>
      </CardContent>
    </Card>
  </div>
);

const StationCards = () => (
  <div className="space-y-4">
    <SectionHeader title="Stations" />

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-5">
      {Array.from({ length: 8 }).map((_, i) => (
        <Card key={i} className="bg-white rounded-lg shadow">
          <CardContent className="space-y-2 ">
            <p className="font-bold text-black text-m text-center">Station {i + 1}</p>
            <KpiBar
              label="OEE"
              value={70 + Math.random() * 20}
              color="#2563eb"
            />
            <KpiBar label="A" value={65 + Math.random() * 20} color="#16a34a" />
            <KpiBar label="P" value={60 + Math.random() * 20} color="#f59e0b" />
            <KpiBar label="Q" value={85 + Math.random() * 10} color="#22c55e" />
          </CardContent>
        </Card>
      ))}
    </div>
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
    <SectionHeader title="M4 Downtime Analysis" />

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Duration */}
      <Card className="bg-white rounded-xl shadow">
        <CardContent>
          <h4 className="font-bold mb-2 text-black text-center">Duration Wise</h4>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={downtimeData}>
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
            <BarChart data={downtimeData}>
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

const TPMDowntimeAnalysis = () => (
  <div className="space-y-4">
    <SectionHeader title="TPM Downtime Analysis" />

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
              <XAxis type="number" tick={{ fill: "#000", fontWeight: 300 , fontSize: 14 }}/>
              <YAxis type="category" dataKey="name" width={80}tick={{ fill: "#000", fontWeight: 300 , fontSize: 14 }}/>
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
              <XAxis type="number" tick={{ fill: "#000", fontWeight: 300 , fontSize: 14 }}/>
              <YAxis type="category" dataKey="name" width={80} tick={{ fill: "#000", fontWeight: 300 , fontSize: 14 }}/>
              <Tooltip contentStyle={{ color: 'black' }} />
              <Bar dataKey="value" fill="#f59e0b" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  </div>
);

const LinesPreformance = () => {
  return (
    <DashboardLayout>
      <div className="pl-6 pr-6 pb-6 space-y-8 bg-gray-100 min-h-screen">
        <FilterBar />

        <LineSelector />

        <LineSummary />

        {/* Line Trends */}
        <div className="space-y-4">
          <SectionHeader title="Line Trends" />

          <div className="gap-6">
            {/* LIGHT OEE */}
            <TrendChart
              title="OEE Trend"
              color="#93c5fd" // light blue
              light
            />

            <TrendChart title="Availability" color="#9b83b4" />
            <TrendChart title="Performance" color="#acb5e0" />
            <TrendChart title="Quality" color="#c52281" />
          </div>
        </div>

        <StationCards />

        <M4DowntimeAnalysis />

        <TPMDowntimeAnalysis />

        <SectionHeader title="Quality Expected vs Actual​" />
        <QualityHourlyChart />
<SectionHeader title="Total Parts vs Rejection Part" />
        <QualityHourlyChart2 />
        <RejectionReason />
      </div>
    </DashboardLayout>
  );
};

export default LinesPreformance;
