// ============================================================
// 頁面主邏輯
// ============================================================

const PAGES = {
  crafting: '合成表',
  prices:   'NPC收購價',
  shop:     '商店購買價',
  items:    '物品圖鑑',
  upgrades: '物品升級',
};

let currentPage = 'crafting';

const craftingStations = [
  { key: 'all',     label: '全部' },
  { key: 'general', label: '一般合成台' },
  { key: 'job',     label: '公職合成台' },
];
let activeStation = 'all';
let activeCat = '全部';

function $(id) { return document.getElementById(id); }

// ============================================================
// 導覽列
// ============================================================
function renderNav() {
  $('navTabs').innerHTML = Object.entries(PAGES).map(([key, label]) =>
    `<button class="nav-tab ${currentPage === key ? 'active' : ''}" onclick="setPage('${key}')">${label}</button>`
  ).join('');
}

function setPage(page) {
  currentPage = page;
  renderNav();
  renderPage();
  closePopup();
}

function renderPage() {
  $('pageContent').innerHTML = '';
  $('controls').innerHTML = '';
  if (currentPage === 'crafting') renderCrafting();
  else if (currentPage === 'prices') renderPrices();
  else if (currentPage === 'shop') renderShop();
  else if (currentPage === 'items') renderItems();
  else if (currentPage === 'upgrades') renderUpgrades();
}

// ============================================================
// 圖鑑小卡 Popup
// ============================================================
function buildItemPopupHtml(item) {
  return `
    <div class="popup-header">
      <span class="popup-icon">${item.icon}</span>
      <div>
        <div class="popup-name">${item.name}</div>
        <span class="badge badge-cat">${item.category}</span>
      </div>
    </div>
    ${item.effect ? `<div class="popup-effect">✨ ${item.effect}</div>` : ''}
    <div class="popup-divider"></div>
    <div class="popup-label">獲取方式</div>
    ${item.source.map(s => `<div class="popup-source">▸ ${s}</div>`).join('')}
    ${item.note ? `<div class="popup-note">💡 ${item.note}</div>` : ''}
  `;
}

function showItemPopup(name, triggerEl) {
  const item = itemsData.find(i => i.name === name);
  const popup = $('itemPopup');

  if (!item) {
    closePopup();
    return;
  }

  popup.innerHTML = buildItemPopupHtml(item);

  // 定位：優先顯示在觸發元素右方，空間不夠則左方
  const rect = triggerEl.getBoundingClientRect();
  const scrollY = window.scrollY;
  popup.style.display = 'block';

  const popupW = 260;
  const spaceRight = window.innerWidth - rect.right - 12;
  const left = spaceRight >= popupW
    ? rect.right + 8
    : rect.left - popupW - 8;

  popup.style.left = Math.max(8, left) + 'px';
  popup.style.top  = (rect.top + scrollY) + 'px';
}

function closePopup() {
  const popup = $('itemPopup');
  if (popup) popup.style.display = 'none';
}

// 點擊其他地方關閉
document.addEventListener('click', e => {
  const popup = $('itemPopup');
  if (!popup) return;
  if (!popup.contains(e.target) && !e.target.closest('.mat-link')) {
    closePopup();
  }
});

// ============================================================
// 合成表頁面
// ============================================================
function renderCrafting() {
  $('controls').innerHTML = `
    <div class="search-wrap">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
      <input type="search" id="searchInput" placeholder="搜尋物品或材料..." oninput="renderCraftingCards()">
    </div>
    <div class="filter-row">
      <span class="filter-label">合成台</span>
      <div class="tabs" id="stationTabs"></div>
    </div>
    <div class="filter-row">
      <span class="filter-label">類型</span>
      <div class="tabs" id="catTabs"></div>
    </div>
  `;
  activeStation = 'all'; activeCat = '全部';
  renderStationTabs();
  renderCatTabs();
  renderCraftingCards();
}

function getCraftingVisible() {
  const q = ($('searchInput') || {}).value || '';
  return craftingItems.filter(i => {
    if (activeStation !== 'all' && i.stationType !== activeStation) return false;
    if (activeCat !== '全部' && i.category !== activeCat) return false;
    if (q && !i.name.includes(q) && !i.materials.some(m => m.name.includes(q)) && !i.station.includes(q)) return false;
    return true;
  });
}

