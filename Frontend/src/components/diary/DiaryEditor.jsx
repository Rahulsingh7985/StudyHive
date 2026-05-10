import { useState, useEffect, useRef, useCallback } from "react";

const MOODS = [
  { value: "happy",     emoji: "😊" },
  { value: "focused",   emoji: "🎯" },
  { value: "motivated", emoji: "🚀" },
  { value: "neutral",   emoji: "😐" },
  { value: "tired",     emoji: "😴" },
  { value: "stressed",  emoji: "😤" },
];

const MOOD_META = {
  happy:     { color: "#facc15", bg: "rgba(250,204,21,0.1)",  border: "rgba(250,204,21,0.3)"  },
  focused:   { color: "#60a5fa", bg: "rgba(96,165,250,0.1)",  border: "rgba(96,165,250,0.3)"  },
  motivated: { color: "#4ade80", bg: "rgba(74,222,128,0.1)",  border: "rgba(74,222,128,0.3)"  },
  neutral:   { color: "#94a3b8", bg: "rgba(148,163,184,0.1)", border: "rgba(148,163,184,0.3)" },
  tired:     { color: "#c084fc", bg: "rgba(192,132,252,0.1)", border: "rgba(192,132,252,0.3)" },
  stressed:  { color: "#f87171", bg: "rgba(248,113,113,0.1)", border: "rgba(248,113,113,0.3)" },
};

// Text highlight colors user can apply
const HIGHLIGHT_COLORS = [
  { label: "Purple", color: "#c084fc" },
  { label: "Blue",   color: "#60a5fa" },
  { label: "Green",  color: "#4ade80" },
  { label: "Yellow", color: "#facc15" },
  { label: "Pink",   color: "#f472b6" },
  { label: "Red",    color: "#f87171" },
];

// ── Formatting toolbar button ─────────────────────────────────────────────────
const ToolbarBtn = ({ onClick, title, active, children }) => (
  <button
    type="button"
    onMouseDown={(e) => { e.preventDefault(); onClick(); }}
    title={title}
    className="w-7 h-7 flex items-center justify-center rounded-lg text-xs transition-all select-none"
    style={{
      background: active ? "rgba(192,132,252,0.2)" : "transparent",
      color:      active ? "#c084fc" : "#64748b",
      border:     active ? "1px solid rgba(192,132,252,0.3)" : "1px solid transparent",
    }}
    onMouseEnter={(e) => { if (!active) e.currentTarget.style.color = "#cbd5e1"; }}
    onMouseLeave={(e) => { if (!active) e.currentTarget.style.color = "#64748b"; }}
  >
    {children}
  </button>
);

const Divider = () => (
  <div className="w-px h-4 mx-1" style={{ background: "rgba(255,255,255,0.08)" }} />
);

