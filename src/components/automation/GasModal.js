import { Dialog } from '@headlessui/react';

const GasModal = ({ isOpen, onClose, analysis }) => {
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
              Gas Optimization Details
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
                  <h3 className="text-xl font-semibold text-secondary">Gas Price Analysis</h3>
                  <p className="text-sm text-textSecondary mt-1">
                    Current and recommended gas prices
                  </p>
                </div>
                <div className="text-2xl font-bold text-accent">
                  {analysis.optimization_score}% Optimized
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-background p-4 rounded-lg">
                  <h4 className="font-medium text-secondary mb-2">Current Status</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span className="text-textSecondary">Current Gas:</span>
                      <span className="text-error">{analysis.current_gas_price.toFixed(2)} GWEI</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-textSecondary">Recommended:</span>
                      <span className="text-success">{analysis.recommended_gas_price.toFixed(2)} GWEI</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-textSecondary">Potential Savings:</span>
                      <span className="text-accent">{metrics.potential_savings}</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-background p-4 rounded-lg">
                  <h4 className="font-medium text-secondary mb-2">Optimization Metrics</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span className="text-textSecondary">Analyzed Txs:</span>
                      <span className="text-secondary">{metrics.analyzed_txs}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-textSecondary">Best Window:</span>
                      <span className="text-accent">{metrics.optimal_window}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-textSecondary">Confidence:</span>
                      <span className="text-success">{metrics.confidence_score}%</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-secondary mb-3">Optimization Opportunities</h4>
                <div className="space-y-3">
                  {(analysis.optimizations || []).map((opt, index) => (
                    <div key={index} className="bg-background p-4 rounded-lg border border-muted">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-secondary">{opt.type}</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${getSeverityColor(opt.priority)} bg-${opt.priority.toLowerCase()}/10`}>
                          {opt.priority}
                        </span>
                      </div>
                      <p className="text-sm text-textSecondary mb-2">{opt.description}</p>
                      <div className="flex justify-between text-xs">
                        <span className="text-accent">Potential Savings: {opt.potential_savings}</span>
                        <span className="text-primary">{opt.recommendation}</span>
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

export default GasModal; 