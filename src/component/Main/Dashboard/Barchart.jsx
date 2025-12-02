import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useGetServicePopularityQuery } from "../../../redux/features/worker/worker";

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

const ServicePopularityChart = () => {
  const current = new Date();
  const currentMonth = current.getMonth() + 1; // 1-12
  const currentYear = current.getFullYear();

  const { data: servicePopularityData } = useGetServicePopularityQuery({
    month: currentMonth,
    year: currentYear,
  });

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

  // Calculate Y-axis max value
  const serviceYMax = useMemo(
    () => calculateYAxisMax(serviceData, "value"),
    [serviceData]
  );

  // Generate ticks
  const serviceTicks = useMemo(
    () => generateYAxisTicks(serviceYMax),
    [serviceYMax]
  );

  return (
    <div className="bg-white shadow-sm rounded-xl p-4 border border-pink-100">
      <h3 className="text-sm font-semibold text-gray-700 mb-2">
        Service Popularity
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={serviceData} barSize={40}>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#f3d1dc"
          />
          <XAxis
            dataKey="serviceName"
            tick={{ fill: "#666", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            ticks={serviceTicks}
            domain={[0, serviceYMax]}
            tick={{ fill: "#666", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(val) => (val === serviceYMax ? "Ꝏ" : val)}
          />
          <Tooltip cursor={{ fill: "#fde6ef" }} />
          <Bar dataKey="value" fill="#e91e63" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ServicePopularityChart;
