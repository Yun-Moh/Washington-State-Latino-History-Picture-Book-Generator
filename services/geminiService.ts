import { GoogleGenAI, Type, SchemaType } from "@google/genai";
import { WA_LATINO_HISTORY_TEXT } from "../constants";
import { BookContent } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateBookStory = async (userQuestion: string): Promise<BookContent> => {
  const model = "gemini-2.5-flash";

  const prompt = `
    You are an expert educator and children's book author.
    The user wants to know about: "${userQuestion}".
    
    Using ONLY the following historical text as your source of truth, create a 5-8 page picture book narrative explaining the answer.
    
    Source Text:
    ${WA_LATINO_HISTORY_TEXT}
    
    Rules:
    1. The language should be accessible (approx 4th-6th grade reading level).
    2. Break the answer into distinct pages.
    3. For each page, provide the text and a detailed prompt for an AI image generator to create an illustration for that page.
    4. The image prompt should specify "Children's book illustration style, colorful, watercolor texture" plus the specific scene description.
    5. Give the book a catchy title.

    Return JSON format adhering to this schema:
    {
      "title": "Book Title",
      "pages": [
        { "pageNumber": 1, "text": "Page text...", "imagePrompt": "Image description..." }
      ]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            pages: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  pageNumber: { type: Type.INTEGER },
                  text: { type: Type.STRING },
                  imagePrompt: { type: Type.STRING },
                },
                required: ["pageNumber", "text", "imagePrompt"],
              },
            },
          },
          required: ["title", "pages"],
        },
      },
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No text returned from Gemini");
    
    return JSON.parse(jsonText) as BookContent;
  } catch (error) {
    console.error("Error generating story:", error);
    throw error;
  }
};

export const generatePageImage = async (imagePrompt: string): Promise<string> => {
  const model = "gemini-2.5-flash-image";

  try {
    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [
          { text: imagePrompt }
        ]
      },
      config: {
        // Nano banana models don't support responseMimeType, so we just get the object
        // We expect inlineData in the response
      }
    });

    // Check for inlineData (base64)
    for (const candidate of response.candidates || []) {
      for (const part of candidate.content?.parts || []) {
        if (part.inlineData && part.inlineData.data) {
           // Standardize output to a usable data URI
           return `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
        }
      }
    }

    throw new Error("No image data found in response");
  } catch (error) {
    console.error("Error generating image:", error);
    // Return a fallback placeholder if generation fails
    return `https://picsum.photos/800/600?blur=2`;
  }
};
