import { BrianSDK, BadRequestError } from "@brian-ai/sdk";
import axios from "axios";

const brian = new BrianSDK({
  apiKey: process.env.NEXT_PUBLIC_BRIAN_API_KEY,
  apiUrl: process.env.NEXT_PUBLIC_BRIAN_API_URL,
});

const contractAnalysisCache = new Map();

async function getContractSourceCode(address) {
  try {
    const response = await axios.get(`https://api.snowtrace.io/api`, {
      params: {
        module: 'contract',
        action: 'getsourcecode',
        address: address,
        apikey: ''
      }
    });

    if (response.data.status === '1' && response.data.result[0]) {
      return response.data.result[0].SourceCode;
    }
    return null;
  } catch (error) {
    console.error("Error fetching contract source:", error);
    return null;
  }
}

function extractJsonFromString(str) {
  try {
    const match = str.match(/```json\n([\s\S]*?)\n```/);
    if (match) {
      return JSON.parse(match[1]);
    }
    return JSON.parse(str);
  } catch (e) {
    console.error("Error parsing JSON:", e);
    return null;
  }
}

async function getAddressTransactions(address, minValue) {
  try {
    const response = await axios.get(`https://api.snowtrace.io/api`, {
      params: {
        module: 'account',
        action: 'txlist',
        address: address,
        startblock: 0,
        endblock: 99999999,
        sort: 'desc',
        apikey: '' 
      }
    });

    if (response.data.status === '1' && response.data.result) {
      return response.data.result.filter(tx => {
        const valueInAVAX = parseInt(tx.value) / 1e18;
        return valueInAVAX >= parseFloat(minValue);
      });
    }
    return [];
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return [];
  }
}

async function getCurrentGasPrice() {
  try {
    const response = await axios.get('https://api.snowtrace.io/api', {
      params: {
        module: 'proxy',
        action: 'eth_gasPrice',
        apikey: ''
      }
    });
    
    if (response.data.result) {
      return parseInt(response.data.result, 16) / 1e9;
    }
    return 0;
  } catch (error) {
    console.error("Error fetching gas price:", error);
    return 0;
  }
}

