import React, { useEffect, useState } from "react";
import DashboardLayout from "../partials/DashboardLayout";
import { motion } from "framer-motion";
import axios from "axios";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";

/* ================== UI COMPONENTS ================== */
const Card = ({ children, className = "", ...props }) => (
  <div className={`rounded-xl shadow ${className}`} {...props}>
    {children}
  </div>
);

const CardContent = ({ children, className = "" }) => (
  <div className={`p-4 ${className}`}>{children}</div>
);

const KpiBar = ({ label, value, color }) => (
  <div>
    <div className="flex justify-between text-xs mb-1">
      <span className="text-black font-medium">{label}</span>
      <span className="font-semibold text-black">{Number(value).toFixed(1)}%</span>
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

/* ================== GROUPS ================== */
const assemblyGroups = [
  { id: 1, label: "1 – 25" },
  { id: 2, label: "25 – 50" },
  { id: 3, label: "50 – 75" },
  { id: 4, label: "75 – 100" },
];

/* ================== FILTER BAR ================== */
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
      {/* LEFT */}
      <div className="flex items-center gap-3">
        <div className="flex gap-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilterType(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition
                ${
                  filterType === f
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }
              `}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Shift Dropdown */}
        <select
          value={shift}
          onChange={(e) => setShift(e.target.value)}
          className="px-3 py-2 rounded-lg text-sm border bg-gray-100 w-28"
        >
          <option value="">ALL</option>
          <option value="A">Shift A</option>
          <option value="B">Shift B</option>
          <option value="C">Shift C</option>
        </select>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border">
        <span className="text-sm text-black font-medium">Start Date:</span>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="px-2 py-1 text-sm rounded-md border"
        />

        <span className="text-sm text-black font-medium">End Date:</span>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="px-2 py-1 text-sm rounded-md border"
        />
      </div>
    </div>
  );
};

/* ================== GROUP SELECTOR ================== */
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

const AssmblySelector = ({ activeGroup, setActiveGroup }) => {
  const sliderSettings = {
    dots: false,
    infinite: false,
    speed: 400,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <Arrow direction="right" />,
    prevArrow: <Arrow direction="left" />,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className="bg-white rounded-2xl shadow px-10 py-4">
      <div className="text-center mb-4">
        <h3 className="font-semibold text-gray-900 text-lg">Assembly Groups</h3>
      </div>

      <div className="relative">
        <Slider {...sliderSettings}>
          {assemblyGroups.map((group) => {
            const isActive = activeGroup === group.id;

            return (
              <div key={group.id} className="px-3">
                <motion.button
                  onClick={() => setActiveGroup(group.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`
                    w-70 py-3 rounded-xl text-sm font-semibold
                    border transition-all duration-300
                    ${
                      isActive
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg border-transparent"
                        : "bg-gray-50 text-black border-gray-200 hover:bg-blue-50"
                    }
                  `}
                >
                  {group.label}
                </motion.button>
              </div>
            );
          })}
        </Slider>
      </div>
    </div>
  );
};

/* ================== LINE CARDS ================== */
const AssemblyLineCard = ({ lines }) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
        {lines.map((line) => {
          const lineName = `Line ${line.LineID}`;

          return (
            <Card
              key={line.LineID}
              className="bg-white rounded-lg shadow cursor-pointer hover:shadow-lg transition"
              onClick={() =>
                navigate("/AssemblyLinePreformance", {
                  state: { lineID: line.LineID, lineName },
                })
              }
            >
              <CardContent className="space-y-2">
                <p className="font-bold text-black text-m text-center">
                  {lineName}
                </p>

                <KpiBar label="OEE" value={line.OEE} color="#2563eb" />
                <KpiBar label="A" value={line.Availability} color="#16a34a" />
                <KpiBar label="P" value={line.Performance} color="#f59e0b" />
                <KpiBar label="Q" value={line.Quality} color="#22c55e" />
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

/* ================== MAIN PAGE ================== */
export default function Assembly() {
  const BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

  const [filterType, setFilterType] = useState("SHIFT");
  const [shift, setShift] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [activeGroup, setActiveGroup] = useState(1);
  const [linesData, setLinesData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAssemblyGroupData = async () => {
    try {
      setLoading(true);

      // If user selected date range, force filterType = DATERANGE
      const apiFilterType =
        startDate && endDate ? "DATERANGE" : filterType;

      const response = await axios.get(
        `${BASE_URL}/AssemblyHome/assembly-group-oee-apq`,
        {
          params: {
            filterType: apiFilterType,
            groupNo: activeGroup,
            shift: shift || null,
            startDate: startDate || null,
            endDate: endDate || null,
          },
        }
      );

      setLinesData(response.data || []);
    } catch (error) {
      console.error("Error fetching assembly group data:", error);
      setLinesData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssemblyGroupData();
  }, [filterType, shift, startDate, endDate, activeGroup]);

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

        {/* Group Selector */}
        <AssmblySelector
          activeGroup={activeGroup}
          setActiveGroup={setActiveGroup}
        />

        {/* Cards */}
        {loading ? (
          <div className="text-center text-black font-semibold">
            Loading...
          </div>
        ) : (
          <AssemblyLineCard lines={linesData} />
        )}
      </div>
    </DashboardLayout>
  );
}
