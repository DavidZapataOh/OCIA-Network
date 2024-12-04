const SecuritySummary = ({ analysis, onClick }) => {
  if (!analysis) return null;

  const getSeverityBadge = (count, severity) => {
    const colors = {
      HIGH: 'bg-error/20 text-error',
      MEDIUM: 'bg-accent/20 text-accent',
      LOW: 'bg-success/20 text-success'
    };

    return count > 0 ? (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[severity]}`}>
        {count} {severity}
      </span>
    ) : null;
  };

  const findingsBySeverity = (analysis.findings || []).reduce((acc, finding) => {
    if (finding.severity) {
      acc[finding.severity] = (acc[finding.severity] || 0) + 1;
    }
    return acc;
  }, {});

  return (
    <div 
      onClick={onClick}
      className="flex items-center justify-between p-3 bg-elementBackground rounded-lg shadow-subtle hover:bg-background/80 cursor-pointer transition-all duration-300 ease"
    >
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">
          {(analysis.risk_score || 0) <= 35 ? '✅' : (analysis.risk_score || 0) <= 70 ? '⚠️' : '🚨'}
        </div>
        <div>
          <p className="font-medium text-secondary">Security Score: {analysis.risk_score || 0}/100</p>
          <p className="text-sm text-textSecondary">
            {(analysis.findings || []).length} findings detected
          </p>
        </div>
      </div>
      
      <div className="flex gap-2">
        {getSeverityBadge(findingsBySeverity.HIGH || 0, 'HIGH')}
        {getSeverityBadge(findingsBySeverity.MEDIUM || 0, 'MEDIUM')}
        {getSeverityBadge(findingsBySeverity.LOW || 0, 'LOW')}
      </div>
    </div>
  );
};

export default SecuritySummary; 