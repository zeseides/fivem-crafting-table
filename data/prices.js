// ============================================================
// NPC 收購價格資料
// 新增物品請照以下格式加入 priceItems 陣列
// sellPrice: NPC 收購價格（單位：$）
// ============================================================
const priceItems = [
  // 礦石
  { name: '鐵',       icon: '⬜', category: '礦石', sellPrice: 150  },
  { name: '銅',       icon: '🟠', category: '礦石', sellPrice: 180  },
  { name: '黃金',     icon: '🟡', category: '礦石', sellPrice: 200  },
  { name: '鑽石',     icon: '💎', category: '礦石', sellPrice: 1500 },

  // 食物
  { name: '橘子',     icon: '🍊', category: '食物', sellPrice: 300 },
  { name: '橘子汁',   icon: '🧃', category: '食物', sellPrice: 500 },
  { name: '高麗菜乾', icon: '🥬', category: '食物', sellPrice: 600 },
  { name: '鳳梨汁',   icon: '🍍', category: '食物', sellPrice: 620 },
  { name: '南瓜汁',   icon: '🎃', category: '食物', sellPrice: 700 },
];
