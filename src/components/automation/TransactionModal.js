import { Dialog } from '@headlessui/react';

const TransactionModal = ({ isOpen, onClose, analysis }) => {
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
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-3xl w-full bg-elementBackground rounded-xl shadow-strong border border-muted">
          <div className="flex justify-between items-center p-4 border-b border-muted">
            <Dialog.Title className="text-lg font-semibold text-secondary">
              Transaction Analysis Details
            </Dialog.Title>
            <button
              onClick={onClose}
              className="text-textSecondary hover:text-secondary transition-colors duration-300"
            >
              <span className="sr-only">Close</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="p-6 max-h-[80vh] overflow-y-auto">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold text-secondary">Risk Assessment</h3>
                  <p className="text-sm text-textSecondary mt-1">
                    Overall risk score and severity evaluation
                  </p>
                </div>
                <div className={`text-2xl font-bold ${getSeverityColor(analysis.severity)}`}>
                  {analysis.risk_score}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-background p-4 rounded-lg">
                  <h4 className="font-medium text-secondary mb-2">Transaction Metrics</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span className="text-textSecondary">Analyzed:</span>
                      <span className="text-secondary">{metrics.analyzed_count}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-textSecondary">Flagged:</span>
                      <span className="text-error">{metrics.flagged_count}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-textSecondary">Total Value:</span>
                      <span className="text-success">{metrics.total_value}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-textSecondary">Unique Addresses:</span>
                      <span className="text-accent">{metrics.unique_addresses}</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-secondary mb-3">Detected Patterns</h4>
                <div className="space-y-3">
                  {(analysis.patterns_detected || []).map((pattern, index) => (
                    <div key={index} className="bg-background p-4 rounded-lg border border-muted">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-secondary">{pattern.type || 'Unknown Pattern'}</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${getSeverityColor(pattern.severity)} bg-${(pattern.severity || 'LOW').toLowerCase()}/10`}>
                          {pattern.severity || 'LOW'}
                        </span>
                      </div>
                      <p className="text-sm text-textSecondary mb-2">{pattern.description || 'No description available'}</p>
                      <div className="flex justify-between text-xs">
                        <span className="text-accent">Frequency: {pattern.frequency || 0}</span>
                        <span className="text-primary">{pattern.recommendation || 'No recommendation available'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {analysis.summary && (
                <div className="mt-4 p-4 bg-background rounded-lg border border-muted">
                  <h4 className="font-medium text-secondary mb-2">Summary</h4>
                  <p className="text-sm text-textSecondary">{analysis.summary}</p>
                </div>
              )}
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default TransactionModal; 