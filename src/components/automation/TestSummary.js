const TestSummary = ({ testSuite, onClick }) => {
  if (!testSuite) return null;

  const getTestCount = (testType) => {
    return testSuite[testType]?.length || 0;
  };

  return (
    <div 
      onClick={onClick}
      className="flex items-center justify-between p-3 bg-elementBackground rounded-lg shadow-subtle hover:bg-background/80 cursor-pointer transition-all duration-300 ease"
    >
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">
          {parseInt(testSuite.summary?.coverage_estimate || 0) >= 85 ? '✅' : '⚠️'}
        </div>
        <div>
          <p className="font-medium text-secondary">
            Test Coverage: {testSuite.summary?.coverage_estimate || '0%'}
          </p>
          <p className="text-sm text-textSecondary">
            {testSuite.summary?.total_tests || 0} tests generated
          </p>
        </div>
      </div>
      
      <div className="flex gap-2">
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-error/20 text-error">
          {getTestCount('security_tests')} Security
        </span>
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-accent/20 text-accent">
          {getTestCount('functional_tests')} Functional
        </span>
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-success/20 text-success">
          {getTestCount('integration_tests')} Integration
        </span>
      </div>
    </div>
  );
};

export default TestSummary; 