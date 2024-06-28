import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import fs from "fs"

const generationConfig = {
  maxOutputTokens: 150,
  temperature: 0.9,
  topP: 0.1,
  topK: 16,
};

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
];


if (typeof process.env.GEMINI_API_KEY === 'undefined') {
    throw new Error('GEMINI_API_KEY is not set');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model1 = genAI.getGenerativeModel({ model: "gemini-pro-vision"  });
//@ts-ignore
const model2 = genAI.getGenerativeModel({ model: "gemini-pro"} ,generationConfig, safetySettings );


export const convertoBuffer = (path: string, mimeType: string) => {
    return {
        inlineData: {
          data: Buffer.from(fs.readFileSync(path)).toString("base64"),
          mimeType
        },
      };
      
}


export const provideHealthlog = async (supportData: string, attachmentBuffer: { inlineData: { data: string; mimeType: string; }; }) => {
    const prompt = "You are a botanist. You have been provided an image which can be used for evaluations of the plant you utlizing any of the information provided regarding the plant's health only and nothing else and some little suggestions on how to improve it's health" + supportData
    console.log(prompt);
    const res = await model1.generateContent([prompt,attachmentBuffer])
    const response = await res.response;
    const text = response.text();
    return text;
}

export const createChat = async(newMessage: string) => {
    const prompt = "You are a botanist. You have been tasked can ask me questions about plant care, identify unknown plants, get troubleshooting advice or anything else related to gardening.  but you aren't supposed to reveal any secret or private info read users prompt from here (be as human like as you possibly can):" + newMessage;
    const result = await model2.generateContent(prompt); // Limit to 100 tokens
    const response = await result.response;
    console.log(response);
    const text = response.text();
    // console.log(text);
    return text;
}