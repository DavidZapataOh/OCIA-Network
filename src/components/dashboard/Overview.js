export default function Overview() {
    const stats = [
      { label: 'Total Transactions', value: '12,543', icon: '💸' },
      { label: 'Optimized Gas', value: '$5,432', icon: '🔥' },
      { label: 'Networks', value: '7', icon: '🌐' },
      { label: 'Active Users', value: '1,245', icon: '👤' },
    ];
  
    return (
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-elementBackground p-6 rounded-lg shadow-md transform transition hover:scale-105"
          >
            <div className="text-4xl text-primary mb-4">{stat.icon}</div>
            <h3 className="text-lg font-bold">{stat.label}</h3>
            <p className="text-2xl font-semibold">{stat.value}</p>
          </div>
        ))}
      </section>
    );
  }
  

  