function getCatsForStation() {
  const pool = activeStation === 'all' ? craftingItems : craftingItems.filter(i => i.stationType === activeStation);
  return ['全部', ...new Set(pool.map(i => i.category))];
}

function renderStationTabs() {
  $('stationTabs').innerHTML = craftingStations.map(s =>
    `<button class="tab ${activeStation === s.key ? 'active-station' + (s.key === 'job' ? ' job' : '') : ''}" onclick="setStation('${s.key}')">${s.label}</button>`
  ).join('');
}

function renderCatTabs() {
  const cats = getCatsForStation();
  if (!cats.includes(activeCat)) activeCat = '全部';
  $('catTabs').innerHTML = cats.map(c =>
    `<button class="tab ${activeCat === c ? 'active-cat' : ''}" onclick="setCat('${c}')">${c}</button>`
  ).join('');
}

function setStation(k) { activeStation = k; activeCat = '全部'; renderStationTabs(); renderCatTabs(); renderCraftingCards(); }
function setCat(c) { activeCat = c; renderCatTabs(); renderCraftingCards(); }

function matRowHtml(m) {
  const hasInfo = itemsData.some(i => i.name === m.name);
  const nameHtml = hasInfo
    ? `<span class="mat-name mat-link" onclick="showItemPopup('${m.name}', this)">${m.name}</span>`
    : `<span class="mat-name">${m.name}</span>`;
  return `<div class="mat-row"><span class="mat-qty">${m.qty}×</span><span class="mat-icon">${m.icon}</span>${nameHtml}</div>`;
}

function craftCardHtml(item) {
  const isJob = item.stationType === 'job';
  const descHtml = item.desc ? `<div class="item-desc">${item.desc}</div>` : '';
  return `
    <div class="card ${isJob ? 'job-card' : ''}">
      <div class="card-header">
        <div class="item-icon">${item.icon}</div>
        <div class="item-info">
          <div class="item-name">${item.name}</div>
          <div class="badges">
            <span class="badge badge-time ${isJob ? 'job' : ''}">⏱ ${item.time}</span>
            <span class="badge badge-lvl">LV ${item.level}</span>
            <span class="badge badge-qty">×${item.qty}</span>
            <span class="badge badge-cat">${item.category}</span>
          </div>
          ${descHtml}
        </div>
      </div>
      <div class="divider"></div>
      <div class="materials-label">所需材料</div>
      <div class="materials">
        ${item.materials.map(matRowHtml).join('')}
      </div>
    </div>`;
}

function renderCraftingCards() {
  const visible = getCraftingVisible();
  $('pageContent').innerHTML = `
    <div class="stats">顯示 <span>${visible.length}</span> / ${craftingItems.length} 筆合成配方</div>
    <div id="craftingContent"></div>
  `;
  if (!visible.length) {
    $('craftingContent').innerHTML = `<div class="no-results"><div class="icon">🔍</div><p>找不到符合的配方</p></div>`;
    return;
  }
  const groups = {};
  visible.forEach(i => {
    if (!groups[i.station]) groups[i.station] = { type: i.stationType, items: [] };
    groups[i.station].items.push(i);
  });
  $('craftingContent').innerHTML = Object.entries(groups).map(([station, g]) => {
    const isJob = g.type === 'job';
    return `
      <div class="section">
        <div class="section-header">
          <span class="section-icon">${isJob ? '🏢' : '🔨'}</span>
          <span class="section-title ${isJob ? 'job' : 'general'}">${station}</span>
          <span class="section-count">${g.items.length} 筆</span>
        </div>
        <div class="grid">${g.items.map(craftCardHtml).join('')}</div>
      </div>`;
  }).join('');
}

// ============================================================
// NPC 收購價格頁面
// ============================================================
let activePriceCat = '全部';

function renderPrices() {
  $('controls').innerHTML = `
    <div class="search-wrap">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
      <input type="search" id="searchInput" placeholder="搜尋物品..." oninput="renderPriceCards()">
    </div>
    <div class="filter-row">
      <span class="filter-label">類型</span>
      <div class="tabs" id="priceCatTabs"></div>
    </div>
  `;
  activePriceCat = '全部';
  renderPriceCatTabs();
  renderPriceCards();
}

function renderPriceCatTabs() {
  const cats = ['全部', ...new Set(priceItems.map(i => i.category))];
  $('priceCatTabs').innerHTML = cats.map(c =>
    `<button class="tab ${activePriceCat === c ? 'active-cat' : ''}" onclick="setPriceCat('${c}')">${c}</button>`
  ).join('');
}

