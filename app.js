// ============================================================
// المصري الذكي – النسخة الأسطورية v2.1 (آمنة + منظمة)
// ============================================================

// ====== STORAGE KEYS (sessionStorage للمفاتيح – localStorage للمحادثات) ======
const STORAGE = {
  groqKey: 'groq_key_elite_v2',
  openaiKey: 'openai_key_elite_v2',
  provider: 'provider_elite_v2',
  model: 'model_elite_v2',
  chats: 'chats_elite_v2',
  activeChat: 'active_chat_elite_v2',
  customModels: 'custom_models_elite_v2',
  routingMode: 'routing_mode_elite_v2',
  backgroundIndex: 'bg_index_elite_v2',
  autoBg: 'auto_bg_elite_v2'
};

// ====== BACKGROUNDS ======
const NATURE_BACKGROUNDS = [
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1920&q=80'
];

// ====== PROVIDERS & MODELS ======
const PROVIDERS = {
  groq: {
    label: '🚀 Groq (سريع جدًا)',
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
    models: [
      'gpt-4o',
      'gpt-4o-mini',
      'gpt-4-turbo',
      'gpt-4',
      'gpt-3.5-turbo'
    ]
  }
};

const DEFAULT_PROVIDER = 'groq';
const DEFAULT_MODEL = 'llama-3.3-70b-versatile';
const SYSTEM_PROMPT = 'أنت مساعد عربي احترافي، ذكي، مفيد ودقيق. لو سألك المستخدم "مين طورك؟" أو "who developed you؟" رد بالإنجليزية فقط: "I was developed by Engineer Mohamed Ragab Abdelmonem." في باقي الأسئلة اكتب بالعربية الطبيعية. لو يوجد صورة افحصها بدقة. إذا طلب توليد صورة أو بحث عن صور تعامل معه خصيصًا.';
const START_MESSAGE = '✨ أهلًا يا محمد!\n🦅 دي النسخة الأسطورية مع:\n✅ Fallback ذكي (لو موديل وقع يتحول للموديل التاني تلقائيًا)\n✅ كل الموديلات المجانية المتاحة\n✅ محادثات محفوظة + خلفيات\n✅ فحص صور + توليد صور\n\nاكتب أي شيء وادعني أساعدك! 💪';

// ====== UTILITIES ======
function safeJSONParse(value, fallback) { try { return JSON.parse(value); } catch { return fallback; } }
function uid() { return crypto?.randomUUID ? crypto.randomUUID() : `chat_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`; }
function escapeHTML(str) { return String(str).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;'); }
function formatText(text) { return escapeHTML(text).replace(/\n/g, '<br>'); }
function timeLabel(ts) { return new Date(ts).toLocaleString('ar-EG', { dateStyle: 'short', timeStyle: 'short' }); }
function normalizeList(list) { return [...new Set((list || []).map(s => String(s).trim()).filter(Boolean))]; }

// ====== CHAT STATE ======
function makeNewChat(title = 'محادثة جديدة', model = DEFAULT_MODEL, provider = DEFAULT_PROVIDER) {
  return {
    id: uid(),
    title,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    model,
    provider,
    messages: [{ role: 'assistant', content: START_MESSAGE, at: Date.now() }]
  };
}

function loadChats() {
  const raw = safeJSONParse(localStorage.getItem(STORAGE.chats), []);
  if (!Array.isArray(raw) || !raw.length) return [makeNewChat('المحادثة الأولى')];
  return raw.map(c => ({
    id: c.id || uid(),
    title: c.title || 'محادثة محفوظة',
    createdAt: c.createdAt || Date.now(),
    updatedAt: c.updatedAt || Date.now(),
    model: c.model || DEFAULT_MODEL,
    provider: c.provider || DEFAULT_PROVIDER,
    messages: Array.isArray(c.messages) && c.messages.length ? c.messages.map(m => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: String(m.content || ''),
      at: m.at || Date.now(),
      imageDataUrl: m.imageDataUrl || '',
      imageName: m.imageName || ''
    })) : [{ role: 'assistant', content: START_MESSAGE, at: Date.now() }]
  }));
}

