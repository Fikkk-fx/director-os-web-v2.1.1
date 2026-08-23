import { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import {
  Film, Image as ImageIcon, Moon, Sun, Video, Type, Wand2,
  FolderKanban, Sparkles, Bot, ChevronDown, Check, Trash2, Plus, X,
  Download, Settings, Menu, ArrowRight,
  RotateCcw, FolderOpen, Layers, FilePlus, Users, Send, Home,
} from 'lucide-react';
import { SettingsModal } from './components/SettingsModal';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/* ── Tab accent system ── */
const TAB_CFG = {
  Home:   { grad: 'from-blue-500 to-cyan-400',    shadow: 'shadow-blue-500/35',   accent: 'text-cyan-400',   accentL: 'text-cyan-600',   orb1: 'bg-blue-500/28',   orb2: 'bg-violet-500/18', border: 'border-blue-400/30'   },
  Image:  { grad: 'from-violet-500 to-purple-400',shadow: 'shadow-violet-500/35', accent: 'text-violet-400', accentL: 'text-violet-600', orb1: 'bg-violet-500/28', orb2: 'bg-pink-500/18',   border: 'border-violet-400/30' },
  Video:  { grad: 'from-orange-500 to-amber-400', shadow: 'shadow-orange-500/35', accent: 'text-amber-400',  accentL: 'text-orange-600', orb1: 'bg-orange-400/25', orb2: 'bg-rose-400/15',   border: 'border-orange-400/30' },
  Assets: { grad: 'from-teal-500 to-emerald-400', shadow: 'shadow-teal-500/30',   accent: 'text-teal-400',   accentL: 'text-teal-600',   orb1: 'bg-teal-500/24',   orb2: 'bg-emerald-500/16',border: 'border-teal-400/30'   },
} as const;
type TabKey = keyof typeof TAB_CFG;

/* ── Types ── */
interface ChatMessage {
  id: string; role: 'user' | 'ai'; content: string; timestamp: string;
  imageUrl?: string; videoUrl?: string;
}
interface ChatSession {
  id: string; title: string; tab: 'Home' | 'Image' | 'Video';
  messages: ChatMessage[]; updatedAt: number;
}

/* ── Custom Select ── */
interface SelectOption { value: string; label: string; }
interface CustomSelectProps {
  label: string; value: string; onChange: (v: string) => void;
  options: SelectOption[]; isLight: boolean; accentClass: string; compact?: boolean;
}
function CustomSelect({ label, value, options, onChange, isLight, accentClass }: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find(o => o.value === value)?.label ?? value;
  const close = useCallback(() => setOpen(false), []);
  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) close(); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [open, close]);
  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => setOpen(p => !p)}
        className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold outline-none select-none transition-all
          ${isLight ? 'text-slate-700 hover:bg-black/5' : 'text-slate-200 hover:bg-white/10'}`}>
        <span className={`text-[9px] font-bold uppercase tracking-[0.2em] ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>{label}</span>
        <span className={accentClass}>{selected}</span>
        <ChevronDown size={12} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''} opacity-50`} />
      </button>
      <div role="listbox" className={`absolute bottom-[calc(100%+10px)] left-1/2 z-50 min-w-[150px] -translate-x-1/2 origin-bottom rounded-2xl p-1.5 transition-all duration-200 glass-elevated
        ${open ? 'pointer-events-auto scale-100 opacity-100 translate-y-0' : 'pointer-events-none scale-90 opacity-0 translate-y-3'}`}>
        {options.map(opt => (
          <button key={opt.value} type="button" role="option" aria-selected={opt.value === value}
            onClick={() => { onChange(opt.value); close(); }}
            className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-sm transition-all duration-100
              ${opt.value === value
                ? isLight ? 'bg-blue-50 text-blue-700 font-semibold' : `${accentClass} bg-white/10 font-semibold`
                : isLight ? 'text-slate-600 hover:bg-black/5' : 'text-slate-300 hover:bg-white/8'}`}>
            <span>{opt.label}</span>
            {opt.value === value && <Check size={11} className="shrink-0 opacity-70" />}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Markdown renderer ── */
function MarkdownText({ text, isLight }: { text: string; isLight: boolean }) {
  const lines = text.split('\n');
  const codeClass = isLight ? 'bg-slate-100 text-slate-800 rounded px-1 font-mono text-[12px]' : 'bg-white/10 text-slate-200 rounded px-1 font-mono text-[12px]';
  const preClass = isLight ? 'bg-slate-100 text-slate-800 rounded-xl p-3 font-mono text-[12px] overflow-x-auto my-2' : 'bg-black/30 text-slate-200 rounded-xl p-3 font-mono text-[12px] overflow-x-auto my-2';
  const h2Class = `font-bold text-base mt-3 mb-1 ${isLight ? 'text-slate-900' : 'text-white'}`;
  const h3Class = `font-bold text-[13px] mt-2 mb-0.5 ${isLight ? 'text-slate-800' : 'text-slate-100'}`;
  const hrClass = `my-3 border-t ${isLight ? 'border-slate-200' : 'border-white/10'}`;
  function renderInline(s: string): React.ReactNode {
    const parts = s.split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g);
    return parts.map((p, i) => {
      if (p.startsWith('`') && p.endsWith('`') && p.length > 2) return <code key={i} className={codeClass}>{p.slice(1,-1)}</code>;
      if (p.startsWith('**') && p.endsWith('**') && p.length > 4) return <strong key={i}>{p.slice(2,-2)}</strong>;
      if (p.startsWith('*') && p.endsWith('*') && p.length > 2) return <em key={i}>{p.slice(1,-1)}</em>;
      return <span key={i}>{p}</span>;
    });
  }
  const elements: React.ReactNode[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.trim().startsWith('```')) {
      const codeLines: string[] = []; i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) { codeLines.push(lines[i]); i++; }
      elements.push(<pre key={i} className={preClass}><code>{codeLines.join('\n')}</code></pre>);
      i++; continue;
    }
    if (line.trim() === '---' || line.trim() === '***') { elements.push(<hr key={i} className={hrClass} />); i++; continue; }
    if (line.startsWith('## ')) { elements.push(<p key={i} className={h2Class}>{renderInline(line.slice(3))}</p>); i++; continue; }
    if (line.startsWith('### ')) { elements.push(<p key={i} className={h3Class}>{renderInline(line.slice(4))}</p>); i++; continue; }
    if (line.trim() === '') { elements.push(<br key={i} />); i++; continue; }
    elements.push(<p key={i} className="leading-[1.75] text-[14px] mb-0">{renderInline(line)}</p>);
    i++;
  }
  return <div className="flex flex-col gap-0.5">{elements}</div>;
}

/* ── Typing Dots ── */
function TypingDots({ color }: { color: string }) {
  return (
    <div className="flex gap-1 items-center">
      {[0, 1, 2].map(i => (
        <span key={i} className={`h-2 w-2 rounded-full ${color} animate-bounce`} style={{ animationDelay: `${i * 0.15}s` }} />
      ))}
    </div>
  );
}

/* ── Demo session ── */
const DEMO_SESSION: ChatSession = {
  id: 'demo-v2', title: 'End-to-End: Filmmaker Jakarta', tab: 'Home',
  updatedAt: Date.now() - 2000000,
  messages: [
    { id: 'dm1', role: 'user', content: 'Buat video cinematic tentang seorang filmmaker muda di Jakarta yang berjuang mewujudkan film pertamanya.', timestamp: '09:00 AM' },
    { id: 'dm2', role: 'ai', timestamp: '09:01 AM', content: `## FASE 0 — STORY BRIEF\n\n**Tema:** Perjuangan kreator muda — universal, emosional, relatable.\n**Genre:** Coming-of-age Drama / Indie Arthouse.\n\n---\n\n### Style Options\n\n**1 — Sinema Realisme Sosial** *(Kamila Andini)*\nRaw, membumi. Flat kumuh Menteng Atas. Cahaya satu bohlam pijar.\n\n**2 — Indie Noir Jakarta** *(Wong Kar-Wai × Wim Umboh)*\nJazz mengalir pelan. Kemang malam hujan. Step-printing di gang sempit.\n\n**3 — Arthouse Ekspresionisme** *(Tarkovsky)*\nKamera diam total. Atap gedung tua, cakrawala Jakarta, narasi VO puitis.` },
  ],
};