// ── Main Editor ───────────────────────────────────────────────────────────────
const DiaryEditor = ({ entry, onSave, onClose, loading }) => {
  const isEditing   = Boolean(entry);
  const editorRef   = useRef(null);
  const [title, setTitle]       = useState(entry?.title || "");
  const [mood,  setMood]        = useState(entry?.mood  || "neutral");
  const [tags,  setTags]        = useState(entry?.tags?.join(", ") || "");
  const [charCount, setCharCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [activeFormats, setActiveFormats] = useState({});
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [isTyping, setIsTyping]     = useState(false);
  const typingTimer                 = useRef(null);

  // Load existing content into editor
  useEffect(() => {
    if (editorRef.current && entry?.content) {
      editorRef.current.innerHTML = entry.content;
      updateCounts(entry.content);
    }
  }, []);

  const updateCounts = (html) => {
    const text = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
    setCharCount(text.length);
    setWordCount(text ? text.split(" ").filter(Boolean).length : 0);
  };

  const handleInput = () => {
    const html = editorRef.current.innerHTML;
    updateCounts(html);
    updateActiveFormats();
    // Typing glow effect
    setIsTyping(true);
    clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => setIsTyping(false), 1000);
  };

  // Track which formats are active at cursor
  const updateActiveFormats = () => {
    setActiveFormats({
      bold:      document.queryCommandState("bold"),
      italic:    document.queryCommandState("italic"),
      underline: document.queryCommandState("underline"),
      ul:        document.queryCommandState("insertUnorderedList"),
      ol:        document.queryCommandState("insertOrderedList"),
    });
  };

  const exec = (cmd, value = null) => {
    editorRef.current.focus();
    document.execCommand(cmd, false, value);
    updateActiveFormats();
  };

  const applyColor = (color) => {
    exec("foreColor", color);
    setShowColorPicker(false);
  };

  const applyHeading = (tag) => {
    exec("formatBlock", tag);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const content = editorRef.current.innerHTML.trim();
    if (!title.trim() || !content || content === "<br>") return;
    const cleanTags = tags.split(",").map(t => t.trim().toLowerCase()).filter(Boolean).slice(0, 10);
    onSave({ title: title.trim(), content, mood, tags: cleanTags });
  };

  useEffect(() => {
    const fn = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, [onClose]);

  // Close color picker on outside click
  useEffect(() => {
    const fn = () => setShowColorPicker(false);
    if (showColorPicker) document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, [showColorPicker]);

  const isEmpty = charCount === 0;

  return (
    <>
      {/* Rich text styles injected once */}
      <style>{`
        .diary-editor { outline: none; min-height: 220px; }
        .diary-editor p  { margin: 0 0 10px; color: #cbd5e1; line-height: 1.8; font-size: 14px; }
        .diary-editor h1 { margin: 0 0 12px; color: #f1f5f9; font-size: 20px; font-weight: 700; line-height: 1.3; }
        .diary-editor h2 { margin: 0 0 10px; color: #e2e8f0; font-size: 16px; font-weight: 600; line-height: 1.4; }
        .diary-editor ul { margin: 0 0 10px; padding-left: 20px; color: #cbd5e1; font-size: 14px; line-height: 1.8; list-style: disc; }
        .diary-editor ol { margin: 0 0 10px; padding-left: 20px; color: #cbd5e1; font-size: 14px; line-height: 1.8; list-style: decimal; }
        .diary-editor li { margin-bottom: 4px; }
        .diary-editor b, .diary-editor strong { color: #f1f5f9; font-weight: 700; }
        .diary-editor i, .diary-editor em     { color: #e2e8f0; font-style: italic; }
        .diary-editor u  { text-decoration: underline; text-decoration-color: rgba(192,132,252,0.5); }
        .diary-editor br { display: block; content: ""; margin: 4px 0; }
        .diary-editor:empty:before {
          content: attr(data-placeholder);
          color: #334155;
          pointer-events: none;
          font-size: 14px;
        }
        .diary-editor ::selection { background: rgba(192,132,252,0.25); }
      `}</style>

      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(10px)" }}
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <div
          className="w-full max-w-2xl flex flex-col rounded-2xl overflow-hidden"
          style={{
            background:  "#1a1a2e",
            border:      "1px solid rgba(192,132,252,0.2)",
            boxShadow:   "0 30px 70px rgba(0,0,0,0.7)",
            maxHeight:   "92vh",
          }}
        >
          {/* ── Header ── */}
          <div
            className="flex items-center justify-between px-6 py-4 shrink-0"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-base"
                style={{ background: "rgba(192,132,252,0.15)", border: "1px solid rgba(192,132,252,0.2)" }}
              >
                📖
              </div>
              <h2 className="text-white font-semibold">{isEditing ? "Edit Entry" : "New Entry"}</h2>
            </div>
            <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">✕</button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
            <div className="flex-1 overflow-y-auto">

              {/* ── Title ── */}
              <div className="px-6 pt-5 pb-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <input
                  type="text"
                  placeholder="Entry title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={150}
                  className="w-full bg-transparent text-xl font-bold text-white placeholder-slate-700 outline-none"
                  required
                />
              </div>

              {/* ── Mood ── */}
              <div className="px-6 py-3 flex items-center gap-2 flex-wrap" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <span className="text-xs text-slate-600 uppercase tracking-widest mr-1">Mood</span>
                {MOODS.map(({ value, emoji }) => {
                  const meta   = MOOD_META[value];
                  const active = mood === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setMood(value)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs transition-all"
                      style={{
                        background: active ? meta.bg    : "rgba(255,255,255,0.03)",
                        border:     `1px solid ${active ? meta.border : "rgba(255,255,255,0.07)"}`,
                        color:      active ? meta.color : "#475569",
                      }}
                    >
                      <span>{emoji}</span>
                      <span className="capitalize">{value}</span>
                    </button>
                  );
                })}
              </div>

              {/* ── Formatting Toolbar ── */}
              <div
                className="px-4 py-2 flex items-center gap-0.5 flex-wrap shrink-0"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", background: "rgba(0,0,0,0.15)" }}
              >
                {/* Headings */}
                <ToolbarBtn onClick={() => applyHeading("h1")} title="Heading 1">
                  <span className="font-bold text-xs">H1</span>
                </ToolbarBtn>
                <ToolbarBtn onClick={() => applyHeading("h2")} title="Heading 2">
                  <span className="font-bold text-xs">H2</span>
                </ToolbarBtn>
                <ToolbarBtn onClick={() => applyHeading("p")} title="Normal text">
                  <span className="text-xs">¶</span>
                </ToolbarBtn>

                <Divider />

                {/* Text styles */}
                <ToolbarBtn onClick={() => exec("bold")}      title="Bold"      active={activeFormats.bold}>
                  <span className="font-black text-xs">B</span>
                </ToolbarBtn>
                <ToolbarBtn onClick={() => exec("italic")}    title="Italic"    active={activeFormats.italic}>
                  <span className="italic text-xs">I</span>
                </ToolbarBtn>
                <ToolbarBtn onClick={() => exec("underline")} title="Underline" active={activeFormats.underline}>
                  <span className="underline text-xs">U</span>
                </ToolbarBtn>

                <Divider />

                {/* Lists */}
                <ToolbarBtn onClick={() => exec("insertUnorderedList")} title="Bullet list" active={activeFormats.ul}>
                  <span className="text-xs">• ≡</span>
                </ToolbarBtn>
                <ToolbarBtn onClick={() => exec("insertOrderedList")} title="Numbered list" active={activeFormats.ol}>
                  <span className="text-xs">1 ≡</span>
                </ToolbarBtn>

                <Divider />

                {/* Text color */}
                <div className="relative" onMouseDown={(e) => e.stopPropagation()}>
                  <ToolbarBtn
                    onClick={() => setShowColorPicker((p) => !p)}
                    title="Text color"
                    active={showColorPicker}
                  >
                    <span className="text-xs font-bold" style={{ color: "#c084fc" }}>A</span>
                  </ToolbarBtn>

                  {showColorPicker && (
                    <div
                      className="absolute top-9 left-0 z-50 p-2 rounded-xl flex gap-1.5"
                      style={{ background: "#1e1e2f", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 8px 25px rgba(0,0,0,0.5)" }}
                    >
                      {HIGHLIGHT_COLORS.map(({ label, color }) => (
                        <button
                          key={color}
                          type="button"
                          title={label}
                          onMouseDown={(e) => { e.preventDefault(); applyColor(color); }}
                          className="w-5 h-5 rounded-full transition-transform hover:scale-125"
                          style={{ background: color, boxShadow: `0 0 6px ${color}60` }}
                        />
                      ))}
                      <button
                        type="button"
                        onMouseDown={(e) => { e.preventDefault(); applyColor("#cbd5e1"); }}
                        className="w-5 h-5 rounded-full transition-transform hover:scale-125"
                        style={{ background: "#cbd5e1" }}
                        title="Default"
                      />
                    </div>
                  )}
                </div>

                <Divider />

                {/* Clear formatting */}
                <ToolbarBtn onClick={() => exec("removeFormat")} title="Clear formatting">
                  <span className="text-xs">✕</span>
                </ToolbarBtn>

                {/* Word / char count pushed right */}
                <div className="flex-1" />
                <span className="text-xs text-slate-700 pr-1">
                  {wordCount} words · {charCount} chars
                </span>
              </div>

              {/* ── Writing area ── */}
              <div
                className="relative px-6 py-4 transition-all duration-700"
                style={{
                  background: isTyping
                    ? "linear-gradient(180deg, rgba(192,132,252,0.03) 0%, transparent 40%)"
                    : "transparent",
                }}
              >
                {/* Subtle left accent line when typing */}
                <div
                  className="absolute left-0 top-4 bottom-4 w-0.5 rounded-full transition-all duration-500"
                  style={{
                    background: isTyping
                      ? "linear-gradient(180deg, transparent, #c084fc, transparent)"
                      : "transparent",
                    opacity: isTyping ? 0.6 : 0,
                  }}
                />

                <div
                  ref={editorRef}
                  contentEditable
                  suppressContentEditableWarning
                  className="diary-editor"
                  data-placeholder="Write your thoughts, session notes, or reflections... Select text to style it ✨"
                  onInput={handleInput}
                  onKeyUp={updateActiveFormats}
                  onMouseUp={updateActiveFormats}
                />
              </div>

              {/* ── Tags ── */}
              <div className="px-6 pb-4" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                <p className="text-xs text-slate-700 uppercase tracking-widest mb-2 mt-3 font-medium">Tags</p>
                <input
                  type="text"
                  placeholder="math, revision, exam-prep..."
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full text-sm text-slate-400 placeholder-slate-700 px-3 py-2 rounded-xl outline-none focus:ring-1 focus:ring-purple-500/40"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
                />
              </div>
            </div>

            {/* ── Footer ── */}
            <div
              className="px-6 py-4 flex items-center justify-between shrink-0"
              style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(0,0,0,0.15)" }}
            >
              <p className="text-xs text-slate-700 italic">
                {isEmpty ? "Start writing..." : `✨ Looking good!`}
              </p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm text-slate-500 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !title.trim() || isEmpty}
                  className="px-5 py-2 text-sm font-medium text-white rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 active:scale-95"
                  style={{
                    background:  "linear-gradient(135deg, #9333ea, #7c3aed)",
                    boxShadow:   "0 4px 15px rgba(147,51,234,0.35)",
                  }}
                >
                  {loading ? "Saving..." : isEditing ? "Save Changes" : "Save Entry"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default DiaryEditor;