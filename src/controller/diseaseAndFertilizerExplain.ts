import { Request, Response } from "express";
import ModelClient, { isUnexpected } from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";

const token = process.env.GITHUB_TOCKEN;
const endpoint = "https://models.github.ai/inference";
const model = "openai/gpt-4.1";

// Initialize the client
const client = ModelClient(endpoint, new AzureKeyCredential(token || ""));

// Interface for model response
interface ModelData {
  id: string;
  [key: string]: any;
}

interface ModelsResponse {
  data?: ModelData[];
  [key: string]: any;
}

/**
 * Handle chat completion with content from request body
 */
export const chatCompletion = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      content,
      systemMessage = "You are a helpful assistant.",
      temperature = 0.7,
      top_p = 1,
    } = req.body;

    // Validate required fields
    if (!content) {
      res.status(400).json({
        success: false,
        error: "Content is required in the request body",
      });
      return;
    }

    const response = await client.path("/chat/completions").post({
      body: {
        messages: [
          { role: "system", content: systemMessage },
          { role: "user", content: content },
        ],
        temperature,
        top_p,
        model,
      },
    });

    if (isUnexpected(response)) {
      const errorMessage =
        (response.body as any)?.error?.message ||
        "Unexpected response from AI service";
      throw new Error(errorMessage);
    }

    const responseBody = response.body as any;
    const aiResponse =
      responseBody.choices?.[0]?.message?.content || "No response generated";

    res.json({
      success: true,
      response: aiResponse,
      usage: responseBody.usage,
    });
  } catch (error: any) {
    console.error("❌ Error in chatCompletion:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Internal server error",
    });
  }
};

/**
 * Handle conversation with multiple messages from body
 */
export const conversation = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { messages, temperature = 0.7, top_p = 1 } = req.body;

    // Validate required fields
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({
        success: false,
        error: "Messages array is required and must not be empty",
      });
      return;
    }

    const response = await client.path("/chat/completions").post({
      body: {
        messages,
        temperature,
        top_p,
        model,
      },
    });

    if (isUnexpected(response)) {
      const errorMessage =
        (response.body as any)?.error?.message ||
        "Unexpected response from AI service";
      throw new Error(errorMessage);
    }

    const responseBody = response.body as any;
    const aiResponse =
      responseBody.choices?.[0]?.message?.content || "No response generated";

    res.json({
      success: true,
      response: aiResponse,
      usage: responseBody.usage,
    });
  } catch (error: any) {
    console.error("❌ Error in conversation:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Internal server error",
    });
  }
};

/**
 * Health check endpoint
 */
export const healthCheck = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Use a safer endpoint or just check if we can make a simple request
    // The /models endpoint might not be available in all Azure AI Inference setups
    const response = await client.path("/chat/completions").post({
      body: {
        messages: [
          { role: "system", content: "You are a health check assistant." },
          { role: "user", content: "Say 'healthy' if you are working." },
        ],
        temperature: 0.1,
        max_tokens: 5,
        model,
      },
    });

    if (isUnexpected(response)) {
      throw new Error("AI service unavailable");
    }

    const responseBody = response.body as any;
    const healthStatus =
      responseBody.choices?.[0]?.message?.content || "unknown";

    res.json({
      success: true,
      status: "Service is healthy",
      response: healthStatus,
    });
  } catch (error: any) {
    console.error("❌ Health check failed:", error);
    res.status(503).json({
      success: false,
      error: "AI service unavailable",
    });
  }
};

/**
 * Simple echo test endpoint
 */
export const test = async (req: Request, res: Response): Promise<void> => {
  try {
    const { message = "Hello" } = req.body;

    const response = await client.path("/chat/completions").post({
      body: {
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that echoes messages.",
          },
          { role: "user", content: `Echo this message: ${message}` },
        ],
        temperature: 0.7,
        top_p: 1,
        model,
      },
    });

    if (isUnexpected(response)) {
      const errorMessage =
        (response.body as any)?.error?.message || "Unexpected response";
      throw new Error(errorMessage);
    }

    const responseBody = response.body as any;

    res.json({
      success: true,
      originalMessage: message,
      response: responseBody.choices?.[0]?.message?.content,
    });
  } catch (error: any) {
    console.error("❌ Test error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
