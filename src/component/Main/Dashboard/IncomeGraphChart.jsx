import { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useBookingRevenueQuery } from "../../../redux/features/analytics/analytics";

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

const RevenueReportChart = () => {
  const { data } = useBookingRevenueQuery();
  const bookingRevenue = data;
  console.log(bookingRevenue)

  // Prepare revenue data from API
  const revenueData = useMemo(() => {
    return (
      bookingRevenue?.revenue?.map((item) => ({
        name: item.month,
        value: item.revenue,
      })) || []
    );
  }, [bookingRevenue]);

  // Calculate Y-axis max value
  const revenueYMax = useMemo(
    () => calculateYAxisMax(revenueData, "value"),
    [revenueData]
  );

  // Generate ticks
  const revenueTicks = useMemo(
    () => generateYAxisTicks(revenueYMax),
    [revenueYMax]
  );

  return (
    <div className="bg-white shadow-sm rounded-xl p-4 border border-pink-100">
      <h3 className="text-sm font-semibold text-gray-700 mb-2">
        Revenue Report
      </h3>

      <ResponsiveContainer width="100%" height={250}>
        <AreaChart
          data={revenueData}
          margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
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
            dataKey="name"
            tick={{ fill: "#666", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            ticks={revenueTicks}
            domain={[0, revenueYMax]}
            tick={{ fill: "#666", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(val) => (val === revenueYMax ? "Ꝏ" : val)}
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
            dataKey="value"
            stroke="#e91e63"
            fill="url(#colorRevenue)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueReportChart;
