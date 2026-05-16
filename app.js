// ============================================================
//  المصري الذكي – النسخة الأسطورية v8.0
//  أمان, أداء, Markdown كامل, نطق, Retry, وكل اللي طلبته
// ============================================================

'use strict';

// ========== 1. STORAGE KEYS ==========
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

// ========== 2. BACKGROUNDS (60+ صورة) ==========
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
  { url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=1920&q=85', name: '🏜️ صحراء ذهبية' },
  { url: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&w=1920&q=85', name: '🌸 أزهار الربيع' },
  { url: 'https://images.unsplash.com/photo-1444464666168-49d633b86797?auto=format&fit=crop&w=1920&q=85', name: '🦜 طيور مهاجرة' },
  { url: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1920&q=85', name: '🏕️ مخيم في الغابة' },
  { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1920&q=85', name: '🏔️ قمة مغطاة بالثلوج' },
  { url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1920&q=85', name: '🌾 حقول القمح' },
  { url: 'https://images.unsplash.com/photo-1433086966358-548c1ae6b9b2?auto=format&fit=crop&w=1920&q=85', name: '💦 شلالات' },
  { url: 'https://images.unsplash.com/photo-1518495973542-454dc4e73b1c?auto=format&fit=crop&w=1920&q=85', name: '🏝️ جزيرة استوائية' },
  { url: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=1920&q=85', name: '🌋 بركان هادئ' }
];

// ========== 3. PROVIDERS & MODELS ==========
const PROVIDERS = {
  groq: {
    label: '🚀 Groq – سريع جدًا',
    endpoint: 'https://api.groq.com/openai/v1/chat/completions',
    keyField: 'groqKey',
    models: ['llama-3.3-70b-versatile','llama-3.1-70b-versatile','llama-3.1-8b-instant','mixtral-8x7b-32768','qwen-qwq-32b','llama-guard-3-8b']
  },
  openai: {
    label: '🌟 OpenAI / ChatGPT',
    endpoint: 'https://api.openai.com/v1/chat/completions',
    keyField: 'openaiKey',
    models: ['gpt-4o','gpt-4o-mini','gpt-4-turbo','gpt-4','gpt-3.5-turbo']
  }
};

const DEFAULT_PROVIDER = 'groq';
const DEFAULT_MODEL    = 'llama-3.3-70b-versatile';

const SYSTEM_PROMPT = `أنت مساعد ذكي اسمك "المصري الذكي". أسلوبك دافئ وواضح. ردودك مفصلة ومفيدة. خبير في البرمجة، الأمن السيبراني، التصميم، والعلوم. عند سؤالك عن المطور: مطور هذا البرنامج هو المهندس محمد رجب عبد المنعم من الفيوم – مركز طامية، خبير في برمجة التطبيقات والأمن السيبراني، طالب نظم ومعلومات، من مواليد 25 أكتوبر 2006.`;

const START_MESSAGE = `✨ أهلاً! أنا **المصري الذكي** v8.0 – بث مباشر، نطق، و Markdown كامل. اسأل أي شيء! 🚀🦅`;

// ========== 4. UTILITIES (Markdown قوي, كاش بوقت, تنقية) ==========
const safeJSON  = (v, fb) => { try { return JSON.parse(v); } catch { return fb; } };
const uid       = () => crypto?.randomUUID ? crypto.randomUUID() : `c_${Date.now()}_${Math.random().toString(36).slice(2,9)}`;
const escHTML   = s => String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const sleep     = ms => new Promise(r=>setTimeout(r,ms));

// تنقية الإدخال لمنع الـ prompt injection
function sanitizeInput(text) {
  return text.replace(/ignore previous instructions/gi, '')
             .replace(/تجاهل التعليمات السابقة/gi, '')
             .replace(/forget your instructions/gi, '');
}

// Markdown كامل (يدعم headings, links, tables, code, bold, italic)
function renderMarkdown(text) {
  let html = escHTML(text);
  // Code blocks ```lang \n code ```
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
    return `<pre><code class="language-${lang || 'text'}">${escHTML(code)}</code></pre>`;
  });
  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  // Headings # ## ###
  html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>');
  // Bold ** **
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  // Italic * *
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  // Links [text](url)
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
  // Tables simple (| --- |)
  const tableRegex = /\|(.+)\|\n\|[-: |]+\|\n((?:\|.+\|\n?)+)/g;
  html = html.replace(tableRegex, (match, header, rows) => {
    const headers = header.split('|').filter(c=>c.trim()).map(h=>`<th>${h.trim()}</th>`).join('');
    const bodyRows = rows.trim().split('\n').map(row => {
      const cells = row.split('|').filter(c=>c.trim()).map(c=>`<td>${c.trim()}</td>`).join('');
      return `<tr>${cells}</tr>`;
    }).join('');
    return `<table><thead><tr>${headers}</tr></thead><tbody>${bodyRows}</tbody></table>`;
  });
  // Line breaks
  html = html.replace(/\n/g, '<br>');
  return html;
}

// كاش مع expiry (ساعة واحدة)
const responseCache = new Map();
function getCacheKey(provider, model, messages) {
  const str = provider + '|' + model + '|' + JSON.stringify(messages);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return hash.toString(36);
}
function setCached(key, reply) {
  responseCache.set(key, { reply, expiry: Date.now() + 3600000 });
}
function getCached(key) {
  const entry = responseCache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiry) {
    responseCache.delete(key);
    return null;
  }
  return entry.reply;
}

// ========== 5. STATE ==========
function makeChat(title='محادثة جديدة', model=DEFAULT_MODEL, provider=DEFAULT_PROVIDER) {
  return { id: uid(), title, createdAt: Date.now(), updatedAt: Date.now(), model, provider, messages: [{ role:'assistant', content:START_MESSAGE, at:Date.now() }] };
}
function loadChats() {
  const raw = safeJSON(localStorage.getItem(STORAGE.chats), []);
  if (!raw.length) return [makeChat('المحادثة الأولى')];
  return raw.map(c => ({ ...c, messages: c.messages.map(m=>({...m})) }));
}

const state = {
  groqKey: sessionStorage.getItem(STORAGE.groqKey) || '',
  openaiKey: sessionStorage.getItem(STORAGE.openaiKey) || '',
  provider: localStorage.getItem(STORAGE.provider) || DEFAULT_PROVIDER,
  currentModel: localStorage.getItem(STORAGE.model) || DEFAULT_MODEL,
  customModels: [...new Set((safeJSON(localStorage.getItem(STORAGE.customModels), [])).map(s=>String(s).trim()).filter(Boolean))],
  routingMode: localStorage.getItem(STORAGE.routingMode) || 'auto',
  chats: loadChats(),
  activeChatId: localStorage.getItem(STORAGE.activeChat) || '',
  isSending: false,
  activeTab: 'chat',
  attachedImage: null,
  bgIndex: Number(localStorage.getItem(STORAGE.bgIndex) || 0),
  autoBg: localStorage.getItem(STORAGE.autoBg) !== '0',
  autoBgTimer: null,
  bgTransitioning: false,
  abortController: null,
  lastSendTime: 0
};

// ========== 6. DOM REFS (اختصار) ==========
const $ = id => document.getElementById(id);
const $$ = sel => [...document.querySelectorAll(sel)];
const el = {
  bgLayer1: $('bgLayer1'), bgLayer2: $('bgLayer2'), bgIndicator: $('bgIndicator'), bgDots: $('bgDots'), bgName: $('bgName'),
  panelTitle: $('panelTitle'), panelHint: $('panelHint'), chatMessages: $('chatMessages'), chatInput: $('chatInput'),
  sendBtn: $('sendBtn'), providerSelect: $('providerSelect'), routingModeSelect: $('routingModeSelect'), modelSelect: $('modelSelect'),
  modelState: $('modelState'), keyState: $('keyState'), apiState: $('apiState'), chatState: $('chatState'),
  groqKeyInput: $('groqKeyInput'), openaiKeyInput: $('openaiKeyInput'), saveKeysBtn: $('saveKeysBtn'), clearKeysBtn: $('clearKeysBtn'),
  toggleKeysBtn: $('toggleKeysBtn'), keyStatus: $('keyStatus'), searchInput: $('searchInput'), searchBtn: $('searchBtn'),
  googleSearchBtn: $('googleSearchBtn'), searchClearBtn: $('searchClearBtn'), searchResults: $('searchResults'),
  imagePrompt: $('imagePrompt'), genBtn: $('genBtn'), webImageBtn: $('webImageBtn'), samplePromptBtn: $('samplePromptBtn'),
  imageResult: $('imageResult'), clearChatBtn: $('clearChatBtn'), testKeyBtn: $('testKeyBtn'), newChatBtn: $('newChatBtn'),
  newChatTopBtn: $('newChatTopBtn'), clearAllChatsBtn: $('clearAllChatsBtn'), exportChatsBtn: $('exportChatsBtn'),
  importChatsBtn: $('importChatsBtn'), importFileInput: $('importFileInput'), imageFileInput: $('imageFileInput'),
  conversationList: $('conversationList'), chatTitleInput: $('chatTitleInput'), saveTitleBtn: $('saveTitleBtn'),
  exportOneBtn: $('exportOneBtn'), modelNotes: $('modelNotes'), attachmentBox: $('attachmentBox'),
  attachmentPreview: $('attachmentPreview'), attachmentTitle: $('attachmentTitle'), attachImageBtn: $('attachImageBtn'),
  clearAttachmentBtn: $('clearAttachmentBtn'), removeAttBtn: $('removeAttBtn'), bgPrevBtn: $('bgPrevBtn'),
  bgNextBtn: $('bgNextBtn'), bgAutoBtn: $('bgAutoBtn'), customModelInput: $('customModelInput')
};

// ========== 7. PERSISTENCE ==========
function persist() {
  if (state.groqKey) sessionStorage.setItem(STORAGE.groqKey, state.groqKey);
  if (state.openaiKey) sessionStorage.setItem(STORAGE.openaiKey, state.openaiKey);
  localStorage.setItem(STORAGE.provider, state.provider);
  localStorage.setItem(STORAGE.model, state.currentModel);
  localStorage.setItem(STORAGE.customModels, JSON.stringify(state.customModels));
  localStorage.setItem(STORAGE.routingMode, state.routingMode);
  localStorage.setItem(STORAGE.chats, JSON.stringify(state.chats));
  localStorage.setItem(STORAGE.activeChat, state.activeChatId);
  localStorage.setItem(STORAGE.bgIndex, String(state.bgIndex));
  localStorage.setItem(STORAGE.autoBg, state.autoBg ? '1' : '0');
}

// ========== 8. BACKGROUND SYSTEM (كل 15 ثانية) – نفس السابق ==========
let _activeLayer = 1;
function buildBgDots() { el.bgDots.innerHTML = ''; BACKGROUNDS.forEach((bg,i)=>{let d=document.createElement('div'); d.className=`bg-dot ${i===state.bgIndex?'active':''}`; d.title=bg.name; d.addEventListener('click',()=>setBackground(i)); el.bgDots.appendChild(d);}); }
function updateBgDots() { $$('.bg-dot').forEach((d,i)=>d.classList.toggle('active',i===state.bgIndex)); }
let _indicatorTimeout=null;
function showBgIndicator() { el.bgIndicator.classList.add('visible'); clearTimeout(_indicatorTimeout); _indicatorTimeout=setTimeout(()=>el.bgIndicator.classList.remove('visible'),3500); }
function setBackground(index, skipIndicator=false) { if(state.bgTransitioning) return; state.bgIndex=((index%BACKGROUNDS.length)+BACKGROUNDS.length)%BACKGROUNDS.length; state.bgTransitioning=true; persist(); const bg=BACKGROUNDS[state.bgIndex]; const layerIn=_activeLayer===1?el.bgLayer2:el.bgLayer1; const layerOut=_activeLayer===1?el.bgLayer1:el.bgLayer2; const img=new Image(); img.onload=()=>{ layerIn.style.backgroundImage=`url('${bg.url}')`; layerIn.style.opacity='0'; requestAnimationFrame(()=>{ layerIn.style.transition='opacity 1.4s ease'; layerOut.style.transition='opacity 1.4s ease'; layerIn.style.opacity='0.72'; layerOut.style.opacity='0'; }); setTimeout(()=>{ _activeLayer=_activeLayer===1?2:1; state.bgTransitioning=false; },1500); }; img.onerror=()=>{ state.bgTransitioning=false; }; img.src=bg.url; el.bgName.textContent=bg.name; updateBgDots(); if(!skipIndicator) showBgIndicator(); }
function updateBgAutoBtn() { el.bgAutoBtn.innerHTML=state.autoBg?'<i class="fas fa-pause"></i>':'<i class="fas fa-play"></i>'; el.bgAutoBtn.classList.toggle('active-ctrl',state.autoBg); }
function startAutoBg() { if(state.autoBgTimer) clearInterval(state.autoBgTimer); if(!state.autoBg) return; state.autoBgTimer=setInterval(()=>setBackground(state.bgIndex+1,true),15000); }
function initBackgrounds() { el.bgLayer1.style.backgroundImage=`url('${BACKGROUNDS[state.bgIndex].url}')`; el.bgLayer1.style.opacity='0.72'; el.bgLayer2.style.opacity='0'; el.bgName.textContent=BACKGROUNDS[state.bgIndex].name; buildBgDots(); updateBgAutoBtn(); startAutoBg(); }

// ========== 9. TABS ==========
const PANEL_META = { chat: ['🦅 دردشة ذكية', 'بث مباشر + نطق + Markdown'], search: ['🔎 بحث عميق', 'ويكيبيديا + جوجل'], image: ['🎨 الصور الذكية', 'رسم + بحث'], settings: ['⚙️ الإعدادات', 'مفاتيح + تحذيرات'] };
function activateTab(tab) { state.activeTab=tab; $$('.nav-btn').forEach(b=>b.classList.toggle('active',b.dataset.tab===tab)); $$('.panel').forEach(p=>p.classList.toggle('active',p.id===tab)); const [title,hint]=PANEL_META[tab]||['','']; el.panelTitle.textContent=title; el.panelHint.textContent=hint; }

// ========== 10. MODEL SELECTS مع مراعاة routingMode ==========
function currentProvider() { return PROVIDERS[state.provider] || PROVIDERS.groq; }
function currentKey() { return state.provider==='openai'?state.openaiKey:state.groqKey; }
function buildProviderOptions() { el.providerSelect.innerHTML=Object.entries(PROVIDERS).map(([k,p])=>`<option value="${k}" ${k===state.provider?'selected':''}>${p.label}</option>`).join(''); }
function buildModelOptions() { const base=currentProvider().models.map(m=>({id:m,label:m})); const custom=state.customModels.map(m=>({id:m,label:`${m} (مخصص)`})); const seen=new Set(); const all=[...base,...custom].filter(x=>!seen.has(x.id)&&seen.add(x.id)); el.modelSelect.innerHTML=all.map(m=>`<option value="${escHTML(m.id)}" ${m.id===state.currentModel?'selected':''}>${escHTML(m.label)}</option>`).join(''); }
function renderModelNotes() { el.modelNotes.value=[`المزود: ${currentProvider().label}`,'⚠️ تخزين المفاتيح غير آمن – يُفضل استخدام backend',`عدد الخلفيات: ${BACKGROUNDS.length}`,'تم تفعيل Markdown, نطق, وRetry'].join('\n'); }

// ========== 11. CHAT HELPERS ==========
function getActiveChat() { let c=state.chats.find(x=>x.id===state.activeChatId); if(!c) { c=state.chats[0]||makeChat(); if(!state.chats.length) state.chats.push(c); state.activeChatId=c.id; } return c; }
function setStatus(elRef,cls,html) { if(elRef){ elRef.className=`status-box ${cls}`; elRef.innerHTML=html; } }
function refreshKeyUI() { const has=!!currentKey(); el.keyState.textContent=has?'🔑 ✅':'🔑 ❌'; el.apiState.textContent=has?'⚡ جاهز':'⚡ يحتاج مفتاح'; el.groqKeyInput.value=state.groqKey; el.openaiKeyInput.value=state.openaiKey; setStatus(el.keyStatus,has?'good':'warn',has?'✅ مفتاح محفوظ (غير آمن)':'⚠️ أدخل مفتاحك. يفضل استخدام backend.'); }
function updateAttachmentBox() { if(state.attachedImage?.dataUrl){ el.attachmentBox.classList.add('active'); el.attachmentPreview.src=state.attachedImage.dataUrl; el.attachmentTitle.textContent=state.attachedImage.name||'صورة'; } else el.attachmentBox.classList.remove('active'); }
function scrollBottom() { el.chatMessages.scrollTop=el.chatMessages.scrollHeight; }

// ========== 12. RENDER MESSAGES مع زر نطق و Retry ==========
function addMsgToUI(role, content, meta={}) {
  const wrap=document.createElement('div'); wrap.className=`message ${role}`;
  const avatar=document.createElement('div'); avatar.className='msg-avatar'; avatar.textContent=role==='user'?'👤':'🦅';
  const bubble=document.createElement('div'); bubble.className='msg-bubble';
  if(role==='assistant' && meta.isStreaming) {
    const streamId = 'stream_'+Date.now()+'_'+Math.random().toString(36).slice(2);
    bubble.id = streamId;
    meta.streamId = streamId;
    bubble.innerHTML = '';
  } else {
    bubble.innerHTML = renderMarkdown(content);
  }
  if(meta.imageDataUrl) { const img=document.createElement('img'); img.className='msg-image'; img.src=meta.imageDataUrl; img.alt=meta.imageName||''; bubble.appendChild(img); }
  wrap.appendChild(avatar); wrap.appendChild(bubble);
  // زر النطق للرسائل النهائية (غير streaming)
  if(role==='assistant' && !meta.isStreaming && content && content.trim().length>0) {
    const speakBtn = document.createElement('button');
    speakBtn.innerHTML = '🔊';
    speakBtn.className = 'speak-btn';
    speakBtn.style.background = 'none';
    speakBtn.style.border = 'none';
    speakBtn.style.cursor = 'pointer';
    speakBtn.style.fontSize = '1.2rem';
    speakBtn.style.marginRight = '8px';
    speakBtn.title = 'انطق الرد';
    speakBtn.onclick = () => {
      const utterance = new SpeechSynthesisUtterance(content);
      utterance.lang = 'ar-EG';
      speechSynthesis.speak(utterance);
    };
    wrap.insertBefore(speakBtn, bubble);
  }
  el.chatMessages.appendChild(wrap);
  scrollBottom();
  return bubble;
}
function addThinkingIndicator() { const wrap=document.createElement('div'); wrap.className='message'; wrap.dataset.thinking='1'; wrap.innerHTML=`<div class="msg-avatar">🦅</div><div class="msg-bubble"><div class="thinking-dots"><span></span><span></span><span></span></div></div>`; el.chatMessages.appendChild(wrap); scrollBottom(); }
function removeThinking() { $$('[data-thinking="1"]').forEach(e=>e.remove()); }

// إضافة رسالة خطأ مع زر Retry
function addErrorWithRetry(errorMsg, retryCallback) {
  const wrap = document.createElement('div'); wrap.className='message';
  const avatar = document.createElement('div'); avatar.className='msg-avatar'; avatar.textContent='🦅';
  const bubble = document.createElement('div'); bubble.className='msg-bubble';
  bubble.innerHTML = renderMarkdown(`❌ ${errorMsg}\n\n[حاول مرة أخرى]($)`);
  const retryLink = bubble.querySelector('a');
  if(retryLink) {
    retryLink.addEventListener('click', (e) => {
      e.preventDefault();
      retryCallback();
    });
    retryLink.style.cursor = 'pointer';
    retryLink.style.textDecoration = 'underline';
  }
  wrap.appendChild(avatar); wrap.appendChild(bubble);
  el.chatMessages.appendChild(wrap);
  scrollBottom();
}

// ========== 13. CONVERSATIONS مع تسمية تلقائية ==========
let _lastConvRender=0;
function renderConversationList() { /* نفس */ state.chats.sort((a,b)=>b.updatedAt-a.updatedAt); el.conversationList.innerHTML=state.chats.map(c=>`<button class="conversation-item ${c.id===state.activeChatId?'active':''}" data-id="${c.id}"><div class="ci-title">${escHTML(c.title)}</div><div class="ci-meta">${c.messages.length} رسالة</div></button>`).join(''); $$('.conversation-item').forEach(btn=>btn.addEventListener('click',()=>switchChat(btn.dataset.id))); }
function renderChat() { const chat=getActiveChat(); el.chatMessages.innerHTML=''; chat.messages.forEach(m=>addMsgToUI(m.role,m.content,{imageDataUrl:m.imageDataUrl,imageName:m.imageName})); el.chatTitleInput.value=chat.title; el.chatState.textContent=`💬 ${chat.messages.length}`; el.modelState.textContent=`🤖 ${state.currentModel.split('-').slice(0,3).join('-')}`; renderConversationList(); scrollBottom(); }
function newChat() { const c=makeChat('محادثة جديدة',state.currentModel,state.provider); state.chats.unshift(c); state.activeChatId=c.id; persist(); renderConversationList(); renderChat(); el.chatInput.focus(); }
function switchChat(id) { if(state.abortController) state.abortController.abort(); state.activeChatId=id; const c=getActiveChat(); state.provider=c.provider||DEFAULT_PROVIDER; state.currentModel=c.model||DEFAULT_MODEL; persist(); buildProviderOptions(); buildModelOptions(); refreshUI(); renderChat(); }
function clearCurrentChat() { if(!confirm('تمسح المحادثة؟')) return; const c=getActiveChat(); c.messages=[{role:'assistant',content:START_MESSAGE,at:Date.now()}]; c.updatedAt=Date.now(); persist(); renderChat(); }
function clearAllChats() { if(!confirm('تمسح كل المحادثات؟')) return; state.chats=[makeChat('المحادثة الأولى',state.currentModel,state.provider)]; state.activeChatId=state.chats[0].id; persist(); renderConversationList(); renderChat(); }
function setChatTitle() { const c=getActiveChat(); const t=el.chatTitleInput.value.trim(); if(t) { c.title=t; c.updatedAt=Date.now(); persist(); renderConversationList(); } }
function addToChat(role, content, meta={}) { const c=getActiveChat(); c.messages.push({role,content,at:Date.now(),imageDataUrl:meta.imageDataUrl||'',imageName:meta.imageName||''}); if(c.messages.length>60) c.messages=c.messages.slice(-60); c.updatedAt=Date.now(); if(role==='user' && (c.title==='محادثة جديدة'||c.title==='المحادثة الأولى')) { c.title=content.trim().slice(0,30)||c.title; } c.model=state.currentModel; c.provider=state.provider; persist(); el.chatState.textContent=`💬 ${c.messages.length}`; renderConversationList(); }
function exportChatsFile(chats=state.chats,name='almasry-chats.json') { const blob=new Blob([JSON.stringify({exportedAt:new Date(),chats},null,2)],{type:'application/json'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=name; a.click(); setTimeout(()=>URL.revokeObjectURL(blob),100); }
function importChats(obj) { const incoming=Array.isArray(obj?.chats)?obj.chats:Array.isArray(obj)?obj:null; if(!incoming) throw new Error('ملف غير صالح'); const norm=incoming.map(c=>({...c,id:c.id||uid(),messages:c.messages.map(m=>({...m}))})); state.chats=[...norm,...state.chats].filter((c,i,a)=>i===a.findIndex(x=>x.id===c.id)); state.activeChatId=state.chats[0]?.id||''; persist(); renderConversationList(); renderChat(); }

// ========== 14. SMART ROUTING (يدعم manual/auto) ==========
function classifyIntent(text) {
  const t=text.toLowerCase();
  if(/شرح|افهم|وضح|عرفني|كيف يعمل/.test(t)) return 'explain';
  if(/اختصر|ملخص|لخص|باختصار|خلاصة/.test(t)) return 'summarize';
  if(/كود|برمجة|debug|اكتب|فنكشن|سكريبت/.test(t)) return 'code';
  if(/قارن|مقارنة|vs|فرق|بين.+(و|،)/.test(t)) return 'compare';
  if(/ترجم|translate/.test(t)) return 'translate';
  if(/مقال|موضوع|تقرير/.test(t) && t.length>150) return 'longform';
  return 'general';
}
function pickSmartModel(text, hasImage=false) {
  if(hasImage) return state.provider==='openai'?'gpt-4o':DEFAULT_MODEL;
  const intent=classifyIntent(text);
  const isOpen=state.provider==='openai';
  switch(intent){
    case 'explain': return isOpen?'gpt-4o':'llama-3.3-70b-versatile';
    case 'summarize': return isOpen?'gpt-4o-mini':'llama-3.1-8b-instant';
    case 'code': return isOpen?'gpt-4o':'qwen-qwq-32b';
    case 'compare': return isOpen?'gpt-4o':'llama-3.3-70b-versatile';
    case 'translate': return isOpen?'gpt-4o-mini':'llama-3.1-8b-instant';
    case 'longform': return isOpen?'gpt-4o':'llama-3.3-70b-versatile';
    default: return DEFAULT_MODEL;
  }
}
function getModelCandidates(text, hasImage=false) {
  if(state.routingMode === 'manual') return [state.currentModel];
  const smart=pickSmartModel(text,hasImage);
  const allBase=currentProvider().models;
  const all=[smart,state.currentModel,...state.customModels,...allBase];
  return [...new Set(all.filter(Boolean))];
}
function isDevQuestion(text) { const q=text.toLowerCase(); return ['مين عملك','من طورك','who made you','who created you','who developed you','طورك','مين عمل البرنامج','مين محمد رجب','من هو محمد رجب','محمد رجب عبد المنعم','المطور'].some(kw=>q.includes(kw)); }
function buildMessages(chat, userText, userImage) {
  const limit=(userText||'').length>200?10:20;
  const history=chat.messages.filter(m=>m.role==='user'||m.role==='assistant').slice(-limit).map(m=>({role:m.role,content:m.content}));
  const msgs=[{role:'system',content:SYSTEM_PROMPT},...history];
  if(userImage && state.provider==='openai') msgs.push({role:'user',content:[{type:'text',text:userText||'افحص'},{type:'image_url',image_url:{url:userImage.dataUrl}}]});
  else if(userImage) msgs.push({role:'user',content:`${userText||''}\n[صورة مرفقة لكن هذا المزود لا يدعمها]`});
  else msgs.push({role:'user',content:userText});
  return msgs;
}

// ========== 15. STREAMING API (مع تحسين الأداء: إلحاق النص تدريجي) ==========
async function callAPIStream(provider, model, messages, onChunk, signal) {
  const prov=PROVIDERS[provider];
  const key=provider==='openai'?state.openaiKey:state.groqKey;
  const cacheKey=getCacheKey(provider,model,messages);
  const cached=getCached(cacheKey);
  if(cached) { onChunk(cached,true); return cached; }
  let attempt=0, delay=1000;
  while(attempt<3){
    try{
      const res=await fetch(prov.endpoint,{
        method:'POST', headers:{'Content-Type':'application/json','Authorization':`Bearer ${key}`},
        body:JSON.stringify({model,messages,temperature:0.85,max_tokens:2500,top_p:0.95,stream:true}), signal
      });
      if(res.status===429){ await sleep(delay); delay*=2; attempt++; continue; }
      if(!res.ok){ const err=await res.json().catch(()=>({})); throw new Error(err.error?.message||`HTTP ${res.status}`); }
      const reader=res.body.getReader(); const decoder=new TextDecoder(); let fullReply='';
      while(true){
        const {done,value}=await reader.read(); if(done) break;
        const chunk=decoder.decode(value);
        const lines=chunk.split('\n').filter(l=>l.trim().startsWith('data: '));
        for(const line of lines){
          const data=line.slice(6); if(data==='[DONE]') continue;
          try{ const parsed=JSON.parse(data); const content=parsed.choices[0]?.delta?.content; if(content){ fullReply+=content; onChunk(content,false); } }catch(e){}
        }
      }
      if(!fullReply || fullReply.length<5) throw new Error('Streaming incomplete');
      setCached(cacheKey,fullReply);
      onChunk('',true);
      return fullReply;
    }catch(err){
      if(err.name==='AbortError') throw err;
      attempt++; if(attempt>=3) throw err;
      await sleep(delay); delay*=2;
    }
  }
}

// ========== 16. SEND CHAT مع typing effect, retry, وتنقية ==========
async function sendChat(text, isRetry=false) {
  let finalText = isRetry ? text : sanitizeInput(text);
  if(!finalText.trim() || state.isSending) return;
  const now=Date.now();
  if(now-state.lastSendTime<500 && !isRetry) { el.apiState.textContent='⚡ انتظر قليلاً'; return; }
  state.lastSendTime=now;
  if(!currentKey()){
    addMsgToUI('user',finalText); addToChat('user',finalText);
    addMsgToUI('assistant','⚠️ أدخل مفتاح API في الإعدادات أولاً (Groq مجاني).'); addToChat('assistant','⚠️ أدخل مفتاح API');
    return;
  }
  state.isSending=true; el.sendBtn.disabled=true; el.sendBtn.innerHTML='<i class="fas fa-spinner fa-spin"></i>'; el.apiState.textContent='⚡ يبث...';
  if(state.abortController) state.abortController.abort();
  state.abortController=new AbortController();
  try{
    if(isDevQuestion(finalText)){
      addMsgToUI('user',finalText); addToChat('user',finalText);
      const devInfo='**المهندس محمد رجب عبد المنعم**\n📍 الفيوم – مركز طامية\n💻 برمجة تطبيقات وأمن سيبراني\n🎓 طالب نظم ومعلومات\n🎂 25 أكتوبر 2006 (19 سنة)\n📦 مشاريعه على GitHub';
      addMsgToUI('assistant',devInfo); addToChat('assistant',devInfo);
      state.isSending=false; el.sendBtn.disabled=false; el.sendBtn.innerHTML='<i class="fas fa-paper-plane"></i>';
      return;
    }
    const img=state.attachedImage;
    addMsgToUI('user',finalText,{imageDataUrl:img?.dataUrl,imageName:img?.name}); addToChat('user',finalText,{imageDataUrl:img?.dataUrl,imageName:img?.name});
    addThinkingIndicator();
    await sleep(300); // typing effect
    const chat=getActiveChat();
    const candidates=getModelCandidates(finalText,!!img);
    let lastError=null, success=false;
    for(const model of candidates){
      try{
        const msgs=buildMessages(chat,finalText,img);
        removeThinking();
        const bubble=addMsgToUI('assistant','',{isStreaming:true});
        const streamId=bubble.id;
        let accumulated='';
        const onChunk=(chunk,isEnd)=>{
          if(chunk){ accumulated+=chunk; const bubbleEl=document.getElementById(streamId); if(bubbleEl) bubbleEl.innerHTML=renderMarkdown(accumulated); scrollBottom(); }
          if(isEnd){ if(accumulated){ addToChat('assistant',accumulated); success=true; } }
        };
        await callAPIStream(state.provider,model,msgs,onChunk,state.abortController.signal);
        if(success){
          state.currentModel=model; chat.model=model; persist();
          if(el.modelSelect) el.modelSelect.value=model;
          el.modelState.textContent=`🤖 ${model.split('-').slice(0,3).join('-')}`;
          el.apiState.textContent=`⚡ ✅ ${model.split('-')[0]}`;
          state.attachedImage=null; updateAttachmentBox();
          return;
        }
      }catch(err){ if(err.name!=='AbortError') lastError=err; removeThinking(); continue; }
    }
    removeThinking();
    const errorMsg = `فشل الرد: ${lastError?.message||'غير معروف'}`;
    addErrorWithRetry(errorMsg, () => sendChat(finalText, true));
    addToChat('assistant', `❌ ${errorMsg}`);
    el.apiState.textContent='⚡ ❌ خطأ';
  }finally{
    state.isSending=false; el.sendBtn.disabled=false; el.sendBtn.innerHTML='<i class="fas fa-paper-plane"></i>';
    state.abortController=null; persist();
  }
}

// ========== 17. وظائف أخرى (بحث، صور، مفاتيح) ==========
async function deepSearch() { /* مختصر */ const q=el.searchInput.value.trim(); if(!q) return; el.searchResults.innerHTML='<div>⏳ جاري...</div>'; try{ const url=`https://ar.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(q)}&format=json&origin=*`; const res=await fetch(url); const data=await res.json(); const hits=data?.query?.search||[]; if(!hits.length){ el.searchResults.innerHTML='<div class="empty-hint">لا نتائج</div>'; return; } el.searchResults.innerHTML=hits.slice(0,6).map(r=>`<div class="result-item"><strong>${escHTML(r.title)}</strong><small>${escHTML((r.snippet||'').replace(/<[^>]+>/g,''))}</small></div>`).join('')+`<div class="result-item"><button class="ghost-btn" onclick="window.open('https://www.google.com/search?q=${encodeURIComponent(q)}','_blank')"><i class="fab fa-google"></i> بحث جوجل</button></div>`; }catch(e){ el.searchResults.innerHTML=`<div class="status-box bad">خطأ: ${escHTML(e.message)}</div>`; } }
function generateImage() { const p=el.imagePrompt.value.trim(); if(!p) return; el.imageResult.innerHTML=`<div>⏳ توليد...</div><img class="msg-image" src="https://image.pollinations.ai/prompt/${encodeURIComponent(p)}?width=1024&height=1024&nologo=true" onclick="window.open(this.src,'_blank')" onload="this.previousSibling.textContent='✅ جاهز'">`; }
function saveKeys() { state.groqKey=el.groqKeyInput.value.trim(); state.openaiKey=el.openaiKeyInput.value.trim(); persist(); refreshKeyUI(); setStatus(el.keyStatus,'good','✅ حفظت المفاتيح مؤقتاً (غير آمن).'); }
function clearKeys() { state.groqKey=''; state.openaiKey=''; sessionStorage.removeItem(STORAGE.groqKey); sessionStorage.removeItem(STORAGE.openaiKey); refreshKeyUI(); }
async function testKey() { if(!currentKey()){ setStatus(el.keyStatus,'warn','لا مفتاح'); return; } el.testKeyBtn.disabled=true; try{ const msgs=[{role:'system',content:'رد بكلمة واحدة'},{role:'user',content:'مرحباً'}]; const m=state.provider==='openai'?'gpt-4o-mini':'llama-3.1-8b-instant'; const reply=await callAPIStream(state.provider,m,msgs,(chunk,isEnd)=>{},null); setStatus(el.keyStatus,'good',`✅ يعمل: ${reply.slice(0,40)}`); }catch(e){ setStatus(el.keyStatus,'bad',`❌ ${e.message}`); } finally{ el.testKeyBtn.disabled=false; } }
function attachImage(file){ return new Promise((res,rej)=>{ const reader=new FileReader(); reader.onload=()=>{ const img=new Image(); img.onload=()=>{ const canvas=document.createElement('canvas'); let w=img.width,h=img.height,max=1024; if(w>h&&w>max){h=Math.round(h*max/w);w=max;}else if(h>max){w=Math.round(w*max/h);h=max;} canvas.width=w; canvas.height=h; canvas.getContext('2d').drawImage(img,0,0,w,h); state.attachedImage={name:file.name,dataUrl:canvas.toDataURL('image/jpeg',0.8)}; updateAttachmentBox(); res(); }; img.onerror=()=>rej(new Error('فشل تحميل الصورة')); img.src=reader.result; }; reader.onerror=()=>rej(new Error('فشل قراءة الملف')); reader.readAsDataURL(file); }); }
function clearAttachment() { state.attachedImage=null; updateAttachmentBox(); }
function autoResize(ta) { ta.style.height='auto'; ta.style.height=Math.min(ta.scrollHeight,200)+'px'; }
function refreshUI() { buildProviderOptions(); buildModelOptions(); renderModelNotes(); refreshKeyUI(); updateAttachmentBox(); if(el.providerSelect) el.providerSelect.value=state.provider; if(el.routingModeSelect) el.routingModeSelect.value=state.routingMode; if(el.modelSelect && state.currentModel) el.modelSelect.value=state.currentModel; if(el.customModelInput) el.customModelInput.value=state.customModels.join(', '); el.modelState.textContent=`🤖 ${state.currentModel.split('-').slice(0,3).join('-')}`; updateBgAutoBtn(); }

// ========== 18. ربط الأحداث (نفس السابق مع إضافة التوجيه اليدوي) ==========
$$('.nav-btn').forEach(b=>b.addEventListener('click',()=>activateTab(b.dataset.tab)));
el.providerSelect.addEventListener('change',()=>{ state.provider=el.providerSelect.value; state.currentModel=currentProvider().models[0]||DEFAULT_MODEL; persist(); buildModelOptions(); refreshUI(); });
el.routingModeSelect.addEventListener('change',()=>{ state.routingMode=el.routingModeSelect.value; persist(); renderModelNotes(); buildModelOptions(); });
el.modelSelect.addEventListener('change',()=>{ state.currentModel=el.modelSelect.value; persist(); el.modelState.textContent=`🤖 ${state.currentModel.split('-').slice(0,3).join('-')}`; });
el.customModelInput.addEventListener('change',()=>{ state.customModels=[...new Set((el.customModelInput.value||'').split(',').map(s=>s.trim()).filter(Boolean))]; persist(); buildModelOptions(); });
el.sendBtn.addEventListener('click',()=>{ const t=el.chatInput.value.trim(); if(t){ el.chatInput.value=''; autoResize(el.chatInput); sendChat(t); } });
el.chatInput.addEventListener('keydown',e=>{ if(e.key==='Enter'&&!e.shiftKey){ e.preventDefault(); el.sendBtn.click(); } });
el.chatInput.addEventListener('input',()=>autoResize(el.chatInput));
$$('[data-fill]').forEach(b=>b.addEventListener('click',()=>{ el.chatInput.value=b.dataset.fill; el.chatInput.focus(); autoResize(el.chatInput); }));
el.saveKeysBtn.addEventListener('click',saveKeys); el.clearKeysBtn.addEventListener('click',clearKeys);
el.toggleKeysBtn.addEventListener('click',()=>{ el.groqKeyInput.type=el.groqKeyInput.type==='password'?'text':'password'; el.openaiKeyInput.type=el.openaiKeyInput.type==='password'?'text':'password'; });
el.testKeyBtn.addEventListener('click',testKey);
el.searchBtn.addEventListener('click',deepSearch); el.searchInput.addEventListener('keydown',e=>{if(e.key==='Enter')deepSearch();});
el.searchClearBtn.addEventListener('click',()=>{ el.searchInput.value=''; el.searchResults.innerHTML='<div class="empty-hint">🔍 ابدأ...</div>'; });
el.googleSearchBtn.addEventListener('click',()=>{ const q=el.searchInput.value.trim(); if(q) window.open(`https://www.google.com/search?q=${encodeURIComponent(q)}`,'_blank'); });
el.genBtn.addEventListener('click',generateImage); el.imagePrompt.addEventListener('keydown',e=>{if(e.key==='Enter')generateImage();});
el.webImageBtn.addEventListener('click',()=>{ const q=el.imagePrompt.value.trim(); if(q) window.open(`https://www.google.com/search?q=${encodeURIComponent(q)}&tbm=isch`,'_blank'); });
el.samplePromptBtn.addEventListener('click',()=>{ el.imagePrompt.value='مدينة مصرية مستقبلية ليلاً، نيون'; generateImage(); });
el.clearChatBtn.addEventListener('click',clearCurrentChat); el.newChatBtn.addEventListener('click',newChat); el.newChatTopBtn.addEventListener('click',newChat);
el.clearAllChatsBtn.addEventListener('click',clearAllChats);
el.exportChatsBtn.addEventListener('click',()=>exportChatsFile());
el.importChatsBtn.addEventListener('click',()=>el.importFileInput.click());
el.importFileInput.addEventListener('change',async()=>{ const f=el.importFileInput.files?.[0]; if(f){ try{ await importChats(JSON.parse(await f.text())); }catch(e){ alert(`فشل: ${e.message}`); } finally{ el.importFileInput.value=''; } } });
el.saveTitleBtn.addEventListener('click',setChatTitle);
el.exportOneBtn.addEventListener('click',()=>{ const c=getActiveChat(); exportChatsFile([c],`${c.title.replace(/[^a-zA-Z0-9]/g,'_')}.json`); });
el.attachImageBtn.addEventListener('click',()=>el.imageFileInput.click());
el.clearAttachmentBtn?.addEventListener('click',clearAttachment); el.removeAttBtn?.addEventListener('click',clearAttachment);
el.imageFileInput.addEventListener('change',async()=>{ const f=el.imageFileInput.files?.[0]; if(f){ try{ await attachImage(f); }catch(e){ alert(e.message); } el.imageFileInput.value=''; } });
el.bgPrevBtn.addEventListener('click',()=>setBackground(state.bgIndex-1)); el.bgNextBtn.addEventListener('click',()=>setBackground(state.bgIndex+1));
el.bgAutoBtn.addEventListener('click',()=>{ state.autoBg=!state.autoBg; persist(); updateBgAutoBtn(); startAutoBg(); });
document.addEventListener('keydown',e=>{ if((e.ctrlKey||e.metaKey) && e.key==='k'){ e.preventDefault(); newChat(); } if((e.ctrlKey||e.metaKey) && e.key==='ArrowRight'){ e.preventDefault(); setBackground(state.bgIndex-1); } if((e.ctrlKey||e.metaKey) && e.key==='ArrowLeft'){ e.preventDefault(); setBackground(state.bgIndex+1); } });

// ========== 19. INIT ==========
(function init() {
  if(!state.chats.length) state.chats=[makeChat()];
  if(!state.activeChatId) state.activeChatId=state.chats[0].id;
  refreshUI(); renderChat(); initBackgrounds();
  el.chatInput.focus();
  console.log(`🦅 v8.0 – أمان، نطق، Markdown متكامل، Retry، خلفيات ${BACKGROUNDS.length}`);
})();
