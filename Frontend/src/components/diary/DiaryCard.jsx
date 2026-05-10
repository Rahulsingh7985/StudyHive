const MOOD_META = {
  happy:     { emoji: "😊", color: "#b45309", bg: "#fef3c7", border: "#fde68a" },
  focused:   { emoji: "🎯", color: "#1d4ed8", bg: "#dbeafe", border: "#bfdbfe" },
  motivated: { emoji: "🚀", color: "#166534", bg: "#dcfce7", border: "#bbf7d0" },
  neutral:   { emoji: "😐", color: "#475569", bg: "#f1f5f9", border: "#e2e8f0" },
  tired:     { emoji: "😴", color: "#6d28d9", bg: "#ede9fe", border: "#ddd6fe" },
  stressed:  { emoji: "😤", color: "#be123c", bg: "#ffe4e6", border: "#fecdd3" },
};

const MOOD_ACCENT = {
  happy: "#f59e0b", focused: "#3b82f6", motivated: "#22c55e",
  neutral: "#94a3b8", tired: "#a855f7", stressed: "#f43f5e",
};

const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

const htmlToText = (html = "") =>
  html.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();

const DiaryCard = ({ entry, onEdit, onDelete, onTogglePin, isDeleting }) => {
  const mood   = MOOD_META[entry.mood] || MOOD_META.neutral;
  const accent = MOOD_ACCENT[entry.mood] || MOOD_ACCENT.neutral;
  const isPinned = entry.isPinned;

  const plainText = htmlToText(entry.content);
  const preview   = plainText.length > 110 ? plainText.slice(0, 110) + "…" : plainText;
  const words     = plainText.split(" ").filter(Boolean).length;
  const readTime  = Math.max(1, Math.ceil(words / 200));

  return (
    <div
      style={{
        background: "#23243a",
        border: isPinned
          ? `1px solid ${accent}55`
          : "0 px solid",
        borderRadius: "var(--border-radius-lg)",
        borderLeft: `3px solid ${accent}`,
        overflow: "hidden",
        transition: "box-shadow 0.18s ease, transform 0.18s ease",
        position: "relative",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Pinned top accent bar */}
      {isPinned && (
        <div
          style={{
            height: "2px",
            background: `linear-gradient(90deg, ${accent} 0%, ${accent}33 70%, transparent 100%)`,
          }}
        />
      )}

      <div style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: "8px" }}>

        {/* Row 1: Date · readtime + mood + pin badge */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
          <span style={{ fontSize: "11px", color: "var(--color-text-tertiary)", fontWeight: 400 }}>
            {formatDate(entry.createdAt)}&nbsp;·&nbsp;{readTime}m read
          </span>

          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            {isPinned && (
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: 500,
                  color: accent,
                  background: `${accent}14`,
                  border: `0.5px solid ${accent}44`,
                  borderRadius: "4px",
                  padding: "2px 6px",
                  letterSpacing: "0.04em",
                }}
              >
                PINNED
              </span>
            )}
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                fontSize: "11px",
                fontWeight: 500,
                color: mood.color,
                background: mood.bg,
                border: `0.5px solid ${mood.border}`,
                borderRadius: "4px",
                padding: "2px 7px",
              }}
            >
              <span style={{ fontSize: "12px" }}>{mood.emoji}</span>
              <span style={{ textTransform: "capitalize" }}>{entry.mood}</span>
            </span>
          </div>
        </div>

        {/* Row 2: Title */}
        <p
          style={{
            margin: 0,
            fontSize: "13px",
            fontWeight: 500,
            color: "var(--color-text-primary)",
            lineHeight: 1.4,
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
          }}
        >
          {entry.title}
        </p>

        {/* Row 3: Preview */}
        <p
          style={{
            margin: 0,
            fontSize: "12px",
            color: "var(--color-text-secondary)",
            lineHeight: 1.55,
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {preview || "No content yet..."}
        </p>

        {/* Row 4: Tags */}
        {entry.tags?.length > 0 && (
          <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
            {entry.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  fontSize: "10px",
                  fontWeight: 500,
                  color: "var(--color-text-secondary)",
                  background: "var(--color-background-secondary)",
                  border: "0.5px solid var(--color-border-tertiary)",
                  borderRadius: "4px",
                  padding: "2px 6px",
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Divider + Actions */}
        <div
          style={{
            borderTop: "0.5px solid var(--color-border-tertiary)",
            paddingTop: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <button
            onClick={() => onTogglePin(entry._id)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "11px",
              fontWeight: 500,
              color: isPinned ? accent : "var(--color-text-tertiary)",
              padding: "3px 6px",
              borderRadius: "4px",
              transition: "background 0.15s, color 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = accent;
              e.currentTarget.style.background = `${accent}12`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = isPinned ? accent : "var(--color-text-tertiary)";
              e.currentTarget.style.background = "none";
            }}
          >
            {isPinned ? "Unpin" : "Pin"}
          </button>

          <div style={{ display: "flex", gap: "2px" }}>
            <button
              onClick={() => onEdit(entry)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "11px",
                fontWeight: 500,
                color: "var(--color-text-tertiary)",
                padding: "3px 8px",
                borderRadius: "4px",
                transition: "background 0.15s, color 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--color-text-info)";
                e.currentTarget.style.background = "var(--color-background-info)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--color-text-tertiary)";
                e.currentTarget.style.background = "none";
              }}
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(entry._id)}
              disabled={isDeleting}
              style={{
                background: "none",
                border: "none",
                cursor: isDeleting ? "not-allowed" : "pointer",
                fontSize: "11px",
                fontWeight: 500,
                color: "var(--color-text-tertiary)",
                padding: "3px 8px",
                borderRadius: "4px",
                opacity: isDeleting ? 0.4 : 1,
                transition: "background 0.15s, color 0.15s",
              }}
              onMouseEnter={(e) => {
                if (!isDeleting) {
                  e.currentTarget.style.color = "var(--color-text-danger)";
                  e.currentTarget.style.background = "var(--color-background-danger)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--color-text-tertiary)";
                e.currentTarget.style.background = "none";
              }}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiaryCard;