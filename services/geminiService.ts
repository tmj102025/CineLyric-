import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResponse, CharacterProfile, Scene } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// 1. Analyze Lyrics to break them into scenes
export const analyzeLyrics = async (lyrics: string): Promise<AnalysisResponse> => {
  const modelId = "gemini-2.5-flash"; 

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      characterArchetype: {
        type: Type.STRING,
        description: "คำอธิบายลักษณะตัวละครหลักภาษาไทย (บังคับ: หญิงสาวชาวเอเชีย สวยงาม คนเดียว) ให้สอดคล้องกับอารมณ์เพลง",
      },
      scenes: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            lyric_segment: { type: Type.STRING, description: "ท่อนเพลงสำหรับฉากนี้ (ถ้าเพลงจบให้วนซ้ำท่อนฮุค หรือใส่คำว่า 'Instrumental' สำหรับฉากอารมณ์)" },
            visual_description: { type: Type.STRING, description: "คำบรรยายภาพฉาก มุมกล้อง และการกระทำอย่างละเอียด เป็นภาษาไทย (ต้องระบุมุมกล้อง เช่น มุมกว้าง, มุมเงย, โคลสอัพ, มุมโดรน)" },
            mood: { type: Type.STRING, description: "อารมณ์ของฉาก เป็นภาษาไทย" },
          },
          required: ["lyric_segment", "visual_description", "mood"],
        },
      },
    },
    required: ["characterArchetype", "scenes"],
  };

  const prompt = `
    You are a World-Class Film Director creating a Music Video (MV).
    
    DIRECTOR'S MANDATE:
    1. **TOTAL SCENES**: You MUST generate a MINIMUM of 20 SCENES. 
       - If the lyrics are short, REPEAT the chorus, verses, or add "Instrumental/Emotional" bridge scenes to reach 20+.
       - The video must feel full and complete.
    
    2. **VISUAL VARIETY (CRITICAL)**: 
       - DO NOT use the same camera angle twice in a row.
       - Use a mix of: 
         * Extreme Wide Shot (เห็นบรรยากาศกว้าง)
         * Low Angle (มุมเงย ให้ตัวละครดูเด่น)
         * High Angle / Drone Shot (มุมสูง)
         * Dutch Angle (มุมเอียง สร้างความรู้สึก)
         * Extreme Close-up (เน้นดวงตาหรือปาก)
         * Over-the-shoulder (มุมมองข้ามไหล่)
    
    3. **CHARACTER**: 
       - Main Character is STRICTLY a "Beautiful Asian Woman" (Solo). 
       - She must look consistent.

    4. **LANGUAGE**: Output visual descriptions in Thai (ภาษาไทย).

    Lyrics:
    "${lyrics}"
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        systemInstruction: "You are a visionary film director. Create a cinematic storyboard with at least 20 scenes. Focus on lighting, camera angles, and emotional depth.",
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text) as AnalysisResponse;
  } catch (error) {
    console.error("Error analyzing lyrics:", error);
    throw error;
  }
};

// 2. Generate Image for a single scene
export const generateSceneImage = async (
  scene: Scene,
  character: CharacterProfile
): Promise<string> => {
  // Use the 'nano banana' model alias (gemini-2.5-flash-image)
  const modelId = "gemini-2.5-flash-image";

  // Construct a prompt that enforces consistency, specific Asian Female requirement, and NO TEXT
  const finalPrompt = `
    Cinematic Shot, ${scene.visualPrompt}.
    
    SUBJECT:
    - A SOLO Beautiful Asian Woman.
    - Flawless skin, symmetrical face, K-pop idol aesthetic or Movie Star look.
    - EXACT SAME FACE as previous shots.
    - ${character.description}

    STYLE & COMPOSITION:
    - ${character.style}
    - Aspect Ratio 16:9.
    - Highly detailed, Photorealistic, 8k resolution, Arri Alexa, Film Grain.
    - Cinematic Lighting (Rembrandt lighting, Volumetric lighting, or Neon depending on scene).

    NEGATIVE PROMPT (FORBIDDEN):
    - TEXT, TYPOGRAPHY, LETTERS, WATERMARK, SIGNATURE, SUBTITLES, CREDITS, LOGO.
    - UGLY, DEFORMED, DISTORTED, BLURRY.
    - MULTIPLE PEOPLE, CROWD, MAN, BOY (Only 1 Woman allowed).
    - CARTOON, ANIME, 3D RENDER (Must be Photorealistic).
  `.trim();

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: finalPrompt,
      config: {
        imageConfig: {
          aspectRatio: '16:9',
        }
      },
    });

    // Extract image
    const parts = response.candidates?.[0]?.content?.parts;
    if (!parts) throw new Error("No content generated");

    for (const part of parts) {
      if (part.inlineData && part.inlineData.data) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    
    throw new Error("No image data found in response");

  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
};