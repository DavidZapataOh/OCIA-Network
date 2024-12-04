const SecurityAnalysis = ({ analysis }) => {
  if (!analysis) return null;

  const getSeverityColor = (severity) => {
    switch((severity || '').toUpperCase()) {
      case 'HIGH': return 'text-error';
      case 'MEDIUM': return 'text-accent';
      case 'LOW': return 'text-success';
      default: return 'text-textSecondary';
    }
  };

  return (
    <div className="p-4 bg-elementBackground rounded-lg shadow-subtle">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-secondary">Security Analysis</h3>
        <div className="flex items-center gap-2 text-textSecondary">
          <span>Risk Score:</span>
          <span className={getSeverityColor(analysis.severity)}>
            {analysis.risk_score || 0}/100 ({analysis.severity || 'UNKNOWN'})
          </span>
        </div>
      </div>

      {analysis.findings && analysis.findings.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-medium text-secondary">Findings:</h4>
          {analysis.findings.map((finding, index) => (
            <div key={index} className="p-3 bg-background rounded border border-muted">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-secondary">{finding.type || 'Unknown Issue'}</span>
                <span className={`px-2 py-1 rounded ${getSeverityColor(finding.severity)} bg-elementBackground`}>
                  {finding.severity || 'UNKNOWN'}
                </span>
              </div>
              <p className="text-sm text-textSecondary mb-2">{finding.description || 'No description available'}</p>
              {finding.recommendation && (
                <p className="text-sm text-primary">💡 {finding.recommendation}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {analysis.summary && (
        <div className="mt-4 p-3 bg-background rounded border border-muted">
          <h4 className="font-medium text-secondary mb-2">Summary</h4>
          <p className="text-sm text-textSecondary">{analysis.summary}</p>
        </div>
      )}
    </div>
  );
};

export default SecurityAnalysis;