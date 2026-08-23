let chatHistory = [];
let isStreaming = false;
let sceneCounter = 1;
let currentLanguage = localStorage.getItem('cinema_lang') || 'id';

// Configure Marked
marked.setOptions({
    highlight: function(code, lang) {
        if (lang && hljs.getLanguage(lang)) {
            return hljs.highlight(code, { language: lang }).value;
        }
        return hljs.highlightAuto(code).value;
    },
    breaks: true
});

const I18N = {
    id: {
        brandSub: "DIRECTING ENGINE • 35MM PRODUCTION",
        newSession: "NEW SESSION",
        welcomeHeading: "EXT. CINÉMA STUDIO - PRODUCTION SLATE",
        welcomeText: "Selamat datang di konsol penyutradaraan <strong>ZERO CINEMA</strong>. Antarmuka ini dirancang untuk menyusun naskah film, spesifikasi kamera optik, dan prompt video 9-Blok presisi tinggi dengan keterbacaan optimal.",
        directiveTitle: "PANDUAN SUTRADARA",
        directiveText: "Deskripsikan adegan yang ingin Anda buat pada konsol di bawah (misal: <em>\"Duel silat brutal 15 detik di lorong sempit\"</em> atau <em>\"Noir misteri di bar tengah malam\"</em>). Sistem akan memandu pementasan naskah hingga prompt final.",
        placeholder: "Tulis visi adegan atau naskah film Anda di sini... (Enter untuk kirim, Shift+Enter untuk baris baru)",
        btnExecute: "EXECUTE",
        userNoteTag: "DIRECTOR'S SCRIPT NOTE",
        userLogTitle: "DIRECTOR'S LOG",
        userLogAuthor: "AUTHOR: YOU",
        assistantCrestTitle: "ZERO CINEMA MEMORANDUM",
        stagePre: "STAGE: PRE-PRODUCTION",
        stageInProg: "STAGE: IN PROGRESS",
        stageLogged: "STAGE: RECORDED",
        activityInit: "MEMPROSES KONTEKS SINEMATIK...",
        copyBtn: "COPY SPEC",
        copied: "COPIED"
    },
    en: {
        brandSub: "DIRECTING ENGINE • 35MM PRODUCTION",
        newSession: "NEW SESSION",
        welcomeHeading: "EXT. CINEMA STUDIO - PRODUCTION SLATE",
        welcomeText: "Welcome to the <strong>ZERO CINEMA</strong> Directorial Console. This workspace is engineered to compose high-fidelity screenplays, Panavision large-format optics, and zero-distortion 10-Block Extended video production prompts.",
        directiveTitle: "DIRECTORIAL DIRECTIVE",
        directiveText: "Describe your scene concept, mood, or script excerpt in the console below (e.g., <em>\"Brutal 15-second martial arts corridor fight\"</em> or <em>\"Late-night neo-noir bar conversation\"</em>). The system will direct the staging step-by-step to final production code.",
        placeholder: "Enter directorial instruction or scene concept here... (Enter to send, Shift+Enter for newline)",
        btnExecute: "EXECUTE",
        userNoteTag: "DIRECTOR'S SCRIPT NOTE",
        userLogTitle: "DIRECTOR'S LOG",
        userLogAuthor: "AUTHOR: YOU",
        assistantCrestTitle: "ZERO CINEMA MEMORANDUM",
        stagePre: "STAGE: PRE-PRODUCTION",
        stageInProg: "STAGE: IN PROGRESS",
        stageLogged: "STAGE: RECORDED",
        activityInit: "PROCESSING CINEMATIC CONTEXT...",
        copyBtn: "COPY SPEC",
        copied: "COPIED"
    }
};

function setLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('cinema_lang', lang);
    
    document.getElementById('langIdBtn').classList.toggle('active', lang === 'id');
    document.getElementById('langEnBtn').classList.toggle('active', lang === 'en');
    
    applyLanguageTexts();
}

function applyLanguageTexts() {
    const t = I18N[currentLanguage];
    
    document.getElementById('brandSub').innerText = t.brandSub;
    document.getElementById('newSessionBtnText').innerText = t.newSession;
    document.getElementById('chatInput').placeholder = t.placeholder;
    document.getElementById('sendButtonText').innerText = t.btnExecute;
    
    const welcomeBody = document.getElementById('welcomeBody');
    if (welcomeBody && chatHistory.length === 0) {
        welcomeBody.innerHTML = `
            <h2 class="scene-heading">${t.welcomeHeading}</h2>
            <p>${t.welcomeText}</p>
            <div class="director-directive">
                <div class="directive-title">${t.directiveTitle}</div>
                <p>${t.directiveText}</p>
            </div>
        `;
    }
}

