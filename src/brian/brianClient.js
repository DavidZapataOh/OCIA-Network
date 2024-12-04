import { BrianSDK } from "@brian-ai/sdk";
import { executeAgentTask } from "./executeAgentTask";

export const BRIAN_API_KEY = process.env.NEXT_PUBLIC_BRIAN_API_KEY;
export const BRIAN_API_URL = process.env.NEXT_PUBLIC_BRIAN_API_URL;

if (!BRIAN_API_KEY) {
    throw new Error("BRIAN_API_KEY is not set");
}
  

const brianClient = new BrianSDK({
    apiKey: BRIAN_API_KEY,
    apiUrl: BRIAN_API_URL,
});

export async function handler(req, res) {
    try {
      const { taskType, taskConfig } = req.body;
      const result = await executeAgentTask(taskType, taskConfig);
      res.status(200).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

export default brianClient;