function setPriceCat(c) { activePriceCat = c; renderPriceCatTabs(); renderPriceCards(); }

function renderPriceCards() {
  const q = ($('searchInput') || {}).value || '';
  let list = priceItems;
  if (activePriceCat !== '全部') list = list.filter(i => i.category === activePriceCat);
  if (q) list = list.filter(i => i.name.includes(q));

  if (!list.length) {
    $('pageContent').innerHTML = priceItems.length === 0
      ? `<div class="no-results"><div class="icon">💰</div><p>價格資料建置中，敬請期待</p></div>`
      : `<div class="no-results"><div class="icon">🔍</div><p>找不到符合的物品</p></div>`;
    return;
  }

  const sorted = [...list].sort((a, b) => a.sellPrice - b.sellPrice);
  $('pageContent').innerHTML = `
    <div class="stats">顯示 <span>${sorted.length}</span> / ${priceItems.length} 筆價格資料</div>
    <div class="price-table">
      <div class="price-header-row"><span>物品</span><span>類型</span><span>NPC 收購價</span></div>
      ${sorted.map(i => `
        <div class="price-row">
          <span class="price-item-name">${i.icon} ${i.name}</span>
          <span class="price-cat">${i.category}</span>
          <span class="price-value">$ ${i.sellPrice.toLocaleString()}</span>
        </div>
      `).join('')}
    </div>
  `;
}

// ============================================================
// 商店購買價頁面
// ============================================================
let activeShopName = '全部';

function renderShop() {
  $('controls').innerHTML = `
    <div class="search-wrap">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
      <input type="search" id="searchInput" placeholder="搜尋物品..." oninput="renderShopCards()">
    </div>
    <div class="filter-row">
      <span class="filter-label">商店</span>
      <div class="tabs" id="shopNameTabs"></div>
    </div>
  `;
  activeShopName = '全部';
  renderShopNameTabs();
  renderShopCards();
}

function renderShopNameTabs() {
  const shops = ['全部', ...new Set(shopItems.map(i => i.shop))];
  $('shopNameTabs').innerHTML = shops.map(s =>
    `<button class="tab ${activeShopName === s ? 'active-station' : ''}" onclick="setShopName('${s}')">${s}</button>`
  ).join('');
}

function setShopName(s) { activeShopName = s; renderShopNameTabs(); renderShopCards(); }

