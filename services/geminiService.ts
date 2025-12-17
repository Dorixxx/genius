import { GoogleGenAI, Type } from "@google/genai";
import { ElementDefinition, CombinationResult } from "../types";
import { getStaticCombination } from "./staticRecipes";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// We cache combinations to save API calls and make it feel like a consistent game rule
const recipeCache: Record<string, CombinationResult> = {};

export const combineElements = async (
  elementA: ElementDefinition,
  elementB: ElementDefinition,
  useAI: boolean = false
): Promise<CombinationResult> => {
  // Consistent cache key
  const sortedNames = [elementA.name, elementB.name].sort();
  const cacheKey = `${sortedNames[0]}+${sortedNames[1]}`;

  // 1. Check Static Recipes First (Offline Mode & Hardcoded Paths)
  const staticResult = getStaticCombination(elementA.name, elementB.name);
  if (staticResult) {
     return {
         success: true,
         element: staticResult,
         flavorText: "数据库匹配成功：标准合成路径确认。"
     };
  }

  // 2. Check Cache
  if (recipeCache[cacheKey]) {
    return recipeCache[cacheKey];
  }

  // 3. If AI is disabled and no static recipe found, fail.
  if (!useAI) {
      return {
          success: false,
          flavorText: "该组合在基础数据库中无效。尝试开启 AI 协议以进行实验性合成。"
      };
  }

  // 4. Use AI Generation
  const systemPrompt = `
    你是一个名为“创世协议”的AI，正在热寂后的宇宙中重建万物。
    用户将两个概念（卡牌）结合起来创造一个新的概念。
    
    规则：
    1. 结果必须是逻辑递进、科学组合或哲学综合。
    2. 必须富有创造力，但要植根于科幻/宇宙恐怖/充满希望的传说中。
    3. 如果组合完全没有意义，则返回 null。
    4. 进阶层级：原始(primordial) -> 物质(matter) -> 能量(energy) -> 生命(life) -> 科技(technology) -> 抽象(abstract) -> 宇宙(cosmic)。
    5. **所有输出必须使用简体中文**。
    
    示例：
    - 火花 + 虚空 -> 能量
    - 能量 + 虚空 -> 物质
    - 物质 + 能量 -> 恒星
    - 人类 + 石头 -> 工具
    - 人类 + 时间 -> 尸体
    - 爱 + 恨 -> 战争
  `;

  const prompt = `结合 '${elementA.name}' (${elementA.description}) 和 '${elementB.name}' (${elementB.description}).`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            success: { type: Type.BOOLEAN, description: "如果存在有效的组合，则为 True" },
            flavorText: { type: Type.STRING, description: "解释合成过程的简短、神秘或科学的日志条目（中文）。" },
            newElement: {
              type: Type.OBJECT,
              nullable: true,
              properties: {
                name: { type: Type.STRING, description: "新元素的名称（中文）" },
                emoji: { type: Type.STRING },
                description: { type: Type.STRING, description: "新元素的描述（中文）" },
                type: { 
                  type: Type.STRING, 
                  enum: ['primordial', 'matter', 'energy', 'life', 'technology', 'abstract', 'cosmic'] 
                }
              }
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const data = JSON.parse(text);

    let result: CombinationResult;

    if (data.success && data.newElement) {
        // Clean up the ID to be snake_case (using English char replacement if possible, or random)
        // Since names are Chinese now, using random ID is safer for uniqueness
        const newId = Math.random().toString(36).substr(2, 9);
        
        result = {
            success: true,
            flavorText: data.flavorText,
            element: {
                id: newId,
                name: data.newElement.name,
                emoji: data.newElement.emoji,
                description: data.newElement.description,
                type: data.newElement.type
            }
        };
    } else {
        result = {
            success: false,
            flavorText: data.flavorText || "组件无法发生反应。熵值保持恒定。"
        };
    }

    recipeCache[cacheKey] = result;
    return result;

  } catch (error) {
    console.error("Synthesis error:", error);
    return {
      success: false,
      flavorText: "协议错误：合成计算失败。"
    };
  }
};