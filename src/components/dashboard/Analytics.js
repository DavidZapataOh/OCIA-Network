import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function Analytics() {
  const data = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    datasets: [
      {
        label: 'Transactions',
        data: [200, 300, 250, 400, 450],
        borderColor: '#00C896',
        backgroundColor: 'rgba(0,200,150,0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  return (
    <section className="bg-elementBackground p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-bold mb-4">Transaction Trends</h2>
      <Line data={data} />
    </section>
  );
}

