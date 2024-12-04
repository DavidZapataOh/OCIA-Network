'use client';
import { useState, useEffect, useCallback } from "react";
import { executeAgentTask } from "@/brian/executeAgentTask";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaExclamationTriangle, FaGasPump, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { ethers } from 'ethers';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";
import { motion, AnimatePresence } from 'framer-motion';
import SecurityAnalysis from './SecurityAnalysis';
import SecuritySummary from './SecuritySummary';
import SecurityModal from './SecurityModal';
import TestSuiteViewer from './TestSuiteViewer';
import TestSummary from './TestSummary';
import TestModal from "./TestModal";
import TransactionSummary from './TransactionSummary';
import TransactionModal from './TransactionModal';
import GasSummary from './GasSummary';
import GasModal from './GasModal';

export default function MainContent() {
  const [agents, setAgents] = useState([
    {
      name: "Gas Optimizer",
      status: "active",
      task: "real_time_gas_optimizer",
      transactions: 120,
      errors: 3,
      gasSaved: "AVAX 10.5",
      metrics: [
        { timestamp: '1h', gasPrice: 25, savedAmount: 2.1 },
        { timestamp: '2h', gasPrice: 30, savedAmount: 1.8 },
        { timestamp: '3h', gasPrice: 28, savedAmount: 2.3 },
        { timestamp: '4h', gasPrice: 32, savedAmount: 2.7 },
        { timestamp: '5h', gasPrice: 27, savedAmount: 1.6 },
        { timestamp: '6h', gasPrice: 29, savedAmount: 2.0 }
      ]
    },
    {
      name: "Contract Monitor",
      status: "inactive",
      task: "contract_security_monitor",
      transactions: 0,
      errors: 0,
      gasSaved: "AVAX 0.0",
      metrics: [
        { timestamp: '1h', riskScore: 20, alerts: 0 },
        { timestamp: '2h', riskScore: 25, alerts: 1 },
        { timestamp: '3h', riskScore: 15, alerts: 0 },
        { timestamp: '4h', riskScore: 30, alerts: 2 },
        { timestamp: '5h', riskScore: 18, alerts: 0 },
        { timestamp: '6h', riskScore: 22, alerts: 1 }
      ]
    },
    {
      name: "Transaction Scheduler",
      status: "active",
      task: "transaction_reviewer",
      transactions: 45,
      errors: 1,
      gasSaved: "AVAX 2.8",
      metrics: [
        { timestamp: '1h', analyzedTx: 15, flaggedTx: 2 },
        { timestamp: '2h', analyzedTx: 12, flaggedTx: 1 },
        { timestamp: '3h', analyzedTx: 18, flaggedTx: 3 },
        { timestamp: '4h', analyzedTx: 10, flaggedTx: 0 },
        { timestamp: '5h', analyzedTx: 14, flaggedTx: 1 },
        { timestamp: '6h', analyzedTx: 16, flaggedTx: 2 }
      ]
    }
  ]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [taskType, setTaskType] = useState('');
  const [taskConfig, setTaskConfig] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const ITEMS_PER_PAGE = 5;
  const [isTaskRunning, setIsTaskRunning] = useState({});
  const [globalStats, setGlobalStats] = useState({
    activeAgents: 0,
    totalGasSaved: 0,
    totalErrors: 0,
    totalTransactions: 0
  });
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [selectedTestSuite, setSelectedTestSuite] = useState(null);
  const [selectedTransactionAnalysis, setSelectedTransactionAnalysis] = useState(null);
  const [selectedGasAnalysis, setSelectedGasAnalysis] = useState(null);

  const availableTasks = [
    {
      id: 'real_time_gas_optimizer',
      name: 'Real-Time Gas Optimizer',
      description: 'Optimizes gas costs in real-time by monitoring network conditions',
      questions: [
        {
          id: 'max_gas_price',
          label: 'Maximum gas price (in GWEI)',
          type: 'text',
          placeholder: 'Ex: 100',
          validation: value => {
            const num = parseFloat(value);
            return !isNaN(num) && num > 0 && num < 1000;
          },
          helperText: 'Maximum acceptable gas price in GWEI'
        },
        {
          id: 'optimization_level',
          label: 'Optimization Level',
          type: 'select',
          options: [
            { value: 'low', label: 'Low - Minimal optimizations, safer execution' },
            { value: 'medium', label: 'Medium - Balanced optimizations' },
            { value: 'high', label: 'High - Aggressive optimizations, higher risk' }
          ],
          defaultValue: 'medium',
          validation: value => ['low', 'medium', 'high'].includes(value),
          helperText: 'Choose how aggressively to optimize gas usage'
        }
      ],
      metrics: ['gasSaved', 'optimizationScore', 'successRate']
    },
    {
      id: 'contract_security_monitor',
      name: 'Contract Security Monitor',
      description: 'Monitors smart contracts for potential security issues',
      questions: [
        {
          id: 'contract_address',
          label: 'Contract address to monitor',
          type: 'text',
          placeholder: '0x...',
          validation: value => ethers.isAddress(value)
        },
        {
          id: 'alert_threshold',
          label: 'Risk threshold (1-100)',
          type: 'number',
          placeholder: 'Ex: 80',
          validation: value => value >= 1 && value <= 100
        }
      ],
      metrics: ['riskScore', 'alerts', 'vulnerabilities']
    },
    {
      id: 'onchain_test_automation',
      name: 'On-Chain Test Automation',
      description: 'Automates testing of smart contracts on-chain',
      questions: [
        {
          id: 'test_contract',
          label: 'Test contract address',
          type: 'text',
          placeholder: '0x...',
          validation: value => ethers.isAddress(value)
        },
        {
          id: 'test_frequency',
          label: 'Test frequency (in minutes)',
          type: 'number',
          placeholder: 'Ex: 60',
          validation: value => value >= 5 && value <= 1440
        }
      ],
      metrics: ['testsPassed', 'testsFailed', 'coverage']
    },
    {
      id: 'transaction_reviewer',
      name: 'Transaction Reviewer',
      description: 'Analyzes transaction patterns and behaviors for a specific address',
      questions: [
        {
          id: 'address',
          label: 'Address to Monitor',
          type: 'text',
          placeholder: 'Enter wallet or contract address (0x...)',
          validation: value => value && value.length === 42 && value.startsWith('0x'),
          helperText: 'The address whose transaction patterns you want to analyze'
        },
        {
          id: 'min_transaction_value',
          label: 'Minimum Transaction Value (AVAX)',
          type: 'text',
          placeholder: 'Ex: 0.001',
          validation: value => {
            const num = parseFloat(value);
            return !isNaN(num) && num > 0;
          },
          helperText: 'Only analyze transactions above this value (can be decimal)'
        },
        {
          id: 'alert_patterns',
          label: 'Alert Patterns',
          type: 'text',
          placeholder: 'high_value, flash_loan, unusual_pattern',
          validation: value => value.length > 0,
          helperText: 'Comma-separated list of patterns to detect'
        }
      ],
      metrics: ['analyzedTx', 'flaggedTx', 'accuracy']
    },
    {
      id: 'onchain_data_analyzer',
      name: 'On-Chain Data Analyzer',
      description: 'Analyzes on-chain data for patterns and insights',
      questions: [
        {
          id: 'data_type',
          label: 'Data type to analyze',
          type: 'select',
          options: ['transactions', 'contracts', 'tokens', 'defi'],
          validation: value => ['transactions', 'contracts', 'tokens', 'defi'].includes(value)
        },
        {
          id: 'analysis_period',
          label: 'Analysis period (in hours)',
          type: 'number',
          placeholder: 'Ex: 24',
          validation: value => value >= 1 && value <= 168
        }
      ],
      metrics: ['dataPoints', 'insights', 'predictions']
    }
  ];

  const validateTaskConfig = (taskType, config) => {
    const task = availableTasks.find(t => t.id === taskType);
    if (!task) return false;

    return task.questions.every(question => {
      const value = config[question.id];
      return question.validation(value);
    });
  };

  const calculateGlobalStats = useCallback(() => {
    const stats = agents.reduce((acc, agent) => ({
      activeAgents: acc.activeAgents + (agent.status === "active" ? 1 : 0),
      totalGasSaved: acc.totalGasSaved + parseFloat(agent.gasSaved.split(' ')[1]),
      totalErrors: acc.totalErrors + agent.errors,
      totalTransactions: acc.totalTransactions + agent.transactions
    }), {
      activeAgents: 0,
      totalGasSaved: 0,
      totalErrors: 0,
      totalTransactions: 0
    });
    setGlobalStats(stats);
  }, [agents]);

  useEffect(() => {
    calculateGlobalStats();
  }, [agents, calculateGlobalStats]);

  const handleRunTask = async (agent) => {
    try {
      // Verify API configuration
      if (!process.env.NEXT_PUBLIC_BRIAN_API_KEY || !process.env.NEXT_PUBLIC_BRIAN_API_URL) {
        throw new Error("API configuration is missing. Please check your environment variables.");
      }

      // Verify agent configuration
      if (!agent.taskConfig) {
        throw new Error("Agent configuration is missing");
      }

      setIsTaskRunning(prev => ({ ...prev, [agent.name]: true }));
      const toastId = toast.loading(`Running task for ${agent.name}...`);
      
      let result;
      
      try {
        result = await executeAgentTask(agent.task, {
          ...agent.taskConfig,
          prompt: generatePromptForTask(agent.task, agent.taskConfig)
        });
        
        if (!result) {
          throw new Error("No result received from API");
        }

        // Update recent activity with detailed response
        setRecentActivity(prev => [{
          timestamp: new Date().toLocaleString(),
          agent: agent.name,
          task: agent.task,
          response: formatTaskResponse(result),
          status: 'success'
        }, ...prev]);

        // Update agent metrics based on task result
        setAgents(prev => prev.map(a => {
          if (a.name === agent.name) {
            const newMetrics = [...a.metrics];
            newMetrics.shift();
            
            // Add new data point based on task type
            const newMetric = generateMetricFromResult(agent.task, result);
            newMetrics.push(newMetric);
            
            return {
              ...a,
              metrics: newMetrics,
              transactions: a.transactions + 1,
              errors: a.errors + (result.error ? 1 : 0),
              gasSaved: updateGasSaved(a.gasSaved, result)
            };
          }
          return a;
        }));

        toast.update(toastId, {
          render: formatSuccessMessage(agent.name, result),
          type: "success",
          isLoading: false,
          autoClose: 3000
        });
      } catch (apiError) {
        console.error("API Error:", apiError);
        throw new Error(`API Error: ${apiError.message || 'Failed to execute task'}`);
      }
    } catch (error) {
      console.error("Task Error:", error);
      const errorMessage = error.message || "Unknown error occurred";
      toast.error(`Task error: ${errorMessage}`, {
        autoClose: 5000,
        hideProgressBar: false,
      });
      setRecentActivity(prev => [{
        timestamp: new Date().toLocaleString(),
        agent: agent.name,
        task: agent.task,
        response: errorMessage,
        status: 'error'
      }, ...prev]);
    } finally {
      setIsTaskRunning(prev => ({ ...prev, [agent.name]: false }));
    }
  };

  const generatePromptForTask = (taskType, config) => {
    switch (taskType) {
      case 'contract_security_monitor':
        return `Analyze security risks for contract ${config.contract_address} with risk threshold ${config.alert_threshold}`;
      case 'real_time_gas_optimizer':
        return `Optimize gas usage with max price ${config.max_gas_price} AVAX`;
      case 'transaction_reviewer':
        return `Review transactions with minimum value ${config.min_transaction_value} AVAX looking for patterns: ${config.alert_patterns}`;
      case 'onchain_test_automation':
        return `Generate and execute test cases for contract ${config.test_contract}`;
      default:
        return '';
    }
  };

  const formatTaskResponse = (result) => {
    if (result.message) return result.message;
    
    if (result.analysis) {
      if (result.analysis.findings) {
        return (
          <SecuritySummary 
            analysis={result.analysis}
            onClick={() => setSelectedAnalysis(result.analysis)}
          />
        );
      }
      if (result.analysis.patterns_detected) {
        return (
          <TransactionSummary
            analysis={result.analysis}
            onClick={() => setSelectedTransactionAnalysis(result.analysis)}
          />
        );
      }
      if (result.analysis.optimization_score !== undefined) {
        return (
          <GasSummary
            analysis={result.analysis}
            onClick={() => setSelectedGasAnalysis(result.analysis)}
          />
        );
      }
    }
    
    if (result.test_suite) {
      return (
        <TestSummary
          testSuite={result.test_suite}
          onClick={() => setSelectedTestSuite(result.test_suite)}
        />
      );
    }
    
    if (result.details?.completion) return JSON.stringify(result.details.completion);
    return JSON.stringify(result);
  };

  const generateMetricFromResult = (taskType, result) => {
    const timestamp = '1h';
    switch (taskType) {
      case 'contract_security_monitor':
        return {
          timestamp,
          riskScore: result.analysis?.risk_score || 0,
          alerts: result.analysis?.findings?.length || 0,
          vulnerabilities: result.analysis?.findings?.filter(f => f.severity === 'HIGH').length || 0
        };
      case 'onchain_test_automation':
        return {
          timestamp,
          totalTests: result.test_suite?.summary?.total_tests || 0,
          coverage: parseInt(result.test_suite?.summary?.coverage_estimate || '0'),
          riskAreas: result.test_suite?.summary?.risk_areas?.length || 0
        };
      case 'real_time_gas_optimizer':
        return {
          timestamp,
          gasPrice: result.optimizations?.currentGasPrice || 0,
          savedAmount: result.optimizations?.savedAmount || 0
        };
      case 'transaction_reviewer':
        return {
          timestamp,
          analyzedTx: result.analyzedCount || 0,
          flaggedTx: result.flaggedCount || 0
        };
      default:
        return { timestamp, value: 0 };
    }
  };

  const handleStopAgent = (agentName) => {
    setAgents((prev) =>
      prev.map((agent) =>
        agent.name === agentName ? { ...agent, status: "inactive" } : agent
      )
    );
    toast.info(`Agent ${agentName} stopped`);
  };

  const handleCreateAgent = (newAgent) => {
    if (!validateTaskConfig(newAgent.task, newAgent.taskConfig)) {
      toast.error("Invalid configuration values");
      return;
    }

    const initialMetrics = Array(6).fill().map((_, i) => {
      const hour = 6 - i;
      switch (newAgent.task) {
        case 'real_time_gas_optimizer':
          return { timestamp: `${hour}h`, gasPrice: 0, savedAmount: 0 };
        case 'contract_security_monitor':
          return { timestamp: `${hour}h`, riskScore: 0, alerts: 0 };
        case 'transaction_reviewer':
          return { timestamp: `${hour}h`, analyzedTx: 0, flaggedTx: 0 };
        default:
          return { timestamp: `${hour}h`, value: 0 };
      }
    });
  
    const agentWithDefaults = {
      ...newAgent,
      metrics: initialMetrics,
      transactions: 0,
      errors: 0,
      gasSaved: "AVAX 0.0"
    };
    
    setAgents(prev => [...prev, agentWithDefaults]);
    setShowModal(false);
    toast.success(`Agent ${newAgent.name} created successfully`);
  };

  const updateGasSaved = (currentGasSaved, result) => {
    if (!result.optimizations?.savedAmount) return currentGasSaved;
    const current = parseFloat(currentGasSaved.split(' ')[1]);
    return `AVAX ${(current + result.optimizations.savedAmount).toFixed(2)}`;
  };

  const formatSuccessMessage = (agentName, result) => {
    if (result.message) return `Task completed: ${result.message}`;
    return `Task completed for ${agentName}`;
  };

  const openAgentDetails = (agent) => {
    setSelectedAgent(agent);
  };

  const handleReactivateAgent = (agentName) => {
    setAgents(prev =>
      prev.map(agent =>
        agent.name === agentName ? { ...agent, status: "active" } : agent
      )
    );
    toast.success(`Agent ${agentName} reactivated`);
  };

  const filteredActivities = recentActivity.filter(activity =>
    activity.agent.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.task.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedActivities = filteredActivities.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const GlobalStats = () => (
    <div className="grid grid-cols-4 gap-4 mb-8">
      <div className="bg-elementBackground p-4 rounded-lg">
        <h3 className="text-sm text-textSecondary">Active Agents</h3>
        <p className="text-2xl font-bold text-primary">{globalStats.activeAgents}</p>
      </div>
      <div className="bg-elementBackground p-4 rounded-lg">
        <h3 className="text-sm text-textSecondary">Total Gas Saved</h3>
        <p className="text-2xl font-bold text-success">AVAX {globalStats.totalGasSaved.toFixed(2)}</p>
      </div>
      <div className="bg-elementBackground p-4 rounded-lg">
        <h3 className="text-sm text-textSecondary">Total Errors</h3>
        <p className="text-2xl font-bold text-error">{globalStats.totalErrors}</p>
      </div>
      <div className="bg-elementBackground p-4 rounded-lg">
        <h3 className="text-sm text-textSecondary">Total Transactions</h3>
        <p className="text-2xl font-bold text-primary">{globalStats.totalTransactions}</p>
      </div>
    </div>
  );

  const PreviewConfig = ({ config, taskType }) => {
    const task = availableTasks.find(t => t.id === taskType);
    return (
      <div className="mt-4 p-4 bg-[#2A2A2A] rounded-lg">
        <h4 className="font-bold mb-2">Configuration Preview</h4>
        <ul className="space-y-2">
          {Object.entries(config).map(([key, value]) => (
            <li key={key} className="flex justify-between">
              <span className="text-textSecondary">
                {task?.questions.find(q => q.id === key)?.label}:
              </span>
              <span>{value}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const TaskMetrics = ({ task, metrics }) => {
    const taskType = availableTasks.find(t => t.id === task);
    
    return (
      <div className="mt-4">
        <ResponsiveContainer width="100%" height={200}>
          {taskType?.id === 'real_time_gas_optimizer' ? (
            <LineChart data={metrics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="gasPrice" stroke="#8884d8" />
              <Line type="monotone" dataKey="savedAmount" stroke="#82ca9d" />
            </LineChart>
          ) : taskType?.id === 'contract_security_monitor' ? (
            <BarChart data={metrics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="riskScore" fill="#8884d8" />
              <Bar dataKey="alerts" fill="#82ca9d" />
            </BarChart>
          ) : (
            <LineChart data={metrics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#8884d8" />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    );
  };

  const getDefaultTaskConfig = (taskType) => {
    switch (taskType) {
      case 'contract_security_monitor':
        return {
          contract_address: '',
          alert_threshold: 80
        };
      case 'transaction_reviewer':
        return {
          address: '',
          min_transaction_value: 1.0,
          alert_patterns: ['high_value', 'unusual_pattern', 'frequent_transfers']
        };
      case 'onchain_test_automation':
        return {
          test_contract: '',
          coverage_threshold: 85,
          test_types: ['security', 'functional', 'integration', 'gas']
        };
      case 'real_time_gas_optimizer':
        return {
          max_gas_price: 100,
          optimization_level: 'medium'
        };
      default:
        return {};
    }
  };

  return (
    <>
      <main className="ml-64 p-8 flex-1 bg-background text-secondary overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-primary">Automation</h1>
          <button
            onClick={() => setShowModal(true)}
            className="bg-primary px-6 py-3 rounded-lg text-secondary hover:bg-primaryHover transition"
          >
            Create New Agent
          </button>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {agents.map((agent, idx) => (
            <motion.div
              key={idx}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-6 bg-elementBackground rounded-lg shadow-lg"
            >
              <h3 className="text-lg font-bold text-primary mb-2 flex items-center gap-2">
                {agent.name}
                {agent.status === "active" ? 
                  <FaCheckCircle className="text-success" /> : 
                  <FaTimesCircle className="text-error" />
                }
              </h3>
              
              <div className="h-24 mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={agent.transactionHistory || [
                      { time: '6h', value: 0 },
                      { time: '5h', value: 0 },
                      { time: '4h', value: 0 },
                      { time: '3h', value: 0 },
                      { time: '2h', value: 0 },
                      { time: '1h', value: 0 },
                    ]}
                    margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis 
                      dataKey="time" 
                      stroke="#A8A8A8"
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      stroke="#A8A8A8"
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#2C2C2C',
                        border: 'none',
                        borderRadius: '4px',
                        color: '#fff'
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#4CAF50"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <FaGasPump className="text-primary" />
                <span>{agent.gasSaved}</span>
              </div>
              
              <div className="mt-4 space-x-4 flex">
                {agent.status === "active" ? (
                  <button
                    onClick={() => handleRunTask(agent)}
                    disabled={isTaskRunning[agent.name]}
                    className={`bg-primary px-4 py-2 rounded-lg text-secondary transition
                      ${isTaskRunning[agent.name] ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primaryHover'}`}
                  >
                    {isTaskRunning[agent.name] ? (
                      <span className="flex items-center">
                        <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                        </svg>
                        Running...
                      </span>
                    ) : 'Run Task'}
                  </button>
                ) : (
                  <button
                    onClick={() => handleReactivateAgent(agent.name)}
                    className="bg-success px-4 py-2 rounded-lg text-secondary hover:bg-successHover transition"
                  >
                    Reactivate
                  </button>
                )}
                <button
                  onClick={() => handleStopAgent(agent.name)}
                  className="bg-[#FF4C4C] px-4 py-2 rounded-lg text-secondary hover:bg-[#FF6C6C] transition"
                >
                  Stop
                </button>
                <button
                  onClick={() => openAgentDetails(agent)}
                  className="bg-[#2A2A2A] px-4 py-2 rounded-lg text-secondary hover:bg-[#333] transition"
                >
                  Details
                </button>
              </div>
              <TaskMetrics 
                task={agent.task} 
                metrics={agent.metrics || []} 
              />
            </motion.div>
          ))}
        </section>

        <section className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Recent Activity</h2>
            <input
              type="text"
              placeholder="Search activities..."
              className="px-4 py-2 rounded-lg bg-background text-secondary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="p-6 bg-elementBackground rounded-lg shadow-lg">
            {filteredActivities.length === 0 ? (
              <p className="text-textSecondary">No activities found.</p>
            ) : (
              <>
                <ul className="space-y-4">
                  {paginatedActivities.map((activity, idx) => (
                    <li key={idx} className="p-4 bg-[#2A2A2A] rounded-lg">
                      <p className="text-primary font-bold flex items-center gap-2">
                        {activity.agent}
                        <span className="text-sm text-textSecondary">{activity.timestamp}</span>
                      </p>
                      <p className="mt-2">{activity.response}</p>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex justify-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-lg bg-primary disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    disabled={paginatedActivities.length < ITEMS_PER_PAGE}
                    className="px-4 py-2 rounded-lg bg-primary disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </>
            )}
          </div>
        </section>

        {selectedAgent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-elementBackground p-6 rounded-lg shadow-2xl w-full max-w-lg">
              <h2 className="text-xl font-bold text-primary mb-4">{selectedAgent.name} - Details</h2>
              <p className="mb-2">
                <strong>Task:</strong> {selectedAgent.task}
              </p>
              <p className="mb-2">
                <strong>Status:</strong>{" "}
                <span className={selectedAgent.status === "active" ? "text-success" : "text-error"}>
                  {selectedAgent.status.toUpperCase()}
                </span>
              </p>
              <p className="mb-2">
                <strong>Transactions:</strong> {selectedAgent.transactions}
              </p>
              <p className="mb-2">
                <strong>Errors:</strong> {selectedAgent.errors}
              </p>
              <p className="mb-4">
                <strong>Gas Saved:</strong> {selectedAgent.gasSaved}
              </p>
              <button
                onClick={() => setSelectedAgent(null)}
                className="bg-primary px-4 py-2 rounded-lg text-secondary hover:bg-primaryHover transition"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-elementBackground p-6 rounded-lg shadow-2xl w-full max-w-md">
              <h2 className="text-xl font-bold text-primary mb-4">Create New Agent</h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  const newAgent = {
                    name: formData.get("name"),
                    task: taskType,
                    taskConfig: taskConfig,
                    status: "active",
                    transactions: 0,
                    errors: 0,
                    gasSaved: "AVAX 0.0",
                  };
                  handleCreateAgent(newAgent);
                }}
              >
                <div className="mb-4">
                  <label htmlFor="name" className="block text-sm text-textSecondary mb-1">
                    Agent Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Enter agent name"
                    className="w-full px-4 py-2 rounded-lg bg-background text-secondary placeholder-textSecondary focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm text-textSecondary mb-1">
                    Task Type
                  </label>
                  <select
                    value={taskType}
                    onChange={(e) => {
                      setTaskType(e.target.value);
                      setTaskConfig({});
                    }}
                    className="w-full px-4 py-2 rounded-lg bg-background text-secondary focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  >
                    <option value="">Select a task</option>
                    {availableTasks.map(task => (
                      <option key={task.id} value={task.id}>
                        {task.name}
                      </option>
                    ))}
                  </select>
                </div>

                {taskType && (
                  <div className="space-y-4 mb-4">
                    {availableTasks
                      .find(task => task.id === taskType)
                      ?.questions.map(question => (
                        <div key={question.id}>
                          <label className="block text-sm text-textSecondary mb-1">
                            {question.label}
                          </label>
                          {question.type === 'select' ? (
                            <select
                              value={taskConfig[question.id] || question.defaultValue}
                              onChange={(e) => setTaskConfig(prev => ({
                                ...prev,
                                [question.id]: e.target.value
                              }))}
                              className="w-full px-4 py-2 rounded-lg bg-background text-secondary focus:outline-none focus:ring-2 focus:ring-primary"
                              required
                            >
                              {question.options.map(option => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <input
                              type={question.type}
                              placeholder={question.placeholder}
                              className="w-full px-4 py-2 rounded-lg bg-background text-secondary placeholder-textSecondary focus:outline-none focus:ring-2 focus:ring-primary"
                              onChange={(e) => setTaskConfig(prev => ({
                                ...prev,
                                [question.id]: e.target.value
                              }))}
                              required
                            />
                          )}
                          {question.helperText && (
                            <p className="mt-1 text-xs text-textSecondary">
                              {question.helperText}
                            </p>
                          )}
                        </div>
                      ))}
                  </div>
                )}

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
      <ToastContainer position="bottom-right" theme="dark" />
      <SecurityModal
        isOpen={!!selectedAnalysis}
        onClose={() => setSelectedAnalysis(null)}
        analysis={selectedAnalysis}
      />
      <TestModal
        isOpen={!!selectedTestSuite}
        onClose={() => setSelectedTestSuite(null)}
        testSuite={selectedTestSuite}
      />
      <TransactionModal
        isOpen={!!selectedTransactionAnalysis}
        onClose={() => setSelectedTransactionAnalysis(null)}
        analysis={selectedTransactionAnalysis}
      />
      <GasModal
        isOpen={!!selectedGasAnalysis}
        onClose={() => setSelectedGasAnalysis(null)}
        analysis={selectedGasAnalysis}
      />
    </>
  );
}
