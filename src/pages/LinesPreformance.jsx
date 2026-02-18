import { React, useState , useEffect } from "react";
import DashboardLayout from "../partials/DashboardLayout";

import { motion } from "framer-motion";
import axios from "axios";
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
import { useNavigate } from "react-router-dom";

import Slider from "react-slick";
import { LineChart, Line, CartesianGrid, Legend } from "recharts";
import { TrendingUp, Target, Clock, CheckCircle, XCircle } from "lucide-react";

const BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;


/* ================== LOCAL CARD COMPONENT ================== */
const Card = ({ children, className = "", ...props }) => (
  <div
    className={`rounded-xl shadow ${className}`}
    {...props}
  >
    {children}
  </div>
);




const CardContent = ({ children, className = "" }) => (
  <div className={`p-4 ${className}`}>{children}</div>
);

const RejectionReason = ({ data = [], loading }) => {
  if (loading) {
    return <div className="text-center py-6">Loading Rejection Data...</div>;
  }

  if (!data || data.length === 0) {
    return <div className="text-center py-6">No Rejection Data Available</div>;
  }

  return (
    <>
      <SectionHeader title=" Rejection Reason Analysis" />
      <div className=" gap-6">
        <Card className="bg-white rounded-xl shadow">
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={data} layout="vertical">
                <XAxis
                  type="number"
                  tick={{ fill: "#000", fontWeight: 300, fontSize: 14 }}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={120}
                  tick={{ fill: "#000", fontWeight: 300, fontSize: 14 }}
                />
                <Tooltip contentStyle={{ color: "black" }} />
                <Bar
                  dataKey="value"
                  fill="#60a5fa"
                  radius={[0, 6, 6, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </>
  );
};


const QualityHourlyChart = ({ data }) => (
  <Card className="bg-white rounded-xl shadow">
    <CardContent>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="hour" />
          <YAxis />
          <Tooltip />
          <Legend />

          <Line type="monotone" dataKey="expected" stroke="#25c7eb" strokeWidth={2} />
          <Line type="monotone" dataKey="actual" stroke="#3b1d82" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);


const QualityHourlyChart2 = ({ data }) => (
  <Card className="bg-white rounded-xl shadow">
    <CardContent>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="hour" />
          <YAxis />
          <Tooltip />
          <Legend />

          <Line type="monotone" dataKey="TotalPart" stroke="#9925eb" strokeWidth={2} />
          <Line type="monotone" dataKey="RejectedPart" stroke="#16a39e" strokeWidth={2} />
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
  data = [],
  dataKey = "OEE",
  color = "#93c5fd",
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

const LineSelector = ({ setSelectedLine }) => {
  const [lines, setLines] = useState([]);
  const [activeLine, setActiveLine] = useState(null);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    fetchLines();
  }, []);

  const fetchLines = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${BASE_URL}/smtLine/GetLines`
      );

      const data = response.data?.data ?? response.data ?? [];
      setLines(data);

      if (Array.isArray(data) && data.length > 0) {
        setActiveLine(data[0].LineID);
        if (setSelectedLine) {
          setSelectedLine(data[0].LineID);
        }
      }
    } catch (error) {
      console.error("Error fetching lines:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading Lines...</div>;
  }

  return (
  <div className="bg-white rounded-2xl shadow px-10 py-6">
    <div className="text-center mb-4">
      <h3 className="font-semibold text-black text-lg">
        Line Selection
      </h3>
    </div>

    <div className="relative px-8">
      <Slider {...sliderSettings}>
        {Array.isArray(lines) &&
          lines.map((line) => {
            const isActive = activeLine === line.LineID;

            return (
              <div key={line.LineID} className="px-2">
                <button
                  onClick={() => {
                    setActiveLine(line.LineID);
                    if (setSelectedLine) {
                      setSelectedLine(line.LineID);
                    }
                  }}
                  className={`w-full px-5 py-2 rounded-full text-sm font-semibold transition
                    ${
                      isActive
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                        : "bg-gray-100 text-gray-700 hover:bg-blue-50"
                    }
                  `}
                >
                  {line.LineName}
                </button>
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


const LineSummary = ({ data, loading }) => {
  if (loading) {
    return <div className="text-center py-6">Loading OEE...</div>;
  }

  if (!data) {
    return <div className="text-center py-6">No Data Available</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* LEFT – OEE + APQ */}
      <Card className="bg-white rounded-xl shadow">
        <CardContent className="p-6space-y-10">
          <h3 className="text-lg font-bold text-gray-800 text-center">
            Line OEE (A, P, Q)
          </h3>

          <div className="flex justify-between items-center">
          <CircularChart value={data.OEEPct || 0} label="OEE" size={180} strokeWidth={18} />

          <div className="flex gap-6 ">
            <CircularChart value={data.AvailabilityPct || 0} label="A" size={110} />
            <CircularChart value={data.PerformancePct || 0} label="P" size={110} />
            <CircularChart value={data.QualityPct || 0} label="Q" size={110} />
          </div>
          </div>
        </CardContent>
      </Card>

      {/* RIGHT – PRODUCTION SUMMARY */}
      <Card className="bg-white rounded-2xl shadow">
        <CardContent className="space-y-4">
          <h3 className="text-lg font-bold text-gray-800 text-center">
            Production Summary
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <MetricCard title="Plan" value={data.PlanQty || 0} />
            <MetricCard title="Actual" value={data.ActualQty || 0} />
            <MetricCard title="Downtime" value={`${data.DowntimeMin || 0}m`} />
            <MetricCard title="Good" value={data.GoodParts || 0} />
            <MetricCard title="Bad" value={data.BadParts || 0} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};


const StationCards = ({
  selectedLine,
  filterType,
  shift,
  startDate,
  endDate,
}) => {
  const navigate = useNavigate();
  const [stationData, setStationData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedLine) {
      fetchStations();
    }
  }, [selectedLine, filterType, shift, startDate, endDate]);

  const fetchStations = async () => {
    try {
      setLoading(true);

      const params = {
        LineID: selectedLine,
        FilterType: filterType,
      };

      if (shift) params.Shift = shift;

      if (filterType === "DATERANGE") {
        params.StartDate = startDate;
        params.EndDate = endDate;
      }

      const res = await axios.get(
        `${BASE_URL}/smtLine/SMTLineStationWiseOEE`,
        { params }
      );

      const data = res.data?.data ?? [];

      if (Array.isArray(data)) {
        setStationData(data);
      }

    } catch (err) {
      console.error("Station API error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading Stations...</div>;

  if (!stationData.length)
    return <div className="text-center py-4">No Station Data</div>;

  return (
    <div className="space-y-4">
      <SectionHeader title="Stations" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-5">
        {stationData.map((station, i) => (
          <Card
            key={i}
            className="bg-white rounded-lg shadow cursor-pointer hover:shadow-lg transition"
            onClick={() =>
              navigate("/LinesStationPreformance", {
                state: { 
                  stationName: station.StationName,
                  stationId: station.StationID,
                  lineId: selectedLine
                },
              })
            }
          >
            <CardContent className="space-y-2">
              <p className="font-bold text-black text-m text-center">
                {station.StationName}
              </p>

              <KpiBar label="OEE" value={station.OEEPct || 0} color="#2563eb" />
              <KpiBar label="A" value={station.AvailabilityPct || 0} color="#16a34a" />
              <KpiBar label="P" value={station.PerformancePct || 0} color="#f59e0b" />
              <KpiBar label="Q" value={station.QualityPct || 0} color="#22c55e" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};




const M4DowntimeAnalysis = ({ durationData, occurrenceData }) => (

  <div className="space-y-4">
    <SectionHeader title="M4 Downtime Analysis" />

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Duration */}
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

const TPMDowntimeAnalysis = ({ durationData = [], occurrenceData = [] }) => {

  const renderChart = (data, title, color) => {

    const sortedData = [...data].sort((a, b) => b.value - a.value);

    // Dynamic height based on data count
    const chartHeight = Math.max(sortedData.length * 45, 300);

    return (
      <Card className="bg-white rounded-2xl shadow-lg border border-gray-100">
        <CardContent className="p-6">
          <h4 className="font-semibold text-gray-700 text-lg text-center mb-4">
            {title}
          </h4>

          {/* Scroll Wrapper */}
          <div className="overflow-y-auto" style={{ maxHeight: "420px" }}>
            <div style={{ height: chartHeight }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={sortedData}
                  layout="vertical"
                  margin={{ top: 10, right: 20, left: 10, bottom: 10 }}  // 👈 left space fix
                >
                  <XAxis
                    type="number"
                    tick={{ fill: "#6b7280", fontSize: 13 }}
                  />

                  <YAxis
                    type="category"
                    dataKey="name"
                    width={140} // 👈 optimized width
                    tick={{ fill: "#374151", fontSize: 13 }}
                    tickFormatter={(value) =>
                      value.length > 22
                        ? value.substring(0, 22) + "..."
                        : value
                    }
                  />

                  <Tooltip />

                  <Bar
                    dataKey="value"
                    fill={color}
                    radius={[0, 10, 10, 0]}
                    barSize={22}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <SectionHeader title="TPM Downtime Analysis" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {renderChart(
          durationData,
          "Duration Wise Loss (Minutes)",
          "#3b82f6"
        )}

        {renderChart(
          occurrenceData,
          "Occurrence Wise Loss (Count)",
          "#f59e0b"
        )}
      </div>
    </div>
  );
};



const LinesPreformance = () => {
  const [filterType, setFilterType] = useState("SHIFT");
  const [shift, setShift] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedLine, setSelectedLine] = useState(null);
  const [lineOEEData, setLineOEEData] = useState(null);
const [loadingOEE, setLoadingOEE] = useState(false);
const [trendData, setTrendData] = useState([]);
const [loadingTrend, setLoadingTrend] = useState(false);
const [m4DurationData, setM4DurationData] = useState([]);
const [m4OccurrenceData, setM4OccurrenceData] = useState([]);
const [tpmDurationData, setTpmDurationData] = useState([]);
const [tpmOccurrenceData, setTpmOccurrenceData] = useState([]);
const [planActualData, setPlanActualData] = useState([]);
const [goodRejectData, setGoodRejectData] = useState([]);
const [loadingQuality, setLoadingQuality] = useState(false);
const [rejectionReasonData, setRejectionReasonData] = useState([]);
const [loadingRejection, setLoadingRejection] = useState(false);
const [stationData, setStationData] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchStations = async () => {
    try {
      const res = await axios.get("/api/stations"); // apna API lagao
      const data = res.data?.data ?? res.data ?? [];
      setStationData(data);
    } catch (err) {
      console.error("Station API error:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchStations();
}, []);


useEffect(() => {
  if (selectedLine) {
    fetchPlanVsActual();
    fetchGoodVsRejection();
  }
}, [selectedLine, filterType, shift, startDate, endDate]);


useEffect(() => {
  if (selectedLine) {
    fetchM4Loss();
    fetchTPMLoss();
  }
}, [selectedLine, filterType, shift, startDate, endDate]);
  

useEffect(() => {
  if (selectedLine) {
    fetchLineLevelOEE();
  }
}, [selectedLine, filterType, shift, startDate, endDate]);

useEffect(() => {
  if (selectedLine) {
    fetchTrendData();
  }
}, [selectedLine, filterType, shift, startDate, endDate]);

useEffect(() => {
  if (selectedLine) {
    fetchRejectionReason();
  }
}, [selectedLine, filterType, shift, startDate, endDate]);


const fetchTrendData = async () => {
  try {
    setLoadingTrend(true);

    const params = {
      LineID: selectedLine,
      FilterType: filterType,
    };

    if (shift) params.Shift = shift;

    if (filterType === "DATERANGE") {
      params.StartDate = startDate;
      params.EndDate = endDate;
    }

    const response = await axios.get(
      `${BASE_URL}/smtLine/SMTLineWiseHourlyOEE`,
      { params }
    );

    const data = response.data.data || response.data;

    if (Array.isArray(data) && data.length > 0) {
      const formatted = data.map((item, index) => ({
        time: item.Hour || item.HourNo || `H${index + 1}`,
        OEE: item.OEEPct || 0,
        Availability: item.AvailabilityPct || 0,
        Performance: item.PerformancePct || 0,
        Quality: item.QualityPct || 0,
      }));

      setTrendData(formatted);
    }
  } catch (error) {
    console.error("Error fetching trend data:", error);
  } finally {
    setLoadingTrend(false);
  }
};


const fetchLineLevelOEE = async () => {
  try {
    setLoadingOEE(true);

    const params = {
      LineID: selectedLine,
      FilterType: filterType,
    };

    if (shift) params.Shift = shift;
    if (filterType === "DATERANGE") {
      params.StartDate = startDate;
      params.EndDate = endDate;
    }

    const response = await axios.get(
      `${BASE_URL}/smtLine/LineLevelOEE`,
      { params }
    );

    const data = response.data.data || response.data;

    if (Array.isArray(data) && data.length > 0) {
      setLineOEEData(data[0]);
    }
  } catch (error) {
    console.error("Error fetching OEE:", error);
  } finally {
    setLoadingOEE(false);
  }
};

const fetchM4Loss = async () => {
  try {
    const params = {
      LineID: selectedLine,
      FilterType: filterType,
    };

    if (shift) params.Shift = shift;

    if (filterType === "DATERANGE") {
      params.StartDate = startDate;
      params.EndDate = endDate;
    }

    const response = await axios.get(
      `${BASE_URL}/smtLine/SMTLineWise4MLoss`,
      { params }
    );

    const data = response.data.data || response.data;

    if (Array.isArray(data)) {
     const duration = data.map(item => ({
  name: item.LossType,
  value: item.TotalDuration || 0,
}));

const occurrence = data.map(item => ({
  name: item.LossType,
  value: item.Occurrence || 0,
}));


      setM4DurationData(duration);
      setM4OccurrenceData(occurrence);
    }
  } catch (error) {
    console.error("M4 Loss API error:", error);
  }
};

const fetchTPMLoss = async () => {
  try {
    const params = {
      LineID: selectedLine,
      FilterType: filterType,
    };

    if (shift) params.Shift = shift;

    if (filterType === "DATERANGE") {
      params.StartDate = startDate;
      params.EndDate = endDate;
    }

    const response = await axios.get(
      `${BASE_URL}/smtLine/SMTLineWiseTPMLoss`,
      { params }
    );

    const data = response.data.data || response.data;

    if (Array.isArray(data)) {
      const duration = data.map(item => ({
        name: item.LossName,
        value: item.DurationMin || 0,
      }));

      const occurrence = data.map(item => ({
        name: item.LossName,
        value: item.OccurrenceCount || 0,
      }));

      setTpmDurationData(duration);
      setTpmOccurrenceData(occurrence);
    }
  } catch (error) {
    console.error("TPM Loss API error:", error);
  }
};

const fetchPlanVsActual = async () => {
  try {
    setLoadingQuality(true);

    const params = {
      LineID: selectedLine,
      FilterType: filterType,
    };

    if (shift) params.Shift = shift;

    if (filterType === "DATERANGE") {
      params.StartDate = startDate;
      params.EndDate = endDate;
    }

    const response = await axios.get(
      `${BASE_URL}/smtLine/SMTLinePlanVsActual`,
      { params }
    );

    const data = response.data?.data || [];

    if (Array.isArray(data)) {
      const formatted = data.map((item, index) => ({
        hour: item.Hour || item.HourNo || `H${index + 1}`,
        expected: item.PlanQty || item.Plan || 0,
        actual: item.ActualQty || item.Actual || 0,
      }));

      setPlanActualData(formatted);
    }

  } catch (error) {
    console.error("Plan vs Actual API error:", error);
  } finally {
    setLoadingQuality(false);
  }
};
const fetchGoodVsRejection = async () => {
  try {
    const params = {
      LineID: selectedLine,
      FilterType: filterType,
    };

    if (shift) params.Shift = shift;

    if (filterType === "DATERANGE") {
      params.StartDate = startDate;
      params.EndDate = endDate;
    }

    const response = await axios.get(
      `${BASE_URL}/smtLine/SMTLineGoodVsRejection`,
      { params }
    );

    const data = response.data?.data || [];

    if (Array.isArray(data)) {
      const formatted = data.map((item, index) => ({
        hour: item.Hour || item.HourNo || `H${index + 1}`,
        TotalPart: item.GoodQty || item.TotalQty || 0,
        RejectedPart: item.RejectionQty || item.BadQty || 0,
      }));

      setGoodRejectData(formatted);
    }

  } catch (error) {
    console.error("Good vs Rejection API error:", error);
  }
};
const fetchRejectionReason = async () => {
  try {
    setLoadingRejection(true);

    const params = {
      LineID: selectedLine,
      FilterType: filterType,
    };

    if (shift) params.Shift = shift;
    if (filterType === "DATERANGE") {
      params.StartDate = startDate;
      params.EndDate = endDate;
    }

    const response = await axios.get(
      `${BASE_URL}/smtLine/SMTLineRejectionReason`,
      { params }
    );

    const data = response.data?.data || [];

    if (Array.isArray(data)) {
      const formatted = data.map(item => ({
        name: item.ReasonName || item.LossName || item.RejectionReason,
        value: item.TotalCount || item.Count || item.RejectionCount || 0,
      }));

      setRejectionReasonData(formatted);
    }

  } catch (error) {
    console.error("Rejection Reason API error:", error);
  } finally {
    setLoadingRejection(false);
  }
};

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

       <LineSelector setSelectedLine={setSelectedLine} />

       <LineSummary data={lineOEEData} loading={loadingOEE} />


        {/* Line Trends */}
        <div className="space-y-4">
          <SectionHeader title="Line Trends" />

          <div className="gap-6">
            {/* LIGHT OEE */}
            <TrendChart
  title="OEE Trend"
  data={trendData}
  dataKey="OEE"
  color="#93c5fd"
  light
/>

<TrendChart
  title="Availability"
  data={trendData}
  dataKey="Availability"
  color="#9b83b4"
/>

<TrendChart
  title="Performance"
  data={trendData}
  dataKey="Performance"
  color="#acb5e0"
/>

<TrendChart
  title="Quality"
  data={trendData}
  dataKey="Quality"
  color="#c52281"
/>

          </div>
        </div>

     

       <M4DowntimeAnalysis
  durationData={m4DurationData}
  occurrenceData={m4OccurrenceData}
/>

<TPMDowntimeAnalysis
  durationData={tpmDurationData}
  occurrenceData={tpmOccurrenceData}
/>

        <SectionHeader title="Quality Planned vs Actual​" />
        <QualityHourlyChart data={planActualData} />
<SectionHeader title="Total Parts vs Rejection Part" />
        <QualityHourlyChart2 data={goodRejectData} />
        <RejectionReason
  data={rejectionReasonData}
  loading={loadingRejection}
/>


          <StationCards
  selectedLine={selectedLine}
  filterType={filterType}
  shift={shift}
  startDate={startDate}
  endDate={endDate}
/>


      </div>
    </DashboardLayout>
  );
};

export default LinesPreformance;