/* ── Models ── */
const HOME_MODELS: SelectOption[] = [
  { value: 'openai/gpt-5.6-sol', label: 'GPT-5.6 Sol' },
  { value: 'anthropic/claude-sonnet-4', label: 'Claude Sonnet 4' },
  { value: 'google/gemini-2.5-pro', label: 'Gemini 2.5 Pro' },
];

/* ═══════════════════════════════════════════════════════
   LANDING PAGE COMPONENTS
═══════════════════════════════════════════════════════ */

/* ── Navigation ── */
interface NavigationProps {
  view: 'landing' | 'chat' | 'assets';
  setView: (v: 'landing' | 'chat' | 'assets') => void;
  theme: 'light' | 'dark';
  setTheme: (fn: (t: 'light' | 'dark') => 'light' | 'dark') => void;
  isLight: boolean;
  healthStatus: string;
  sessions: ChatSession[];
  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean) => void;
  onShowSettings: () => void;
}
function Navigation({ view, setView, theme, setTheme, isLight, healthStatus, sessions, sidebarOpen, setSidebarOpen, onShowSettings }: NavigationProps) {
  const navItems = [
    { id: 'landing' as const, label: 'Home' },
    { id: 'chat' as const, label: 'Generate' },
    { id: 'assets' as const, label: 'Assets' },
  ];
  return (
    <header className={`sticky top-0 z-50 w-full border-b ${isLight ? 'border-black/8 bg-white/85 backdrop-blur-md' : 'border-white/8 bg-[#0D0D0F]/90 backdrop-blur-md'}`}>
      <div className="flex h-14 items-center justify-between px-4 max-w-[1600px] mx-auto">
        <div className="flex items-center gap-4">
          {view === 'chat' && (
            <button type="button" onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`lg:hidden flex h-9 w-9 items-center justify-center rounded-xl transition ${isLight ? 'text-slate-600 hover:bg-black/6' : 'text-slate-300 hover:bg-white/8'}`}>
              <Menu size={18} />
            </button>
          )}
          <button type="button" onClick={() => setView('landing')} className={`flex items-center gap-2.5 font-bold text-lg tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 shadow-md shadow-blue-500/30">
              <Film size={16} className="text-white" />
            </div>
            <span>Director OS</span>
          </button>
          <div className={`hidden lg:flex items-center gap-0.5 rounded-xl border p-1 ${isLight ? 'border-black/8 bg-black/3' : 'border-white/8 bg-white/3'}`}>
            {navItems.map(item => (
              <button key={item.id} type="button" onClick={() => setView(item.id)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-150
                  ${view === item.id
                    ? isLight ? 'bg-white text-slate-900 shadow-sm' : 'bg-white/12 text-white shadow-sm'
                    : isLight ? 'text-slate-500 hover:text-slate-800 hover:bg-black/4' : 'text-slate-400 hover:text-slate-100 hover:bg-white/6'}`}>
                {item.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {sessions.length > 0 && (
            <span className={`hidden md:block text-[11px] font-medium ${isLight ? 'text-slate-400' : 'text-slate-600'}`}>
              {sessions.length} session{sessions.length !== 1 ? 's' : ''}
            </span>
          )}
          <div className={`hidden sm:flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold ${
            healthStatus.includes('Online')
              ? 'border-emerald-500/25 bg-emerald-500/8 text-emerald-400'
              : 'border-rose-500/25 bg-rose-500/8 text-rose-400'
          }`}>
            <span className={`h-1.5 w-1.5 rounded-full ${healthStatus.includes('Online') ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
            {healthStatus}
          </div>
          <button type="button" onClick={onShowSettings}
            className={`flex h-9 w-9 items-center justify-center rounded-xl transition ${isLight ? 'text-slate-500 hover:bg-black/6' : 'text-slate-400 hover:bg-white/8'}`}>
            <Settings size={16} />
          </button>
          <button type="button" onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
            className={`flex h-9 w-9 items-center justify-center rounded-xl transition ${isLight ? 'text-slate-600 hover:bg-black/6' : 'text-slate-300 hover:bg-white/8'}`}>
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          </button>
        </div>
      </div>
    </header>
  );
}

/* ── Prompt Composer (Landing) ── */
interface PromptComposerProps {
  prompt: string; setPrompt: (v: string) => void; onSend: () => void; isLight: boolean;
  generateMode: 'Brief' | 'Image' | 'Video'; setGenerateMode: (m: 'Brief' | 'Image' | 'Video') => void;
}
function PromptComposer({ prompt, setPrompt, onSend, isLight, generateMode, setGenerateMode }: PromptComposerProps) {
  const suggestions = [
    'create a cinematic product ad', 'design character concept art',
    'write a story brief for sci-fi', 'generate consistent character poses',
    'storyboard a luxury brand video', 'produce UGC-style testimonial',
    'compare top video AI models', 'build a full brand visual kit',
  ];
  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onSend(); } };
  return (
    <div className="w-full max-w-3xl mx-auto mt-10 relative z-10">
      <div className={`border rounded-t-2xl p-4 shadow-2xl relative transition-colors focus-within:border-white/25 ${isLight ? 'bg-white/60 border-black/10 backdrop-blur-md' : 'bg-[#1A1A1D]/90 border-white/10 backdrop-blur-md'}`}>
        <div className="flex gap-3">
          <textarea
            value={prompt}
            onChange={e => { setPrompt(e.target.value); e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 180) + 'px'; }}
            onKeyDown={handleKey} rows={2}
            placeholder="What should we create today?"
            className={`flex-1 bg-transparent text-base resize-none outline-none placeholder:opacity-40 min-h-[64px] font-medium ${isLight ? 'text-slate-900 placeholder:text-slate-400' : 'text-white placeholder:text-slate-500'}`}
          />
          <button type="button" onClick={onSend} disabled={!prompt.trim()}
            className="h-11 w-11 shrink-0 self-end mb-1 flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 text-white shadow-lg shadow-blue-500/30 transition duration-200 hover:scale-105 disabled:opacity-40 disabled:hover:scale-100">
            <Send size={18} />
          </button>
        </div>
        <div className={`flex items-center justify-between mt-3 pt-3 border-t ${isLight ? 'border-black/6' : 'border-white/6'}`}>
          <div className={`flex items-center gap-1 rounded-xl p-1 ${isLight ? 'bg-black/5' : 'bg-white/5'}`}>
            {(['Brief', 'Image', 'Video'] as const).map(m => (
              <button key={m} type="button" onClick={() => setGenerateMode(m)}
                className={`flex h-7 px-3 items-center gap-1.5 rounded-lg text-[11px] font-bold tracking-wide transition-all ${
                  generateMode === m
                    ? isLight ? 'bg-white text-slate-900 shadow-sm' : 'bg-white/15 text-white shadow-sm'
                    : isLight ? 'text-slate-500 hover:text-slate-700' : 'text-slate-400 hover:text-white'}`}>
                {m === 'Brief' && <Type size={11} />}
                {m === 'Image' && <Wand2 size={11} />}
                {m === 'Video' && <Film size={11} />}
                {m}
              </button>
            ))}
          </div>
          <span className={`text-[9px] font-semibold uppercase tracking-widest ${isLight ? 'text-slate-400' : 'text-slate-600'}`}>
            Powered by Atlas Cloud
          </span>
        </div>
      </div>
      <div className={`border border-t-0 rounded-b-2xl px-3 py-2.5 overflow-hidden ${isLight ? 'bg-white/40 border-black/8 backdrop-blur-md' : 'bg-[#141416]/90 border-white/8 backdrop-blur-md'}`}>
        <div className="flex overflow-x-auto gap-2 pb-0.5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          style={{ maskImage: 'linear-gradient(to right, transparent, black 12px, black calc(100% - 12px), transparent)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 12px, black calc(100% - 12px), transparent)' }}>
          {suggestions.map((s, i) => (
            <button key={i} type="button" onClick={() => setPrompt(s)}
              className={`whitespace-nowrap text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all border ${
                isLight ? 'bg-black/5 hover:bg-black/8 text-slate-600 border-transparent' : 'bg-white/6 hover:bg-white/10 text-slate-300 border-transparent hover:border-white/10'}`}>
              {s}
              <ArrowRight size={11} className="opacity-40 shrink-0" />
            </button>
          ))}
        </div>
      </div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-600/15 to-cyan-600/15 blur-3xl opacity-60 rounded-full pointer-events-none transform translate-y-8" />
    </div>
  );
}

/* ── Hero Section ── */
interface HeroProps {
  prompt: string; setPrompt: (v: string) => void; onSend: () => void; isLight: boolean;
  generateMode: 'Brief' | 'Image' | 'Video'; setGenerateMode: (m: 'Brief' | 'Image' | 'Video') => void;
}
function HeroSection({ prompt, setPrompt, onSend, isLight, generateMode, setGenerateMode }: HeroProps) {
  return (
    <section className="relative pt-20 pb-16 px-4 flex flex-col items-center text-center overflow-hidden">
      <div className="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />
      <div className="absolute right-1/4 top-20 h-80 w-80 rounded-full bg-violet-600/8 blur-3xl pointer-events-none" />
      <div className="relative z-10 mb-6 flex items-center justify-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 shadow-xl shadow-blue-500/30">
          <Film size={24} className="text-white" />
        </div>
        <span className={`text-2xl font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>Director OS</span>
        <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${isLight ? 'border-blue-300/50 text-blue-500 bg-blue-50' : 'border-blue-500/30 text-blue-400 bg-blue-500/10'}`}>v2.1</span>
      </div>
      <h1 className={`relative z-10 text-4xl sm:text-5xl lg:text-[62px] font-semibold leading-[1.1] tracking-[-0.025em] max-w-4xl mb-6 ${isLight ? 'text-slate-900' : 'text-white'}`}>
        Your AI creative director<br className="hidden sm:block" />
        <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent"> for cinematic production.</span>
      </h1>
      <p className={`relative z-10 text-lg sm:text-xl font-medium tracking-[-0.01em] max-w-2xl mb-10 ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
        One agent for your whole production pipeline — from first concept to final delivery.
      </p>
      <PromptComposer prompt={prompt} setPrompt={setPrompt} onSend={onSend} isLight={isLight} generateMode={generateMode} setGenerateMode={setGenerateMode} />
    </section>
  );
}

/* ── Features Section ── */
function FeaturesSection({ isLight }: { isLight: boolean }) {
  const [activeTab, setActiveTab] = useState('memory');
  const tabs = [
    { id: 'memory', label: 'Memory' }, { id: 'skills', label: 'Skills' },
    { id: 'scale', label: 'Scale' }, { id: 'consistency', label: 'Consistency' },
    { id: 'multimodal', label: 'Multi-modal' },
  ];
  const content: Record<string, { title: string; desc: string; points: { icon: React.ReactNode; text: string }[] }> = {
    memory: { title: 'Persistent memory and context', desc: 'Start a new session, not a new project.',
      points: [
        { icon: <FolderOpen size={16} />, text: 'References, decisions, and rejected takes stay attached to the project.' },
        { icon: <RotateCcw size={16} />, text: 'Pick a project back up weeks later with context fully intact.' },
        { icon: <Layers size={16} />, text: 'Memory is scoped per session so work stays cleanly separated.' },
      ] },
    skills: { title: 'Stackable cinematic skills', desc: 'Guided creative templates, pre-built by expert cinematographers.',
      points: [
        { icon: <Layers size={16} />, text: 'Skills encode the style guidelines a good cinematic result needs.' },
        { icon: <FilePlus size={16} />, text: 'Add your own so output follows your chosen visual language by default.' },
        { icon: <Wand2 size={16} />, text: 'Stack them: a look, a format, and a delivery spec in one run.' },
      ] },
    scale: { title: 'Scalable from solo creators to full production teams', desc: 'The same session model for one person or multiple users.',
      points: [
        { icon: <Users size={16} />, text: 'Share projects, skills, and references across a workspace.' },
        { icon: <Layers size={16} />, text: 'Queue and batch generation when volume climbs.' },
        { icon: <FolderOpen size={16} />, text: 'Manage multiple end-to-end workflows simultaneously.' },
      ] },
    consistency: { title: 'Character and style consistency', desc: 'Keep characters, brand look, and color grading consistent across every frame.',
      points: [
        { icon: <ImageIcon size={16} />, text: 'Anti-jump-cut rules ensure seamless multi-clip transitions.' },
        { icon: <Film size={16} />, text: 'Character sheets generated once, referenced in every scene.' },
        { icon: <Sparkles size={16} />, text: 'Style references locked in and applied automatically to every output.' },
      ] },
    multimodal: { title: 'Multi-modal generation pipeline', desc: 'Text briefs, images, and videos in one unified workflow.',
      points: [
        { icon: <Type size={16} />, text: 'Brief mode: AI director writes complete creative briefs from your idea.' },
        { icon: <ImageIcon size={16} />, text: 'Image mode: 176+ image models via Atlas Cloud API.' },
        { icon: <Film size={16} />, text: 'Video mode: cinematic clips generated from text or image references.' },
      ] },
  };
  const active = content[activeTab] || content.memory;
  return (
    <section className={`py-24 px-4 w-full max-w-5xl mx-auto border-t ${isLight ? 'border-black/5' : 'border-white/5'}`}>
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
        <div className="lg:w-1/3">
          <h2 className={`text-3xl font-semibold mb-4 tracking-[-0.02em] ${isLight ? 'text-slate-900' : 'text-white'}`}>Create with context</h2>
          <p className={`text-sm leading-relaxed ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
            Generate consistent assets, render characters that hold across every scene, and maintain style fidelity across every model and modality.
          </p>
        </div>
        <div className="lg:w-2/3 flex flex-col md:flex-row gap-8">
          <div className={`flex md:flex-col overflow-x-auto md:overflow-visible gap-1 border rounded-xl p-1 md:w-44 shrink-0 self-start [&::-webkit-scrollbar]:hidden ${isLight ? 'border-black/8 bg-black/3' : 'border-white/8 bg-white/3'}`}>
            {tabs.map(tab => (
              <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 text-xs font-semibold rounded-lg text-left whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? isLight ? 'bg-white text-slate-900 shadow-sm' : 'bg-white/12 text-white'
                    : isLight ? 'text-slate-500 hover:text-slate-700' : 'text-gray-500 hover:text-gray-300'}`}>
                {tab.label}
              </button>
            ))}
          </div>
          <div className="flex-1 min-h-[240px]">
            <h3 className={`text-xl font-medium mb-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>{active.title}</h3>
            <p className={`text-sm mb-8 ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>{active.desc}</p>
            <ul className="space-y-4">
              {active.points.map((point, idx) => (
                <li key={idx} className="flex items-start gap-4">
                  <div className="mt-0.5 bg-blue-500/15 text-blue-400 p-1.5 rounded-lg border border-blue-500/25 shrink-0">{point.icon}</div>
                  <span className={`text-sm leading-snug ${isLight ? 'text-slate-600' : 'text-gray-300'}`}>{point.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Use Case Card ── */
function UseCaseCard({ type, tag, steps, models, cost, title, prompt, isLight, onClick }:
  { type: 'character'|'campaign'|'film'; tag: string; steps: string; models: string; cost: string;
    title: string; prompt: string; isLight: boolean; onClick: () => void; }) {
  const tagColors: Record<string, string> = {
    Character: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    Brand: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
    Film: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  };
  return (
    <div className={`rounded-2xl border overflow-hidden flex flex-col group transition-all duration-200 hover:-translate-y-1 cursor-pointer
      ${isLight ? 'bg-white border-black/8 hover:border-black/15 hover:shadow-xl' : 'bg-[#141416] border-white/8 hover:border-white/16 hover:shadow-xl hover:shadow-black/30'}`}
      onClick={onClick}>
      <div className={`aspect-video relative flex items-center justify-center overflow-hidden ${isLight ? 'bg-slate-100' : 'bg-[#1C1C1E]'}`}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10" />
        {type === 'character' && (
          <div className="grid grid-cols-3 gap-2 w-full h-full p-4 opacity-25 z-0">
            {[1,2,3,4,5,6].map(i => <div key={i} className={`rounded-lg ${isLight ? 'bg-slate-300' : 'bg-gray-700'}`} />)}
          </div>
        )}
        {type === 'campaign' && (
          <div className="flex gap-2 w-full h-full p-4 opacity-25 z-0">
            <div className={`w-1/3 rounded-lg ${isLight ? 'bg-slate-300' : 'bg-gray-800'}`} />
            <div className={`w-2/3 rounded-lg ${isLight ? 'bg-slate-200' : 'bg-gray-700'}`} />
          </div>
        )}
        {type === 'film' && (
          <div className="flex items-center justify-center opacity-15 z-0">
            <Film size={64} className={isLight ? 'text-slate-400' : 'text-gray-500'} />
          </div>
        )}
        <span className={`absolute top-3 left-3 z-20 inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${tagColors[tag] || tagColors.Film}`}>{tag}</span>
        <span className={`absolute top-3 right-3 z-20 text-[10px] font-medium ${isLight ? 'text-slate-500' : 'text-gray-500'}`}>{steps} steps · ${cost}</span>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className={`text-base font-medium mb-3 ${isLight ? 'text-slate-900' : 'text-white'}`}>{title}</h3>
        <div className={`rounded-lg p-3 text-[11px] leading-relaxed font-mono border mb-4 line-clamp-3 ${isLight ? 'bg-slate-50 text-slate-500 border-slate-200' : 'bg-black/30 text-gray-400 border-white/5'}`}>{prompt}</div>
        <div className={`mt-auto pt-4 flex items-center justify-end border-t ${isLight ? 'border-slate-100' : 'border-white/5'}`}>
          <button type="button" className={`flex items-center gap-1 text-[11px] font-medium transition-colors ${isLight ? 'text-blue-500 hover:text-blue-600' : 'text-cyan-400 hover:text-cyan-300'}`}>
            Try this example <ArrowRight size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Gallery Section ── */
function GallerySection({ isLight, onCreateSession }: { isLight: boolean; onCreateSession: (p: string, m: 'Home'|'Image'|'Video') => void }) {
  const cases = [
    { type: 'character' as const, tag: 'Character', steps: '4', models: '6', cost: '4.86',
      title: 'Six poses of one character, from a single photo',
      prompt: "Here's one photo of my character. Build a six-pose reference sheet: front, three-quarter, profile, back, seated, mid-action. Keep the face, wardrobe, and lighting identical across all six...",
      mode: 'Image' as const },
    { type: 'campaign' as const, tag: 'Brand', steps: '4', models: '6', cost: '4.86',
      title: 'A product, a vision, and a campaign',
      prompt: "Brand campaign for our new collection. Cold, flat light, big grain, shot on film. Lock it for everything. 12 shots, mixed crops, consistent color grade across all assets...",
      mode: 'Image' as const },
    { type: 'film' as const, tag: 'Film', steps: '4', models: '6', cost: '4.86',
      title: 'A cinematic scene from two keyframes',
      prompt: "30-second scene for a heritage brand. Two keyframes: the product detail and the craftsman deep in creative flow. Board the in-between beats, maintain consistent atmosphere...",
      mode: 'Video' as const },
  ];
  return (
    <section className={`py-24 px-4 w-full max-w-6xl mx-auto border-t ${isLight ? 'border-black/5' : 'border-white/5'}`}>
      <div className="text-center mb-16">
        <h2 className={`text-3xl font-semibold mb-4 tracking-[-0.02em] ${isLight ? 'text-slate-900' : 'text-white'}`}>From concept to finished frame</h2>
        <p className={`text-sm max-w-xl mx-auto ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
          Bring the reference you already have in mind and iterate to final vision.
        </p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cases.map((c, i) => (
          <UseCaseCard key={i} {...c} isLight={isLight} onClick={() => onCreateSession(c.prompt, c.mode)} />
        ))}
      </div>
    </section>
  );
}

/* ── Footer ── */
function Footer({ isLight }: { isLight: boolean }) {
  const lc = `text-sm transition-colors ${isLight ? 'text-slate-400 hover:text-slate-700' : 'text-gray-500 hover:text-gray-300'}`;
  return (
    <footer className={`border-t pt-16 pb-8 px-4 mt-8 ${isLight ? 'border-black/8 bg-slate-50' : 'border-white/8 bg-[#0A0A0C]'}`}>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-16">
          <div className="col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400">
                <Film size={16} className="text-white" />
              </div>
              <span className={`text-lg font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>Director OS</span>
            </div>
            <p className={`text-sm mb-6 leading-relaxed ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>Build cinematic visuals with the fastest AI production platform.</p>
          </div>
          <div>
            <h4 className={`font-semibold text-sm mb-4 ${isLight ? 'text-slate-700' : 'text-white'}`}>Image Models</h4>
            <ul className="space-y-2">
              <li><a href="#" className={lc}>GPT Image 2</a></li>
              <li><a href="#" className={lc}>FLUX Ultra</a></li>
              <li><a href="#" className={lc}>Ideogram 4</a></li>
              <li><a href="#" className={lc}>Explore More</a></li>
            </ul>
          </div>
          <div>
            <h4 className={`font-semibold text-sm mb-4 ${isLight ? 'text-slate-700' : 'text-white'}`}>Video Models</h4>
            <ul className="space-y-2">
              <li><a href="#" className={lc}>Seedance 2.5</a></li>
              <li><a href="#" className={lc}>Kling 3.0</a></li>
              <li><a href="#" className={lc}>Veo 3.1</a></li>
              <li><a href="#" className={lc}>Wan Video</a></li>
            </ul>
          </div>
          <div>
            <h4 className={`font-semibold text-sm mb-4 ${isLight ? 'text-slate-700' : 'text-white'}`}>Platform</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-cyan-500 hover:text-cyan-400">Director OS</a></li>
              <li><a href="#" className={lc}>Atlas Cloud</a></li>
              <li><a href="#" className={lc}>Documentation</a></li>
              <li><a href="#" className={lc}>API Reference</a></li>
            </ul>
          </div>
        </div>
        <div className={`border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs ${isLight ? 'border-black/6 text-slate-400' : 'border-white/6 text-gray-600'}`}>
          <p>Director OS, 2026. All Rights Reserved.</p>
          <div className="flex gap-6">
            <a href="#" className={`transition-colors ${isLight ? 'hover:text-slate-600' : 'hover:text-gray-400'}`}>Terms of Service</a>
            <a href="#" className={`transition-colors ${isLight ? 'hover:text-slate-600' : 'hover:text-gray-400'}`}>Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN APP
═══════════════════════════════════════════════════════ */
function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() =>
    (localStorage.getItem('director_theme') as 'light' | 'dark') || 'dark'
  );
  const isLight = theme === 'light';
  const [view, setView] = useState<'landing' | 'chat' | 'assets'>('landing');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [healthStatus, setHealthStatus] = useState('Connecting…');
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    try {
      const s = localStorage.getItem('chat_sessions');
      if (s) { const parsed = JSON.parse(s); return parsed.length > 0 ? parsed : [DEMO_SESSION]; }
      return [DEMO_SESSION];
    } catch { return [DEMO_SESSION]; }
  });
  useEffect(() => {
    setSessions(prev => { if (prev.find(s => s.id === 'demo-v2')) return prev; return [...prev, DEMO_SESSION]; });
  }, []);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(() => localStorage.getItem('active_session_id'));
  useEffect(() => { localStorage.setItem('chat_sessions', JSON.stringify(sessions)); }, [sessions]);
  useEffect(() => {
    if (activeSessionId) localStorage.setItem('active_session_id', activeSessionId);
    else localStorage.removeItem('active_session_id');
  }, [activeSessionId]);

  const activeSession = sessions.find(s => s.id === activeSessionId);
  const activeMessages = activeSession?.messages ?? [];

  const handleSessionClick = (id: string, tab: string) => {
    setActiveSessionId(id);
    setView('chat');
    if (window.innerWidth < 1024) setSidebarOpen(false);
  };

  const createSession = useCallback((tab: 'Home' | 'Image' | 'Video', initialPrompt?: string): string => {
    const s: ChatSession = {
      id: Date.now().toString(),
      title: initialPrompt ? initialPrompt.substring(0, 32) + (initialPrompt.length > 32 ? '…' : '') : 'New Chat',
      tab,
      messages: [{ id: 'w', role: 'ai', timestamp: new Date().toLocaleTimeString(),
        content: tab === 'Home' ? 'Hello, Director. What are we creating today?'
          : tab === 'Image' ? 'Ready to generate images. Describe your vision.'
          : 'Ready to generate cinematic videos. What is the scene?' }],
      updatedAt: Date.now(),
    };
    setSessions(p => [s, ...p]);
    setActiveSessionId(s.id);
    setView('chat');
    return s.id;
  }, []);

  const updateMsgs = useCallback((fn: (p: ChatMessage[]) => ChatMessage[]) => {
    setSessions(prev => prev.map(s => {
      if (s.id !== activeSessionId) return s;
      const msgs = fn(s.messages);
      let title = s.title;
      if (title === 'New Chat') { const f = msgs.find(m => m.role === 'user'); if (f) title = f.content.substring(0, 32) + (f.content.length > 32 ? '…' : ''); }
      return { ...s, messages: msgs, title, updatedAt: Date.now() };
    }).sort((a, b) => b.updatedAt - a.updatedAt));
  }, [activeSessionId]);

  const deleteSession = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSessions(p => p.filter(s => s.id !== id));
    if (activeSessionId === id) { setActiveSessionId(null); setView('landing'); }
  };

  const [generateMode, setGenerateMode] = useState<'Brief' | 'Image' | 'Video'>('Brief');
  const [prompt, setPrompt] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [generatingSessions, setGeneratingSessions] = useState<Record<string, boolean>>({});
  const isGenerating = activeSessionId ? !!generatingSessions[activeSessionId] : false;
  const [models, setModels] = useState<any[]>([]);
  const [selectedImageModel, setSelectedImageModel] = useState('openai/gpt-image-2/text-to-image');
  const [selectedVideoModel, setSelectedVideoModel] = useState('bytedance/seedance-2.5/text-to-video');
  const [selectedHomeModel, setSelectedHomeModel] = useState('openai/gpt-5.6-sol');
  const [assets, setAssets] = useState<Array<{id: string; type: 'Image'|'Video'; url: string; prompt: string; model: string; modelName: string; ts: string}>>(() => {
    try { const s = localStorage.getItem('director_assets'); return s ? JSON.parse(s) : []; } catch { return []; }
  });
  useEffect(() => { localStorage.setItem('director_assets', JSON.stringify(assets)); }, [assets]);
  const [aspectRatioImg, setAspectRatioImg] = useState('16:9');
  const [aspectRatioVid, setAspectRatioVid] = useState('16:9');
  const [durationVid, setDurationVid] = useState('5s');
  const [numOutputsImg, setNumOutputsImg] = useState<number>(1);
  const [qualityImg, setQualityImg] = useState<number>(80);
  const [negPromptImg, setNegPromptImg] = useState('');
  const [negPromptVid, setNegPromptVid] = useState('');
  const [formatImg, setFormatImg] = useState('webp');
  const [seedImg, setSeedImg] = useState('');
  const [resolution, setResolution] = useState('1080p');
  const [generateAudio, setGenerateAudio] = useState(false);
  const [hd, setHd] = useState(false);
  const [stylize, setStylize] = useState(0);
  const [motion, setMotion] = useState('low');
  const [chaos, setChaos] = useState(0);
  const [weird, setWeird] = useState(0);
  const [sref, setSref] = useState('');
  const [watermark, setWatermark] = useState(false);
  const [returnLastFrame, setReturnLastFrame] = useState(false);
  const [thinkingLevel, setThinkingLevel] = useState('default');
  const [mediaResolution, setMediaResolution] = useState('default');
  const [refFiles, setRefFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const feedEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { document.documentElement.setAttribute('data-theme', theme); localStorage.setItem('director_theme', theme); }, [theme]);
  useEffect(() => { feedEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [activeMessages]);
  useEffect(() => {
    axios.get(`${API_BASE}/api/health`).then(() => setHealthStatus('System: Online')).catch(() => setHealthStatus('System: Offline'));
    axios.get(`${API_BASE}/api/atlas/models`).then(res => {
      setModels(res.data.models);
      if (!res.data.models.some((m: any) => m.id === 'openai/gpt-image-2/text-to-image')) {
        const fi = res.data.models.find((m: any) => m.type === 'Image'); if (fi) setSelectedImageModel(fi.id);
      }
      if (!res.data.models.some((m: any) => m.id === 'bytedance/seedance-2.5/text-to-video')) {
        const fv = res.data.models.find((m: any) => m.type === 'Video'); if (fv) setSelectedVideoModel(fv.id);
      }
    }).catch(err => console.error('Failed to load models', err));
  }, []);
  useEffect(() => {
    const mdl = models.find((m: any) => m.id === selectedImageModel || m.id === selectedVideoModel);
    if (!mdl) return;
    const prov = mdl.provider || '';
    if (prov === 'MiniMax') setResolution('2K');
    else if (prov === 'Wan' && mdl.type === 'Image') setResolution('1K');
    else if (prov === 'Google' && mdl.type === 'Image') setResolution('1k');
    else setResolution('1080p');
  }, [selectedImageModel, selectedVideoModel]);

  const modelLabel = (id: string) => HOME_MODELS.find(m => m.value === id)?.label || id.split('/').pop() || id;
  const handleKeyDown = (e: React.KeyboardEvent, fn: () => void) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); fn(); } };

  const handleSendHome = async (overrideSessionId?: string) => {
    if (!prompt.trim() && refFiles.length === 0) return;
    let sid = overrideSessionId || activeSessionId;
    if (!sid) { sid = createSession('Home'); }
    setActiveSessionId(sid);
    const up = prompt.trim(); setPrompt('');
    const tid = sid!;
    updateMsgs(p => [...p, {
      id: Date.now().toString(), role: 'user',
      content: up || (refFiles.length > 0 ? 'Sent reference files.' : ''),
      imageUrl: refFiles.length > 0 && refFiles[0].type.startsWith('image') ? URL.createObjectURL(refFiles[0]) : undefined,
      timestamp: new Date().toLocaleTimeString(),
    }]);
    setGeneratingSessions(p => ({ ...p, [tid]: true }));
    try {
      const fd = new FormData();
      fd.append('prompt', up); fd.append('model', selectedHomeModel);
      fd.append('history', JSON.stringify(activeSession?.messages.map(m => ({ role: m.role, content: m.content })) ?? []));
      if (refFiles[0]) fd.append('reference_image', refFiles[0]);
      const res = await axios.post(`${API_BASE}/api/chat`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      updateMsgs(p => [...p, { id: (Date.now()+1).toString(), role: 'ai', content: res.data.response, timestamp: new Date().toLocaleTimeString() }]);
      setRefFiles([]);
    } catch (e: any) {
      updateMsgs(p => [...p, { id: (Date.now()+1).toString(), role: 'ai', content: `**Error:** ${e.response?.data?.detail || e.message}`, timestamp: new Date().toLocaleTimeString() }]);
    } finally { setGeneratingSessions(p => ({ ...p, [tid]: false })); }
  };

  const handleSendMedia = async (type: 'Image' | 'Video', overrideSessionId?: string) => {
    const isImg = type === 'Image';
    const up = prompt.trim();
    const model = isImg ? selectedImageModel : selectedVideoModel;
    if (!up || !model) return;
    let sid = overrideSessionId || activeSessionId;
    if (!sid) { sid = createSession(type); }
    setActiveSessionId(sid);
    setPrompt('');
    const mdl = models.find((m: any) => m.id === model);
    const supported: string[] = mdl?.supported_params ?? [];
    const has = (p: string) => supported.includes(p);
    const tid = sid!;
    updateMsgs(p => [...p, {
      id: Date.now().toString(), role: 'user', content: up,
      imageUrl: refFiles.length > 0 && refFiles[0].type.startsWith('image') ? URL.createObjectURL(refFiles[0]) : undefined,
      videoUrl: refFiles.length > 0 && refFiles[0].type.startsWith('video') ? URL.createObjectURL(refFiles[0]) : undefined,
      timestamp: new Date().toLocaleTimeString(),
    }]);
    setGeneratingSessions(p => ({ ...p, [tid]: true }));
    try {
      const fd = new FormData();
      fd.append('type', type); fd.append('prompt', up); fd.append('model_keyword', model);
      const ar = isImg ? aspectRatioImg : aspectRatioVid;
      if (has('aspect_ratio') || has('ratio') || has('size')) fd.append('aspect_ratio', ar);
      if (!isImg && has('duration')) fd.append('duration', durationVid);
      const negP = isImg ? negPromptImg : negPromptVid;
      if (has('negative_prompt') && negP.trim()) fd.append('negative_prompt', negP.trim());
      if (has('seed') && seedImg) fd.append('seed', seedImg);
      if (has('resolution') && resolution) fd.append('resolution', resolution);
      if (has('num_outputs') && numOutputsImg > 1) fd.append('num_outputs', numOutputsImg.toString());
      if (has('output_format') && formatImg !== 'webp') fd.append('output_format', formatImg);
      if ((has('quality') || has('quality_mj') || has('output_quality')) && qualityImg !== 80) fd.append('output_quality', qualityImg.toString());
      if (has('hd') && hd) fd.append('hd', String(hd));
      if (has('stylize') && stylize !== 0) fd.append('stylize', String(stylize));
      if (has('motion') && motion) fd.append('motion', motion);
      if (has('chaos') && chaos !== 0) fd.append('chaos', String(chaos));
      if (has('weird') && weird !== 0) fd.append('weird', String(weird));
      if (has('sref') && sref) fd.append('sref', sref);
      if (has('thinking_level') && thinkingLevel !== 'default') fd.append('thinking_level', thinkingLevel);
      if (has('media_resolution') && mediaResolution !== 'default') fd.append('media_resolution', mediaResolution);
      if (has('generate_audio') || has('sound')) fd.append('generate_audio', String(generateAudio));
      if (has('watermark') && watermark) fd.append('watermark', String(watermark));
      if (has('return_last_frame') && returnLastFrame) fd.append('return_last_frame', String(returnLastFrame));
      if (refFiles[0] && mdl?.supports_image) fd.append('reference_file', refFiles[0]);
      if (refFiles[1] && mdl?.supports_image) fd.append('reference_file_2', refFiles[1]);
      const res = await axios.post(`${API_BASE}/api/atlas/generate`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      const predId = res.data.prediction_id;
      const modelName = res.data.model_name || mdl?.name || model;
      setRefFiles([]);
      updateMsgs(p => [...p, { id: (Date.now()+1).toString(), role: 'ai',
        content: `**Generating ${type}...**\n*Model: ${modelName}*\n\nID: \`${predId}\`\nPolling for result...`,
        timestamp: new Date().toLocaleTimeString() }]);
      let attempts = 0;
      const pollInterval = setInterval(async () => {
        attempts++;
        try {
          const statusRes = await axios.get(`${API_BASE}/api/atlas/status/${predId}`);
          const { status, output } = statusRes.data;
          const outputUrl: string | null = Array.isArray(output) ? (output.length > 0 ? output[0] : null) : (output || null);
          if (status === 'completed' || status === 'succeeded' || outputUrl) {
            clearInterval(pollInterval);
            setGeneratingSessions(p => ({ ...p, [tid]: false }));
            if (outputUrl) {
              setAssets(prev => [{ id: predId, type: type as 'Image'|'Video', url: outputUrl, prompt: up, model, modelName, ts: new Date().toLocaleTimeString() }, ...prev]);
              updateMsgs(p => [...p, { id: (Date.now()+2).toString(), role: 'ai', content: `✅ **${type} ready!** Check the Assets tab.`, timestamp: new Date().toLocaleTimeString() }]);
            } else {
              updateMsgs(p => [...p, { id: (Date.now()+2).toString(), role: 'ai', content: `✅ **${type} submitted.** No output URL returned.`, timestamp: new Date().toLocaleTimeString() }]);
            }
          } else if (status === 'failed' || status === 'error') {
            clearInterval(pollInterval); setGeneratingSessions(p => ({ ...p, [tid]: false }));
            updateMsgs(p => [...p, { id: (Date.now()+2).toString(), role: 'ai', content: `❌ **Generation failed.** Status: ${status}`, timestamp: new Date().toLocaleTimeString() }]);
          } else if (attempts >= 60) {
            clearInterval(pollInterval); setGeneratingSessions(p => ({ ...p, [tid]: false }));
            updateMsgs(p => [...p, { id: (Date.now()+2).toString(), role: 'ai', content: `⏳ **Generation timed out.** ID: \`${predId}\``, timestamp: new Date().toLocaleTimeString() }]);
          }
        } catch { /* keep polling */ }
      }, 5000);
    } catch (e: any) {
      const detail = e.response?.data?.detail || e.message;
      updateMsgs(p => [...p, { id: (Date.now()+1).toString(), role: 'ai', content: `❌ **Error:** ${detail}`, timestamp: new Date().toLocaleTimeString() }]);
      setGeneratingSessions(p => ({ ...p, [tid]: false }));
    }
  };

  const handleLandingSend = () => {
    if (!prompt.trim()) return;
    const tab = generateMode === 'Brief' ? 'Home' : generateMode;
    const sid = createSession(tab as 'Home'|'Image'|'Video', prompt);
    setActiveSessionId(sid);
    setView('chat');
    // Slight delay to let the session state settle before sending
    setTimeout(() => {
      if (generateMode === 'Brief') handleSendHome(sid);
      else handleSendMedia(generateMode, sid);
    }, 100);
  };

  const handleUseCaseClick = (useCasePrompt: string, mode: 'Home'|'Image'|'Video') => {
    setPrompt(useCasePrompt);
    setGenerateMode(mode === 'Home' ? 'Brief' : mode as 'Image'|'Video');
    setView('chat');
    const sid = createSession(mode, useCasePrompt);
    setActiveSessionId(sid);
  };

  const chatTab: TabKey = activeSession?.tab === 'Image' ? 'Image' : activeSession?.tab === 'Video' ? 'Video' : 'Home';
  const chatCfg = TAB_CFG[chatTab];

  return (
    <div className={`min-h-screen ${isLight ? 'bg-slate-50 text-slate-900' : 'bg-[#0D0D0F] text-white'} font-sans selection:bg-blue-500/30`}>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-slide { animation: fadeSlideIn 0.28s ease-out both; }
      ` }} />

      <Navigation
        view={view} setView={setView} theme={theme} setTheme={setTheme} isLight={isLight}
        healthStatus={healthStatus} sessions={sessions} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}
        onShowSettings={() => setShowSettings(true)}
      />

      {/* ══ LANDING ══ */}
      {view === 'landing' && (
        <main className="animate-fade-slide">
          <HeroSection prompt={prompt} setPrompt={setPrompt} onSend={handleLandingSend} isLight={isLight} generateMode={generateMode} setGenerateMode={setGenerateMode} />
          <FeaturesSection isLight={isLight} />
          <GallerySection isLight={isLight} onCreateSession={handleUseCaseClick} />
          <Footer isLight={isLight} />
        </main>
      )}

      {/* ══ CHAT ══ */}
      {view === 'chat' && (
        <div className="flex h-[calc(100vh-56px)] relative animate-fade-slide">
          {/* Mobile overlay */}
          {sidebarOpen && (
            <div className="absolute inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
          )}

          {/* Sidebar */}
          <aside className={`absolute inset-y-0 left-0 z-50 flex w-[260px] shrink-0 flex-col border-r transition-transform duration-300 ease-out
            lg:relative lg:translate-x-0
            ${isLight ? 'bg-white/90 border-black/8 backdrop-blur-md' : 'bg-[#111113]/95 border-white/8 backdrop-blur-md'}
            ${sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}>
            <div className="p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-bold uppercase tracking-[0.2em] ${isLight ? 'text-slate-400' : 'text-slate-600'}`}>Sessions</span>
                <button type="button" onClick={() => setSidebarOpen(false)} className={`lg:hidden h-7 w-7 flex items-center justify-center rounded-lg ${isLight ? 'hover:bg-black/5' : 'hover:bg-white/8'}`}><X size={14} /></button>
              </div>
              <button type="button"
                onClick={() => { createSession(chatTab === 'Home' ? 'Home' : chatTab as 'Image'|'Video'); if (window.innerWidth < 1024) setSidebarOpen(false); }}
                className={`flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r ${chatCfg.grad} px-3 py-2.5 text-sm font-bold text-white shadow-lg ${chatCfg.shadow} transition hover:-translate-y-0.5`}>
                <Plus size={14} /> New Chat
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-3 flex flex-col gap-0.5 min-h-0 pb-4">
              {sessions.map(s => {
                const sc = TAB_CFG[s.tab as TabKey];
                return (
                  <button key={s.id} type="button" onClick={() => handleSessionClick(s.id, s.tab)}
                    className={`group flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-xs font-medium transition-all
                      ${activeSessionId === s.id
                        ? isLight ? `bg-blue-50 ${sc.accentL}` : `bg-white/10 ${sc.accent}`
                        : isLight ? 'text-slate-600 hover:bg-black/5' : 'text-slate-400 hover:bg-white/6'}`}>
                    <span className="shrink-0">
                      {s.tab === 'Image' ? <ImageIcon size={12} /> : s.tab === 'Video' ? <Video size={12} /> : <Home size={12} />}
                    </span>
                    <span className="flex-1 truncate">{s.title}</span>
                    <span onClick={e => deleteSession(e, s.id)} className={`shrink-0 p-1 rounded opacity-0 group-hover:opacity-100 transition ${isLight ? 'hover:text-red-500' : 'hover:text-red-400'}`}>
                      <Trash2 size={10} />
                    </span>
                  </button>
                );
              })}
              {sessions.length === 0 && (
                <p className={`px-3 py-2 text-xs italic ${isLight ? 'text-slate-400' : 'text-slate-600'}`}>No sessions yet.</p>
              )}
            </div>
            <div className={`p-4 border-t ${isLight ? 'border-black/6' : 'border-white/6'}`}>
              <button type="button" onClick={() => setView('landing')}
                className={`w-full flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium transition ${isLight ? 'text-slate-500 hover:bg-black/5' : 'text-slate-500 hover:bg-white/6'}`}>
                <Home size={12} /> Back to Home
              </button>
            </div>
          </aside>

          {/* Chat canvas */}
          <div className="flex-1 flex flex-col min-w-0 relative">
            <div className={`pointer-events-none absolute left-1/4 top-10 h-64 w-64 rounded-full blur-3xl opacity-15 ${chatCfg.orb1}`} />
            <div className={`pointer-events-none absolute right-1/4 bottom-20 h-64 w-64 rounded-full blur-3xl opacity-10 ${chatCfg.orb2}`} />

            <div className="flex-1 overflow-y-auto px-4 py-8 relative z-10">
              <div className="mx-auto max-w-3xl flex flex-col gap-5">
                {!activeSessionId && (
                  <div className="flex flex-col items-center justify-center py-24 text-center">
                    <div className={`mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br ${chatCfg.grad} shadow-lg ${chatCfg.shadow}`}>
                      <Sparkles size={28} className="text-white" />
                    </div>
                    <h2 className={`text-2xl font-semibold mb-3 ${isLight ? 'text-slate-800' : 'text-white'}`}>Start a new session</h2>
                    <p className={`text-sm mb-6 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Type a prompt below or create a new chat from the sidebar.</p>
                  </div>
                )}
                {activeMessages.map(msg => (
                  <div key={msg.id} className={`message-shell max-w-[85%] rounded-[22px] px-5 py-4
                    ${msg.role === 'user' ? 'ml-auto glass-msg-user' : 'glass-msg-ai mr-auto'}`}>
                    {msg.role === 'ai' && (
                      <div className={`mb-3 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em] ${isLight ? chatCfg.accentL : chatCfg.accent}`}>
                        <Bot size={11} />
                        {activeSession?.tab === 'Home' ? modelLabel(selectedHomeModel) : `Agent ${activeSession?.tab}`}
                      </div>
                    )}
                    {msg.imageUrl && (
                      <div className="group relative mb-3">
                        <img src={msg.imageUrl} alt="Result" className="max-h-64 w-full rounded-xl object-cover border border-white/10" />
                        <button type="button" onClick={() => { const a = document.createElement('a'); a.href = msg.imageUrl!; a.download = `download-${msg.id}.jpg`; a.click(); }}
                          className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-xl bg-black/60 text-white opacity-0 backdrop-blur-md transition-all group-hover:opacity-100 hover:bg-black/80">
                          <Download size={16} />
                        </button>
                      </div>
                    )}
                    {msg.videoUrl && (
                      <div className="group relative mb-3">
                        <video src={msg.videoUrl} controls className="max-h-80 w-full rounded-xl object-cover" />
                        <button type="button" onClick={() => { const a = document.createElement('a'); a.href = msg.videoUrl!; a.download = `download-${msg.id}.mp4`; a.click(); }}
                          className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-xl bg-black/60 text-white opacity-0 backdrop-blur-md transition-all group-hover:opacity-100 hover:bg-black/80">
                          <Download size={16} />
                        </button>
                      </div>
                    )}
                    <div className={`text-[14px] leading-[1.75] ${isLight ? 'text-slate-800' : 'text-slate-100'}`}>
                      {msg.role === 'ai' ? <MarkdownText text={msg.content} isLight={isLight} /> : <span className="whitespace-pre-wrap">{msg.content}</span>}
                    </div>
                    <div className={`mt-3 text-right text-[10px] ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>{msg.timestamp}</div>
                  </div>
                ))}
                {isGenerating && (
                  <div className="glass-msg-ai max-w-[85%] rounded-[22px] px-5 py-4 mr-auto">
                    <div className={`mb-3 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em] ${isLight ? chatCfg.accentL : chatCfg.accent}`}>
                      <Bot size={11} /> {activeSession?.tab === 'Home' ? modelLabel(selectedHomeModel) : `Agent ${activeSession?.tab}`}
                    </div>
                    <div className="flex items-center gap-3">
                      <TypingDots color={activeSession?.tab === 'Video' ? 'bg-amber-400' : activeSession?.tab === 'Image' ? 'bg-violet-400' : 'bg-cyan-400'} />
                      <span className={`text-[13px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                        {activeSession?.tab === 'Home' ? `${modelLabel(selectedHomeModel)} is thinking…` : 'Processing via Atlas Cloud…'}
                      </span>
                    </div>
                  </div>
                )}
                <div ref={feedEndRef} className="h-4 shrink-0" />
              </div>
            </div>

            {/* Chat Prompt Bar */}
            <div className={`border-t px-4 py-4 relative z-10 ${isLight ? 'border-black/6 bg-white/60 backdrop-blur-md' : 'border-white/6 bg-[#0D0D0F]/80 backdrop-blur-md'}`}>
              <div className="mx-auto max-w-3xl">
                <div className={`border rounded-2xl p-3 transition-colors focus-within:border-white/25 ${isLight ? 'bg-white/80 border-black/10' : 'bg-[#1A1A1D]/80 border-white/10'}`}>
                  {refFiles.length > 0 && (
                    <div className="flex gap-2 mb-2 ml-2">
                      {refFiles.map((file, idx) => (
                        <div key={idx} className="relative group">
                          <img src={file.type.startsWith('image') ? URL.createObjectURL(file) : ''} alt=""
                            className="h-14 w-14 rounded-xl object-cover border border-white/20" />
                          {file.type.startsWith('video') && (
                            <span className="absolute inset-0 flex items-center justify-center text-white bg-black/40 rounded-xl"><Film size={18} /></span>
                          )}
                          <button type="button" onClick={() => setRefFiles(prev => prev.filter((_, i) => i !== idx))}
                            className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-white shadow-md hover:scale-110 transition">
                            <X size={11} strokeWidth={3} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex items-end gap-2">
                    <button type="button" onClick={() => fileInputRef.current?.click()}
                      className={`h-10 w-10 shrink-0 flex items-center justify-center rounded-xl transition ${isLight ? 'text-slate-500 hover:bg-black/5' : 'text-slate-400 hover:bg-white/10'}`}>
                      <Plus size={20} className={refFiles.length > 0 ? 'text-emerald-400' : ''} />
                    </button>
                    <input type="file" multiple accept="image/*,video/*" ref={fileInputRef} className="hidden"
                      onChange={e => { if (e.target.files?.length) setRefFiles(prev => [...prev, ...Array.from(e.target.files!)].slice(0, 4)); }} />
                    <textarea value={prompt}
                      onChange={e => { setPrompt(e.target.value); e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 180) + 'px'; }}
                      onKeyDown={e => handleKeyDown(e, () => { if (generateMode === 'Brief') handleSendHome(); else handleSendMedia(generateMode); })}
                      rows={1} placeholder={generateMode === 'Brief' ? 'Ask anything...' : `Describe the ${generateMode.toLowerCase()} you imagine...`}
                      className={`flex-1 bg-transparent px-2 py-2.5 outline-none resize-none min-h-[40px] max-h-[180px] text-[14px] font-medium placeholder:opacity-40 ${isLight ? 'text-slate-900' : 'text-white'}`}
                    />
                    <button type="button"
                      onClick={() => { if (generateMode === 'Brief') handleSendHome(); else handleSendMedia(generateMode); }}
                      disabled={isGenerating || (!prompt.trim() && refFiles.length === 0)}
                      className={`h-10 w-10 shrink-0 flex items-center justify-center rounded-xl bg-gradient-to-br ${chatCfg.grad} text-white shadow-md ${chatCfg.shadow} transition hover:scale-105 disabled:opacity-40 disabled:hover:scale-100`}>
                      <Send size={16} />
                    </button>
                  </div>
                  <div className={`mt-3 pt-3 flex items-center justify-between border-t ${isLight ? 'border-black/5' : 'border-white/5'}`}>
                    <div className="flex items-center gap-2">
                      <div className={`flex items-center rounded-lg p-0.5 ${isLight ? 'bg-black/5' : 'bg-white/5'}`}>
                        {(['Brief', 'Image', 'Video'] as const).map(m => (
                          <button key={m} type="button" onClick={() => setGenerateMode(m)}
                            className={`flex h-7 px-2.5 items-center gap-1 rounded-md text-[11px] font-bold tracking-wide transition-all ${
                              generateMode === m
                                ? isLight ? 'bg-white text-slate-900 shadow-sm' : 'bg-white/15 text-white shadow-sm'
                                : isLight ? 'text-slate-500 hover:text-slate-700' : 'text-slate-400 hover:text-white'}`}>
                            {m === 'Brief' && <Type size={11} />}
                            {m === 'Image' && <Wand2 size={11} />}
                            {m === 'Video' && <Film size={11} />}
                            {m}
                          </button>
                        ))}
                      </div>
                      {generateMode === 'Brief' ? (
                        <CustomSelect label="Model" isLight={isLight} value={selectedHomeModel} onChange={setSelectedHomeModel} options={HOME_MODELS} accentClass={chatCfg.accent} compact />
                      ) : (
                        <button type="button" onClick={() => setShowSettings(true)}
                          className={`flex h-7 items-center gap-1.5 rounded-lg border px-2.5 transition ${isLight ? 'border-black/8 bg-black/5 text-slate-700 hover:bg-black/8' : 'border-white/8 bg-white/5 text-slate-200 hover:bg-white/10'}`}>
                          <Settings size={12} className="opacity-60" />
                          <span className="text-[11px] font-semibold truncate max-w-[120px]">
                            {models.find(m => m.id === (generateMode === 'Image' ? selectedImageModel : selectedVideoModel))?.name || 'Select Model'}
                          </span>
                        </button>
                      )}
                    </div>
                    <span className={`hidden sm:block text-[9px] font-semibold uppercase tracking-widest ${isLight ? 'text-slate-400' : 'text-slate-600'}`}>Atlas Cloud</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══ ASSETS ══ */}
      {view === 'assets' && (
        <div className="min-h-[calc(100vh-56px)] p-6 md:p-10 animate-fade-slide">
          <div className="mx-auto max-w-5xl">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <p className={`mb-1 text-[10px] font-bold uppercase tracking-[0.22em] text-teal-400`}>Library</p>
                <h1 className={`text-3xl font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>Asset Library</h1>
                <p className={`mt-1.5 text-sm ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Generated images and videos from all sessions.</p>
              </div>
              <span className="rounded-full border px-3 py-1.5 text-xs font-bold border-teal-400/30 text-teal-400 bg-white/5">
                {assets.length} asset{assets.length !== 1 ? 's' : ''}
              </span>
            </div>
            {assets.length === 0 ? (
              <div className={`flex flex-col items-center justify-center min-h-[300px] rounded-2xl border border-dashed ${isLight ? 'border-slate-300 text-slate-400' : 'border-white/10 text-slate-600'}`}>
                <ImageIcon size={32} className="mb-3 opacity-40" />
                <p className="text-sm font-medium">No assets yet — generate something!</p>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {assets.map(asset => (
                  <div key={asset.id} className={`group relative overflow-hidden rounded-2xl border ${isLight ? 'border-black/8 bg-white' : 'border-white/8 bg-white/4'} transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}>
                    <div className="relative aspect-video w-full overflow-hidden bg-black/10">
                      {asset.type === 'Video'
                        ? <video src={asset.url} controls className="h-full w-full object-cover" />
                        : <img src={asset.url} alt={asset.prompt} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />}
                      <a href={asset.url} download={`director-os-${asset.type.toLowerCase()}-${asset.id}`} target="_blank" rel="noopener noreferrer"
                        className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-lg bg-black/60 text-white opacity-0 backdrop-blur-md transition-all group-hover:opacity-100 hover:bg-black/80">
                        <Download size={14} />
                      </a>
                      <span className={`absolute left-2 top-2 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest ${asset.type === 'Video' ? 'bg-orange-500/90 text-white' : 'bg-violet-500/90 text-white'}`}>{asset.type}</span>
                    </div>
                    <div className="p-4">
                      <p className={`text-xs font-semibold line-clamp-2 ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>{asset.prompt}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className={`text-[10px] ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>{asset.modelName}</span>
                        <span className={`text-[10px] ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>{asset.ts}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <SettingsModal
        isOpen={showSettings} onClose={() => setShowSettings(false)}
        mode={generateMode === 'Brief' ? 'Image' : generateMode}
        models={models}
        selectedModelId={generateMode === 'Image' ? selectedImageModel : selectedVideoModel}
        onSelectModel={(id) => generateMode === 'Image' ? setSelectedImageModel(id) : setSelectedVideoModel(id)}
        isLight={isLight}
        aspectRatio={generateMode === 'Image' ? aspectRatioImg : aspectRatioVid}
        setAspectRatio={(v) => generateMode === 'Image' ? setAspectRatioImg(v) : setAspectRatioVid(v)}
        numOutputs={numOutputsImg} setNumOutputs={setNumOutputsImg}
        quality={qualityImg} setQuality={setQualityImg}
        duration={durationVid} setDuration={setDurationVid}
        negPrompt={generateMode === 'Image' ? negPromptImg : negPromptVid}
        setNegPrompt={generateMode === 'Image' ? setNegPromptImg : setNegPromptVid}
        format={formatImg} setFormat={setFormatImg}
        seed={seedImg} setSeed={setSeedImg}
        resolution={resolution} setResolution={setResolution}
        generateAudio={generateAudio} setGenerateAudio={setGenerateAudio}
        hd={hd} setHd={setHd}
        stylize={stylize} setStylize={setStylize}
        motion={motion} setMotion={setMotion}
        chaos={chaos} setChaos={setChaos}
        weird={weird} setWeird={setWeird}
        sref={sref} setSref={setSref}
        watermark={watermark} setWatermark={setWatermark}
        returnLastFrame={returnLastFrame} setReturnLastFrame={setReturnLastFrame}
        thinkingLevel={thinkingLevel} setThinkingLevel={setThinkingLevel}
        mediaResolution={mediaResolution} setMediaResolution={setMediaResolution}
      />
    </div>
  );
}

export default App;
