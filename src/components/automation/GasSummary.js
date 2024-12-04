const GasSummary = ({ analysis, onClick }) => {
  if (!analysis) return null;

  const metrics = analysis.metrics || {
    analyzed_txs: 0,
    potential_savings: "0 AVAX",
    optimal_window: "N/A",
    confidence_score: 0
  };

  const getSeverityColor = (severity) => {
    switch (severity?.toUpperCase()) {
      case 'HIGH': return 'text-error';
      case 'MEDIUM': return 'text-accent';
      case 'LOW': return 'text-success';
      default: return 'text-textSecondary';
    }
  };

  return (
    <div 
      onClick={onClick}
      className="flex items-center justify-between p-3 bg-elementBackground rounded-lg shadow-subtle hover:bg-background/80 cursor-pointer transition-all duration-300 ease"
    >
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">
          {analysis.optimization_score >= 80 ? '✅' : analysis.optimization_score >= 50 ? '⚡' : '⚠️'}
        </div>
        <div>
          <p className="font-medium text-secondary">
            Gas Price: <span className={getSeverityColor(analysis.severity)}>
              {analysis.current_gas_price.toFixed(2)} → {analysis.recommended_gas_price.toFixed(2)} GWEI
            </span>
          </p>
          <p className="text-sm text-textSecondary">
            Optimization Score: {analysis.optimization_score}%
          </p>
        </div>
      </div>
      
      <div className="flex gap-2">
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-error/20 text-error">
          {metrics.analyzed_txs} Txs
        </span>
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-accent/20 text-accent">
          {metrics.optimal_window}
        </span>
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-success/20 text-success">
          Save {metrics.potential_savings}
        </span>
      </div>
    </div>
  );
};

export default GasSummary; 