function formatMarkdownContent(rawText) {
    let text = rawText
        .replace(/\\rightarrow|\$\\rightarrow\$|\$\\to\$|\\to/g, '→')
        .replace(/\\Rightarrow|\$\\Rightarrow\$/g, '⇒')
        .replace(/\\leftarrow|\$\\leftarrow\$/g, '←');

    // 1. Strip codeblock backticks accidentally wrapping MANDATORY HARD STOP
    text = text.replace(/```(?:text)?\s*(\n?🛑\s*MANDATORY HARD STOP[\s\S]*?)```/gi, '$1');

    // 2. Render clean, fully-closed Director Checkpoint UI Card
    text = text.replace(/🛑\s*MANDATORY HARD STOP\s*(\([^\)]*\))?([^\n]*)([\s\S]*?)(?=(?:\n\n[A-Z0-9#\d]|$))/gi, (match, p1, p2, p3) => {
        const title = p1 ? p1.replace(/[\(\)]/g, '').trim() : 'MANDATORY APPROVAL GATEWAY';
        const body = (p2 + '\n' + p3).trim();
        return `\n\n<div class="director-checkpoint-card">\n<div class="checkpoint-header"><span class="checkpoint-badge">🛑 DIRECTOR'S GATEWAY</span><span class="checkpoint-title">${title}</span></div>\n<div class="checkpoint-content">${body.replace(/\n/g, '<br>')}</div>\n</div>\n\n`;
    });

    return marked.parse(text);
}

function isActualPromptCodeblock(codeText) {
    const lower = codeText.toLowerCase();
    if (lower.includes('mandatory hard stop') || lower.includes("director's checkpoint") || lower.includes("director's gateway") || lower.includes('alert-box')) {
        return false;
    }
    if (lower.includes('[prose') || lower.includes('[kinetic') || lower.includes('[acting') || lower.includes('[camera') || lower.includes('[audio')) return true;
    if (lower.includes('charsheet') || lower.includes('character reference') || lower.includes('4-panel')) return true;
    if (lower.includes('envsheet') || lower.includes('environment reference')) return true;
    if (lower.includes('propsheet') || lower.includes('prop reference')) return true;
    if (lower.includes('storyboard') || lower.includes('10-panel') || lower.includes('grid layout')) return true;
    if (lower.includes('panavision') || lower.includes('arri') || lower.includes('--ar') || lower.includes('--niji') || lower.includes('--v 6')) return true;
    return false;
}

function detectCodeblockLabel(preElement, codeText) {
    // 1. Check previous element text
    const prevEl = preElement.previousElementSibling;
    if (prevEl && prevEl.tagName && (prevEl.tagName.startsWith('H') || prevEl.tagName === 'P')) {
        const titleText = prevEl.innerText.trim();
        if (titleText.length > 3 && titleText.length < 60) {
            return titleText.replace(/^[#\d\.\s\-\*🎭🏛️🎬]+/, '').toUpperCase() + ' • PROMPT';
        }
    }
    
    // 2. Check content signature
    const lower = codeText.toLowerCase();
    if (lower.includes('charsheet') || lower.includes('character reference sheet') || lower.includes('4-panel grid')) {
        const charMatch = codeText.match(/(?:Indonesian|Korean|Japanese|American|woman|man|male|female)\s+(?:\d+yo\s+)?([A-Za-z]+)/i);
        if (charMatch && charMatch[1]) {
            return `CHARACTER REFERENCE SPEC • ${charMatch[1].toUpperCase()}`;
        }
        return 'CHARACTER REFERENCE SPEC (4-PANEL UGC)';
    }
    if (lower.includes('envsheet') || lower.includes('environment reference') || lower.includes('interior') || lower.includes('exterior')) {
        return 'ENVIRONMENT REFERENCE SPEC';
    }
    if (lower.includes('propsheet') || lower.includes('prop reference')) {
        return 'PROP REFERENCE SPEC';
    }
    if (codeText.includes('[PROSE') || codeText.includes('[KINETIC') || codeText.includes('[TEMPORAL TRANSITION')) {
        return 'MASTER VIDEO PRODUCTION PROMPT (10-BLOCK EXTENDED)';
    }
    
    return 'CINEMA PRODUCTION PROMPT';
}

function postProcessSlateCard(cardElement) {
    const content = cardElement.querySelector('.card-screenplay-body');
    if (!content) return;
    const t = I18N[currentLanguage];
    
    content.querySelectorAll('pre').forEach(pre => {
        if (pre.parentElement.classList.contains('codeblock-container')) return;
        
        const codeEl = pre.querySelector('code');
        const codeText = codeEl ? codeEl.innerText : pre.innerText;
        
        // If this pre block is NOT a genuine prompt, do NOT wrap with copy container!
        if (!isActualPromptCodeblock(codeText)) {
            // Check if it's a checkpoint instruction, if so, render as clean callout
            if (codeText.includes("MANDATORY HARD STOP") || codeText.includes("DIRECTOR'S CHECKPOINT") || codeText.includes("alert-box")) {
                const calloutDiv = document.createElement('div');
                calloutDiv.className = 'alert-box stop';
                calloutDiv.innerHTML = `<strong>DIRECTOR'S CHECKPOINT (MANDATORY APPROVAL GATEWAY):</strong><br>` + 
                    codeText.replace(/<div class="alert-box stop">/g, '')
                            .replace(/<strong>.*?<\/strong><br>/g, '')
                            .replace(/<\/div>/g, '')
                            .replace(/🛑\s*MANDATORY HARD STOP[^\n]*/g, '')
                            .trim().replace(/\n/g, '<br>');
                pre.parentNode.replaceChild(calloutDiv, pre);
            }
            return;
        }

        const dynamicLabel = detectCodeblockLabel(pre, codeText);
        
        const container = document.createElement('div');
        container.className = 'codeblock-container';
        
        const header = document.createElement('div');
        header.className = 'codeblock-header';
        
        header.innerHTML = `
            <span class="code-lang-label">${dynamicLabel}</span>
            <button class="copy-prompt-btn">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2"><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                <span>${t.copyBtn}</span>
            </button>
        `;
        
        const copyBtn = header.querySelector('.copy-prompt-btn');
        copyBtn.onclick = () => {
            navigator.clipboard.writeText(codeText);
            copyBtn.querySelector('span').innerText = t.copied;
            setTimeout(() => copyBtn.querySelector('span').innerText = t.copyBtn, 2000);
        };
        
        pre.parentNode.insertBefore(container, pre);
        container.appendChild(header);
        container.appendChild(pre);
    });
}

function appendUserMessage(text) {
    const t = I18N[currentLanguage];
    const messages = document.getElementById('chatMessages');
    const entry = document.createElement('div');
    entry.className = 'screenplay-slate user';
    
    entry.innerHTML = `
        <div class="slate-header-strip" style="justify-content: flex-end;">
            <div class="slate-num-pill">${t.userNoteTag}</div>
        </div>
        <div class="slate-page-card">
            <div class="card-crest">
                <div class="crest-title">${t.userLogTitle}</div>
                <div class="crest-date">${t.userLogAuthor}</div>
            </div>
            <div class="card-screenplay-body markdown-body">
                <p>${text.replace(/\n/g, '<br>')}</p>
            </div>
        </div>
    `;
    
    messages.appendChild(entry);
    scrollToBottom();
}

function createAssistantSlate() {
    const t = I18N[currentLanguage];
    sceneCounter++;
    const padScene = String(sceneCounter).padStart(3, '0');
    
    const messages = document.getElementById('chatMessages');
    const entry = document.createElement('div');
    entry.className = 'screenplay-slate assistant';
    
    entry.innerHTML = `
        <div class="slate-header-strip">
            <div class="slate-num-pill">SCENE ${padScene}</div>
            <div class="slate-spec-info">PANAVISION DXL2 • 70MM PRIMO • -14 LUFS</div>
            <div class="slate-take-info">TAKE 01</div>
        </div>
        <div class="slate-page-card">
            <div class="card-crest">
                <div class="crest-title">${t.assistantCrestTitle}</div>
                <div class="crest-date">${t.stageInProg}</div>
            </div>
            <div class="card-screenplay-body markdown-body">
                <span class="stream-cursor">▌</span>
            </div>
        </div>
    `;
    
    messages.appendChild(entry);
    scrollToBottom();
    return entry;
}

function setLiveActivity(text, show = true) {
    const bar = document.getElementById('liveActivityBar');
    const label = document.getElementById('activityText');
    if (show) {
        label.innerText = text.toUpperCase();
        bar.style.display = 'flex';
    } else {
        bar.style.display = 'none';
    }
}

function scrollToBottom() {
    const vp = document.getElementById('chatViewport');
    vp.scrollTop = vp.scrollHeight;
}

async function handleSend() {
    if (isStreaming) return;
    const input = document.getElementById('chatInput');
    const text = input.value.trim();
    if (!text) return;
    
    const model = document.getElementById('modelSelect').value;
    const t = I18N[currentLanguage];
    
    appendUserMessage(text);
    chatHistory.push({ role: 'user', content: text });
    input.value = '';
    adjustInputHeight(input);
    
    isStreaming = true;
    document.getElementById('sendButton').disabled = true;
    setLiveActivity(t.activityInit, true);
    
    const assistantSlate = createAssistantSlate();
    const contentDiv = assistantSlate.querySelector('.card-screenplay-body');
    const crestDate = assistantSlate.querySelector('.crest-date');
    
    let accumulatedText = "";
    
    try {
        const response = await fetch('/api/chat-stream', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messages: chatHistory,
                model: model,
                language: currentLanguage,
                temperature: 0.7
            })
        });
        
        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let buffer = "";
        
        while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n\n");
            buffer = lines.pop();
            
            for (const line of lines) {
                if (line.startsWith("data: ")) {
                    const jsonStr = line.replace("data: ", "").trim();
                    if (!jsonStr) continue;
                    try {
                        const event = JSON.parse(jsonStr);
                        
                        if (event.type === 'activity') {
                            setLiveActivity(event.text, true);
                        } else if (event.type === 'token') {
                            accumulatedText += event.text;
                            contentDiv.innerHTML = formatMarkdownContent(accumulatedText);
                            scrollToBottom();
                        } else if (event.type === 'error') {
                            accumulatedText += `\n\n⚠️ **ALERT:** ${event.text}`;
                            contentDiv.innerHTML = formatMarkdownContent(accumulatedText);
                        }
                    } catch (e) {
                        console.error("Parse error:", e);
                    }
                }
            }
        }
        
        chatHistory.push({ role: 'assistant', content: accumulatedText });
        contentDiv.innerHTML = formatMarkdownContent(accumulatedText);
        postProcessSlateCard(assistantSlate);
        crestDate.innerText = t.stageLogged;
        
    } catch (e) {
        contentDiv.innerHTML = `⚠️ **COMMUNICATION ERROR:** ${e.message}`;
    } finally {
        postProcessSlateCard(assistantSlate);
        setLiveActivity("", false);
        isStreaming = false;
        document.getElementById('sendButton').disabled = false;
        scrollToBottom();
    }
}