const state = {
  groqKey: sessionStorage.getItem(STORAGE.groqKey) || '',
  openaiKey: sessionStorage.getItem(STORAGE.openaiKey) || '',
  provider: localStorage.getItem(STORAGE.provider) || DEFAULT_PROVIDER,
  currentModel: localStorage.getItem(STORAGE.model) || DEFAULT_MODEL,
  customModels: normalizeList(safeJSONParse(localStorage.getItem(STORAGE.customModels), [])),
  routingMode: localStorage.getItem(STORAGE.routingMode) || 'auto',
  chats: loadChats(),
  activeChatId: localStorage.getItem(STORAGE.activeChat) || '',
  isSending: false,
  activeTab: 'chat',
  attachedImage: null,
  bgIndex: Number(localStorage.getItem(STORAGE.backgroundIndex) || 0),
  autoBg: localStorage.getItem(STORAGE.autoBg) !== '0',
  autoBgTimer: null
};

// ====== DOM ELEMENTS ======
const els = {
  wallpaper: document.querySelector('.wallpaper'),
  tabBtns: [...document.querySelectorAll('.tab-btn')],
  panels: [...document.querySelectorAll('.panel')],
  panelTitle: document.getElementById('panelTitle'),
  panelHint: document.getElementById('panelHint'),
  chatMessages: document.getElementById('chatMessages'),
  chatInput: document.getElementById('chatInput'),
  sendBtn: document.getElementById('sendBtn'),
  providerSelect: document.getElementById('providerSelect'),
  routingModeSelect: document.getElementById('routingModeSelect'),
  modelSelect: document.getElementById('modelSelect'),
  modelState: document.getElementById('modelState'),
  keyState: document.getElementById('keyState'),
  apiState: document.getElementById('apiState'),
  chatState: document.getElementById('chatState'),
  groqKeyInput: document.getElementById('groqKeyInput'),
  openaiKeyInput: document.getElementById('openaiKeyInput'),
  saveKeysBtn: document.getElementById('saveKeysBtn'),
  clearKeysBtn: document.getElementById('clearKeysBtn'),
  toggleKeysBtn: document.getElementById('toggleKeysBtn'),
  keyStatus: document.getElementById('keyStatus'),
  searchInput: document.getElementById('searchInput'),
  searchBtn: document.getElementById('searchBtn'),
  googleSearchBtn: document.getElementById('googleSearchBtn'),
  searchClearBtn: document.getElementById('searchClearBtn'),
  searchResults: document.getElementById('searchResults'),
  imagePrompt: document.getElementById('imagePrompt'),
  genBtn: document.getElementById('genBtn'),
  webImageBtn: document.getElementById('webImageBtn'),
  samplePromptBtn: document.getElementById('samplePromptBtn'),
  imageResult: document.getElementById('imageResult'),
  clearChatBtn: document.getElementById('clearChatBtn'),
  testKeyBtn: document.getElementById('testKeyBtn'),
  newChatBtn: document.getElementById('newChatBtn'),
  newChatTopBtn: document.getElementById('newChatTopBtn'),
  clearAllChatsBtn: document.getElementById('clearAllChatsBtn'),
  exportChatsBtn: document.getElementById('exportChatsBtn'),
  importChatsBtn: document.getElementById('importChatsBtn'),
  importFileInput: document.getElementById('importFileInput'),
  imageFileInput: document.getElementById('imageFileInput'),
  conversationList: document.getElementById('conversationList'),
  chatTitleInput: document.getElementById('chatTitleInput'),
  saveTitleBtn: document.getElementById('saveTitleBtn'),
  exportOneBtn: document.getElementById('exportOneBtn'),
  modelNotes: document.getElementById('modelNotes'),
  attachmentBox: document.getElementById('attachmentBox'),
  attachmentPreview: document.getElementById('attachmentPreview'),
  attachmentTitle: document.getElementById('attachmentTitle'),
  attachImageBtn: document.getElementById('attachImageBtn'),
  clearAttachmentBtn: document.getElementById('clearAttachmentBtn'),
  bgPrevBtn: document.getElementById('bgPrevBtn'),
  bgNextBtn: document.getElementById('bgNextBtn'),
  bgAutoBtn: document.getElementById('bgAutoBtn'),
  customModelInput: document.getElementById('customModelInput')
};

// ====== PERSISTENCE ======
function persist() {
  if (state.groqKey) sessionStorage.setItem(STORAGE.groqKey, state.groqKey);
  if (state.openaiKey) sessionStorage.setItem(STORAGE.openaiKey, state.openaiKey);
  localStorage.setItem(STORAGE.provider, state.provider);
  localStorage.setItem(STORAGE.model, state.currentModel);
  localStorage.setItem(STORAGE.customModels, JSON.stringify(state.customModels));
  localStorage.setItem(STORAGE.routingMode, state.routingMode);
  localStorage.setItem(STORAGE.chats, JSON.stringify(state.chats));
  localStorage.setItem(STORAGE.activeChat, state.activeChatId);
  localStorage.setItem(STORAGE.backgroundIndex, String(state.bgIndex));
  localStorage.setItem(STORAGE.autoBg, state.autoBg ? '1' : '0');
}

