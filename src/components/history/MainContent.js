'use client';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function HistoryContent() {
  const data = [
    { date: "01 Dec", transactions: 34 },
    { date: "02 Dec", transactions: 42 },
    { date: "03 Dec", transactions: 38 },
    { date: "04 Dec", transactions: 55 },
    { date: "05 Dec", transactions: 48 },
    { date: "06 Dec", transactions: 60 },
    { date: "07 Dec", transactions: 52 },
  ];

  return (
    <main className="ml-64 p-8">
      <section className="mb-6">
        <h1 className="text-3xl font-bold text-secondary">Transaction History</h1>
        <p className="text-textSecondary mt-2">
          Analyze past transaction trends over time to identify patterns and optimize performance.
        </p>
      </section>

      <section className="bg-elementBackground p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold text-secondary mb-4">Weekly Transaction Overview</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2C2C2C" />
            <XAxis dataKey="date" tick={{ fill: "#A8A8A8" }} />
            <YAxis tick={{ fill: "#A8A8A8" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1A1A1A",
                borderRadius: "8px",
                border: "none",
              }}
              labelStyle={{ color: "#FFD700" }}
              itemStyle={{ color: "#FFFFFF" }}
            />
            <Line
              type="monotone"
              dataKey="transactions"
              stroke="#00C896"
              strokeWidth={3}
              dot={{ r: 5, stroke: "#00C896", fill: "#1A1A1A", strokeWidth: 2 }}
              activeDot={{ r: 8, fill: "#00E6A0" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </section>

      <section className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-elementBackground p-6 rounded-lg shadow-md">
          <h3 className="text-sm font-semibold text-secondary">Total Transactions</h3>
          <p className="text-2xl font-bold text-primary mt-2">329</p>
        </div>
        <div className="bg-elementBackground p-6 rounded-lg shadow-md">
          <h3 className="text-sm font-semibold text-secondary">Highest in a Day</h3>
          <p className="text-2xl font-bold text-primary mt-2">60</p>
        </div>
        <div className="bg-elementBackground p-6 rounded-lg shadow-md">
          <h3 className="text-sm font-semibold text-secondary">Average Daily Transactions</h3>
          <p className="text-2xl font-bold text-primary mt-2">47</p>
        </div>
      </section>
    </main>
  );
}
