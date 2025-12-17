import { ElementDefinition } from "../types";

// Helper type for defining recipes easily
type RecipeDefinition = {
  inputs: [string, string];
  result: {
    id: string;
    name: string;
    emoji: string;
    description: string;
    type: ElementDefinition['type'];
  };
};

// --- MASSIVE RECIPE DATABASE ---
// Ordered roughly by complexity
const RAW_RECIPES: RecipeDefinition[] = [
  // === Tier 0: 宇宙创世 (Genesis) ===
  { inputs: ["火花", "虚空"], result: { id: "energy", name: "能量", emoji: "⚡", description: "宇宙的原动力。", type: "energy" } },
  { inputs: ["能量", "虚空"], result: { id: "matter", name: "物质", emoji: "📦", description: "实体的基础。", type: "matter" } },
  { inputs: ["物质", "能量"], result: { id: "plasma", name: "等离子体", emoji: "✨", description: "超高能状态的物质。", type: "energy" } },
  { inputs: ["物质", "物质"], result: { id: "gravity", name: "引力", emoji: "🧲", description: "物质之间的相互吸引。", type: "cosmic" } },
  { inputs: ["等离子体", "引力"], result: { id: "star", name: "恒星", emoji: "☀️", description: "照亮宇宙的核聚变炉。", type: "cosmic" } },
  { inputs: ["物质", "引力"], result: { id: "planet", name: "行星", emoji: "🪐", description: "围绕恒星运行的天体。", type: "cosmic" } },
  { inputs: ["恒星", "行星"], result: { id: "time", name: "时间", emoji: "🕙", description: "规则的执行者。", type: "cosmic" } },
  { inputs: ["物质", "时间"], result: { id: "entropy", name: "熵", emoji: "⌛", description: "无序度的增加。", type: "abstract" } },
  { inputs: ["恒星", "时间"], result: { id: "black_hole", name: "黑洞", emoji: "🕳️", description: "光也无法逃脱的深渊。", type: "cosmic" } },

  // === Tier 1: 自然元素 (Elements) ===
  { inputs: ["行星", "能量"], result: { id: "atmosphere", name: "大气层", emoji: "☁️", description: "行星的保护罩。", type: "matter" } },
  { inputs: ["大气层", "能量"], result: { id: "storm", name: "风暴", emoji: "⛈️", description: "大气的剧烈运动。", type: "energy" } },
  { inputs: ["大气层", "物质"], result: { id: "water", name: "水", emoji: "💧", description: "生命之源。", type: "matter" } },
  { inputs: ["行星", "火花"], result: { id: "fire", name: "火焰", emoji: "🔥", description: "剧烈的氧化反应。", type: "energy" } },
  { inputs: ["行星", "火焰"], result: { id: "magma", name: "岩浆", emoji: "🌋", description: "地心的血液。", type: "matter" } },
  { inputs: ["岩浆", "大气层"], result: { id: "stone", name: "石头", emoji: "🪨", description: "冷却后的坚硬地壳。", type: "matter" } },
  { inputs: ["石头", "风暴"], result: { id: "sand", name: "沙子", emoji: "🏜️", description: "时间的磨损。", type: "matter" } },
  { inputs: ["水", "火焰"], result: { id: "steam", name: "蒸汽", emoji: "💨", description: "气态的水。", type: "matter" } },
  { inputs: ["水", "石头"], result: { id: "soil", name: "泥土", emoji: "🌱", description: "孕育生命的温床。", type: "matter" } },
  { inputs: ["泥土", "火焰"], result: { id: "brick", name: "砖块", emoji: "🧱", description: "最基础的建筑材料。", type: "matter" } },
  { inputs: ["沙子", "火焰"], result: { id: "glass", name: "玻璃", emoji: "🥃", description: "透明的固体。", type: "matter" } },
  { inputs: ["石头", "火焰"], result: { id: "metal", name: "金属", emoji: "🔩", description: "从矿石中提炼出的坚硬物质。", type: "matter" } },

  // === Tier 2: 生命起源 (Life) ===
  { inputs: ["水", "能量"], result: { id: "soup", name: "原始汤", emoji: "🍲", description: "有机分子的混合物。", type: "life" } },
  { inputs: ["原始汤", "时间"], result: { id: "life", name: "生命", emoji: "🧬", description: "自我复制的奇迹。", type: "life" } },
  { inputs: ["生命", "泥土"], result: { id: "plant", name: "植物", emoji: "🌿", description: "通过光合作用生存的生命。", type: "life" } },
  { inputs: ["植物", "时间"], result: { id: "tree", name: "树木", emoji: "🌳", description: "高大的植物。", type: "life" } },
  { inputs: ["植物", "石头"], result: { id: "coal", name: "煤炭", emoji: "⚫", description: "植物的化石，储存着远古的太阳能。", type: "matter" } },
  { inputs: ["树木", "时间"], result: { id: "coal", name: "煤炭", emoji: "⚫", description: "植物的化石。", type: "matter" } }, // Alternate path
  { inputs: ["生命", "水"], result: { id: "fish", name: "鱼", emoji: "🐟", description: "水中的游动者。", type: "life" } },
  { inputs: ["生命", "石头"], result: { id: "bug", name: "昆虫", emoji: "🐞", description: "坚硬外壳的小生命。", type: "life" } },
  { inputs: ["鱼", "泥土"], result: { id: "animal", name: "动物", emoji: "🐅", description: "陆地上的行走者。", type: "life" } },
  { inputs: ["动物", "时间"], result: { id: "evolution", name: "进化", emoji: "🦕", description: "适应环境的过程。", type: "abstract" } },
  { inputs: ["动物", "火花"], result: { id: "human", name: "人类", emoji: "🧑", description: "拥有复杂大脑的动物。", type: "life" } },
  { inputs: ["人类", "时间"], result: { id: "corpse", name: "尸体", emoji: "💀", description: "尘归尘，土归土。", type: "matter" } },

  // === Tier 3: 原始文明 (Primitive) ===
  { inputs: ["人类", "石头"], result: { id: "tool", name: "工具", emoji: "🔨", description: "人类的第一步。", type: "technology" } },
  { inputs: ["人类", "树木"], result: { id: "wood", name: "木材", emoji: "🪵", description: "加工后的树木。", type: "matter" } },
  { inputs: ["木材", "人类"], result: { id: "hut", name: "小屋", emoji: "⛺", description: "遮风挡雨的地方。", type: "technology" } },
  { inputs: ["人类", "火焰"], result: { id: "cooked_meat", name: "熟食", emoji: "🍖", description: "美味且更易消化。", type: "life" } },
  { inputs: ["人类", "泥土"], result: { id: "pottery", name: "陶器", emoji: "🏺", description: "储存水的容器。", type: "technology" } },
  { inputs: ["人类", "人类"], result: { id: "society", name: "社会", emoji: "🤝", description: "群体的力量。", type: "abstract" } },
  { inputs: ["社会", "工具"], result: { id: "civilization", name: "文明", emoji: "🏛️", description: "秩序与法律的建立。", type: "abstract" } },
  { inputs: ["人类", "植物"], result: { id: "agriculture", name: "农业", emoji: "🌾", description: "驯化植物。", type: "technology" } },
  { inputs: ["人类", "金属"], result: { id: "weapon", name: "武器", emoji: "⚔️", description: "为了争斗而生。", type: "technology" } },
  { inputs: ["社会", "武器"], result: { id: "war", name: "战争", emoji: "🛡️", description: "文明的阴暗面。", type: "abstract" } },
  { inputs: ["工具", "木材"], result: { id: "wheel", name: "轮子", emoji: "⚙️", description: "最伟大的发明之一。", type: "technology" } },
  { inputs: ["轮子", "木材"], result: { id: "cart", name: "马车", emoji: "🛒", description: "运输工具。", type: "technology" } },
  { inputs: ["木材", "水"], result: { id: "boat", name: "船", emoji: "⛵", description: "征服水域。", type: "technology" } },

  // === Tier 4: 前工业/科学 (Pre-Industrial) ===
  { inputs: ["木材", "工具"], result: { id: "paper", name: "纸张", emoji: "📄", description: "记录知识的载体。", type: "matter" } },
  { inputs: ["纸张", "人类"], result: { id: "knowledge", name: "知识", emoji: "📚", description: "信息的积累。", type: "abstract" } },
  { inputs: ["知识", "金属"], result: { id: "coin", name: "货币", emoji: "🪙", description: "交易的媒介。", type: "abstract" } },
  { inputs: ["知识", "玻璃"], result: { id: "lens", name: "透镜", emoji: "🔍", description: "看清微小或遥远的事物。", type: "technology" } },
  { inputs: ["透镜", "星系"], result: { id: "telescope", name: "望远镜", emoji: "🔭", description: "仰望星空。", type: "technology" } },
  { inputs: ["煤炭", "火焰"], result: { id: "heat", name: "高热", emoji: "♨️", description: "工业的能量来源。", type: "energy" } },
  { inputs: ["高热", "金属"], result: { id: "steel", name: "钢铁", emoji: "🏗️", description: "更坚硬的金属。", type: "matter" } },

  // === Tier 5: 工业革命 (Industrial) ===
  { inputs: ["钢铁", "蒸汽"], result: { id: "steam_engine", name: "蒸汽机", emoji: "🚂", description: "工业的心脏。", type: "technology" } },
  { inputs: ["蒸汽机", "马车"], result: { id: "train", name: "火车", emoji: "🚆", description: "铁路时代的霸主。", type: "technology" } },
  { inputs: ["蒸汽机", "船"], result: { id: "steamboat", name: "轮船", emoji: "🛳️", description: "跨越海洋的巨兽。", type: "technology" } },
  { inputs: ["蒸汽机", "社会"], result: { id: "factory", name: "工厂", emoji: "🏭", description: "大规模生产。", type: "technology" } },
  { inputs: ["工厂", "大气层"], result: { id: "pollution", name: "污染", emoji: "🌫️", description: "工业的代价。", type: "matter" } },
  { inputs: ["工厂", "人类"], result: { id: "worker", name: "工人", emoji: "👷", description: "工业的齿轮。", type: "life" } },
  { inputs: ["知识", "机器"], result: { id: "engineering", name: "工程学", emoji: "📐", description: "应用科学。", type: "abstract" } },
  { inputs: ["生物", "时间"], result: { id: "oil", name: "石油", emoji: "🛢️", description: "黑色的金子。", type: "matter" } },
  { inputs: ["石油", "火焰"], result: { id: "combustion", name: "内燃机", emoji: "🏎️", description: "更高效的动力。", type: "technology" } },
  { inputs: ["内燃机", "马车"], result: { id: "car", name: "汽车", emoji: "🚗", description: "改变了城市的结构。", type: "technology" } },

  // === Tier 6: 电气时代 (Electricity) ===
  { inputs: ["金属", "风暴"], result: { id: "electricity", name: "电力", emoji: "⚡", description: "被驯服的雷电。", type: "energy" } },
  { inputs: ["电力", "金属"], result: { id: "wire", name: "电线", emoji: "➰", description: "能量的传输通道。", type: "technology" } },
  { inputs: ["电力", "玻璃"], result: { id: "lightbulb", name: "灯泡", emoji: "💡", description: "驱散黑夜。", type: "technology" } },
  { inputs: ["电力", "蒸汽机"], result: { id: "generator", name: "发电机", emoji: "🔋", description: "能量转换装置。", type: "technology" } },
  { inputs: ["电力", "声音"], result: { id: "radio", name: "无线电", emoji: "📻", description: "无形的波段。", type: "technology" } },
  { inputs: ["电力", "社会"], result: { id: "modern_city", name: "现代城市", emoji: "🏙️", description: "不夜城。", type: "technology" } },
  { inputs: ["石油", "化学"], result: { id: "plastic", name: "塑料", emoji: "🥤", description: "难以降解的人造物。", type: "matter" } },
  { inputs: ["工程学", "物质"], result: { id: "chemistry", name: "化学", emoji: "⚗️", description: "物质变化的科学。", type: "abstract" } },

  // === Tier 7: 信息时代 (Information) ===
  { inputs: ["电力", "知识"], result: { id: "data", name: "数据", emoji: "💾", description: "数字化的信息。", type: "abstract" } },
  { inputs: ["沙子", "电力"], result: { id: "silicon", name: "芯片", emoji: "📟", description: "逻辑的物理载体。", type: "technology" } },
  { inputs: ["芯片", "电力"], result: { id: "computer", name: "计算机", emoji: "💻", description: "思考的机器。", type: "technology" } },
  { inputs: ["计算机", "计算机"], result: { id: "internet", name: "互联网", emoji: "🌐", description: "连接全人类的神经。", type: "technology" } },
  { inputs: ["互联网", "社会"], result: { id: "social_media", name: "社交网络", emoji: "📱", description: "距离消失了，孤独增加了。", type: "technology" } },
  { inputs: ["计算机", "无线电"], result: { id: "smartphone", name: "智能手机", emoji: "🤳", description: "手中的世界。", type: "technology" } },
  { inputs: ["计算机", "工厂"], result: { id: "robot", name: "机器人", emoji: "🤖", description: "不知疲倦的劳动力。", type: "technology" } },
  { inputs: ["透镜", "电力"], result: { id: "laser", name: "激光", emoji: "🔦", description: "集中的光束。", type: "energy" } },

  // === Tier 8: 未来科技 (Future) ===
  { inputs: ["计算机", "意识"], result: { id: "ai", name: "人工智能", emoji: "🧠", description: "硅基生命的觉醒。", type: "technology" } },
  { inputs: ["机器人", "人类"], result: { id: "cyborg", name: "赛博格", emoji: "🦾", description: "人机融合。", type: "life" } },
  { inputs: ["互联网", "人工智能"], result: { id: "metaverse", name: "虚拟现实", emoji: "🥽", description: "数字化的彼岸。", type: "technology" } },
  { inputs: ["生物", "工程学"], result: { id: "biotech", name: "基因工程", emoji: "🧬", description: "扮演上帝。", type: "technology" } },
  { inputs: ["基因工程", "人类"], result: { id: "superhuman", name: "新人类", emoji: "🦸", description: "超越进化的限制。", type: "life" } },
  { inputs: ["原子", "工程学"], result: { id: "nuclear", name: "核能", emoji: "☢️", description: "恒星的力量。", type: "energy" } },
  { inputs: ["核能", "武器"], result: { id: "nuke", name: "核武器", emoji: "🍄", description: "世界的终结者。", type: "technology" } },
  { inputs: ["火箭", "核能"], result: { id: "starship", name: "星际飞船", emoji: "🚀", description: "飞向群星。", type: "technology" } },
  { inputs: ["汽车", "天空"], result: { id: "flying_car", name: "飞行汽车", emoji: "🛸", description: "未来的交通。", type: "technology" } },

  // === Tier 9: 终极 (Singularity) ===
  { inputs: ["人工智能", "人工智能"], result: { id: "singularity", name: "奇点", emoji: "👁️", description: "技术发展的极限，超越人类理解的时刻。", type: "cosmic" } },
  { inputs: ["奇点", "时间"], result: { id: "time_machine", name: "时间机器", emoji: "🕰️", description: "逆转因果。", type: "technology" } },
  { inputs: ["奇点", "虚空"], result: { id: "new_universe", name: "新宇宙", emoji: "🌌", description: "在毁灭中诞生的新轮回。", type: "cosmic" } },
  { inputs: ["星际飞船", "虫洞"], result: { id: "warp", name: "曲速引擎", emoji: "🌠", description: "超越光速。", type: "technology" } },
];

// --- BUILDER FUNCTION ---
// Converts the raw list into a Map with sorted keys for O(1) lookup.
const RECIPE_MAP: Record<string, Omit<ElementDefinition, 'discoveredAt'>> = {};

RAW_RECIPES.forEach((recipe) => {
  // Sort inputs to ensure Key consistency (A+B is same as B+A)
  const sorted = [...recipe.inputs].sort(); 
  const key = `${sorted[0]}+${sorted[1]}`;
  RECIPE_MAP[key] = recipe.result;
});

/**
 * Checks for a predefined static combination for two element names.
 * Ensures consistent sorting key generation.
 */
export const getStaticCombination = (nameA: string, nameB: string): Omit<ElementDefinition, 'discoveredAt'> | undefined => {
  const sortedNames = [nameA, nameB].sort();
  const key = `${sortedNames[0]}+${sortedNames[1]}`;
  return RECIPE_MAP[key];
};
