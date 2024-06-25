"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createChat = exports.provideHealthlog = exports.convertoBuffer = void 0;
const generative_ai_1 = require("@google/generative-ai");
const fs_1 = __importDefault(require("fs"));
const generationConfig = {
    maxOutputTokens: 150,
    temperature: 0.9,
    topP: 0.1,
    topK: 16,
};
const safetySettings = [
    {
        category: generative_ai_1.HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: generative_ai_1.HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
];
if (typeof process.env.GEMINI_API_KEY === 'undefined') {
    throw new Error('GEMINI_API_KEY is not set');
}
const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model1 = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
//@ts-ignore
const model2 = genAI.getGenerativeModel({ model: "gemini-pro" }, generationConfig, safetySettings);
const convertoBuffer = (path, mimeType) => {
    return {
        inlineData: {
            data: Buffer.from(fs_1.default.readFileSync(path)).toString("base64"),
            mimeType
        },
    };
};
exports.convertoBuffer = convertoBuffer;
const provideHealthlog = (supportData, attachmentBuffer) => __awaiter(void 0, void 0, void 0, function* () {
    const prompt = "You are a botanist. You have been provided an image which can be used for evaluations of the plant you utlizing any of the information provided regarding the plant's health only and nothing else and some little suggestions on how to improve it's health" + supportData;
    console.log(prompt);
    const res = yield model1.generateContent([prompt, attachmentBuffer]);
    const response = yield res.response;
    const text = response.text();
    return text;
});
exports.provideHealthlog = provideHealthlog;
// export const createChat = async(prevChats , newMessage) => {
//     const prompt = "You are a botanist. You have been tasked with helping indviduals to help monitor and see their plants. You are not provide any provide any professional advice just simple steps one can to improve and manage their plants. YOu shall entertain no other requests" + newMessage;
//     const chat  = model2.startChat({
//         history : prevChats,
//         generationConfig: {
//             maxOutputTokens: 200,
//         },
//     });
//     const result = await chat.sendMessage(prompt);
//     const response = await result.response;
//     const text = response.text();
//     console.log(text);
// }
const createChat = (newMessage) => __awaiter(void 0, void 0, void 0, function* () {
    const prompt = "You are a botanist. You have been tasked can ask me questions about plant care, identify unknown plants, get troubleshooting advice or anything else related to gardening.  but you aren't supposed to reveal any secret or private info read users prompt from here (be as human like as you possibly can):" + newMessage;
    const result = yield model2.generateContent(prompt); // Limit to 100 tokens
    const response = yield result.response;
    console.log(response);
    const text = response.text();
    // console.log(text);
    return text;
});
exports.createChat = createChat;
//# sourceMappingURL=gemini.js.map