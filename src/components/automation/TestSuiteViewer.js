const TestSuiteViewer = ({ testSuite }) => {
  if (!testSuite) return null;

  const renderTestSection = (tests, title) => {
    if (!tests || tests.length === 0) return null;

    return (
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-secondary mb-3">{title}</h3>
        <div className="space-y-4">
          {tests.map((test, index) => (
            <div key={index} className="bg-elementBackground p-4 rounded-lg border border-muted">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium text-secondary">{test.name}</h4>
                <span className="px-2 py-1 text-xs rounded bg-background text-textSecondary">
                  {test.category}
                </span>
              </div>
              <p className="text-sm text-textSecondary mb-3">{test.description}</p>
              <pre className="bg-background p-3 rounded text-sm overflow-x-auto">
                <code className="text-primary">{test.code}</code>
              </pre>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 bg-elementBackground rounded-lg shadow-subtle">
      {renderTestSection(testSuite.security_tests, "Security Tests")}
      {renderTestSection(testSuite.functional_tests, "Functional Tests")}
      {renderTestSection(testSuite.integration_tests, "Integration Tests")}
      {renderTestSection(testSuite.gas_tests, "Gas Optimization Tests")}
      
      {testSuite.summary && (
        <div className="mt-6 p-4 bg-background rounded-lg border border-muted">
          <h3 className="text-lg font-semibold text-secondary mb-3">Summary</h3>
          <div className="space-y-2 text-sm text-textSecondary">
            <p>Total Tests: {testSuite.summary.total_tests}</p>
            <p>Coverage Estimate: {testSuite.summary.coverage_estimate}</p>
            <div>
              <p className="mb-1">Risk Areas:</p>
              <ul className="list-disc list-inside pl-4">
                {testSuite.summary.risk_areas.map((area, i) => (
                  <li key={i}>{area}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-1">Recommendations:</p>
              <ul className="list-disc list-inside pl-4">
                {testSuite.summary.recommendations.map((rec, i) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestSuiteViewer; 