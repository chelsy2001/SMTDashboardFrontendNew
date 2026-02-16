import { React, useState } from "react";
import DashboardLayout from "../partials/DashboardLayout";

import { motion } from "framer-motion";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";


const Card = ({ children, className = "", ...props }) => (
  <div
    className={`rounded-xl shadow ${className}`}
    {...props}
  >
    {children}
  </div>
);


const assemblyGroups = [
  { id: 1, label: "1 – 25", start: 1, end: 25 },
  { id: 2, label: "25 – 50", start: 25, end: 50 },
  { id: 3, label: "50 – 75", start: 50, end: 75 },
  { id: 4, label: "75 – 100", start: 75, end: 100 },
];


const CardContent = ({ children, className = "" }) => (
  <div className={`p-4 ${className}`}>{children}</div>
);

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

const AssmblySelector = ({ onGroupChange }) => {
  const [activeGroup, setActiveGroup] = useState(1);

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

  const handleSelect = (group) => {
    setActiveGroup(group.id);

    // 👇 yahan se selected group ka data load kara sakte ho
    onGroupChange?.(group);
  };

  return (
    <div className="bg-white rounded-2xl shadow px-10 py-4">
      {/* Header */}
      <div className="text-center mb-4">
        <h3 className="font-semibold text-gray-900 text-lg">
          Assembly Groups
        </h3>
      </div>

      {/* Slider */}
      <div className="relative">
        <Slider {...sliderSettings}>
          {assemblyGroups.map((group) => {
            const isActive = activeGroup === group.id;

            return (
              <div key={group.id} className="px-3">
                <motion.button
                  onClick={() => handleSelect(group)}
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
const handleGroupChange = (group) => {
  console.log("Selected Assembly Group:", group);
  // example:
  // fetchData(group.start, group.end)
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


const AssemblyLineCard = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
        {Array.from({ length: 25 }).map((_, i) => {
          const AssemblyLineName = `AssemblyLineName ${i + 1}`;

          return (
            <Card
              key={i}
              className="bg-white rounded-lg shadow cursor-pointer hover:shadow-lg transition"
              onClick={() =>
  navigate("/AssemblyLinePreformance", {
    state: { AssemblyLineName },
  })
}
            >
              <CardContent className="space-y-2">
                <p className="font-bold text-black text-m text-center">
                  {AssemblyLineName}
                </p>

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
          );
        })}
      </div>
    </div>
  );
};

const Assembly = () => {
  return (
    <DashboardLayout>
      <div className="pl-6 pr-6 pb-6 space-y-8 bg-gray-100 min-h-screen">
        <FilterBar />

      <AssmblySelector onGroupChange={handleGroupChange} />

        <AssemblyLineCard />

      </div>
    </DashboardLayout>
  );
};

export default Assembly
