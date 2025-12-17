import { ElementDefinition, CombinationResult } from "../types";
import { getStaticCombination } from "./staticRecipes";

// 纯本地模式：只检查静态合成表
export const combineElements = async (
  elementA: ElementDefinition,
  elementB: ElementDefinition
): Promise<CombinationResult> => {
  // 模拟一点点计算延迟，让UI看起来在运作（可选）
  await new Promise(resolve => setTimeout(resolve, 300));

  // 1. Check Static Recipes
  const staticResult = getStaticCombination(elementA.name, elementB.name);
  
  if (staticResult) {
     return {
         success: true,
         element: staticResult,
         flavorText: "合成路径匹配成功。新物质已生成。"
     };
  }

  // 2. Failure
  return {
      success: false,
      flavorText: "这两种物质无法产生反应。"
  };
};