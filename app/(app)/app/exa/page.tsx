'use client';

import { useState, useEffect } from "react";

// ── Paletă SIMATIC WinCC "Flat" (Comfort/Advanced Panel) ──
const C = {
  bg: "#E4E7EA",
  panel: "#FFFFFF",
  panelBorder: "#B9C0C7",
  header: "#00646E",      // Siemens petrol
  headerDark: "#00464D",
  tabActive: "#00646E",
  text: "#1B2226",
  textDim: "#5B6570",
  ioField: "#FFFFFF",
  ioBorder: "#0072BC",    // Siemens blue
  run: "#1BA33C",
  runBg: "#E4F5E8",
  warn: "#E8A400",
  warnBg: "#FDF1D6",
  alarm: "#D2232A",
  alarmBg: "#FBDCDD",
  idle: "#8A929B",
  idleBg: "#EDEFF1",
} as const;

type Stare = "run" | "warn" | "alarm" | "idle";
type TipStatie = "tank" | "motor" | "nozzle" | "fan";
type StareAlarma = "ACTIVĂ" | "CONFIRMATĂ" | "REVENITĂ";

interface Statie {
  key: string;
  label: string;
  tip: TipStatie;
  stare: Stare;
  activ?: boolean;
}

interface Alarma {
  data: string;
  ora: string;
  mesaj: string;
  stare: StareAlarma;
}

interface FKey {
  k: string;
  t: string;
}

const STATII: Statie[] = [
  { key: "prewash", label: "PRE-SPĂLARE", tip: "tank", stare: "run" },
  { key: "brush", label: "PERII ROTATIVE", tip: "motor", stare: "run" },
  { key: "rinse", label: "PRESIUNE ÎNALTĂ", tip: "nozzle", stare: "run", activ: true },
  { key: "wax", label: "CEARĂ", tip: "tank", stare: "idle" },
  { key: "dry", label: "USCARE", tip: "fan", stare: "warn" },
];

const ALARME: Alarma[] = [
  { data: "19.07.2026", ora: "14:22:07", mesaj: "USCARE — filtru colmatat, verificare în 6h", stare: "ACTIVĂ" },
  { data: "19.07.2026", ora: "14:10:41", mesaj: "CEARĂ — nivel consumabil sub 40%", stare: "CONFIRMATĂ" },
  { data: "19.07.2026", ora: "13:58:02", mesaj: "POMPĂ PRINCIPALĂ — presiune revenită la normal", stare: "REVENITĂ" },
];

const STARE_COLORI: Record<StareAlarma, { bg: string; fg: string }> = {
  ACTIVĂ: { bg: C.alarmBg, fg: C.alarm },
  CONFIRMATĂ: { bg: C.warnBg, fg: C.warn },
  REVENITĂ: { bg: C.idleBg, fg: C.textDim },
};

function stateColor(stare: Stare): string {
  if (stare === "run") return C.run;
  if (stare === "warn") return C.warn;
  if (stare === "alarm") return C.alarm;
  return C.idle;
}