// ====== UI HELPERS ======
function providerInfo() { return PROVIDERS[state.provider] || PROVIDERS.groq; }
function currentKey() { return state.provider === 'openai' ? state.openaiKey : state.groqKey; }
function getActiveChat() {
  let c = state.chats.find(x => x.id === state.activeChatId);
  if (!c) {
    if (!state.chats.length) {
      c = makeNewChat();
      state.chats.push(c);
    } else {
      c = state.chats[0];
    }
    state.activeChatId = c.id;
  }
  return c;
}
function setStatus(el, type, html) { el.className = `status ${type || ''}`.trim(); el.innerHTML = html; }

function updateHeader(tab) {
  const map = {
    chat: ['🦅 دردشة ذكية', 'موديلات متعددة + Fallback تلقائي + محادثات محفوظة'],
    search: ['🔎 بحث عميق', 'ويكيبيديا + صور + بحث جوجل'],
    image: ['🎨 الصور الذكية', 'رسم صور + بحث صور + فحص صور'],
    settings: ['⚙️ الإعدادات', 'المفاتيح + الموديلات + المحادثات']
  };
  els.panelTitle.textContent = map[tab][0];
  els.panelHint.textContent = map[tab][1];
}

function activateTab(tab) {
  state.activeTab = tab;
  els.tabBtns.forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
  els.panels.forEach(p => p.classList.toggle('active', p.id === tab));
  updateHeader(tab);
}

// ====== MODEL OPTIONS ======
function buildProviderOptions() {
  els.providerSelect.innerHTML = Object.entries(PROVIDERS)
    .map(([key, prov]) => `<option value="${key}">${prov.label}</option>`)
    .join('');
}

function buildModelOptions() {
  const base = providerInfo().models.map(m => ({ id: m, label: m }));
  const custom = state.customModels.map(m => ({ id: m, label: `${m} (مخصص)` }));
  const seen = new Set();
  const deduped = [...base, ...custom].filter(x => !seen.has(x.id) && seen.add(x.id));
  els.modelSelect.innerHTML = deduped.map(m => `<option value="${escapeHTML(m.id)}">${escapeHTML(m.label)}</option>`).join('');
}

function renderModelNotes() {
  els.modelNotes.value = [
    `المزود الحالي: ${PROVIDERS[state.provider].label}`,
    `النمط: ${state.routingMode === 'auto' ? 'تلقائي ذكي مع Fallback' : 'موديل محدد'}`,
    '',
    'موديلات Groq المتاحة:',
    ...PROVIDERS.groq.models.map(m => `• ${m}`),
    '',
    'موديلات OpenAI / ChatGPT:',
    ...PROVIDERS.openai.models.map(m => `• ${m}`),
    '',
    `الموديلات المخصصة: ${state.customModels.length ? state.customModels.join(', ') : 'لا توجد'}`,
    '',
    '⚡ نظام Fallback الذكي:',
    '• إذا فشل موديل واحد، يحاول الكود الموديل التالي تلقائيًا',
    '• في النمط التلقائي، يختار الكود أفضل موديل للسؤال',
    '• في النمط اليدوي، تختار الموديل بنفسك'
  ].join('\n');
}

// ====== DEBOUNCE VARIABLE ======
let lastConvRender = 0;

function renderConversationList() {
  const now = Date.now();
  if (now - lastConvRender < 300) return;
  lastConvRender = now;

  state.chats.sort((a, b) => (b.updatedAt || b.createdAt) - (a.updatedAt || a.createdAt));
  if (!state.chats.length) state.chats = [makeNewChat('المحادثة الأولى')];
  els.conversationList.innerHTML = '';
  state.chats.forEach(chat => {
    const btn = document.createElement('button');
    btn.className = `conversation-item ${chat.id === state.activeChatId ? 'active' : ''}`;
    btn.innerHTML = `<div class="title">${escapeHTML(chat.title || 'بدون عنوان')}</div><div class="meta">${chat.messages?.length || 0} • ${timeLabel(chat.updatedAt || chat.createdAt)}</div>`;
    btn.addEventListener('click', () => switchChat(chat.id));
    els.conversationList.appendChild(btn);
  });
}