function renderShopCards() {
  const q = ($('searchInput') || {}).value || '';
  let list = shopItems;
  if (activeShopName !== '全部') list = list.filter(i => i.shop === activeShopName);
  if (q) list = list.filter(i => i.name.includes(q) || i.shop.includes(q));

  if (!list.length) {
    $('pageContent').innerHTML = `<div class="no-results"><div class="icon">🔍</div><p>找不到符合的物品</p></div>`;
    return;
  }

  const groups = {};
  list.forEach(i => { if (!groups[i.shop]) groups[i.shop] = []; groups[i.shop].push(i); });

  $('pageContent').innerHTML = `
    <div class="stats">顯示 <span>${list.length}</span> / ${shopItems.length} 筆商品</div>
    ${Object.entries(groups).map(([shop, items]) => `
      <div class="section">
        <div class="section-header">
          <span class="section-icon">🏪</span>
          <span class="section-title general">${shop}</span>
          <span class="section-count">${items.length} 筆</span>
        </div>
        <div class="price-table">
          <div class="price-header-row" style="grid-template-columns:1fr 100px 60px 140px">
            <span>物品</span><span>類型</span><span>稀有度</span><span>購買價</span>
          </div>
          ${items.map(i => `
            <div class="price-row" style="grid-template-columns:1fr 100px 60px 140px">
              <span class="price-item-name">${i.icon} ${i.name}</span>
              <span class="price-cat">${i.category}</span>
              <span>${i.rarity === 'rare' ? '<span class="badge-rare">RARE</span>' : '<span class="badge-normal">普通</span>'}</span>
              <span class="price-value shop">$ ${i.shopPrice.toLocaleString()}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `).join('')}
  `;
}

// ============================================================
// 物品圖鑑頁面
// ============================================================
let activeItemCat = '全部';

function linkifyText(text, currentItemName) {
  const names = itemsData
    .map(i => i.name)
    .filter(n => n !== currentItemName)
    .sort((a, b) => b.length - a.length);

  const placeholders = [];
  let result = text;
  names.forEach(name => {
    const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    result = result.replace(new RegExp(escaped, 'g'), () => {
      const idx = placeholders.length;
      placeholders.push(`<a class="item-link" href="#" onclick="jumpToItem('${name}');return false;">${name}</a>`);
      return `\x00${idx}\x00`;
    });
  });
  result = result.replace(/\x00(\d+)\x00/g, (_, idx) => placeholders[Number(idx)]);
  return result;
}

function jumpToItem(name) {
  if (activeItemCat !== '全部') {
    activeItemCat = '全部';
    renderItemCatTabs();
    renderItemCards();
  }
  const target = document.querySelector(`[data-item-name="${name}"]`);
  if (!target) return;
  target.scrollIntoView({ behavior: 'smooth', block: 'center' });
  target.classList.remove('highlight');
  void target.offsetWidth;
  target.classList.add('highlight');
  setTimeout(() => target.classList.remove('highlight'), 1800);
}

function renderItems() {
  $('controls').innerHTML = `
    <div class="search-wrap">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
      <input type="search" id="searchInput" placeholder="搜尋物品..." oninput="renderItemCards()">
    </div>
    <div class="filter-row">
      <span class="filter-label">類型</span>
      <div class="tabs" id="itemCatTabs"></div>
    </div>
  `;
  activeItemCat = '全部';
  renderItemCatTabs();
  renderItemCards();
}

function renderItemCatTabs() {
  const cats = ['全部', ...new Set(itemsData.map(i => i.category))];
  $('itemCatTabs').innerHTML = cats.map(c =>
    `<button class="tab ${activeItemCat === c ? 'active-cat' : ''}" onclick="setItemCat('${c}')">${c}</button>`
  ).join('');
}

function setItemCat(c) { activeItemCat = c; renderItemCatTabs(); renderItemCards(); }

function renderItemCards() {
  const q = ($('searchInput') || {}).value || '';
  let list = itemsData;
  if (activeItemCat !== '全部') list = list.filter(i => i.category === activeItemCat);
  if (q) list = list.filter(i => i.name.includes(q) || i.source.some(s => s.includes(q)));

  if (!list.length) {
    $('pageContent').innerHTML = `<div class="no-results"><div class="icon">🔍</div><p>找不到符合的物品</p></div>`;
    return;
  }

  const groups = {};
  list.forEach(i => { if (!groups[i.category]) groups[i.category] = []; groups[i.category].push(i); });

  $('pageContent').innerHTML = `
    <div class="stats">顯示 <span>${list.length}</span> / ${itemsData.length} 筆物品資料</div>
    ${Object.entries(groups).map(([cat, items]) => `
      <div class="section">
        <div class="section-header">
          <span class="section-icon">📦</span>
          <span class="section-title general">${cat}</span>
          <span class="section-count">${items.length} 筆</span>
        </div>
        <div class="grid">
          ${items.map(item => `
            <div class="card" data-item-name="${item.name}">
              <div class="card-header">
                <div class="item-icon">${item.icon}</div>
                <div class="item-info">
                  <div class="item-name">${item.name}</div>
                  <div class="badges"><span class="badge badge-cat">${item.category}</span></div>
                  ${item.effect ? `<div class="item-desc">✨ ${item.effect}</div>` : ''}
                </div>
              </div>
              <div class="divider"></div>
              <div class="materials-label">獲取方式</div>
              <div class="materials">
                ${item.source.map(s => `<div class="mat-row"><span class="mat-icon">▸</span><span class="mat-name">${linkifyText(s, item.name)}</span></div>`).join('')}
              </div>
              ${item.note ? `<div class="item-note">💡 ${linkifyText(item.note, item.name)}</div>` : ''}
            </div>
          `).join('')}
        </div>
      </div>
    `).join('')}
  `;
}

// ============================================================
// 物品升級頁面
// ============================================================
function renderUpgrades() {
  $('controls').innerHTML = '';
  $('pageContent').innerHTML = upgradeItems.length === 0
    ? `<div class="no-results"><div class="icon">⬆️</div><p>升級資料建置中，敬請期待</p></div>`
    : '';
}

// ============================================================
// 初始化
// ============================================================
renderNav();
renderPage();
