const TransactionSummary = ({ analysis, onClick }) => {
  if (!analysis) return null;

  const metrics = analysis.metrics || {
    analyzed_count: 0,
    flagged_count: 0,
    unique_addresses: 0,
    total_value: '0 AVAX'
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
          {(analysis.severity || 'LOW') === 'HIGH' ? '⚠️' : (analysis.severity || 'LOW') === 'MEDIUM' ? '⚡' : '✅'}
        </div>
        <div>
          <p className="font-medium text-secondary">
            Risk Score: <span className={getSeverityColor(analysis.severity)}>{analysis.risk_score || 0}</span>
          </p>
          <p className="text-sm text-textSecondary">
            {metrics.analyzed_count} transactions analyzed
          </p>
        </div>
      </div>
      
      <div className="flex gap-2">
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-error/20 text-error">
          {metrics.flagged_count} Flagged
        </span>
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-accent/20 text-accent">
          {metrics.unique_addresses} Addresses
        </span>
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-success/20 text-success">
          {metrics.total_value}
        </span>
      </div>
    </div>
  );
};

export default TransactionSummary; 