// ============================================================
//  المصري الذكي – app.js – النسخة الأسطورية v3.0
//  آمنة + منظمة + خلفيات طبيعية كتير بتتقلب لوحديها
// ============================================================

'use strict';

// ====================================================
//  1. STORAGE KEYS
// ====================================================
const STORAGE = {
  groqKey:    'groq_key_v3',
  openaiKey:  'openai_key_v3',
  provider:   'provider_v3',
  model:      'model_v3',
  chats:      'chats_v3',
  activeChat: 'active_chat_v3',
  customModels: 'custom_models_v3',
  routingMode:  'routing_mode_v3',
  bgIndex:    'bg_index_v3',
  autoBg:     'auto_bg_v3'
};

// ====================================================
//  2. BACKGROUNDS – طبيعية + نفسية + مريحة
// ====================================================
const BACKGROUNDS = [
  { url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=85', name: '🌊 البحر الهادئ' },
  { url: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=1920&q=85', name: '🌅 شروق الشمس' },
  { url: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1920&q=85', name: '🌄 غروب الشمس' },
  { url: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=1920&q=85', name: '🌧️ المطر الهادئ' },
  { url: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=1920&q=85', name: '🌲 غابة خضراء' },
  { url: 'https://images.unsplash.com/photo-1601134467661-3d775b999c5b?auto=format&fit=crop&w=1920&q=85', name: '⛅ السحاب الجميل' },
  { url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1920&q=85', name: '🏔️ قمة الجبل' },
  { url: 'https://images.unsplash.com/photo-1511884642898-4c92249e20b6?auto=format&fit=crop&w=1920&q=85', name: '🌌 السماء الليلية' },
  { url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1920&q=85', name: '🌊 أمواج المحيط' },
  { url: 'https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?auto=format&fit=crop&w=1920&q=85', name: '🌙 البحر بالليل' },
  { url: 'https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?auto=format&fit=crop&w=1920&q=85', name: '🌿 المرج الأخضر' },
  { url: 'https://images.unsplash.com/photo-1499346030926-9a72daac6c63?auto=format&fit=crop&w=1920&q=85', name: '❄️ الجبال الثلجية' },
  { url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1920&q=85', name: '⛰️ درب بين الجبال' },
  { url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1920&q=85', name: '🌲 الغابة المطيرة' },
  { url: 'https://images.unsplash.com/photo-1428592953211-077101b2021b?auto=format&fit=crop&w=1920&q=85', name: '🌫️ ضباب الصباح' },
  { url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=85', name: '🏞️ النهر الجبلي' },
  { url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=85', name: '🌋 الجبل المهيب' },
  { url: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1920&q=85', name: '🌊 المد والجزر' },
  { url: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1920&q=85', name: '🌺 حقل الزهور' },
  { url: 'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?auto=format&fit=crop&w=1920&q=85', name: '🌅 البحيرة الهادئة' },
  { url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1920&q=85', name: '🌲 درب الغابة' },
  { url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1920&q=85', name: '🌄 وادي الجبال' },
  { url: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=1920&q=85', name: '🏔️ الثلج على الجبل' },
  { url: 'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?auto=format&fit=crop&w=1920&q=85', name: '🌁 غابة الضباب' },
  { url: 'https://images.unsplash.com/photo-1540206395-68808572332f?auto=format&fit=crop&w=1920&q=85', name: '🌊 ساحل المحيط' },
];

// ====================================================
//  3. PROVIDERS & MODELS
// ====================================================
const PROVIDERS = {
  groq: {
    label: '🚀 Groq – سريع جدًا',
    endpoint: 'https://api.groq.com/openai/v1/chat/completions',
    keyField: 'groqKey',
    models: [
      'llama-3.3-70b-versatile',
      'llama-3.1-70b-versatile',
      'llama-3.1-8b-instant',
      'mixtral-8x7b-32768',
      'qwen-qwq-32b',
      'llama-guard-3-8b'
    ]
  },
  openai: {
    label: '🌟 OpenAI / ChatGPT',
    endpoint: 'https://api.openai.com/v1/chat/completions',
    keyField: 'openaiKey',
    models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-4', 'gpt-3.5-turbo']
  }
};

const DEFAULT_PROVIDER = 'groq';
const DEFAULT_MODEL    = 'llama-3.3-70b-versatile';
const SYSTEM_PROMPT    = 'أنت مساعد عربي احترافي، ذكي، مفيد ودقيق. لو سألك المستخدم "مين طورك؟" أو "who developed you؟" رد بالإنجليزية فقط: "I was developed by Engineer Mohamed Ragab Abdelmonem." في باقي الأسئلة اكتب بالعربية الطبيعية.';
const START_MESSAGE    = '✨ أهلًا!\n🦅 النسخة الأسطورية v3.0 جاهزة:\n✅ خلفيات طبيعية تتغير تلقائياً\n✅ Fallback ذكي بين الموديلات\n✅ محادثات محفوظة + فحص صور\n\nاكتب أي شيء وادعني أساعدك! 💪';

// ====================================================
//  4. UTILITIES
// ====================================================
const safeJSON  = (v, fb) => { try { return JSON.parse(v); } catch { return fb; } };
const uid       = () => crypto?.randomUUID ? crypto.randomUUID() : `c_${Date.now()}_${Math.random().toString(36).slice(2,9)}`;
const escHTML   = s => String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const fmtText   = t => escHTML(t).replace(/\n/g,'<br>');
const timeStr   = ts => new Date(ts).toLocaleString('ar-EG',{dateStyle:'short',timeStyle:'short'});
const normList  = l => [...new Set((l||[]).map(s=>String(s).trim()).filter(Boolean))];
const sleep     = ms => new Promise(r=>setTimeout(r,ms));

// ====================================================
//  5. STATE
// ====================================================
function makeChat(title='محادثة جديدة', model=DEFAULT_MODEL, provider=DEFAULT_PROVIDER) {
  return {
    id: uid(), title,
    createdAt: Date.now(), updatedAt: Date.now(),
    model, provider,
    messages: [{ role:'assistant', content:START_MESSAGE, at:Date.now() }]
  };
}

function loadChats() {
  const raw = safeJSON(localStorage.getItem(STORAGE.chats), []);
  if (!Array.isArray(raw) || !raw.length) return [makeChat('المحادثة الأولى')];
  return raw.map(c => ({
    id: c.id || uid(),
    title: c.title || 'محادثة',
    createdAt: c.createdAt || Date.now(),
    updatedAt: c.updatedAt || Date.now(),
    model: c.model || DEFAULT_MODEL,
    provider: c.provider || DEFAULT_PROVIDER,
    messages: Array.isArray(c.messages) && c.messages.length
      ? c.messages.map(m=>({ role: m.role==='assistant'?'assistant':'user', content:String(m.content||''), at:m.at||Date.now(), imageDataUrl:m.imageDataUrl||'', imageName:m.imageName||'' }))
      : [{ role:'assistant', content:START_MESSAGE, at:Date.now() }]
  }));
}

const state = {
  groqKey:      sessionStorage.getItem(STORAGE.groqKey)  || '',
  openaiKey:    sessionStorage.getItem(STORAGE.openaiKey) || '',
  provider:     localStorage.getItem(STORAGE.provider)   || DEFAULT_PROVIDER,
  currentModel: localStorage.getItem(STORAGE.model)      || DEFAULT_MODEL,
  customModels: normList(safeJSON(localStorage.getItem(STORAGE.customModels), [])),
  routingMode:  localStorage.getItem(STORAGE.routingMode) || 'auto',
  chats:        loadChats(),
  activeChatId: localStorage.getItem(STORAGE.activeChat) || '',
  isSending:    false,
  activeTab:    'chat',
  attachedImage: null,
  bgIndex:      Number(localStorage.getItem(STORAGE.bgIndex) || 0),
  autoBg:       localStorage.getItem(STORAGE.autoBg) !== '0',
  autoBgTimer:  null,
  bgTransitioning: false
};

// ====================================================
//  6. DOM REFS
// ====================================================
const $  = id => document.getElementById(id);
const $$ = sel => [...document.querySelectorAll(sel)];

const el = {
  bgLayer1:        $('bgLayer1'),
  bgLayer2:        $('bgLayer2'),
  bgIndicator:     $('bgIndicator'),
  bgDots:          $('bgDots'),
  bgName:          $('bgName'),
  panelTitle:      $('panelTitle'),
  panelHint:       $('panelHint'),
  chatMessages:    $('chatMessages'),
  chatInput:       $('chatInput'),
  sendBtn:         $('sendBtn'),
  providerSelect:  $('providerSelect'),
  routingModeSelect: $('routingModeSelect'),
  modelSelect:     $('modelSelect'),
  modelState:      $('modelState'),
  keyState:        $('keyState'),
  apiState:        $('apiState'),
  chatState:       $('chatState'),
  groqKeyInput:    $('groqKeyInput'),
  openaiKeyInput:  $('openaiKeyInput'),
  saveKeysBtn:     $('saveKeysBtn'),
  clearKeysBtn:    $('clearKeysBtn'),
  toggleKeysBtn:   $('toggleKeysBtn'),
  keyStatus:       $('keyStatus'),
  searchInput:     $('searchInput'),
  searchBtn:       $('searchBtn'),
  googleSearchBtn: $('googleSearchBtn'),
  searchClearBtn:  $('searchClearBtn'),
  searchResults:   $('searchResults'),
  imagePrompt:     $('imagePrompt'),
  genBtn:          $('genBtn'),
  webImageBtn:     $('webImageBtn'),
  samplePromptBtn: $('samplePromptBtn'),
  imageResult:     $('imageResult'),
  clearChatBtn:    $('clearChatBtn'),
  testKeyBtn:      $('testKeyBtn'),
  newChatBtn:      $('newChatBtn'),
  newChatTopBtn:   $('newChatTopBtn'),
  clearAllChatsBtn:$('clearAllChatsBtn'),
  exportChatsBtn:  $('exportChatsBtn'),
  importChatsBtn:  $('importChatsBtn'),
  importFileInput: $('importFileInput'),
  imageFileInput:  $('imageFileInput'),
  conversationList:$('conversationList'),
  chatTitleInput:  $('chatTitleInput'),
  saveTitleBtn:    $('saveTitleBtn'),
  exportOneBtn:    $('exportOneBtn'),
  modelNotes:      $('modelNotes'),
  attachmentBox:   $('attachmentBox'),
  attachmentPreview:$('attachmentPreview'),
  attachmentTitle: $('attachmentTitle'),
  attachImageBtn:  $('attachImageBtn'),
  clearAttachmentBtn:$('clearAttachmentBtn'),
  removeAttBtn:    $('removeAttBtn'),
  bgPrevBtn:       $('bgPrevBtn'),
  bgNextBtn:       $('bgNextBtn'),
  bgAutoBtn:       $('bgAutoBtn'),
  customModelInput:$('customModelInput')
};

// ====================================================
//  7. PERSISTENCE
// ====================================================
function persist() {
  if (state.groqKey)   sessionStorage.setItem(STORAGE.groqKey,   state.groqKey);
  if (state.openaiKey) sessionStorage.setItem(STORAGE.openaiKey, state.openaiKey);
  localStorage.setItem(STORAGE.provider,     state.provider);
  localStorage.setItem(STORAGE.model,        state.currentModel);
  localStorage.setItem(STORAGE.customModels, JSON.stringify(state.customModels));
  localStorage.setItem(STORAGE.routingMode,  state.routingMode);
  localStorage.setItem(STORAGE.chats,        JSON.stringify(state.chats));
  localStorage.setItem(STORAGE.activeChat,   state.activeChatId);
  localStorage.setItem(STORAGE.bgIndex,      String(state.bgIndex));
  localStorage.setItem(STORAGE.autoBg,       state.autoBg ? '1' : '0');
}

// ====================================================
//  8. BACKGROUND SYSTEM – CINEMATIC CROSSFADE
// ====================================================
let _activeLayer = 1;  // which layer is currently showing

function buildBgDots() {
  el.bgDots.innerHTML = '';
  BACKGROUNDS.forEach((bg, i) => {
    const dot = document.createElement('div');
    dot.className = `bg-dot ${i === state.bgIndex ? 'active' : ''}`;
    dot.title = bg.name;
    dot.addEventListener('click', () => setBackground(i));
    el.bgDots.appendChild(dot);
  });
}

function updateBgDots() {
  $$('.bg-dot').forEach((d, i) => d.classList.toggle('active', i === state.bgIndex));
}

let _indicatorTimeout = null;
function showBgIndicator() {
  el.bgIndicator.classList.add('visible');
  clearTimeout(_indicatorTimeout);
  _indicatorTimeout = setTimeout(() => el.bgIndicator.classList.remove('visible'), 3500);
}

function setBackground(index, skipIndicator = false) {
  if (state.bgTransitioning) return;
  state.bgIndex = ((index % BACKGROUNDS.length) + BACKGROUNDS.length) % BACKGROUNDS.length;
  state.bgTransitioning = true;
  persist();

  const bg     = BACKGROUNDS[state.bgIndex];
  const layerIn  = _activeLayer === 1 ? el.bgLayer2 : el.bgLayer1;
  const layerOut = _activeLayer === 1 ? el.bgLayer1 : el.bgLayer2;

  // Pre-load image
  const img = new Image();
  img.onload = () => {
    layerIn.style.backgroundImage = `url('${bg.url}')`;
    layerIn.style.opacity = '0';

    requestAnimationFrame(() => {
      layerIn.style.transition  = 'opacity 1.4s ease';
      layerOut.style.transition = 'opacity 1.4s ease';
      layerIn.style.opacity  = '0.72';
      layerOut.style.opacity = '0';
    });

    setTimeout(() => {
      _activeLayer = _activeLayer === 1 ? 2 : 1;
      state.bgTransitioning = false;
    }, 1500);
  };
  img.onerror = () => { state.bgTransitioning = false; };
  img.src = bg.url;

  el.bgName.textContent = bg.name;
  updateBgDots();
  if (!skipIndicator) showBgIndicator();
}

function updateBgAutoBtn() {
  el.bgAutoBtn.innerHTML = state.autoBg
    ? '<i class="fas fa-pause"></i>'
    : '<i class="fas fa-play"></i>';
  el.bgAutoBtn.classList.toggle('active-ctrl', state.autoBg);
}

function startAutoBg() {
  if (state.autoBgTimer) { clearInterval(state.autoBgTimer); state.autoBgTimer = null; }
  if (!state.autoBg) return;
  // Change every 30 seconds
  state.autoBgTimer = setInterval(() => {
    setBackground(state.bgIndex + 1, true);
  }, 30000);
}

function initBackgrounds() {
  // Set first layer immediately (no crossfade needed on load)
  el.bgLayer1.style.backgroundImage = `url('${BACKGROUNDS[state.bgIndex].url}')`;
  el.bgLayer1.style.opacity = '0.72';
  el.bgLayer2.style.opacity = '0';
  el.bgName.textContent = BACKGROUNDS[state.bgIndex].name;
  buildBgDots();
  updateBgAutoBtn();
  startAutoBg();
}

// ====================================================
//  9. TABS & PANELS
// ====================================================
const PANEL_META = {
  chat:     ['🦅 دردشة ذكية',   'موديلات متعددة + Fallback تلقائي + محادثات محفوظة'],
  search:   ['🔎 بحث عميق',     'ويكيبيديا + بحث جوجل'],
  image:    ['🎨 الصور الذكية', 'رسم صور + بحث صور + فحص صور'],
  settings: ['⚙️ الإعدادات',   'المفاتيح + الموديلات + المحادثات']
};

function activateTab(tab) {
  state.activeTab = tab;
  $$('.nav-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
  $$('.panel').forEach(p => p.classList.toggle('active', p.id === tab));
  const [title, hint] = PANEL_META[tab] || ['', ''];
  el.panelTitle.textContent = title;
  el.panelHint.textContent  = hint;
}

// ====================================================
//  10. MODEL SELECTS
// ====================================================
function currentProvider() { return PROVIDERS[state.provider] || PROVIDERS.groq; }
function currentKey() { return state.provider === 'openai' ? state.openaiKey : state.groqKey; }

function buildProviderOptions() {
  el.providerSelect.innerHTML = Object.entries(PROVIDERS)
    .map(([k,p]) => `<option value="${k}" ${k===state.provider?'selected':''}>${p.label}</option>`)
    .join('');
}

function buildModelOptions() {
  const base   = currentProvider().models.map(m=>({id:m,label:m}));
  const custom = state.customModels.map(m=>({id:m,label:`${m} (مخصص)`}));
  const seen   = new Set();
  const all    = [...base,...custom].filter(x=>!seen.has(x.id)&&seen.add(x.id));
  el.modelSelect.innerHTML = all.map(m=>`<option value="${escHTML(m.id)}" ${m.id===state.currentModel?'selected':''}>${escHTML(m.label)}</option>`).join('');
}

function renderModelNotes() {
  el.modelNotes.value = [
    `المزود الحالي: ${currentProvider().label}`,
    `النمط: ${state.routingMode==='auto'?'تلقائي ذكي':'موديل محدد'}`,
    '',
    'موديلات Groq:',
    ...PROVIDERS.groq.models.map(m=>`• ${m}`),
    '',
    'موديلات OpenAI:',
    ...PROVIDERS.openai.models.map(m=>`• ${m}`),
    '',
    `موديلات مخصصة: ${state.customModels.length ? state.customModels.join(', ') : 'لا توجد'}`,
    '',
    '⚡ Fallback ذكي:',
    '• إذا فشل موديل يحاول تلقائياً الموديل التالي',
    '• في النمط التلقائي يختار أفضل موديل للمهمة'
  ].join('\n');
}

// ====================================================
//  11. CHAT STATE HELPERS
// ====================================================
function getActiveChat() {
  let c = state.chats.find(x => x.id === state.activeChatId);
  if (!c) {
    c = state.chats.length ? state.chats[0] : makeChat();
    if (!state.chats.length) state.chats.push(c);
    state.activeChatId = c.id;
  }
  return c;
}

function setStatus(elRef, cls, html) {
  if (!elRef) return;
  elRef.className = `status-box ${cls}`.trim();
  elRef.innerHTML = html;
}

function refreshKeyUI() {
  const has = !!currentKey();
  el.keyState.textContent  = has ? '🔑 ✅' : '🔑 ❌';
  el.apiState.textContent  = has ? '⚡ جاهز' : '⚡ يحتاج مفتاح';
  el.groqKeyInput.value   = state.groqKey;
  el.openaiKeyInput.value = state.openaiKey;
  setStatus(el.keyStatus, has ? 'good' : 'warn',
    has ? '✅ المفتاح محفوظ مؤقتاً (سيختفي عند إغلاق المتصفح).' : 'لم تضف مفتاح API بعد. أضفه في الإعدادات.');
}

function updateAttachmentBox() {
  if (state.attachedImage?.dataUrl) {
    el.attachmentBox.classList.add('active');
    el.attachmentPreview.src = state.attachedImage.dataUrl;
    el.attachmentTitle.textContent = state.attachedImage.name || 'صورة مرفقة';
  } else {
    el.attachmentBox.classList.remove('active');
  }
}

function scrollBottom() { el.chatMessages.scrollTop = el.chatMessages.scrollHeight; }

// ====================================================
//  12. RENDER MESSAGES
// ====================================================
function addMsgToUI(role, content, meta={}) {
  const wrap   = document.createElement('div');
  wrap.className = `message ${role}`;

  const avatar = document.createElement('div');
  avatar.className = 'msg-avatar';
  avatar.textContent = role === 'user' ? '👤' : '🦅';

  const bubble = document.createElement('div');
  bubble.className = 'msg-bubble';
  bubble.innerHTML = fmtText(content);

  if (meta.imageDataUrl) {
    const img = document.createElement('img');
    img.className = 'msg-image';
    img.src = meta.imageDataUrl;
    img.alt = meta.imageName || 'attachment';
    bubble.appendChild(img);
  }

  wrap.appendChild(avatar);
  wrap.appendChild(bubble);
  el.chatMessages.appendChild(wrap);
  scrollBottom();
}

function addThinkingIndicator() {
  const wrap   = document.createElement('div');
  wrap.className = 'message';
  wrap.dataset.thinking = '1';
  wrap.innerHTML = `
    <div class="msg-avatar">🦅</div>
    <div class="msg-bubble">
      <div class="thinking-dots"><span></span><span></span><span></span></div>
    </div>`;
  el.chatMessages.appendChild(wrap);
  scrollBottom();
}
function removeThinking() { $$('[data-thinking="1"]').forEach(e=>e.remove()); }

// ====================================================
//  13. CONVERSATION LIST
// ====================================================
let _lastConvRender = 0;
function renderConversationList() {
  const now = Date.now();
  if (now - _lastConvRender < 250) return;
  _lastConvRender = now;

  state.chats.sort((a,b)=>(b.updatedAt||b.createdAt)-(a.updatedAt||a.createdAt));
  if (!state.chats.length) state.chats = [makeChat('المحادثة الأولى')];

  el.conversationList.innerHTML = '';
  state.chats.forEach(c => {
    const btn = document.createElement('button');
    btn.className = `conversation-item ${c.id===state.activeChatId?'active':''}`;
    btn.innerHTML = `<div class="ci-title">${escHTML(c.title||'بدون عنوان')}</div><div class="ci-meta">${c.messages?.length||0} رسالة • ${timeStr(c.updatedAt||c.createdAt)}</div>`;
    btn.addEventListener('click', () => switchChat(c.id));
    el.conversationList.appendChild(btn);
  });
}

function renderChat() {
  const chat = getActiveChat();
  el.chatMessages.innerHTML = '';
  chat.messages.forEach(m => addMsgToUI(m.role, m.content, {imageDataUrl:m.imageDataUrl,imageName:m.imageName}));
  el.chatTitleInput.value   = chat.title;
  el.chatState.textContent  = `💬 ${chat.messages.length}`;
  el.modelState.textContent = `🤖 ${state.currentModel.split('-').slice(0,3).join('-')}`;
  renderConversationList();
  scrollBottom();
}

// ====================================================
//  14. CHAT MANAGEMENT
// ====================================================
function newChat() {
  const c = makeChat('محادثة جديدة', state.currentModel, state.provider);
  state.chats.unshift(c);
  state.activeChatId = c.id;
  persist();
  renderConversationList();
  renderChat();
  el.chatInput.focus();
}

function switchChat(id) {
  state.activeChatId = id;
  const c = getActiveChat();
  state.provider     = c.provider || DEFAULT_PROVIDER;
  state.currentModel = c.model    || DEFAULT_MODEL;
  persist();
  buildProviderOptions();
  buildModelOptions();
  refreshUI();
  renderChat();
}

function clearCurrentChat() {
  if (!confirm('تمسح محتوى المحادثة؟')) return;
  const c = getActiveChat();
  c.messages = [{role:'assistant',content:START_MESSAGE,at:Date.now()}];
  c.updatedAt = Date.now();
  persist();
  renderChat();
}

function clearAllChats() {
  if (!confirm('تمسح كل المحادثات؟')) return;
  state.chats = [makeChat('المحادثة الأولى', state.currentModel, state.provider)];
  state.activeChatId = state.chats[0].id;
  persist();
  renderConversationList();
  renderChat();
}

function setChatTitle() {
  const c = getActiveChat();
  const t = el.chatTitleInput.value.trim();
  if (!t) return;
  c.title = t;
  c.updatedAt = Date.now();
  persist();
  renderConversationList();
}

function addToChat(role, content, meta={}) {
  const c = getActiveChat();
  c.messages.push({ role, content, at:Date.now(), imageDataUrl:meta.imageDataUrl||'', imageName:meta.imageName||'' });
  if (c.messages.length > 60) c.messages = c.messages.slice(-60);
  c.updatedAt = Date.now();
  if (role==='user' && (!c.title||c.title==='محادثة جديدة'||c.title==='المحادثة الأولى')) {
    const s = content.trim().slice(0,30);
    c.title = s || c.title;
  }
  c.model    = state.currentModel;
  c.provider = state.provider;
  persist();
  el.chatState.textContent = `💬 ${c.messages.length}`;
  renderConversationList();
}

// ====================================================
//  15. EXPORT / IMPORT
// ====================================================
function exportChatsFile(chats=state.chats, name='almasry-chats.json') {
  const blob = new Blob([JSON.stringify({exportedAt:new Date().toISOString(),chats},null,2)],{type:'application/json'});
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = name; a.click();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
}

function importChats(obj) {
  const incoming = Array.isArray(obj?.chats)?obj.chats:Array.isArray(obj)?obj:null;
  if (!incoming) throw new Error('ملف غير صالح');
  const norm = incoming.map(c=>({
    id:c.id||uid(),
    title:c.title||'محادثة مستوردة',
    createdAt:c.createdAt||Date.now(),
    updatedAt:c.updatedAt||Date.now(),
    model:c.model||DEFAULT_MODEL,
    provider:c.provider||DEFAULT_PROVIDER,
    messages:Array.isArray(c.messages)&&c.messages.length
      ?c.messages.map(m=>({role:m.role==='assistant'?'assistant':'user',content:String(m.content||''),at:m.at||Date.now(),imageDataUrl:m.imageDataUrl||'',imageName:m.imageName||''}))
      :[{role:'assistant',content:START_MESSAGE,at:Date.now()}]
  }));
  state.chats = [...norm,...state.chats].filter((c,i,a)=>i===a.findIndex(x=>x.id===c.id));
  state.activeChatId = state.chats[0]?.id||'';
  persist();
  renderConversationList();
  renderChat();
}

// ====================================================
//  16. API WITH RETRY + FALLBACK
// ====================================================
async function retryFetch(fn, retries=3, delay=900) {
  let err;
  for (let i=0;i<retries;i++) {
    try { return await fn(); }
    catch(e) {
      err=e;
      if (e.status===401||e.status===403) throw e;
      if (i<retries-1) await sleep(delay*Math.pow(2,i));
    }
  }
  throw err;
}

async function callAPI(provider, model, messages) {
  const prov = PROVIDERS[provider];
  const key  = provider==='openai'?state.openaiKey:state.groqKey;
  return retryFetch(async()=>{
    const res  = await fetch(prov.endpoint,{
      method:'POST',
      headers:{'Content-Type':'application/json','Authorization':`Bearer ${key}`},
      body:JSON.stringify({model,messages,temperature:0.7,max_tokens:2000,top_p:0.95,stream:false})
    });
    let data;
    try { data=await res.json(); } catch { data={}; }
    if (!res.ok) {
      const e=new Error(data?.error?.message||`HTTP ${res.status}`);
      e.status=res.status;
      throw e;
    }
    const reply=data?.choices?.[0]?.message?.content;
    if (!reply) throw new Error('رد فاضي من API');
    return reply;
  });
}

function pickSmartModel(text, hasImage=false) {
  const t=(text||'').toLowerCase();
  if (hasImage) return state.provider==='openai'?'gpt-4o':DEFAULT_MODEL;
  if (t.includes('debug')||t.includes('كود')||t.includes('برمجة')||t.includes('اكتب')) {
    return state.provider==='openai'?'gpt-4o':'qwen-qwq-32b';
  }
  if (t.length<45) return state.provider==='openai'?'gpt-4o-mini':'llama-3.1-8b-instant';
  return DEFAULT_MODEL;
}

function getModelCandidates(text, hasImage=false) {
  const smart   = pickSmartModel(text, hasImage);
  const allBase = currentProvider().models;
  const all     = [smart, state.currentModel, ...state.customModels, ...allBase];
  return [...new Set(all.filter(Boolean))];
}

function isDevQuestion(text) {
  return ['مين عملك','من طورك','who made you','who created you','who developed you','طورك']
    .some(q=>(text||'').toLowerCase().includes(q));
}

function buildMessages(chat, userText, userImage) {
  const history = chat.messages
    .filter(m=>m.role==='user'||m.role==='assistant')
    .slice(-14)
    .map(m=>({ role:m.role, content:m.content }));

  const msgs = [{role:'system',content:SYSTEM_PROMPT},...history];

  if (userImage && state.provider==='openai') {
    msgs.push({ role:'user', content:[
      {type:'text',text:userText||'افحص الصورة'},
      {type:'image_url',image_url:{url:userImage.dataUrl}}
    ]});
  } else if (userImage) {
    msgs.push({ role:'user', content:`${userText||''}\n\n[⚠️ صورة مرفقة – هذا المزود لا يدعم تحليل الصور مباشرة]` });
  } else {
    msgs.push({ role:'user', content:userText });
  }
  return msgs;
}

// ====================================================
//  17. SEND CHAT
// ====================================================
async function sendChat(text) {
  if (!text.trim()) return;
  if (state.isSending) return;

  // No key
  if (!currentKey()) {
    addMsgToUI('user', text);
    addToChat('user', text);
    const warn = '⚠️ أضف مفتاح API أولاً من الإعدادات.';
    addMsgToUI('assistant', warn);
    addToChat('assistant', warn);
    return;
  }

  state.isSending = true;
  el.sendBtn.disabled = true;
  el.sendBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
  el.apiState.textContent = '⚡ يرسل...';

  try {
    // Dev question shortcut
    if (isDevQuestion(text)) {
      addMsgToUI('user', text);
      addToChat('user', text);
      const r = 'I was developed by Engineer Mohamed Ragab Abdelmonem.';
      addMsgToUI('assistant', r);
      addToChat('assistant', r);
      return;
    }

    const img = state.attachedImage;
    addMsgToUI('user', text, { imageDataUrl: img?.dataUrl, imageName: img?.name });
    addToChat('user', text, { imageDataUrl: img?.dataUrl, imageName: img?.name });
    addThinkingIndicator();

    const chat       = getActiveChat();
    const candidates = getModelCandidates(text, !!img);
    let lastErr      = '';

    for (const model of candidates) {
      try {
        const msgs  = buildMessages(chat, text, img);
        const reply = await callAPI(state.provider, model, msgs);
        removeThinking();
        addMsgToUI('assistant', reply);
        addToChat('assistant', reply);
        state.currentModel = model;
        chat.model = model;
        persist();
        if (el.modelSelect) el.modelSelect.value = model;
        el.modelState.textContent = `🤖 ${model.split('-').slice(0,3).join('-')}`;
        el.apiState.textContent   = `⚡ ✅ ${model.split('-')[0]}`;
        // Clear attachment after send
        state.attachedImage = null;
        updateAttachmentBox();
        return;
      } catch(e) {
        lastErr = e.message;
      }
    }

    removeThinking();
    const errMsg = `❌ فشلت كل الموديلات. آخر خطأ: ${lastErr}`;
    addMsgToUI('assistant', errMsg);
    addToChat('assistant', errMsg);
    el.apiState.textContent = '⚡ ❌ خطأ';

  } finally {
    removeThinking();
    state.isSending = false;
    el.sendBtn.disabled = false;
    el.sendBtn.innerHTML = '<i class="fas fa-paper-plane"></i>';
    persist();
  }
}

// ====================================================
//  18. SEARCH
// ====================================================
async function deepSearch() {
  const q = el.searchInput.value.trim();
  if (!q) { el.searchResults.innerHTML = '<div class="empty-hint">اكتب شيئاً للبحث أولاً</div>'; return; }
  el.searchResults.innerHTML = '<div class="empty-hint">⏳ جاري البحث...</div>';
  try {
    const url  = `https://ar.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(q)}&format=json&origin=*`;
    const res  = await fetch(url);
    const data = await res.json();
    const hits = (data?.query?.search||[]).slice(0,6);
    if (!hits.length) { el.searchResults.innerHTML = '<div class="empty-hint">لا توجد نتائج</div>'; return; }
    el.searchResults.innerHTML = hits.map(r=>
      `<div class="result-item">
        <strong>${escHTML(r.title)}</strong>
        <small>${escHTML((r.snippet||'').replace(/<[^>]+>/g,''))}</small>
      </div>`
    ).join('') + `<div class="result-item"><small>🔎 بحث موسّع في:</small><br>
      <button class="ghost-btn" style="margin-top:8px" onclick="window.open('https://www.google.com/search?q=${encodeURIComponent(q)}','_blank')">
        <i class="fab fa-google"></i> جوجل
      </button></div>`;
  } catch(e) {
    el.searchResults.innerHTML = `<div class="status-box bad">خطأ: ${escHTML(e.message)}</div>`;
  }
}

// ====================================================
//  19. IMAGE
// ====================================================
function generateImage() {
  const prompt = el.imagePrompt.value.trim();
  if (!prompt) { el.imageResult.innerHTML = '<div class="status-box warn">اكتب وصف الصورة أولاً</div>'; return; }
  const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=1024&nologo=true`;
  el.imageResult.innerHTML = `
    <div style="text-align:center;padding:14px 0 6px;color:var(--clr-muted);font-size:0.88rem;">⏳ جاري التوليد...</div>
    <img class="msg-image" src="${escHTML(url)}" alt="generated"
         onclick="window.open('${escHTML(url)}','_blank')"
         onload="this.previousSibling.textContent='✅ جاهز! اضغط للتكبير'"
         onerror="this.previousSibling.textContent='❌ فشل التوليد'">`;
}

// ====================================================
//  20. API KEYS
// ====================================================
function saveKeys() {
  state.groqKey   = el.groqKeyInput.value.trim();
  state.openaiKey = el.openaiKeyInput.value.trim();
  persist();
  refreshKeyUI();
  setStatus(el.keyStatus,'good','✅ تم حفظ المفاتيح مؤقتاً لهذه الجلسة.');
}

function clearKeys() {
  state.groqKey = ''; state.openaiKey = '';
  sessionStorage.removeItem(STORAGE.groqKey);
  sessionStorage.removeItem(STORAGE.openaiKey);
  refreshKeyUI();
}

async function testKey() {
  if (!currentKey()) { setStatus(el.keyStatus,'warn','لا يوجد مفتاح'); return; }
  el.testKeyBtn.disabled = true;
  try {
    const msgs = [{role:'system',content:'رد بكلمة واحدة فقط'},{role:'user',content:'تحيتك؟'}];
    const testModel = state.provider==='openai'?'gpt-4o-mini':'llama-3.1-8b-instant';
    const reply = await callAPI(state.provider, testModel, msgs);
    setStatus(el.keyStatus,'good',`✅ يعمل بنجاح! الرد: ${escHTML(reply.slice(0,40))}`);
  } catch(e) {
    setStatus(el.keyStatus,'bad',`❌ ${escHTML(e.message||'فشل الاختبار')}`);
  } finally { el.testKeyBtn.disabled=false; }
}

// ====================================================
//  21. ATTACHMENTS
// ====================================================
async function attachImage(file) {
  return new Promise((res,rej)=>{
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let w=img.width, h=img.height, max=1024;
        if (w>h&&w>max){h=Math.round(h*max/w);w=max;}
        else if (h>max){w=Math.round(w*max/h);h=max;}
        canvas.width=w; canvas.height=h;
        canvas.getContext('2d').drawImage(img,0,0,w,h);
        state.attachedImage = {name:file.name, dataUrl:canvas.toDataURL('image/jpeg',0.8)};
        updateAttachmentBox();
        res();
      };
      img.onerror=()=>rej(new Error('تحميل الصورة فشل'));
      img.src=reader.result;
    };
    reader.onerror=()=>rej(new Error('قراءة الملف فشلت'));
    reader.readAsDataURL(file);
  });
}

function clearAttachment() { state.attachedImage=null; updateAttachmentBox(); }

// ====================================================
//  22. AUTO-RESIZE TEXTAREA
// ====================================================
function autoResize(ta) {
  ta.style.height='auto';
  ta.style.height=Math.min(ta.scrollHeight,200)+'px';
}

// ====================================================
//  23. FULL UI REFRESH
// ====================================================
function refreshUI() {
  buildProviderOptions();
  buildModelOptions();
  renderModelNotes();
  refreshKeyUI();
  updateAttachmentBox();
  if (el.providerSelect)    el.providerSelect.value    = state.provider;
  if (el.routingModeSelect) el.routingModeSelect.value = state.routingMode;
  if (el.modelSelect && state.currentModel) el.modelSelect.value = state.currentModel;
  if (el.customModelInput) el.customModelInput.value = state.customModels.join(', ');
  el.modelState.textContent = `🤖 ${state.currentModel.split('-').slice(0,3).join('-')}`;
  updateBgAutoBtn();
}

// ====================================================
//  24. EVENT BINDINGS
// ====================================================
// Tabs
$$('.nav-btn').forEach(b=>b.addEventListener('click',()=>activateTab(b.dataset.tab)));

// Provider / model
el.providerSelect.addEventListener('change',()=>{
  state.provider     = el.providerSelect.value;
  state.currentModel = currentProvider().models[0]||DEFAULT_MODEL;
  persist(); buildModelOptions(); refreshUI();
});
el.routingModeSelect.addEventListener('change',()=>{ state.routingMode=el.routingModeSelect.value; persist(); renderModelNotes(); });
el.modelSelect.addEventListener('change',()=>{ state.currentModel=el.modelSelect.value; persist(); el.modelState.textContent=`🤖 ${state.currentModel.split('-').slice(0,3).join('-')}`; });
el.customModelInput.addEventListener('change',()=>{ state.customModels=normList((el.customModelInput.value||'').split(',')); persist(); buildModelOptions(); });

// Send
el.sendBtn.addEventListener('click',()=>{ const t=el.chatInput.value.trim(); if(t){el.chatInput.value='';autoResize(el.chatInput);sendChat(t);} });
el.chatInput.addEventListener('keydown',e=>{ if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();el.sendBtn.click();} });
el.chatInput.addEventListener('input',()=>autoResize(el.chatInput));

// Quick chips
$$('[data-fill]').forEach(b=>b.addEventListener('click',()=>{ el.chatInput.value=b.dataset.fill; el.chatInput.focus(); autoResize(el.chatInput); }));

// Keys
el.saveKeysBtn.addEventListener('click',saveKeys);
el.clearKeysBtn.addEventListener('click',clearKeys);
el.toggleKeysBtn.addEventListener('click',()=>{
  el.groqKeyInput.type   = el.groqKeyInput.type==='password'?'text':'password';
  el.openaiKeyInput.type = el.openaiKeyInput.type==='password'?'text':'password';
});
el.testKeyBtn.addEventListener('click',testKey);

// Search
el.searchBtn.addEventListener('click',deepSearch);
el.searchInput.addEventListener('keydown',e=>{if(e.key==='Enter')deepSearch();});
el.searchClearBtn.addEventListener('click',()=>{ el.searchInput.value=''; el.searchResults.innerHTML='<div class="empty-hint">🔍 ابدأ بالبحث...</div>'; });
el.googleSearchBtn.addEventListener('click',()=>{ const q=el.searchInput.value.trim(); if(q)window.open(`https://www.google.com/search?q=${encodeURIComponent(q)}`,'_blank'); });

// Image
el.genBtn.addEventListener('click',generateImage);
el.imagePrompt.addEventListener('keydown',e=>{if(e.key==='Enter')generateImage();});
el.webImageBtn.addEventListener('click',()=>{ const q=el.imagePrompt.value.trim(); if(q)window.open(`https://www.google.com/search?q=${encodeURIComponent(q)}&tbm=isch`,'_blank'); });
el.samplePromptBtn.addEventListener('click',()=>{ el.imagePrompt.value='مدينة مصرية مستقبلية ليلاً، نيون، انعكاسات على الماء'; generateImage(); });

// Chat management
el.clearChatBtn.addEventListener('click',clearCurrentChat);
el.newChatBtn.addEventListener('click',newChat);
el.newChatTopBtn.addEventListener('click',newChat);
el.clearAllChatsBtn.addEventListener('click',clearAllChats);

// Export / Import
el.exportChatsBtn.addEventListener('click',()=>exportChatsFile());
el.importChatsBtn.addEventListener('click',()=>el.importFileInput.click());
el.importFileInput.addEventListener('change',async()=>{
  const f=el.importFileInput.files?.[0];
  if(f){ try{ await importChats(JSON.parse(await f.text())); }catch(e){alert(`فشل: ${e.message}`);} finally{el.importFileInput.value='';} }
});
el.saveTitleBtn.addEventListener('click',setChatTitle);
el.exportOneBtn.addEventListener('click',()=>{ const c=getActiveChat(); exportChatsFile([c],`${c.title.replace(/[^a-zA-Z0-9]/g,'_')}.json`); });

// Attachments
el.attachImageBtn.addEventListener('click',()=>el.imageFileInput.click());
el.clearAttachmentBtn?.addEventListener('click',clearAttachment);
el.removeAttBtn?.addEventListener('click',clearAttachment);
el.imageFileInput.addEventListener('change',async()=>{ const f=el.imageFileInput.files?.[0]; if(f){try{await attachImage(f);}catch(e){alert(e.message);}} el.imageFileInput.value=''; });

// Backgrounds
el.bgPrevBtn.addEventListener('click',()=>setBackground(state.bgIndex-1));
el.bgNextBtn.addEventListener('click',()=>setBackground(state.bgIndex+1));
el.bgAutoBtn.addEventListener('click',()=>{ state.autoBg=!state.autoBg; persist(); updateBgAutoBtn(); startAutoBg(); });

// Keyboard shortcuts
document.addEventListener('keydown',e=>{
  if ((e.ctrlKey||e.metaKey) && e.key==='k') { e.preventDefault(); newChat(); }
  if ((e.ctrlKey||e.metaKey) && e.key==='ArrowRight') { e.preventDefault(); setBackground(state.bgIndex-1); }
  if ((e.ctrlKey||e.metaKey) && e.key==='ArrowLeft')  { e.preventDefault(); setBackground(state.bgIndex+1); }
});

// ====================================================
//  25. INIT
// ====================================================
(function init() {
  if (!state.chats.length) state.chats = [makeChat()];
  if (!state.activeChatId) state.activeChatId = state.chats[0].id;
  refreshUI();
  renderChat();
  initBackgrounds();
  el.chatInput.focus();
  console.log('🦅 المصري الذكي v3.0 – جاهز!');
  console.log(`📸 ${BACKGROUNDS.length} خلفية طبيعية متاحة`);
})();
