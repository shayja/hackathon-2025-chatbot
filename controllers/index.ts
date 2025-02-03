import { Request, Response } from "express";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

// OpenAIApi required config
const openai = new OpenAI({
  apiKey: process.env.API_KEY,
});

async function useFineTunedModel(fineTunedModelId: string, prompt: string) {
  try {
    const response = await openai.chat.completions.create({
      model: fineTunedModelId,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.1,
      max_tokens: 100,
    });

    console.log("Full response:", response); // Log the entire response object

    let responseText = response.choices
      .map((choice) => choice.message.content)
      .join("\n");

    console.log("Response Text:", responseText);
    return responseText;
  } catch (error) {
    console.error("Error in model request:", error);
    throw error;
  }
}

// Controller function to handle chat conversation
export const generateResponse = async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body; // User's question
    const fineTunedModelId = "ft:gpt-4o-2024-08-06:movement::AwbOwS98";
    const responseText = await useFineTunedModel(fineTunedModelId, prompt);

    res.send({ response: responseText });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error: " + err });
  }
};