function renderChat() {
  const chat = getActiveChat();
  els.chatMessages.innerHTML = '';
  chat.messages.forEach(m => addMessageToUI(m.role, m.content, { imageDataUrl: m.imageDataUrl, imageName: m.imageName }));
  els.chatTitleInput.value = chat.title;
  els.modelState.textContent = `${PROVIDERS[state.provider]?.label || 'غير معروف'}: ${state.currentModel}`;
  els.chatState.textContent = `${chat.messages.length} رسالة`;
  renderConversationList();
  scrollChatToBottom();
}

function refreshKeyUI() {
  const hasKey = !!currentKey();
  els.keyState.textContent = hasKey ? '✅ محفوظ (مؤقت)' : '❌ غير محفوظ';
  els.apiState.textContent = hasKey ? '🟢 جاهز' : '⚠️ بحاجة مفتاح';
  setStatus(els.keyStatus, hasKey ? 'good' : 'warn', hasKey ? '✅ المفتاح محفوظ مؤقتاً (سيختفي عند إغلاق المتصفح).' : 'لم تضف المفتاح بعد. أضفه في الإعدادات.');
  els.groqKeyInput.value = state.groqKey;
  els.openaiKeyInput.value = state.openaiKey;
  els.groqKeyInput.type = 'password';
  els.openaiKeyInput.type = 'password';
}

function updateAttachmentBox() {
  if (state.attachedImage?.dataUrl) {
    els.attachmentBox.classList.add('active');
    els.attachmentPreview.src = state.attachedImage.dataUrl;
    els.attachmentTitle.textContent = state.attachedImage.name || 'صورة مرفقة';
  } else {
    els.attachmentBox.classList.remove('active');
  }
}

function scrollChatToBottom() { els.chatMessages.scrollTop = els.chatMessages.scrollHeight; }

function addMessageToUI(role, content, meta = {}) {
  const msg = document.createElement('div');
  msg.className = `message ${role}`;
  const avatar = document.createElement('div');
  avatar.className = 'message-avatar';
  avatar.textContent = role === 'user' ? '👤' : '🦅';
  const bubble = document.createElement('div');
  bubble.className = 'message-content';
  bubble.innerHTML = formatText(content);
  if (meta.imageDataUrl) {
    const img = document.createElement('img');
    img.className = 'img-preview';
    img.src = meta.imageDataUrl;
    img.alt = meta.imageName || 'attachment';
    bubble.appendChild(img);
  }
  msg.appendChild(avatar);
  msg.appendChild(bubble);
  els.chatMessages.appendChild(msg);
  scrollChatToBottom();
}

function addThinking() {
  const msg = document.createElement('div');
  msg.className = 'message bot';
  msg.dataset.thinking = '1';
  msg.innerHTML = '<div class="message-avatar">🦅</div><div class="message-content"><span class="spinner"><span class="pulse"></span> جاري التفكير...</span></div>';
  els.chatMessages.appendChild(msg);
  scrollChatToBottom();
}

function removeThinking() {
  document.querySelectorAll('[data-thinking="1"]').forEach(el => el.remove());
}

function addToChat(role, content, meta = {}) {
  const chat = getActiveChat();
  chat.messages.push({
    role,
    content,
    at: Date.now(),
    imageDataUrl: meta.imageDataUrl || '',
    imageName: meta.imageName || ''
  });
  if (chat.messages.length > 50) {
    chat.messages = chat.messages.slice(-50);
  }
  chat.updatedAt = Date.now();
  if (role === 'user' && (!chat.title || chat.title === 'محادثة جديدة' || chat.title === 'المحادثة الأولى')) {
    const s = content.trim().slice(0, 28);
    chat.title = s ? (s.length > 28 ? `${s}...` : s) : chat.title;
  }
  chat.model = state.currentModel;
  chat.provider = state.provider;
  persist();
  els.chatState.textContent = `${chat.messages.length} رسالة`;
  renderConversationList();
}

// ====== RETRY FUNCTION ======
async function retryWithDelay(fn, maxRetries = 3, baseDelay = 1000) {
  let lastError;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (err.status === 401 || err.status === 403) {
        throw err;
      }
      if (i < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, i);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  const statusMsg = lastError.status ? ` (${lastError.status})` : '';
  throw new Error(`${lastError.message}${statusMsg}`);
}

// ====== FALLBACK LOGIC ======
function getModelCandidates() {
  const list = [state.currentModel, ...state.customModels, ...providerInfo().models].filter(Boolean);
  return [...new Set(list)];
}