// ── Diagramă mimică (P&ID) a liniei de spălare ──
function Mimic() {
  const xs = [110, 300, 500, 700, 890];
  const y = 70;
  const pipeY = 150;

  return (
    <svg viewBox="0 0 1000 220" style={{ width: "100%", height: "auto", display: "block" }}>
      <line x1={50} y1={pipeY} x2={950} y2={pipeY} stroke="#8A929B" strokeWidth="6" />
      {STATII.slice(0, -1).map((_, i) => (
        <polygon
          key={i}
          points={`${(xs[i] + xs[i + 1]) / 2 - 6},${pipeY - 5} ${(xs[i] + xs[i + 1]) / 2 + 6},${pipeY} ${(xs[i] + xs[i + 1]) / 2 - 6},${pipeY + 5}`}
          fill="#5B6570"
        />
      ))}

      {STATII.map((s, i) => {
        const cx = xs[i];
        const col = stateColor(s.stare);
        return (
          <g key={s.key}>
            <line x1={cx} y1={y + 34} x2={cx} y2={pipeY} stroke="#8A929B" strokeWidth="3" />

            {s.tip === "tank" && (
              <g>
                <rect x={cx - 22} y={y - 20} width="44" height="54" fill="#F4F5F6" stroke={col} strokeWidth="2.5" />
                <rect x={cx - 22} y={s.stare === "idle" ? y + 14 : y + 4} width="44" height={s.stare === "idle" ? 20 : 30} fill={col} opacity="0.35" />
              </g>
            )}
            {s.tip === "motor" && (
              <g>
                <circle cx={cx} cy={y + 6} r="22" fill="#F4F5F6" stroke={col} strokeWidth="2.5" />
                <line x1={cx} y1={y - 12} x2={cx} y2={y + 24} stroke={col} strokeWidth="2.5" />
                <line x1={cx - 15} y1={y - 4} x2={cx + 15} y2={y + 16} stroke={col} strokeWidth="2.5" />
                <line x1={cx - 15} y1={y + 16} x2={cx + 15} y2={y - 4} stroke={col} strokeWidth="2.5" />
              </g>
            )}
            {s.tip === "nozzle" && (
              <g>
                <polygon points={`${cx - 14},${y - 14} ${cx + 14},${y - 14} ${cx},${y + 22}`} fill="#F4F5F6" stroke={col} strokeWidth="2.5" />
                <circle cx={cx - 10} cy={y + 30} r="2.5" fill={col} />
                <circle cx={cx} cy={y + 34} r="2.5" fill={col} />
                <circle cx={cx + 10} cy={y + 30} r="2.5" fill={col} />
              </g>
            )}
            {s.tip === "fan" && (
              <g>
                <circle cx={cx} cy={y + 6} r="22" fill="#F4F5F6" stroke={col} strokeWidth="2.5" />
                <path d={`M ${cx} ${y + 6} L ${cx} ${y - 10} A 8 8 0 0 1 ${cx + 14} ${y + 2} Z`} fill={col} opacity="0.7" />
                <path d={`M ${cx} ${y + 6} L ${cx + 14} ${y + 14} A 8 8 0 0 1 ${cx - 4} ${y + 22} Z`} fill={col} opacity="0.7" />
                <path d={`M ${cx} ${y + 6} L ${cx - 12} ${y + 14} A 8 8 0 0 1 ${cx - 8} ${y - 8} Z`} fill={col} opacity="0.7" />
              </g>
            )}

            <circle cx={cx + 18} cy={y - 16} r="5" fill={col} />

            <text x={cx} y={pipeY + 26} textAnchor="middle" fontSize="12" fontWeight="700" fill={C.text} fontFamily="Arial, sans-serif">
              {s.label}
            </text>
            <text x={cx} y={pipeY + 40} textAnchor="middle" fontSize="10" fill={C.textDim} fontFamily="Arial, sans-serif">
              {s.stare === "run" ? "ÎN FUNCȚIUNE" : s.stare === "warn" ? "AVERTIZARE" : "OPRIT"}
            </text>

            {s.activ && (
              <g>
                <rect x={cx - 26} y={pipeY - 34} width="52" height="18" rx="3" fill="#0072BC" />
                <circle cx={cx - 15} cy={pipeY - 14} r="5" fill="#1B2226" />
                <circle cx={cx + 15} cy={pipeY - 14} r="5" fill="#1B2226" />
                <text x={cx} y={pipeY - 40} textAnchor="middle" fontSize="9" fontWeight="700" fill="#0072BC" fontFamily="Arial, sans-serif">
                  ID-7734
                </text>
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
}

function IOField({ label, val, unit }: { label: string; val: string; unit: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
      <span style={{ fontSize: 11, color: C.textDim, fontWeight: 600 }}>{label}</span>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <div
          style={{
            background: C.ioField,
            border: `1.5px solid ${C.ioBorder}`,
            padding: "4px 8px",
            minWidth: 70,
            textAlign: "right",
            fontSize: 13,
            fontWeight: 700,
            color: C.text,
          }}
        >
          {val}
        </div>
        <span style={{ fontSize: 10, color: C.textDim, width: 24 }}>{unit}</span>
        <div style={{ display: "flex", flexDirection: "column", border: `1px solid ${C.panelBorder}` }}>
          <div style={{ fontSize: 8, padding: "1px 4px", background: "#F4F5F6", borderBottom: `1px solid ${C.panelBorder}`, cursor: "pointer" }}>▲</div>
          <div style={{ fontSize: 8, padding: "1px 4px", background: "#F4F5F6", cursor: "pointer" }}>▼</div>
        </div>
      </div>
    </div>
  );
}

const FKEYS: FKey[] = [
  { k: "F1", t: "START" },
  { k: "F2", t: "STOP" },
  { k: "F3", t: "CONFIRMĂ\nALARME" },
  { k: "F4", t: "AUTO / MANUAL" },
  { k: "F5", t: "SPĂLARE\nRAPIDĂ" },
  { k: "F6", t: "RAPOARTE" },
  { k: "F7", t: "SETĂRI" },
  { k: "F8", t: "IEȘIRE" },
];

export default function IndustrialDashboard() {
  const [now, setNow] = useState<Date | null>(null);
  const [tab, setTab] = useState<string>("PROCES");

  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const time = now ? now.toLocaleTimeString("ro-RO", { hour12: false }) : "--:--:--";
  const date = now ? now.toLocaleDateString("ro-RO") : "--.--.----";

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "Arial, 'Segoe UI', sans-serif", color: C.text }}>
      {/* ── HEADER SIMATIC ── */}
      <div style={{ background: C.header, color: "#fff", padding: "8px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 26, height: 26, background: "#fff", color: C.header, fontWeight: 900, fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center" }}>
            S
          </div>
          <div>
            <div style={{ fontSize: 10, letterSpacing: "0.1em", opacity: 0.75 }}>EXA 360 AUTOMATIC WASH CAR</div>
            <div style={{ fontSize: 14, fontWeight: 700 }}>AUTOWASH LINE 01 — PROCES OVERVIEW, TARGOVISTE, DAMBOBITA, ROMANIA</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 11 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 20, height: 20, borderRadius: "50%", border: "1.5px solid #fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>👤</div>
            OPERATOR
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, background: C.alarm, padding: "3px 8px" }}>
            🔔 <span style={{ fontWeight: 700 }}>{ALARME.filter((a) => a.stare === "ACTIVĂ").length}</span>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontWeight: 700 }}>{time}</div>
            <div style={{ fontSize: 9, opacity: 0.75 }}>{date}</div>
          </div>
        </div>
      </div>

      {/* ── TAB BAR ── */}
      <div style={{ background: "#fff", borderBottom: `1px solid ${C.panelBorder}`, display: "flex", padding: "0 12px" }}>
        {["PROCES", "SENZORI", "ALARME", "TRENDURI", "DIAGNOSTIC"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              background: "transparent",
              border: "none",
              padding: "10px 16px",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.03em",
              color: tab === t ? C.tabActive : C.textDim,
              borderBottom: tab === t ? `3px solid ${C.tabActive}` : "3px solid transparent",
              cursor: "pointer",
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* ── CORP PRINCIPAL: mimic + taste funcționale ── */}
      <div style={{ display: "flex", gap: 10, padding: 12 }}>
        <div style={{ flex: 1, background: C.panel, border: `1px solid ${C.panelBorder}` }}>
          <div style={{ padding: "8px 14px", borderBottom: `1px solid ${C.panelBorder}`, fontSize: 11, fontWeight: 700, color: C.textDim, letterSpacing: "0.05em" }}>
            DIAGRAMĂ PROCES — LINIE SPĂLARE ROBOTIZATĂ
          </div>
          <div style={{ padding: 14 }}>
            <Mimic />
          </div>
        </div>

        <div style={{ width: 108, display: "flex", flexDirection: "column", gap: 6 }}>
          {FKEYS.map((f) => (
            <button
              key={f.k}
              style={{
                background: "#F4F5F6",
                border: `1px solid ${C.panelBorder}`,
                borderTop: "1px solid #fff",
                borderLeft: "1px solid #fff",
                padding: "8px 6px",
                fontSize: 9.5,
                fontWeight: 700,
                color: C.text,
                textAlign: "left",
                cursor: "pointer",
                whiteSpace: "pre-line",
                lineHeight: 1.2,
              }}
            >
              <span style={{ color: C.tabActive, fontSize: 9, display: "block", marginBottom: 2 }}>{f.k}</span>
              {f.t}
            </button>
          ))}
        </div>
      </div>

      {/* ── SETPOINTS + ALARM LIST ── */}
      <div style={{ display: "flex", gap: 10, padding: "0 12px 12px" }}>
        <div style={{ width: 280, background: C.panel, border: `1px solid ${C.panelBorder}` }}>
          <div style={{ padding: "8px 14px", borderBottom: `1px solid ${C.panelBorder}`, fontSize: 11, fontWeight: 700, color: C.textDim, letterSpacing: "0.05em" }}>
            SETPOINT-URI
          </div>
          <div style={{ padding: 14 }}>
            <IOField label="PRESIUNE ȚINTĂ" val="82" unit="bar" />
            <IOField label="DEBIT APĂ" val="120" unit="l/min" />
            <IOField label="TIMP CICLU" val="6.2" unit="min" />
            <IOField label="TEMP. APĂ" val="38" unit="°C" />
          </div>
        </div>

        <div style={{ flex: 1, background: C.panel, border: `1px solid ${C.panelBorder}` }}>
          <div style={{ padding: "8px 14px", borderBottom: `1px solid ${C.panelBorder}`, fontSize: 11, fontWeight: 700, color: C.textDim, letterSpacing: "0.05em" }}>
            LISTĂ ALARME
          </div>
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "90px 80px 1fr 110px", fontSize: 10, fontWeight: 700, color: C.textDim, padding: "6px 14px", borderBottom: `1px solid ${C.panelBorder}` }}>
              <span>DATA</span>
              <span>ORA</span>
              <span>MESAJ</span>
              <span>STARE</span>
            </div>
            {ALARME.map((a, i) => {
              const cs = STARE_COLORI[a.stare];
              return (
                <div
                  key={i}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "90px 80px 1fr 110px",
                    alignItems: "center",
                    fontSize: 11,
                    padding: "7px 14px",
                    background: cs.bg,
                    borderBottom: `1px solid ${C.panelBorder}`,
                  }}
                >
                  <span style={{ color: C.textDim }}>{a.data}</span>
                  <span style={{ color: C.textDim }}>{a.ora}</span>
                  <span style={{ color: C.text }}>{a.mesaj}</span>
                  <span style={{ color: cs.fg, fontWeight: 700 }}>{a.stare}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── STATUS BAR ── */}
      <div style={{ background: C.headerDark, color: "#fff", fontSize: 10, padding: "5px 16px", display: "flex", justifyContent: "space-between" }}>
        <span>PLC: S7-1500 · CONECTAT</span>
        <span>MOD: AUTOMAT</span>
        <span>OPERATOR: SISTEM AI</span>
        <span>{date} {time}</span>
      </div>
    </div>
  );
}