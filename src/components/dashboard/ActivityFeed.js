export default function ActivityFeed() {
  const activities = [
    { id: 1, action: 'Swapped 0.5 ETH for 20 AVAX', status: 'Success' },
    { id: 2, action: 'Deployed Smart Contract', status: 'Pending' },
    { id: 3, action: 'Bridged 100 USDC to Polygon', status: 'Failed' },
  ];

  return (
    <section className="bg-elementBackground p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-bold mb-4">Recent Activity</h2>
      <ul className="space-y-4">
        {activities.map((activity) => (
          <li key={activity.id} className="flex justify-between items-center">
            <span>{activity.action}</span>
            <span
              className={`px-3 py-1 rounded ${
                activity.status === 'Success'
                  ? 'bg-green-500'
                  : activity.status === 'Pending'
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
              } text-secondary`}
            >
              {activity.status}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