function chooseModelSmart(text, hasImage = false) {
  const t = (text || '').toLowerCase();

  if (hasImage) {
    return state.provider === 'openai' ? 'gpt-4o' : DEFAULT_MODEL;
  }

  if (t.includes('debug') || t.includes('error') || t.includes('كود') || t.includes('حل')) {
    return state.provider === 'openai' ? 'gpt-4o' : 'qwen-qwq-32b';
  }

  if (t.length < 40 || t.includes('اختصر') || t.includes('quick')) {
    return state.provider === 'openai' ? 'gpt-4o-mini' : 'llama-3.1-8b-instant';
  }

  return DEFAULT_MODEL;
}

function specialReplyCheck(text) {
  const t = (text || '').toLowerCase();
  return ['مين عملك', 'who made you', 'who created you', 'طورك'].some(q => t.includes(q));
}

function specialReply() { return 'I was developed by Engineer Mohamed Ragab Abdelmonem.'; }

// ====== BACKGROUND MANAGEMENT ======
function setWallpaper(index) {
  state.bgIndex = (index + NATURE_BACKGROUNDS.length) % NATURE_BACKGROUNDS.length;
  els.wallpaper.style.backgroundImage = `url('${NATURE_BACKGROUNDS[state.bgIndex]}')`;
  persist();
}

function updateBgButton() { els.bgAutoBtn.innerHTML = `<i class="fas fa-rotate"></i> ${state.autoBg ? '✅' : '⏸️'}`; }

function startAutoBackground() {
  if (state.autoBgTimer) clearInterval(state.autoBgTimer);
  if (!state.autoBg) return;
  state.autoBgTimer = setInterval(() => setWallpaper(state.bgIndex + 1), 45000);
}

function refreshBackgroundOnLoad() {
  setWallpaper(state.bgIndex);
  updateBgButton();
  startAutoBackground();
}

// ====== CHAT MANAGEMENT ======
function newChat() {
  const chat = makeNewChat('محادثة جديدة', state.currentModel, state.provider);
  state.chats.unshift(chat);
  state.activeChatId = chat.id;
  persist();
  renderConversationList();
  renderChat();
  els.chatInput.focus();
}

function switchChat(id) {
  state.activeChatId = id;
  const chat = getActiveChat();
  state.provider = chat.provider || DEFAULT_PROVIDER;
  state.currentModel = chat.model || DEFAULT_MODEL;
  persist();
  buildModelOptions();
  refreshUI();
  renderChat();
}

function clearCurrentChat() {
  const chat = getActiveChat();
  if (!confirm('تمسح محتوى المحادثة؟')) return;
  chat.messages = [{ role: 'assistant', content: START_MESSAGE, at: Date.now() }];
  chat.updatedAt = Date.now();
  persist();
  renderChat();
}

function clearAllChats() {
  if (!confirm('تمسح كل المحادثات؟')) return;
  state.chats = [makeNewChat('المحادثة الأولى', state.currentModel, state.provider)];
  state.activeChatId = state.chats[0].id;
  persist();
  renderConversationList();
  renderChat();
}

function setChatTitle() {
  const chat = getActiveChat();
  const title = els.chatTitleInput.value.trim();
  if (!title) return;
  chat.title = title;
  chat.updatedAt = Date.now();
  persist();
  renderConversationList();
}

// ====== EXPORT/IMPORT ======
function exportChatsFile(chats = state.chats, name = 'almasry-chats.json') {
  const blob = new Blob([JSON.stringify({ exportedAt: new Date().toISOString(), chats }, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function importChatsFromObject(obj) {
  const incoming = Array.isArray(obj?.chats) ? obj.chats : Array.isArray(obj) ? obj : null;
  if (!incoming) throw new Error('ملف غير صالح');
  const normalized = incoming.map(chat => ({
    id: chat.id || uid(),
    title: chat.title || 'محادثة مستوردة',
    createdAt: chat.createdAt || Date.now(),
    updatedAt: chat.updatedAt || Date.now(),
    model: chat.model || DEFAULT_MODEL,
    provider: chat.provider || DEFAULT_PROVIDER,
    messages: Array.isArray(chat.messages) && chat.messages.length ? chat.messages.map(m => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: String(m.content || ''),
      at: m.at || Date.now(),
      imageDataUrl: m.imageDataUrl || '',
      imageName: m.imageName || ''
    })) : [{ role: 'assistant', content: START_MESSAGE, at: Date.now() }]
  }));
  state.chats = [...normalized, ...state.chats].filter((c, i, arr) => i === arr.findIndex(x => x.id === c.id));
  state.activeChatId = state.chats[0]?.id || '';
  persist();
  renderConversationList();
  renderChat();
}

// ====== API CALLS WITH RETRY ======
async function callGroq(model, messages) {
  return retryWithDelay(async () => {
    const res = await fetch(PROVIDERS.groq.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${state.groqKey}`
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.7,
        max_tokens: 2000,
        top_p: 0.95,
        stream: false
      })
    });
    let data;
    try {
      data = await res.json();
    } catch {
      data = {};
    }
    if (!res.ok) {
      const e = new Error(data?.error?.message || `HTTP ${res.status}`);
      e.status = res.status;
      throw e;
    }
    const reply = data?.choices?.[0]?.message?.content;
    if (!reply) throw new Error('رد فاضي');
    return reply;
  }, 3, 1000);
}

async function callOpenAI(model, messages) {
  return retryWithDelay(async () => {
    const res = await fetch(PROVIDERS.openai.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${state.openaiKey}`
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.7,
        max_tokens: 2000
      })
    });
    let data;
    try {
      data = await res.json();
    } catch {
      data = {};
    }
    if (!res.ok) {
      const e = new Error(data?.error?.message || `HTTP ${res.status}`);
      e.status = res.status;
      throw e;
    }
    const reply = data?.choices?.[0]?.message?.content;
    if (!reply) throw new Error('رد فاضي');
    return reply;
  }, 3, 1000);
}

