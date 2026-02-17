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
import { useState, useEffect } from "react";
import axios from "axios";


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
          className="px-3 py-2 rounded-lg text-sm border bg-gray-100 w-25"
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



// const MetricCard = ({ title, value }) => (
//   <motion.div whileHover={{ scale: 1.05 }}>
//     <Card className="flex items-center justify-center bg-blue-50 outline rounded-lg shadow color-black">
//       <CardContent className="text-center">
//         <p className="text-m text-black font-semibold">{title}</p>
//         <p className=" text-lg text-black">{value}</p>
//       </CardContent>
//     </Card>
//   </motion.div>
// );

const TrendChart = ({
  title,
  data,
  dataKey,
  color = "#93c5fd",
  light = false,
}) => {
  const gradientId = `gradient-${title.replace(/\s+/g, "")}`;

  return (
    <Card className="mb-4 bg-white rounded-xl shadow-sm border">
      <CardContent>
        <h3 className="font-bold mb-3 text-black text-center">{title}</h3>

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

            <XAxis
              dataKey="label"
              tick={{ fill: "#000", fontWeight: 300, fontSize: 14 }}
              interval="preserveStartEnd"
            />
            <YAxis domain={[0, 100]} tick={{ fill: "#000", fontWeight: 300, fontSize: 14 }} />
            <Tooltip />

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

const LineOLESection = ({ data = [] }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-5">
    {data.map((l) => (
      <motion.div
        key={l.LineID}
        whileHover={{ y: -8, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Card className="h-full bg-white rounded-lg shadow">
          <CardContent className="space-y-3">
            {/* Line Header */}
            <div className="flex items-center justify-between">
              <p className="font-semibold text-gray-800">
                {l.LineName}
              </p>
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                SMT
              </span>
            </div>

            {/* KPIs */}
            <KpiBar label="OLE" value={Number(l.OEEPct || 0)} color="#2563eb" />
            <KpiBar label="Availability" value={Number(l.AvailabilityPct || 0)} color="#16a34a" />
            <KpiBar label="Performance" value={Number(l.PerformancePct || 0)} color="#f59e0b" />
            <KpiBar label="Quality" value={Number(l.QualityPct || 0)} color="#22c55e" />
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
  const BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

  const [filterType, setFilterType] = useState("SHIFT");
  const [shift, setShift] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [trendData, setTrendData] = useState([]);
  const [assemblyTrendData, setAssemblyTrendData] = useState([]);
  const [lineWiseData, setLineWiseData] = useState([]);

  const [smtData, setSmtData] = useState({
    AvailabilityPct: 0,
    PerformancePct: 0,
    QualityPct: 0,
    OEEPct: 0,
  });
  const [assemblyData, setAssemblyData] = useState({
    AvailabilityPct: 0,
    PerformancePct: 0,
    QualityPct: 0,
    OEEPct: 0,
  });

  const [loading, setLoading] = useState(false);

  const fetchPlantOEE = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/Home/plant-smt-oee`,
        {
          params: {
            filterType,
            shift: shift || null,
            startDate: startDate || null,
            endDate: endDate || null,
          },
        }
      );

      if (response.data && response.data.length > 0) {
        setSmtData(response.data[0]);
      }

    } catch (error) {
      console.error("Error fetching SMT OEE:", error);
    }
  };

  const fetchPlantAssemblyOEE = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/Home/plant-assembly-oee`,
        {
          params: {
            filterType,
            shift: shift || null,
            startDate: startDate || null,
            endDate: endDate || null,
          },
        }
      );

      if (response.data && response.data.length > 0) {
        setAssemblyData(response.data[0]);
      }
    } catch (error) {
      console.error("Error fetching Assembly OEE:", error);
    }
  };



  //for oee apq trend
  const getTrendMode = () => {
    // If user selected date range
    if (startDate && endDate) {
      if (startDate === endDate) return "Hourly";
      return "Daywise";
    }
    // FilterType based
    if (filterType === "WEEK" || filterType === "MONTH") return "Daywise";

    return "Hourly"; // SHIFT or DAY
  };
  const fetchPlantTrend = async () => {
    try {
      const trendFilterType =
        startDate && endDate ? "DATERANGE" : filterType;

      const response = await axios.get(`${BASE_URL}/Home/plant-smtLine-apq-oee-trend`, {
        params: {
          filterType: trendFilterType,
          shift: shift || null,
          startDate: startDate || null,
          endDate: endDate || null,
        },
      });

      setTrendData(response.data || []);
    } catch (error) {
      console.error("Error fetching Plant Trend:", error);
    }
  };
  const formatHourLabelFromUTCString = (utcString) => {
    if (!utcString) return "";
    // "2026-02-06T06:00:00.000Z"
    const timePart = utcString.split("T")[1]; // "06:00:00.000Z"
    const hourMin = timePart.substring(0, 5); // "06:00"

    return hourMin;
  };

  const formatDateLabel = (dateString) => {
    if (!dateString) return "";
    // "2026-02-06T00:00:00.000Z"
    const datePart = dateString.split("T")[0]; // "2026-02-06"

    const [yyyy, mm, dd] = datePart.split("-");
    return `${dd}-${mm}`; // 06-02
  };

  const trendMode = getTrendMode();

  const formattedTrendData = trendData.map((row) => {
    if (trendMode === "Hourly") {
      return {
        label: formatHourLabelFromUTCString(row.TimeStamp),
        OEE: Number(row.OEE || 0),
        Availability: Number(row.Availability || 0),
        Performance: Number(row.Performance || 0),
        Quality: Number(row.Quality || 0),
      };
    }

    // Daywise
    return {
      label: formatDateLabel(row.ProdDate),
      OEE: Number(row.OEE || 0),
      Availability: Number(row.Availability || 0),
      Performance: Number(row.Performance || 0),
      Quality: Number(row.Quality || 0),
    };
  });

  const fetchAssemblyTrend = async () => {
    try {
      const trendFilterType = startDate && endDate ? "DATERANGE" : filterType;

      const response = await axios.get(
        `${BASE_URL}/Home/plant-assemblyLine-apq-oee-trend`,
        {
          params: {
            filterType: trendFilterType,
            shift: shift || null,
            startDate: startDate || null,
            endDate: endDate || null,
          },
        }
      );

      setAssemblyTrendData(response.data || []);
    } catch (error) {
      console.error("Error fetching Assembly Trend:", error);
    }
  };
  const formattedAssemblyTrendData = assemblyTrendData.map((row) => {
    if (trendMode === "Hourly") {
      return {
        label: formatHourLabelFromUTCString(row.TimeStamp),
        OEE: Number(row.OEE || 0),
        Availability: Number(row.Availability || 0),
        Performance: Number(row.Performance || 0),
        Quality: Number(row.Quality || 0),
      };
    }

    return {
      label: formatDateLabel(row.ProdDate),
      OEE: Number(row.OEE || 0),
      Availability: Number(row.Availability || 0),
      Performance: Number(row.Performance || 0),
      Quality: Number(row.Quality || 0),
    };
  });

  const fetchLineWiseOLE = async () => {
    try {
      const lineFilterType = startDate && endDate ? "DATERANGE" : filterType;

      const response = await axios.get(`${BASE_URL}/Home/LineWise-apq-ole`, {
        params: {
          filterType: lineFilterType,
          shift: shift || null,
          startDate: startDate || null,
          endDate: endDate || null,
        },
      });

      setLineWiseData(response.data || []);
    } catch (error) {
      console.error("Error fetching LineWise OLE:", error);
    }
  };




  //--------------------------------------------------------------------
  useEffect(() => {
    fetchPlantOEE();
    fetchPlantAssemblyOEE();
    fetchPlantTrend();
    fetchAssemblyTrend();
    fetchLineWiseOLE();
  }, [filterType, shift, startDate, endDate]);

  return (
    <DashboardLayout>
      <div className="pl-6 pr-6 pb-6 space-y-8 bg-gray-100 min-h-screen">

        {/* Filters */}
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

        {/* SMT & Assembly Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-white rounded-lg shadow">
            <CardContent className="space-y-8 min-h-[290px] flex flex-col justify-center">
              <h2 className="text-lg font-bold text-black text-center">
                SMT OEE Summary
              </h2>

              <div className="flex items-center justify-between gap-2">
                <CircularChart value={Number(smtData.OEEPct || 0)} label="OEE"  size={180} strokeWidth={18}  />

                <div className="flex gap-8">
                  <CircularChart value={Number(smtData.AvailabilityPct || 0)} label="A" size={110}/>
                  <CircularChart value={Number(smtData.PerformancePct || 0)} label="P" size={110}/>
                  <CircularChart value={Number(smtData.QualityPct || 0)} label="Q" size={110}/>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Assembly Summary */}
          <Card className="bg-white rounded-lg shadow">
            <CardContent className="space-y-8 min-h-[290px] flex flex-col justify-center">
              <h2 className="text-lg font-bold text-black text-center">
                Assembly OEE Summary
              </h2>

              <div className="flex items-center justify-between gap-2">
                <CircularChart value={Number(assemblyData.OEEPct || 0)} label="OEE" size={180} strokeWidth={18}/>

                <div className="flex gap-8">
                  <CircularChart value={Number(assemblyData.AvailabilityPct || 0)} label="A" size={110}/>
                  <CircularChart value={Number(assemblyData.PerformancePct || 0)} label="P" size={110} />
                  <CircularChart value={Number(assemblyData.QualityPct || 0)} label="Q" size={110}/>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* SMT Trends */}
        <div className="space-y-4">
          <SectionHeader title="SMT Trends" />

          <div className="gap-6">
            {/* LIGHT OEE */}
            <TrendChart
              title="SMT OEE Trend"
              data={formattedTrendData}
              dataKey="OEE"
              color="#93c5fd"
              light
            />

            <TrendChart
              title="Availability"
              data={formattedTrendData}
              dataKey="Availability"
              color="#9b83b4"
            />

            <TrendChart
              title="Performance"
              data={formattedTrendData}
              dataKey="Performance"
              color="#acb5e0"
            />

            <TrendChart
              title="Quality"
              data={formattedTrendData}
              dataKey="Quality"
              color="#c52281"
            />
          </div>
        </div>

        {/* Assembly Trends */}
        <div className="space-y-4">
          <SectionHeader title="Assembly Trends" />

          <div className="gap-6">
            <TrendChart
              title="Assembly OEE Trend"
              data={formattedAssemblyTrendData}
              dataKey="OEE"
              color="#93a6ce"
              light
            />

            <TrendChart
              title="Availability"
              data={formattedAssemblyTrendData}
              dataKey="Availability"
              color="#9b83b4"
            />

            <TrendChart
              title="Performance"
              data={formattedAssemblyTrendData}
              dataKey="Performance"
              color="#acb5e0"
            />

            <TrendChart
              title="Quality"
              data={formattedAssemblyTrendData}
              dataKey="Quality"
              color="#c52281"
            />
          </div>
        </div>


        {/* SMT Line OLE */}
        <div className="flex items-center gap-3 mb-4">
          <SectionHeader title="SMT Line OLE" />

        </div>
        <LineOLESection data={lineWiseData} />

      </div>
    </DashboardLayout>
  );
}
