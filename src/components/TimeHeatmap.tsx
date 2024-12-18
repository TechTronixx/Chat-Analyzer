import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface TimeHeatmapProps {
  hourlyData: number[];
}

export const TimeHeatmap = ({ hourlyData }: TimeHeatmapProps) => {
  const data = hourlyData.map((value, hour) => ({
    hour: `${hour}:00`,
    messages: value,
  }));

  return (
    <div className="w-full h-96 px-4 py-4 ">
      <h3 className="text-lg font-semibold mb-4">Messages by Hour</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="hour" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="messages" fill="blue" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