function buildMessages(chat, userText, userImage) {
  const history = chat.messages
    .filter(m => m.role === 'user' || m.role === 'assistant')
    .slice(-14)
    .map(m => ({
      role: m.role,
      content: m.content
    }));

  const messages = [{ role: 'system', content: SYSTEM_PROMPT }, ...history];

  if (userImage && state.provider !== 'openai') {
    messages.push({
      role: 'user',
      content: `${userText || ''}\n\n[⚠️ تم إرسال صورة لكن المزود الحالي لا يدعم تحليل الصور]`
    });
    return messages;
  }

  if (userImage && state.provider === 'openai') {
    messages.push({
      role: 'user',
      content: [
        { type: 'text', text: userText || 'افحص الصورة' },
        { type: 'image_url', image_url: { url: userImage.dataUrl } }
      ]
    });
  } else {
    messages.push({ role: 'user', content: userText });
  }
  return messages;
}

// ====== SEARCH ======
async function deepSearch() {
  const q = els.searchInput.value.trim();
  if (!q) { els.searchResults.innerHTML = 'ابحث أولًا...'; return; }
  els.searchResults.innerHTML = '<div class="loader"><span class="pulse"></span> جاري البحث...</div>';
  try {
    const url = `https://ar.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(q)}&format=json&origin=*`;
    const res = await fetch(url);
    const data = await res.json();
    const results = (data?.query?.search || []).slice(0, 5);
    if (!results.length) { els.searchResults.innerHTML = 'لا توجد نتائج.'; return; }
    let html = results.map(r => `<div class="result-item"><strong>${escapeHTML(r.title)}</strong><small>${escapeHTML(r.snippet || '')}</small></div>`).join('');
    html += `<div class="result-item"><button class="chip" onclick="window.open('https://www.google.com/search?q=${encodeURIComponent(q)}','_blank')"><i class="fab fa-google"></i> جوجل</button></div>`;
    els.searchResults.innerHTML = html;
  } catch (err) {
    els.searchResults.innerHTML = `<div class="status bad">خطأ: ${escapeHTML(err.message)}</div>`;
  }
}

