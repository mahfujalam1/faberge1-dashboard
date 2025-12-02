import { useMemo, useState } from "react";
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
import {
  useGetServicePopularityQuery,
  useGetWorkerPopularityQuery,
} from "../../redux/features/worker/worker";

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

// Helper function to calculate Y-axis max (highest value + 30%)
const calculateYAxisMax = (data, dataKey) => {
  if (!data || data.length === 0) return 100;
  const maxValue = Math.max(...data.map((item) => item[dataKey] || 0));
  return Math.ceil(maxValue * 1.3); // 30% more than highest value
};

// Helper function to generate Y-axis ticks
const generateYAxisTicks = (maxValue) => {
  const step = Math.ceil(maxValue / 4);
  return [0, step, step * 2, step * 3, maxValue];
};

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
  const { data: servicePopularityData } = useGetServicePopularityQuery({
    month: months.indexOf(selectedMonth) + 1,
    year: selectedYear,
  });

  const workerPopularity = workerPopuData?.data;
  const bookingTrends = bookingTrendsData?.data;
  const servicePopularity = servicePopularityData?.data;

  // Prepare service data with actual totalBookings
  const serviceData = useMemo(() => {
    return (
      servicePopularity?.map((service) => ({
        serviceName: service.serviceName,
        value: service.totalBookings,
      })) || []
    );
  }, [servicePopularity]);

  // Prepare worker data with actual totalBookings
  const workerData = useMemo(() => {
    return (
      workerPopularity?.map((worker) => ({
        workerName: worker.workerName,
        value: worker.totalBookings,
      })) || []
    );
  }, [workerPopularity]);

  // Prepare booking trends data
  const bookingTrendsFormatted = useMemo(() => {
    return (
      bookingTrends?.map((trend) => ({
        month: trend.month,
        confirmed: trend.totalBookings,
      })) || []
    );
  }, [bookingTrends]);

  // Calculate Y-axis max values for each chart
  const serviceYMax = useMemo(
    () => calculateYAxisMax(serviceData, "value"),
    [serviceData]
  );
  const workerYMax = useMemo(
    () => calculateYAxisMax(workerData, "value"),
    [workerData]
  );
  const bookingYMax = useMemo(
    () => calculateYAxisMax(bookingTrendsFormatted, "confirmed"),
    [bookingTrendsFormatted]
  );

  // Generate ticks for each chart
  const serviceTicks = useMemo(
    () => generateYAxisTicks(serviceYMax),
    [serviceYMax]
  );
  const workerTicks = useMemo(
    () => generateYAxisTicks(workerYMax),
    [workerYMax]
  );
  const bookingTicks = useMemo(
    () => generateYAxisTicks(bookingYMax),
    [bookingYMax]
  );

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
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3d2db" />
                  <XAxis
                    dataKey="serviceName"
                    stroke="#555"
                    interval={0}
                    tickMargin={10}
                  />
                  <YAxis
                    ticks={serviceTicks}
                    domain={[0, serviceYMax]}
                    tick={{ fill: "#666", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(val) => (val === serviceYMax ? "Ꝏ" : val)}
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
              <XAxis dataKey="workerName" stroke="#555" />
              <YAxis
                ticks={workerTicks}
                domain={[0, workerYMax]}
                tick={{ fill: "#666", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(val) => (val === workerYMax ? "Ꝏ" : val)}
              />
              <Tooltip />
              <Bar
                dataKey="value"
                fill="#e91e63"
                barSize={35}
                radius={[6, 6, 0, 0]}
              />
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
                ticks={bookingTicks}
                domain={[0, bookingYMax]}
                tick={{ fill: "#666", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(val) => (val === bookingYMax ? "Ꝏ" : val)}
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
