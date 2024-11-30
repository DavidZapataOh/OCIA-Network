'use client';
import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function MainContent() {
  const [agentsData, setAgentsData] = useState([]);
  const [loading, setLoading] = useState(true);

  const performanceData = [
    { name: "Jan", Transactions: 400, SuccessRate: 90 },
    { name: "Feb", Transactions: 800, SuccessRate: 85 },
    { name: "Mar", Transactions: 700, SuccessRate: 92 },
    { name: "Apr", Transactions: 1000, SuccessRate: 87 },
  ];

  useEffect(() => {
    async function fetchAgents() {
      setLoading(true);
      try {
        // Fetch sample agents
        const response = await fetch('/api/agents');
        const data = await response.json();
        setAgentsData(data);
      } catch (error) {
        console.error("Error fetching agents data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchAgents();
  }, []);

  return (
    <main className="ml-64 p-8 flex-1 bg-background text-secondary overflow-y-auto">
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        {[
          {
            title: "Active Agents",
            value: loading ? "..." : agentsData.length,
            description: "Agents currently running tasks.",
            color: "text-primary",
          },
          {
            title: "Transactions Processed",
            value: "1,254",
            description: "Total transactions completed successfully.",
            color: "text-success",
          },
          {
            title: "Success Rate",
            value: "92%",
            description: "Overall success rate of all tasks.",
            color: "text-accent",
          },
        ].map((metric, idx) => (
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

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Performance Insights</h2>
        <div className="p-6 bg-elementBackground rounded-lg shadow-lg">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="name" stroke="#A8A8A8" />
              <YAxis stroke="#A8A8A8" />
              <Tooltip contentStyle={{ backgroundColor: "#2C2C2C", border: "none" }} />
              <Line type="monotone" dataKey="Transactions" stroke="#00C896" strokeWidth={2} />
              <Line type="monotone" dataKey="SuccessRate" stroke="#FFD700" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Active Agents</h2>
        {loading ? (
          <p className="text-textSecondary">Loading agents...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agentsData.map((agent, idx) => (
              <div
                key={idx}
                className="p-6 bg-elementBackground rounded-lg shadow-lg flex flex-col justify-between"
              >
                <h3 className="text-lg font-bold text-primary mb-2">{agent.name}</h3>
                <p className="text-sm text-textSecondary mb-4">{agent.description}</p>
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

      <section>
        <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
        <div className="p-6 bg-elementBackground rounded-lg shadow-lg">
          <p className="text-textSecondary">
            Logs and tasks will appear here in real-time.
          </p>
        </div>
      </section>
    </main>
  );
}