// ====== IMAGE ======
function generateImage() {
  const prompt = els.imagePrompt.value.trim();
  if (!prompt) { els.imageResult.innerHTML = '<div class="status warn">اكتب وصف الصورة</div>'; return; }
  const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=1024`;
  els.imageResult.innerHTML = `<img class="img-preview" src="${escapeHTML(url)}" alt="generated" onclick="window.open('${url}','_blank')" />`;
}

function generateSamplePrompt() {
  els.imagePrompt.value = 'مدينة مصرية مستقبلية ليلًا، نيون، ماء';
  generateImage();
}

// ====== KEYS ======
function saveKeys() {
  state.groqKey = els.groqKeyInput.value.trim();
  state.openaiKey = els.openaiKeyInput.value.trim();
  persist();
  refreshKeyUI();
  setStatus(els.keyStatus, 'good', '✅ تم حفظ المفاتيح مؤقتاً لهذه الجلسة.');
}

function clearKeys() {
  state.groqKey = '';
  state.openaiKey = '';
  sessionStorage.removeItem(STORAGE.groqKey);
  sessionStorage.removeItem(STORAGE.openaiKey);
  refreshKeyUI();
  setStatus(els.keyStatus, 'warn', 'تم مسح المفاتيح. لن يتم تخزينها.');
}

async function testKey() {
  if (!currentKey()) { setStatus(els.keyStatus, 'warn', 'لا يوجد مفتاح'); return; }
  els.testKeyBtn.disabled = true;
  try {
    const msgs = [{ role: 'system', content: 'رد بكلمة واحدة فقط' }, { role: 'user', content: 'تحيتك؟' }];
    const reply = state.provider === 'openai' ? await callOpenAI('gpt-4o-mini', msgs) : await callGroq('llama-3.1-8b-instant', msgs);
    setStatus(els.keyStatus, 'good', `✅ يعمل: ${escapeHTML(reply.slice(0, 30))}`);
  } catch (err) {
    setStatus(els.keyStatus, 'bad', `❌ ${escapeHTML(err.message || 'فشل')}`);
  } finally {
    els.testKeyBtn.disabled = false;
  }
}

// ====== CHAT SEND ======
async function sendChat(text) {
  if (!currentKey()) { addMessageToUI('user', text); addToChat('user', text); addMessageToUI('assistant', '⚠️ أضف المفتاح'); addToChat('assistant', '⚠️ أضف المفتاح'); return; }
  if (state.isSending || !text.trim()) return;
  state.isSending = true;
  els.sendBtn.disabled = true;
  els.sendBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
  els.apiState.textContent = '⏳ يرسل...';

  try {
    if (specialReplyCheck(text)) {
      addMessageToUI('user', text);
      addToChat('user', text);
      const reply = specialReply();
      addMessageToUI('assistant', reply);
      addToChat('assistant', reply);
      return;
    }

    addMessageToUI('user', text);
    addToChat('user', text);
    addThinking();

    const chat = getActiveChat();
    const chosenModel = state.routingMode === 'auto' ? chooseModelSmart(text) : state.currentModel;
    const candidates = [...new Set([chosenModel, ...getModelCandidates()])];

    let lastError = '';
    for (const model of candidates) {
      try {
        const messages = buildMessages(chat, text, state.attachedImage);
        const reply = state.provider === 'openai' ? await callOpenAI(model, messages) : await callGroq(model, messages);
        addMessageToUI('assistant', reply);
        addToChat('assistant', reply);
        state.currentModel = model;
        chat.model = model;
        persist();
        if (els.modelSelect) els.modelSelect.value = model;
        els.modelState.textContent = `${PROVIDERS[state.provider]?.label}: ${model}`;
        els.apiState.textContent = `✅ ${model}`;
        return;
      } catch (err) {
        lastError = err.message;
      }
    }

    const msg = `❌ فشل: ${lastError}`;
    addMessageToUI('assistant', msg);
    addToChat('assistant', msg);
    els.apiState.textContent = '❌ خطأ';
  } finally {
    removeThinking();
    state.isSending = false;
    els.sendBtn.disabled = false;
    els.sendBtn.innerHTML = '<i class="fas fa-paper-plane"></i> إرسال';
    persist();
    renderConversationList();
  }
}

// ====== ATTACHMENTS ======
async function attachImageFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let w = img.width, h = img.height;
        const max = 1024;
        if (w > h && w > max) { h = Math.round(h * max / w); w = max; }
        else if (h > max) { w = Math.round(w * max / h); h = max; }
        canvas.width = w;
        canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        state.attachedImage = { name: file.name, dataUrl: canvas.toDataURL('image/jpeg', 0.8) };
        updateAttachmentBox();
        resolve();
      };
      img.onerror = () => reject(new Error('تحميل الصورة فشل'));
      img.src = reader.result;
    };
    reader.onerror = () => reject(new Error('قراءة الملف فشلت'));
    reader.readAsDataURL(file);
  });
}

function clearAttachment() { state.attachedImage = null; updateAttachmentBox(); }

// ====== REFRESH UI ======
function refreshUI() {
  buildProviderOptions();
  buildModelOptions();
  renderModelNotes();
  refreshKeyUI();
  updateAttachmentBox();
  if (els.providerSelect) els.providerSelect.value = state.provider;
  if (els.routingModeSelect) els.routingModeSelect.value = state.routingMode;
  if (els.modelSelect && state.currentModel) els.modelSelect.value = state.currentModel;
  if (els.customModelInput) els.customModelInput.value = state.customModels.join(', ');
  els.modelState.textContent = `${PROVIDERS[state.provider]?.label}: ${state.currentModel}`;
}

// ====== EVENTS ======
els.tabBtns.forEach(b => b.addEventListener('click', () => activateTab(b.dataset.tab)));
els.providerSelect.addEventListener('change', () => {
  state.provider = els.providerSelect.value;
  state.currentModel = PROVIDERS[state.provider]?.models[0] || DEFAULT_MODEL;
  persist();
  buildModelOptions();
  refreshUI();
});
els.routingModeSelect.addEventListener('change', () => {
  state.routingMode = els.routingModeSelect.value;
  persist();
  renderModelNotes();
});
els.modelSelect.addEventListener('change', () => {
  state.currentModel = els.modelSelect.value;
  persist();
  els.modelState.textContent = `${PROVIDERS[state.provider]?.label}: ${state.currentModel}`;
});
els.customModelInput.addEventListener('change', () => {
  state.customModels = normalizeList((els.customModelInput.value || '').split(','));
  persist();
  buildModelOptions();
});

els.sendBtn.addEventListener('click', () => { const text = els.chatInput.value.trim(); if (text) { els.chatInput.value = ''; sendChat(text); } });
els.chatInput.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); els.sendBtn.click(); } });

document.querySelectorAll('[data-fill]').forEach(btn => btn.addEventListener('click', () => { els.chatInput.value = btn.dataset.fill; els.chatInput.focus(); }));

els.saveKeysBtn.addEventListener('click', saveKeys);
els.clearKeysBtn.addEventListener('click', clearKeys);
els.toggleKeysBtn.addEventListener('click', () => {
  els.groqKeyInput.type = els.groqKeyInput.type === 'password' ? 'text' : 'password';
  els.openaiKeyInput.type = els.openaiKeyInput.type === 'password' ? 'text' : 'password';
});
els.testKeyBtn.addEventListener('click', testKey);

els.searchBtn.addEventListener('click', deepSearch);
els.searchInput.addEventListener('keydown', e => { if (e.key === 'Enter') deepSearch(); });
els.searchClearBtn.addEventListener('click', () => { els.searchInput.value = ''; els.searchResults.innerHTML = ''; });
els.googleSearchBtn.addEventListener('click', () => {
  const q = els.searchInput.value.trim();
  if (q) window.open(`https://www.google.com/search?q=${encodeURIComponent(q)}`, '_blank');
});

