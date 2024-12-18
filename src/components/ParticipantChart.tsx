import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface ParticipantChartProps {
  participants: { name: string; count: number }[];
}

const COLORS = ["blue", "green", "red", "orange", "purple"];

export const ParticipantChart = ({ participants }: ParticipantChartProps) => {
  return (
    <div className="w-full h-64">
      <h3 className="text-lg font-semibold mb-4">Top Participants</h3>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={participants}
            dataKey="count"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label
          >
            {participants.map((entry, index) => (
              <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