function clearChat() {
    chatHistory = [];
    sceneCounter = 1;
    const t = I18N[currentLanguage];
    document.getElementById('chatMessages').innerHTML = `
        <div class="screenplay-slate assistant">
            <div class="slate-header-strip">
                <div class="slate-num-pill">SCENE 001</div>
                <div class="slate-spec-info">PANAVISION DXL2 • 70MM PRIMO • -14 LUFS</div>
                <div class="slate-take-info">TAKE 01</div>
            </div>
            <div class="slate-page-card">
                <div class="card-crest">
                    <div class="crest-title">${t.assistantCrestTitle}</div>
                    <div class="crest-date">${t.stagePre}</div>
                </div>
                <div class="card-screenplay-body markdown-body" id="welcomeBody">
                    <h2 class="scene-heading">${t.welcomeHeading}</h2>
                    <p>${t.welcomeText}</p>
                    <div class="director-directive">
                        <div class="directive-title">${t.directiveTitle}</div>
                        <p>${t.directiveText}</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function adjustInputHeight(el) {
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 160) + 'px';
}

const chatInput = document.getElementById('chatInput');
chatInput.addEventListener('input', function() {
    adjustInputHeight(this);
});

chatInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
    }
});

// Initialize on load
setLanguage(currentLanguage);