export async function executeAgentTask(taskType, taskConfig) {
  try {
    let prompt = "";
    let result;

    switch (taskType) {
      case "contract_security_monitor":
        const cacheKey = taskConfig.contract_address;

        if (contractAnalysisCache.has(cacheKey)) {
          return {
            timestamp: new Date().toISOString(),
            contract_address: taskConfig.contract_address,
            threshold: taskConfig.alert_threshold,
            analysis: contractAnalysisCache.get(cacheKey),
            source_code: await getContractSourceCode(taskConfig.contract_address),
            cached: true
          };
        }

        const sourceCode = await getContractSourceCode(taskConfig.contract_address);
        
        if (!sourceCode) {
          return {
            timestamp: new Date().toISOString(),
            contract_address: taskConfig.contract_address,
            threshold: taskConfig.alert_threshold,
            analysis: {
              risk_score: 0,
              severity: "UNKNOWN",
              findings: [],
              summary: "Unable to analyze contract: Source code not verified on Etherscan"
            }
          };
        }

        prompt = `Analyze this smart contract and provide a security assessment:
                
                CONTRACT SOURCE CODE:
              ${sourceCode}

              Evaluate each aspect on a scale of 0-100 and calculate the final risk_score as their weighted average:

              1. Reentrancy Protection (weight: 30%):
                - Check for checks-effects-interactions pattern
                - Evaluate external calls placement
                - Assess state modifications before calls

              2. Access Control (weight: 25%):
                - Analyze permission systems
                - Check owner privileges
                - Evaluate modifier usage

              3. Integer Handling (weight: 20%):
                - Check for SafeMath usage or Solidity >=0.8
                - Assess arithmetic operations
                - Evaluate overflow/underflow protections

              4. Gas Optimization (weight: 15%):
                - Analyze loop implementations
                - Check storage patterns
                - Evaluate function optimization

              5. Code Quality (weight: 10%):
                - Check error handling
                - Assess event emissions
                - Evaluate code documentation

              For each finding, provide:
              {
                "type": "specific_vulnerability_type",
                "description": "detailed_technical_description",
                "severity": "LOW|MEDIUM|HIGH",
                "recommendation": "specific_fix_recommendation",
                "impact_score": "numerical_score_0_100"
              }

              Calculate the final risk_score using the weighted scores and categorize severity as:
              - LOW: 0-35
              - MEDIUM: 36-70
              - HIGH: 71-100

              Format the response EXACTLY as:
              {
                "risk_score": <calculated_weighted_average>,
                "severity": "<severity_based_on_ranges>",
                "findings": [
                  {
                    "type": "<vulnerability_type>",
                    "description": "<detailed_description>",
                    "severity": "<LOW|MEDIUM|HIGH>",
                    "recommendation": "<how_to_fix>",
                    "impact_score": <numerical_score>
                  }
                ],
                "summary": "<brief_overview_of_findings>"
              }`;

        const response = await brian.ask({
          prompt: prompt,
          kb: "public-knowledge-box"
        });

        const analysisData = extractJsonFromString(response.answer);
        
        result = {
          timestamp: new Date().toISOString(),
          contract_address: taskConfig.contract_address,
          threshold: taskConfig.alert_threshold,
          analysis: analysisData || {
            risk_score: 0,
            severity: "UNKNOWN",
            findings: [],
            summary: "Unable to parse contract analysis"
          },
          source_code: sourceCode
        };
        break;

      case "transaction_reviewer":
        if (!taskConfig.address || !taskConfig.min_transaction_value || !taskConfig.alert_patterns) {
          return {
            timestamp: new Date().toISOString(),
            address: taskConfig.address,
            error: true,
            message: "Missing required configuration parameters"
          };
        }

        const transactions = await getAddressTransactions(
          taskConfig.address, 
          taskConfig.min_transaction_value
        );

        if (!transactions.length) {
          return {
            timestamp: new Date().toISOString(),
            address: taskConfig.address,
            min_value: taskConfig.min_transaction_value,
            patterns: taskConfig.alert_patterns,
            analysis: {
              risk_score: 0,
              severity: "LOW",
              patterns_detected: [],
              summary: "No transactions found matching the criteria",
              metrics: {
                analyzed_count: 0,
                flagged_count: 0,
                total_value: "0 AVAX",
                unique_addresses: 0
              }
            }
          };
        }

        prompt = `Analyze these transactions for address ${taskConfig.address}:

TRANSACTIONS DATA:
${JSON.stringify(transactions, null, 2)}

Parameters:
- Minimum Transaction Value: ${taskConfig.min_transaction_value} AVAX
- Alert Patterns to detect: ${taskConfig.alert_patterns}

Analyze the following aspects:

1. Transaction Patterns (40%):
   - Analyze frequency of transactions (daily/weekly patterns)
   - Distribution of transaction values
   - Identify recurring transaction patterns
   - Common interaction addresses

2. Risk Assessment (30%):
   - Detect unusual transaction activities
   - Identify high-value transactions
   - Check for interactions with known malicious addresses
   - Analyze smart contract interactions

3. Network Analysis (20%):
   - Map connected addresses and their relationships
   - Analyze contract interactions
   - Review token transfer patterns
   - Evaluate protocol usage patterns

4. Historical Context (10%):
   - Compare with historical transaction patterns
   - Identify significant pattern changes
   - Detect unusual activity spikes

Format the response EXACTLY as:
{
  "analysis": {
    "risk_score": number,
    "severity": "LOW|MEDIUM|HIGH",
    "patterns_detected": [{
      "type": "pattern_type",
      "description": "detailed_description",
      "severity": "LOW|MEDIUM|HIGH",
      "frequency": "number_of_occurrences",
      "recommendation": "action_recommendation"
    }],
    "summary": "brief_overview",
    "metrics": {
      "analyzed_count": number,
      "flagged_count": number,
      "total_value": "amount_in_avax",
      "unique_addresses": number
    }
  }
}`;

        const txResponse = await brian.ask({
          prompt: prompt,
          kb: "public-knowledge-box"
        });

        const txData = extractJsonFromString(txResponse.answer);

        return {
          timestamp: new Date().toISOString(),
          address: taskConfig.address,
          min_value: taskConfig.min_transaction_value,
          patterns: taskConfig.alert_patterns,
          analysis: txData?.analysis || {
            risk_score: 0,
            severity: "UNKNOWN",
            patterns_detected: [],
            summary: "Unable to analyze transactions",
            metrics: {
              analyzed_count: 0,
              flagged_count: 0,
              total_value: "0 AVAX",
              unique_addresses: 0
            }
          }
        };
        break;

      case "onchain_test_automation":
        const contractCode = await getContractSourceCode(taskConfig.test_contract);
        
        if (!contractCode) {
          return {
            timestamp: new Date().toISOString(),
            contract_address: taskConfig.test_contract,
            analysis: {
              status: "error",
              message: "Unable to fetch contract source code"
            }
          };
        }

        prompt = `Generate comprehensive test cases for the following smart contract:

CONTRACT SOURCE CODE:
${contractCode}

Generate tests covering:

1. Security Tests (40%):
   - Access control tests
   - Reentrancy protection
   - Integer overflow/underflow
   - Input validation

2. Functional Tests (30%):
   - Core functionality
   - Edge cases
   - State transitions
   - Event emissions

3. Integration Tests (20%):
   - Contract interactions
   - External calls
   - Token transfers
   - Protocol compliance

4. Gas Optimization Tests (10%):
   - Function gas usage
   - Storage patterns
   - Loop optimizations

Format the response EXACTLY as:
{
  "test_suite": {
    "security_tests": [{
      "name": "test_name",
      "description": "what_is_being_tested",
      "code": "actual_test_code",
      "category": "security_category"
    }],
    "functional_tests": [{
      "name": "test_name",
      "description": "what_is_being_tested",
      "code": "actual_test_code",
      "category": "functional_category"
    }],
    "integration_tests": [{
      "name": "test_name",
      "description": "what_is_being_tested",
      "code": "actual_test_code",
      "category": "integration_category"
    }],
    "gas_tests": [{
      "name": "test_name",
      "description": "what_is_being_tested",
      "code": "actual_test_code",
      "category": "gas_category"
    }]
  },
  "summary": {
    "total_tests": number,
    "coverage_estimate": "percentage",
    "risk_areas": ["area1", "area2"],
    "recommendations": ["rec1", "rec2"]
  }
}`;

        const testResponse = await brian.ask({
          prompt: prompt,
          kb: "public-knowledge-box"
        });

        const testData = extractJsonFromString(testResponse.answer);

        return {
          timestamp: new Date().toISOString(),
          contract_address: taskConfig.test_contract,
          test_suite: testData,
          source_code: contractCode
        };
        break;

      case "real_time_gas_optimizer":
        if (!taskConfig.max_gas_price || !taskConfig.optimization_level) {
          return {
            timestamp: new Date().toISOString(),
            error: true,
            message: "Missing required configuration parameters"
          };
        }

        const currentGasPrice = await getCurrentGasPrice();
        
        prompt = `Analyze and optimize gas usage considering:

Current Network Status:
- Current Gas Price: ${currentGasPrice} GWEI
- Max Acceptable Gas Price: ${taskConfig.max_gas_price} GWEI
- Optimization Level: ${taskConfig.optimization_level}

Analyze the following aspects:

1. Transaction Timing (40%):
   - Historical gas price patterns
   - Peak usage periods
   - Network congestion analysis
   - Optimal transaction windows

2. Gas Usage Optimization (30%):
   - Contract interaction costs
   - Function call optimizations
   - Data payload optimization
   - Batch transaction potential

3. Priority Analysis (20%):
   - Transaction urgency assessment
   - Cost-benefit analysis
   - Priority fee estimation
   - MEV protection needs

4. Network Conditions (10%):
   - Current network load
   - Pending transaction pool
   - Block utilization
   - Network upgrades impact

Format the response EXACTLY as:
{
  "analysis": {
    "current_gas_price": number,
    "recommended_gas_price": number,
    "optimization_score": number,
    "severity": "LOW|MEDIUM|HIGH",
    "optimizations": [{
      "type": "optimization_type",
      "description": "detailed_description",
      "potential_savings": "estimated_savings_in_avax",
      "recommendation": "action_recommendation",
      "priority": "LOW|MEDIUM|HIGH"
    }],
    "summary": "brief_overview",
    "metrics": {
      "analyzed_txs": number,
      "potential_savings": "amount_in_avax",
      "optimal_window": "time_range",
      "confidence_score": number
    }
  }
}`;

        const gasResponse = await brian.ask({
          prompt: prompt,
          kb: "public-knowledge-box"
        });

        const gasData = extractJsonFromString(gasResponse.answer);

        return {
          timestamp: new Date().toISOString(),
          max_gas_price: taskConfig.max_gas_price,
          optimization_level: taskConfig.optimization_level,
          current_gas_price: currentGasPrice,
          analysis: gasData?.analysis || {
            current_gas_price: 0,
            recommended_gas_price: 0,
            optimization_score: 0,
            severity: "UNKNOWN",
            optimizations: [],
            summary: "Unable to analyze gas optimization opportunities",
            metrics: {
              analyzed_txs: 0,
              potential_savings: "0 AVAX",
              optimal_window: "N/A",
              confidence_score: 0
            }
          }
        };
        break;

      default:
        throw new Error(`Unknown task type: ${taskType}`);
    }

    return result;

  } catch (error) {
    if (error instanceof BadRequestError) {
      console.error("Bad Request Error:", error.message);
      return {
        error: true,
        message: error.message,
        timestamp: new Date().toISOString(),
        task_type: taskType,
        config: taskConfig
      };
    } else {
      console.error("Error in executeAgentTask:", error);
      throw error;
    }
  }
}