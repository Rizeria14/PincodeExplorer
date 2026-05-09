import React from "react";

const ZONE_COLORS = {
  N:  { bg:"rgba(74,175,238,0.12)",  text:"#4aafee",  border:"rgba(74,175,238,0.28)" },
  S:  { bg:"rgba(61,214,140,0.12)",  text:"#3dd68c",  border:"rgba(61,214,140,0.28)" },
  E:  { bg:"rgba(169,125,247,0.12)", text:"#a97df7",  border:"rgba(169,125,247,0.28)" },
  W:  { bg:"rgba(245,197,66,0.12)",  text:"#f5c542",  border:"rgba(245,197,66,0.28)" },
  C:  { bg:"rgba(232,97,58,0.12)",   text:"#e8613a",  border:"rgba(232,97,58,0.28)" },
  NE: { bg:"rgba(232,125,179,0.12)", text:"#e87db3",  border:"rgba(232,125,179,0.28)" },
  NW: { bg:"rgba(45,212,191,0.12)",  text:"#2dd4bf",  border:"rgba(45,212,191,0.28)" },
  SE: { bg:"rgba(239,100,100,0.12)", text:"#f87171",  border:"rgba(239,100,100,0.28)" },
  SW: { bg:"rgba(99,126,255,0.12)",  text:"#8b9eff",  border:"rgba(99,126,255,0.28)" },
};

export function ZoneBadge({ zone, showLabel = false }) {
  const c = ZONE_COLORS[zone] || ZONE_COLORS.C;
  const LABELS = {N:"North",S:"South",E:"East",W:"West",C:"Central",NE:"NE",NW:"NW",SE:"SE",SW:"SW"};
  return (
    <span style={{
      display:"inline-flex",alignItems:"center",gap:4,
      fontFamily:"var(--font-mono)",fontSize:11,fontWeight:500,
      letterSpacing:"0.04em",padding:"3px 10px",borderRadius:100,
      background:c.bg,color:c.text,border:`1px solid ${c.border}`,
      whiteSpace:"nowrap"
    }}>
      {zone}{showLabel && <span style={{opacity:0.7}}>· {LABELS[zone]}</span>}
    </span>
  );
}

export function Spinner({ size = 18 }) {
  return (
    <span style={{
      display:"inline-block",width:size,height:size,borderRadius:"50%",
      border:`2px solid rgba(232,97,58,0.2)`,borderTopColor:"var(--accent)",
      animation:"spin 0.7s linear infinite",flexShrink:0
    }}/>
  );
}

export function ErrorMsg({ message }) {
  return (
    <div style={{
      padding:"14px 18px",borderRadius:"var(--radius-sm)",
      background:"rgba(248,113,113,0.08)",border:"1px solid rgba(248,113,113,0.2)",
      color:"#f87171",fontSize:14,display:"flex",alignItems:"center",gap:10
    }}>
      <span style={{fontSize:18}}>⚠</span>
      <span>{message}</span>
    </div>
  );
}

export function CopyButton({ text, label, copiedKey, onCopy }) {
  const isCopied = copiedKey === text;
  return (
    <button
      onClick={() => onCopy(text)}
      style={{
        fontFamily:"var(--font-mono)",fontSize:11,
        padding:"4px 10px",borderRadius:6,
        border:"1px solid var(--border2)",
        background:"transparent",
        color: isCopied ? "var(--green)" : "var(--text3)",
        transition:"all 0.15s",display:"inline-flex",alignItems:"center",gap:5
      }}
    >
      {isCopied ? "✓ copied" : `⎘ ${label || text}`}
    </button>
  );
}

export function Badge({ children, color = "accent" }) {
  const colors = {
    accent: { bg:"var(--accentbg)", text:"var(--accent2)", border:"var(--accentbd)" },
    green:  { bg:"var(--greenbg)", text:"var(--green)",  border:"rgba(61,214,140,0.25)" },
    blue:   { bg:"var(--bluebg)",  text:"var(--blue)",   border:"rgba(74,175,238,0.25)" },
  };
  const c = colors[color] || colors.accent;
  return (
    <span style={{
      display:"inline-flex",alignItems:"center",
      fontFamily:"var(--font-mono)",fontSize:10,letterSpacing:"0.09em",
      textTransform:"uppercase",padding:"3px 10px",borderRadius:100,
      background:c.bg,color:c.text,border:`1px solid ${c.border}`
    }}>{children}</span>
  );
}

export function StatCard({ label, value, sub }) {
  return (
    <div style={{
      background:"var(--card)",border:"1px solid var(--border)",
      borderRadius:"var(--radius)",padding:"20px 22px"
    }}>
      <div style={{fontSize:12,color:"var(--text3)",fontFamily:"var(--font-mono)",
        textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:8}}>{label}</div>
      <div style={{fontFamily:"var(--font-display)",fontWeight:700,fontSize:28,
        color:"var(--text)",letterSpacing:"-0.02em"}}>{value}</div>
      {sub && <div style={{fontSize:12,color:"var(--text3)",marginTop:4}}>{sub}</div>}
    </div>
  );
}

export function Input({ value, onChange, placeholder, type = "text", style = {} }) {
  return (
    <input
      type={type} value={value} onChange={onChange} placeholder={placeholder}
      style={{
        width:"100%",background:"var(--bg2)",border:"1px solid var(--border)",
        borderRadius:"var(--radius-sm)",color:"var(--text)",
        fontFamily:"var(--font-mono)",fontSize:16,padding:"12px 16px",
        outline:"none",transition:"border-color 0.2s",
        ...style
      }}
      onFocus={e=>e.target.style.borderColor="var(--accent)"}
      onBlur={e=>e.target.style.borderColor="var(--border)"}
    />
  );
}
