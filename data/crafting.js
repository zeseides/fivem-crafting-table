// ============================================================
// 合成表資料
// 新增物品請照以下格式加入 craftingItems 陣列
// stationType: 'general' = 一般合成台, 'job' = 公職合成台
// desc: 物品描述（選填），留空字串代表無描述
// ============================================================
const craftingItems = [
  // 一般合成台 - 武器
  { name: '小刀', icon: '🔪', time: '00:30', level: 0, qty: 1, station: '一般合成台', stationType: 'general', category: '武器',
    desc: '',
    materials: [{ qty: 20, icon: '🪨', name: '鐵' }, { qty: 20, icon: '🪵', name: '木頭' }] },

  // 一般合成台 - 防具
  { name: '劣質防彈衣', icon: '🦺', time: '00:10', level: 0, qty: 1, station: '一般合成台', stationType: 'general', category: '防具',
    desc: '',
    materials: [{ qty: 10, icon: '🪨', name: '鐵' }, { qty: 20, icon: '🟤', name: '普通皮革' }, { qty: 10, icon: '🫧', name: '動物脂肪' }] },

  // 一般合成台 - 道具
  { name: '氧氣瓶', icon: '🧴', time: '00:10', level: 0, qty: 1, station: '一般合成台', stationType: 'general', category: '道具',
    desc: '',
    materials: [
      { qty: 24, icon: '🐟', name: '魚' },
      { qty: 36, icon: '🧪', name: '精煉油' },
      { qty: 5,  icon: '🦈', name: '鯊魚' },
      { qty: 1,  icon: '❤️', name: '野性之心' },
      { qty: 40, icon: '⬜', name: '鐵' },
    ] },

  // 一般合成台 - 食物
  { name: '麵包', icon: '🥖', time: '00:10', level: 0, qty: 1, station: '一般合成台', stationType: 'general', category: '食物',
    desc: '🍽️ 補充 10% 飢餓值',
    materials: [{ qty: 10, icon: '🟤', name: '普通皮革' }, { qty: 50, icon: '🍗', name: '包裝雞肉' }] },
  { name: '水', icon: '🍶', time: '00:10', level: 0, qty: 1, station: '一般合成台', stationType: 'general', category: '食物',
    desc: '💧 補充 10% 口渴值',
    materials: [{ qty: 50, icon: '🫙', name: '空瓶子' }] },

  // 一般合成台 - 其他
  { name: '偷尼錢錢', icon: '👹', time: '00:10', level: 0, qty: 1, station: '一般合成台', stationType: 'general', category: '其他',
    desc: '',
    materials: [{ qty: 5, icon: '🪙', name: '偷尼碎片' }] },

  // 公職合成台 - 修車廠
  { name: '修車工具', icon: '🔧', time: '00:10', level: 0, qty: 1, station: '修車廠', stationType: 'job', category: '修車廠',
    desc: '',
    materials: [{ qty: 5, icon: '⚙️', name: '修復好的引擎' }, { qty: 5, icon: '🪨', name: '洗過的石頭' }, { qty: 5, icon: '🔄', name: '修復好的輪胎' }] },
];