els.genBtn.addEventListener('click', generateImage);
els.webImageBtn.addEventListener('click', () => { const q = els.imagePrompt.value.trim(); if (q) window.open(`https://www.google.com/search?q=${encodeURIComponent(q)}&tbm=isch`, '_blank'); });
els.samplePromptBtn.addEventListener('click', generateSamplePrompt);

els.clearChatBtn.addEventListener('click', clearCurrentChat);
els.newChatBtn.addEventListener('click', newChat);
els.newChatTopBtn.addEventListener('click', newChat);
els.clearAllChatsBtn.addEventListener('click', clearAllChats);
els.exportChatsBtn.addEventListener('click', () => exportChatsFile());
els.importChatsBtn.addEventListener('click', () => els.importFileInput.click());
els.importFileInput.addEventListener('change', async () => {
  const f = els.importFileInput.files?.[0];
  if (f) try { await importChatsFromObject(JSON.parse(await f.text())); } catch (err) { alert(`فشل: ${err.message}`); } finally { els.importFileInput.value = ''; }
});

els.saveTitleBtn.addEventListener('click', setChatTitle);
els.exportOneBtn.addEventListener('click', () => { const c = getActiveChat(); exportChatsFile([c], `${c.title.replace(/[^a-zA-Z0-9]/g, '_')}.json`); });

els.attachImageBtn.addEventListener('click', () => els.imageFileInput.click());
els.clearAttachmentBtn.addEventListener('click', clearAttachment);
els.imageFileInput.addEventListener('change', async () => { const f = els.imageFileInput.files?.[0]; if (f) await attachImageFile(f); els.imageFileInput.value = ''; });

els.bgPrevBtn.addEventListener('click', () => setWallpaper(state.bgIndex - 1));
els.bgNextBtn.addEventListener('click', () => setWallpaper(state.bgIndex + 1));
els.bgAutoBtn.addEventListener('click', () => { state.autoBg = !state.autoBg; persist(); updateBgButton(); startAutoBackground(); });

// ====== INIT ======
(function init() {
  if (!state.chats.length) state.chats = [makeNewChat()];
  if (!state.activeChatId) state.activeChatId = state.chats[0].id;
  refreshUI();
  renderChat();
  refreshBackgroundOnLoad();
  els.chatInput.focus();
})();
