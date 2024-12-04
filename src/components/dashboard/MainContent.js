'use client';
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { executeAgentTask } from "@/brian/executeAgentTask";

export default function MainContent() {
  const [agentsData, setAgentsData] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [gasData, setGasData] = useState([]);
  const [transactionStatusData, setTransactionStatusData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      setLoading(true);
      try {
        // Fetch agents data
        const response = await fetch('/api/agents');
        const agents = await response.json();
        setAgentsData(agents);

        // Fetch gas data (mock example)
        const gasResponse = await fetch('/api/gas-data');
        const gas = await gasResponse.json();
        setGasData(gas);

        // Fetch transaction status data (mock example)
        const transactionResponse = await fetch('/api/transaction-status');
        const transactions = await transactionResponse.json();
        setTransactionStatusData(transactions);

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboardData();
  }, []);

  const COLORS = ['#00C896', '#FF4C4C', '#FFD700']; // Colores para gráficas de pastel

  return (
    <main className="ml-64 p-8 flex-1 bg-background text-secondary overflow-y-auto">
      {/* Key Metrics Section */}
      <section className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-12">
        {[{
          title: "Active Agents",
          value: loading ? "..." : agentsData.length,
          description: "Agents currently running tasks.",
          color: "text-primary",
        }, {
          title: "Transactions Processed",
          value: "1,254",
          description: "Total transactions completed successfully.",
          color: "text-success",
        }, {
          title: "Total Gas Saved",
          value: "AVAX 123.45",
          description: "Amount saved by optimized transactions.",
          color: "text-accent",
        }, {
          title: "Alerts Triggered",
          value: "15",
          description: "Critical issues detected in monitored contracts.",
          color: "text-error",
        }].map((metric, idx) => (
          <div
            key={idx}
            className="p-6 bg-elementBackground rounded-lg shadow-lg flex flex-col"
          >
            <h3 className={`text-lg font-bold ${metric.color} mb-2`}>
              {metric.title}
            </h3>
            <p className="text-4xl font-bold">{metric.value}</p>
            <p className="text-textSecondary mt-2">{metric.description}</p>
          </div>
        ))}
      </section>

      {/* Gas Insights */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Gas Insights</h2>
        <div className="p-6 bg-elementBackground rounded-lg shadow-lg">
          {gasData.length === 0 ? (
            <p className="text-textSecondary">No gas data available at the moment.</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={gasData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="time" stroke="#A8A8A8" />
                <YAxis stroke="#A8A8A8" />
                <Tooltip contentStyle={{ backgroundColor: "#2C2C2C", border: "none" }} />
                <Bar dataKey="gasPrice" fill="#00C896" />
              </BarChart>
            </ResponsiveContainer>
          )}
          <p className="text-sm text-textSecondary mt-4">
            Current trends in gas prices for optimal transaction planning.
          </p>
        </div>
      </section>

      {/* Transaction Status */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Transaction Status</h2>
        <div className="p-6 bg-elementBackground rounded-lg shadow-lg">
          {transactionStatusData.length === 0 ? (
            <p className="text-textSecondary">No transaction status data available.</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={transactionStatusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  label
                >
                  {transactionStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
          <p className="text-sm text-textSecondary mt-4">
            Breakdown of transaction statuses managed by OCIA agents.
          </p>
        </div>
      </section>

      {/* Active Agents */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Active Agents</h2>
        {loading ? (
          <p className="text-textSecondary">Loading agents...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agentsData.map((agent, idx) => (
              <div
                key={idx}
                className="p-6 bg-elementBackground rounded-lg shadow-lg flex flex-col justify-between hover:scale-105 transform transition-transform"
              >
                <h3 className="text-lg font-bold text-primary mb-2">
                  {agent.name}
                </h3>
                <p className="text-sm text-textSecondary mb-4">
                  {agent.task || "No task assigned."}
                </p>
                <p className="text-sm">
                  <strong>Status:</strong>{" "}
                  <span
                    className={`${
                      agent.status === "active" ? "text-success" : "text-error"
                    }`}
                  >
                    {agent.status}
                  </span>
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Recent Activity */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
        <div className="p-6 bg-elementBackground rounded-lg shadow-lg">
          {activityLogs.length === 0 ? (
            <p className="text-textSecondary">No activity logged yet.</p>
          ) : (
            <ul className="space-y-2">
              {activityLogs.map((log, idx) => (
                <li key={idx} className="text-sm text-textSecondary">
                  <strong>{new Date(log.timestamp).toLocaleString()}:</strong>{" "}
                  {log.details}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
}
