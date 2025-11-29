import React, { useMemo, useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { Tabs, Select, Space } from "antd";
import { useGetBookingsTrendsQuery } from "../../redux/features/booking/booking";
import { useGetWorkerPopularityQuery } from "../../redux/features/worker/worker";

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const monthOptions = months.map((m) => ({ label: m, value: m }));
const current = new Date();
const defaultMonth = months[current.getMonth()];
const defaultYear = current.getFullYear();
const yearOptions = [
  defaultYear - 2,
  defaultYear - 1,
  defaultYear,
  defaultYear + 1,
].map((y) => ({ label: String(y), value: y }));

// Utility function to generate service data
function getServiceData(year, month) {
  const idx = month - 1; // month is 1-based, so subtract 1 to get the index
  const seed = (year % 97) * 31 + idx * 17;

  const candidates = ["Manicure", "Pedicure", "Gel", "Pedicure", "Other"];
  const count = 2 + seeded(seed, 2); // 2 or 3 services

  const offset = seeded(seed, candidates.length);
  const rotated = [...candidates.slice(offset), ...candidates.slice(0, offset)];
  const picked = rotated
    .filter((s) => !(s === "Other" && seeded(seed * 7, 2) === 0))
    .slice(0, count);

  return picked.map((service, i) => {
    const base = 60 + seeded(seed * (i + 3), 140);
    return { service, value: base };
  });
}

// Utility function to generate worker data
function getWorkerData(year, month) {
  const idx = month - 1;
  const factor = 0.88 + ((year + idx) % 8) * 0.02;
  return baseWorkerData.map((w, i) => ({
    ...w,
    value: Math.round(w.value * (factor + (i % 4) * 0.02)),
  }));
}

// Utility function to generate booking trends data
function getBookingTrends(year) {
  return months.map((m, i) => {
    const omega = (i / 12) * Math.PI * 2;
    const confirmed = 260 + Math.sin(omega) * 90 + 70;
    const cancelled = 30 + Math.cos(omega) * 18 + 20;
    return {
      month: m,
      confirmed: Math.round(confirmed),
      cancelled: Math.round(cancelled),
    };
  });
}

// Helper function to generate seeded values
function seeded(seed, mod) {
  return ((seed % mod) + mod) % mod;
}

// Base worker data
const baseWorkerData = [
  { name: "John", value: 400 },
  { name: "Liam", value: 300 },
  { name: "Jack", value: 200 },
  { name: "Hershali", value: 280 },
  { name: "Maksud", value: 190 },
  { name: "Kutub", value: 240 },
  { name: "Jangu", value: 350 },
  { name: "Monalisa", value: 270 },
  { name: "Orries", value: 320 },
  { name: "Mories", value: 290 },
  { name: "Nova", value: 310 },
  { name: "Don Kiele", value: 380 },
];

// Chart Wrapper Component
const ChartWrapper = ({ children, height = 380 }) => (
  <div className="bg-white shadow-sm rounded-xl p-4 md:p-6 w-full mt-3">
    <ResponsiveContainer width="100%" height={height}>
      {children}
    </ResponsiveContainer>
  </div>
);

const Analytics = () => {
  const [activeKey, setActiveKey] = useState("1");
  const [selectedMonth, setSelectedMonth] = useState(defaultMonth);
  const [selectedYear, setSelectedYear] = useState(defaultYear);

  // Fetch data using the selected month and year
  const { data: bookingTrendsData } = useGetBookingsTrendsQuery(selectedYear);
  const { data: workerPopuData } = useGetWorkerPopularityQuery({
    month: months.indexOf(selectedMonth) + 1,
    year: selectedYear,
  });

  const workerPopularity = workerPopuData?.data;
  const bookingTrends = bookingTrendsData?.data;

  // Generate service, worker, and booking data
  const serviceData = useMemo(
    () => getServiceData(selectedYear, months.indexOf(selectedMonth) + 1),
    [selectedMonth, selectedYear]
  );

  const workerData = useMemo(
    () => getWorkerData(selectedYear, months.indexOf(selectedMonth) + 1),
    [selectedMonth, selectedYear]
  );

  const bookingTrendsFormatted = useMemo(
    () =>
      bookingTrends?.map((trend) => ({
        month: trend.month,
        confirmed: trend.totalBookings,
        cancelled: 0, // you can modify this if you have cancelled booking data
      })) || [],
    [bookingTrends]
  );

  const serviceCount = serviceData.length;
  const chartWidth = Math.max(serviceCount * 120, 300);

  const extraFilters = (
    <Space size={8} className="ml-auto">
      <Select
        value={selectedMonth}
        onChange={setSelectedMonth}
        options={monthOptions}
        size="middle"
        className="w-28"
      />
      <Select
        value={selectedYear}
        onChange={setSelectedYear}
        options={yearOptions}
        size="middle"
        className="w-24"
      />
    </Space>
  );

  const items = [
    {
      key: "1",
      label: "Service Popularity",
      children: (
        <div className="bg-white shadow-sm rounded-xl p-4 md:p-6 w-full mt-3">
          <div className="overflow-x-auto" style={{ width: "100%" }}>
            <div style={{ minWidth: "280px" }}>
              <ResponsiveContainer width="100%" height={380}>
                <BarChart
                  data={serviceData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
                  barCategoryGap="15%"
                  barGap={10}
                  barSize={35}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3d2db" />
                  <XAxis
                    dataKey="service"
                    stroke="#555"
                    interval={0}
                    tickMargin={10}
                  />
                  <YAxis
                    ticks={[0, 150, 300, 450, 600]}
                    domain={[0, 600]}
                    tick={{ fill: "#666", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(val) => (val === 600 ? "Ꝏ" : val)}
                  />
                  <Tooltip />
                  <Bar
                    dataKey="value"
                    fill="#e91e63"
                    barSize={40}
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "2",
      label: "Worker Popularity",
      children: (
        <div className="bg-white shadow-sm rounded-xl p-4 md:p-6 w-full mt-3">
          <ResponsiveContainer width="100%" height={380}>
            <BarChart data={workerData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3d2db" />
              <XAxis dataKey="name" stroke="#555" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#e91e63" barSize={35} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ),
    },
    {
      key: "3",
      label: "Booking Trends",
      children: (
        <div className="bg-white shadow-sm rounded-xl p-4 md:p-6 w-full mt-3 border border-pink-100">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            Booking Trends
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart
              data={bookingTrendsFormatted}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorConfirmed" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#e91e63" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#e91e63" stopOpacity={0.05} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f3d1dc"
              />
              <XAxis
                dataKey="month"
                tick={{ fill: "#666", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                ticks={[0, 150, 300, 450, 600]}
                domain={[0, 600]}
                tick={{ fill: "#666", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(val) => (val === 600 ? "Ꝏ" : val)}
              />
              <Tooltip
                cursor={{ stroke: "#e91e63", strokeWidth: 1 }}
                contentStyle={{
                  backgroundColor: "#fff",
                  borderRadius: "8px",
                  border: "1px solid #f3d1dc",
                }}
              />

              <Area
                type="monotone"
                dataKey="confirmed"
                stroke="#e91e63"
                fill="url(#colorConfirmed)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 md:p-6 min-h-screen overflow-x-auto md:w-[420px] lg:w-[680px] xl:w-full">
      <h1 className="text-xl font-semibold text-gray-800 mb-4">Analytics</h1>

      <div className="bg-white rounded-lg p-3 md:p-4 shadow-sm">
        <Tabs
          activeKey={activeKey}
          onChange={setActiveKey}
          items={items}
          className="analytics-tabs"
          tabBarGutter={24}
          size="large"
          tabBarStyle={{ marginBottom: 16 }}
          tabBarExtraContent={extraFilters}
        />
      </div>
    </div>
  );
};

export default Analytics;
