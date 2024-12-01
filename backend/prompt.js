import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyCy8Im6B73TS62soLbLK2AGrJXdCsVbBxw");
const model = genAI.getGenerativeModel({
   model: "gemini-1.5-flash"
});

const prompt = "Pretend you are a machine meant to differentiate between 3 things: public APIs (no key or authentication needed to access, can simply make an API call), private APIs (an API key or other form of authentication is required to access) and URLs (webpages). Upon input of a link, you are to return one word depending on which category is matched. If the link is a public API, return the word public, if it is a private API, return the word private, and otherwise return the word url. Use your knowledge of existing APIs as well as return types (if the link returns HTML, you know it is a website and if it returns JSON it is an API) to try and discern the correct answer and most importantly, only return 1 word. The link to be tested is ";

export async function sendPrompt(link) {
    const specificPrompt = `${prompt}${link}`;
    const result = await model.generateContent(specificPrompt);
    return result.response.text();
}