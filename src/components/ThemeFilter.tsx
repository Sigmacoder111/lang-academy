import { AP_THEMES } from "../data/themes";

interface Props {
  selected: string[];
  onChange: (selected: string[]) => void;
  multiSelect?: boolean;
}

export default function ThemeFilter({
  selected,
  onChange,
  multiSelect = true,
}: Props) {
  const allSelected =
    selected.length === 0 || selected.length === AP_THEMES.length;

  function handleClick(key: string) {
    if (multiSelect) {
      if (allSelected) {
        onChange([key]);
      } else if (selected.includes(key)) {
        const next = selected.filter((k) => k !== key);
        onChange(next.length === 0 ? [] : next);
      } else {
        const next = [...selected, key];
        onChange(next.length === AP_THEMES.length ? [] : next);
      }
    } else {
      onChange(selected.includes(key) ? [] : [key]);
    }
  }

  function handleAll() {
    onChange([]);
  }

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "0.5rem",
        alignItems: "center",
      }}
    >
      <Chip
        chinese="全部"
        english="All"
        active={allSelected}
        onClick={handleAll}
      />
      {AP_THEMES.map((theme) => (
        <Chip
          key={theme.key}
          chinese={theme.chinese}
          english={theme.english}
          active={!allSelected && selected.includes(theme.key)}
          onClick={() => handleClick(theme.key)}
        />
      ))}
    </div>
  );
}

function Chip({
  chinese,
  english,
  active,
  onClick,
}: {
  chinese: string;
  english: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.0625rem",
        padding: "0.375rem 0.75rem",
        borderRadius: "9999px",
        border: active ? "1px solid transparent" : "1px solid var(--border)",
        background: active ? "var(--accent)" : "var(--surface)",
        cursor: "pointer",
        transition: "all 0.15s ease",
        lineHeight: 1.2,
      }}
    >
      <span
        style={{
          fontFamily: "'Noto Serif SC', Georgia, serif",
          fontSize: "13px",
          fontWeight: 600,
          color: active ? "#FFFFFF" : "var(--text-primary)",
        }}
      >
        {chinese}
      </span>
      <span
        style={{
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: "10px",
          color: active ? "rgba(255,255,255,0.8)" : "var(--text-muted)",
        }}
      >
        {english}
      </span>
    </button>
  );
}
