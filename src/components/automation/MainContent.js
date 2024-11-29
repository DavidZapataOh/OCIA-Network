'use client';
import { useState } from 'react';

export default function MainContent() {
  const [agents, setAgents] = useState([
    { name: "Agent 1", status: "active", task: "Monitor Transactions" },
    { name: "Agent 2", status: "inactive", task: "Execute Arbitrage" },
  ]);
  const [showModal, setShowModal] = useState(false);

  const handleCreateAgent = (newAgent) => {
    setAgents([...agents, newAgent]);
    setShowModal(false);
  };

  return (
    <main className="ml-64 p-8 flex-1 bg-background text-secondary">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Automation</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-primary px-6 py-3 rounded-lg text-secondary hover:bg-primaryHover transition"
        >
          Create New Agent
        </button>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent, idx) => (
          <div
            key={idx}
            className="p-6 bg-elementBackground rounded-lg shadow-md flex flex-col justify-between"
          >
            <h3 className="text-lg font-bold text-primary">{agent.name}</h3>
            <p className="text-sm text-textSecondary">{agent.task}</p>
            <p
              className={`text-sm ${
                agent.status === "active" ? "text-success" : "text-error"
              }`}
            >
              {agent.status.toUpperCase()}
            </p>
          </div>
        ))}
      </section>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-elementBackground p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold text-primary mb-4">Create New Agent</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const newAgent = {
                  name: formData.get("name"),
                  task: formData.get("task"),
                  status: "active",
                };
                handleCreateAgent(newAgent);
              }}
            >
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm text-textSecondary">
                  Agent Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="w-full px-4 py-2 rounded-lg bg-background text-secondary placeholder-textSecondary focus:outline-none"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="task" className="block text-sm text-textSecondary">
                  Task
                </label>
                <input
                  type="text"
                  name="task"
                  id="task"
                  className="w-full px-4 py-2 rounded-lg bg-background text-secondary placeholder-textSecondary focus:outline-none"
                  required
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-[#2A2A2A] px-4 py-2 rounded-lg text-secondary hover:bg-[#333] transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-primary px-4 py-2 rounded-lg text-secondary hover:bg-primaryHover transition"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
