import { useState, useEffect, useRef } from "react";

const accent = "#ff6b35";
const purple = "#6c4ef2";
const yellow = "#ffd60a";
const green = "#22c55e";
const dark = "#0f0f1a";
const cardBg = "#1a1a2e";

// Simulated stops on the route
const MORNING_STOPS = [
  { id: 1, name: "Liam Doe", address: "12 Acacia Rd", status: "picked_up", time: "06:42", isMyChild: false, coords: { x: 18, y: 72 } },
  { id: 2, name: "Amara Khumalo", address: "8 Blossom St", status: "picked_up", time: "06:55", isMyChild: false, coords: { x: 28, y: 58 } },
  { id: 3, name: "Zara Nkosi", address: "45 Elm Ave", status: "current", time: "07:08", isMyChild: true, coords: { x: 42, y: 44 } },
  { id: 4, name: "Ethan Botha", address: "3 Maple Close", status: "upcoming", time: "07:18", isMyChild: false, coords: { x: 58, y: 35 } },
  { id: 5, name: "Naledi Dlamini", address: "29 Jacaranda Rd", status: "upcoming", time: "07:26", isMyChild: false, coords: { x: 70, y: 26 } },
  { id: 6, name: "School", address: "Greenfield Primary", status: "school", time: "07:45", isMyChild: false, coords: { x: 84, y: 16 } },
];

const AFTERNOON_STOPS = [
  { id: 1, name: "School", address: "Greenfield Primary", status: "picked_up", time: "14:00", isMyChild: false, coords: { x: 84, y: 16 } },
  { id: 2, name: "Naledi Dlamini", address: "29 Jacaranda Rd", status: "picked_up", time: "14:18", isMyChild: false, coords: { x: 70, y: 26 } },
  { id: 3, name: "Ethan Botha", address: "3 Maple Close", status: "current", time: "14:28", isMyChild: false, coords: { x: 58, y: 35 } },
  { id: 4, name: "Zara Nkosi", address: "45 Elm Ave", status: "upcoming", time: "14:38", isMyChild: true, coords: { x: 42, y: 44 } },
  { id: 5, name: "Amara Khumalo", address: "8 Blossom St", status: "upcoming", time: "14:50", isMyChild: false, coords: { x: 28, y: 58 } },
  { id: 6, name: "Liam Doe", address: "12 Acacia Rd", status: "upcoming", time: "15:02", isMyChild: false, coords: { x: 18, y: 72 } },
];

const DRIVER = { name: "Mr. Sipho Ndlovu", vehicle: "Toyota Quantum", plate: "GP 42 RK", rating: 4.9, phone: "+27 82 345 6789", avatar: "👨🏾‍✈️" };

function MapCanvas({ stops, driverPos, tripType }) {
  const myStop = stops.find(s => s.isMyChild);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}>
      {/* Fake map background */}
      <svg width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(108,78,242,0.08)" strokeWidth="1" />
          </pattern>
          <radialGradient id="mapGrad" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor="#1e1b4b" />
            <stop offset="100%" stopColor="#0f0f1a" />
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#mapGrad)" />
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Fake road lines */}
        <path d="M 5% 90% Q 25% 70% 45% 55% T 85% 20%" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="18" strokeLinecap="round" />
        <path d="M 5% 90% Q 25% 70% 45% 55% T 85% 20%" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="14" strokeLinecap="round" />
        <path d="M 10% 80% Q 40% 65% 60% 40% T 90% 10%" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="10" strokeLinecap="round" />

        {/* Route path */}
        <path
          d={`M ${stops[0].coords.x}% ${stops[0].coords.y}% ${stops.slice(1).map(s => `L ${s.coords.x}% ${s.coords.y}%`).join(" ")}`}
          fill="none"
          stroke={accent}
          strokeWidth="3"
          strokeDasharray="6 4"
          opacity="0.7"
        />

        {/* Completed route */}
        {(() => {
          const doneStops = stops.filter(s => s.status === "picked_up");
          if (doneStops.length < 2) return null;
          return (
            <path
              d={`M ${doneStops[0].coords.x}% ${doneStops[0].coords.y}% ${doneStops.slice(1).map(s => `L ${s.coords.x}% ${s.coords.y}%`).join(" ")}`}
              fill="none"
              stroke={green}
              strokeWidth="3.5"
              opacity="0.9"
            />
          );
        })()}

        {/* Stop dots */}
        {stops.map(stop => {
          const isPicked = stop.status === "picked_up";
          const isCurrent = stop.status === "current";
          const isSchool = stop.status === "school";
          const isMe = stop.isMyChild;
          const color = isSchool ? yellow : isPicked ? green : isCurrent ? accent : "rgba(255,255,255,0.3)";
          const r = isMe || isSchool ? 9 : 6;

          return (
            <g key={stop.id}>
              {(isMe || isCurrent) && (
                <circle cx={`${stop.coords.x}%`} cy={`${stop.coords.y}%`} r={r + 8} fill={color} opacity="0.15">
                  <animate attributeName="r" values={`${r + 4};${r + 12};${r + 4}`} dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.2;0.05;0.2" dur="2s" repeatCount="indefinite" />
                </circle>
              )}
              <circle cx={`${stop.coords.x}%`} cy={`${stop.coords.y}%`} r={r} fill={color} stroke="#0f0f1a" strokeWidth="2" />
              {isSchool && (
                <text x={`${stop.coords.x}%`} y={`${stop.coords.y}%`} textAnchor="middle" dominantBaseline="middle" fontSize="9" fill={dark}>🏫</text>
              )}
              {isMe && !isSchool && (
                <text x={`${stop.coords.x}%`} y={`${stop.coords.y - 0.5}%`} textAnchor="middle" dominantBaseline="middle" fontSize="8" fill="#fff">★</text>
              )}
            </g>
          );
        })}

        {/* Driver moving dot */}
        <g>
          <circle cx={`${driverPos.x}%`} cy={`${driverPos.y}%`} r="16" fill="rgba(255,107,53,0.2)">
            <animate attributeName="r" values="14;22;14" dur="1.5s" repeatCount="indefinite" />
          </circle>
          <circle cx={`${driverPos.x}%`} cy={`${driverPos.y}%`} r="11" fill={accent} stroke="#fff" strokeWidth="2.5" />
          <text x={`${driverPos.x}%`} y={`${driverPos.y}%`} textAnchor="middle" dominantBaseline="middle" fontSize="11">🚐</text>
        </g>
      </svg>

      {/* My child label */}
      {myStop && (
        <div style={{
          position: "absolute",
          left: `${myStop.coords.x}%`,
          top: `${myStop.coords.y - 10}%`,
          transform: "translate(-50%, -100%)",
          background: purple,
          color: "#fff",
          borderRadius: "10px",
          padding: "4px 10px",
          fontSize: "10px",
          fontFamily: "'Nunito', sans-serif",
          fontWeight: 800,
          whiteSpace: "nowrap",
          boxShadow: "0 4px 12px rgba(108,78,242,0.5)",
          zIndex: 10,
        }}>
          ⭐ Your Child
          <div style={{
            position: "absolute", bottom: "-5px", left: "50%", transform: "translateX(-50%)",
            width: 0, height: 0,
            borderLeft: "5px solid transparent", borderRight: "5px solid transparent",
            borderTop: `5px solid ${purple}`,
          }} />
        </div>
      )}

      {/* Legend */}
      <div style={{
        position: "absolute", top: "12px", right: "12px",
        background: "rgba(15,15,26,0.85)", borderRadius: "12px",
        padding: "10px 12px", backdropFilter: "blur(8px)",
        border: "1px solid rgba(255,255,255,0.1)",
      }}>
        {[
          { color: green, label: "Picked up" },
          { color: accent, label: "Next stop" },
          { color: "rgba(255,255,255,0.3)", label: "Upcoming" },
          { color: yellow, label: "School" },
        ].map(l => (
          <div key={l.label} style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: l.color, flexShrink: 0 }} />
            <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "10px", fontFamily: "'Nunito', sans-serif", fontWeight: 700 }}>{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TripSummaryModal({ onClose, tripType }) {
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)",
      zIndex: 100, display: "flex", alignItems: "flex-end", justifyContent: "center",
      backdropFilter: "blur(4px)",
    }}>
      <div style={{
        background: cardBg, borderRadius: "28px 28px 0 0",
        width: "100%", maxWidth: "480px", padding: "32px 24px 40px",
        border: "1px solid rgba(255,255,255,0.1)",
        animation: "slideUp 0.35s ease",
      }}>
        <style>{`@keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }`}</style>
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div style={{ fontSize: "56px", marginBottom: "8px" }}>🏠</div>
          <h2 style={{ fontFamily: "'Fredoka One', cursive", fontSize: "26px", color: "#fff", margin: "0 0 6px" }}>
            Zara's Home Safe!
          </h2>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px", margin: 0 }}>
            Drop-off confirmed • {tripType === "morning" ? "Arrived at school" : "Arrived home"}
          </p>
        </div>

        {/* Trip summary */}
        <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: "18px", padding: "20px", marginBottom: "20px" }}>
          <h4 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, color: "rgba(255,255,255,0.5)", fontSize: "11px", letterSpacing: "1.5px", textTransform: "uppercase", margin: "0 0 16px" }}>Trip Summary</h4>
          {[
            { icon: "🕐", label: "Departed", value: tripType === "morning" ? "06:35 AM" : "14:00 PM" },
            { icon: "🏁", label: "Arrived", value: tripType === "morning" ? "07:45 AM" : "14:38 PM" },
            { icon: "⏱️", label: "Duration", value: "1h 10min" },
            { icon: "📍", label: "Stops made", value: "5 stops" },
            { icon: "🚐", label: "Driver", value: "Mr. Sipho Ndlovu" },
          ].map(item => (
            <div key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <span style={{ fontFamily: "'Nunito', sans-serif", color: "rgba(255,255,255,0.5)", fontSize: "14px" }}>
                {item.icon} {item.label}
              </span>
              <span style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, color: "#fff", fontSize: "14px" }}>{item.value}</span>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          style={{
            width: "100%", padding: "16px", borderRadius: "16px", border: "none",
            background: `linear-gradient(135deg, ${green}, #16a34a)`,
            color: "#fff", fontSize: "16px", fontWeight: 800,
            cursor: "pointer", fontFamily: "'Nunito', sans-serif",
            boxShadow: "0 8px 24px rgba(34,197,94,0.3)",
          }}
        >
          ✓ Got it, Thanks!
        </button>
      </div>
    </div>
  );
}

export default function TrackingScreen() {
  const [tripType, setTripType] = useState("morning");
  const [showSummary, setShowSummary] = useState(false);
  const [showStops, setShowStops] = useState(false);
  const [driverPos, setDriverPos] = useState({ x: 35, y: 50 });
  const animRef = useRef(null);
  const tRef = useRef(0);

  const stops = tripType === "morning" ? MORNING_STOPS : AFTERNOON_STOPS;
  const myStop = stops.find(s => s.isMyChild);
  const myStopIndex = stops.findIndex(s => s.isMyChild);
  const currentStop = stops.find(s => s.status === "current");
  const currentIndex = stops.findIndex(s => s.status === "current");
  const pickedUp = stops.filter(s => s.status === "picked_up").length;
  const total = stops.length - 1; // exclude school

  // Animate driver dot
  useEffect(() => {
    const animate = () => {
      tRef.current += 0.008;
      const t = tRef.current % 1;
      const fromStop = stops[currentIndex > 0 ? currentIndex - 1 : 0];
      const toStop = currentStop || stops[currentIndex];
      if (fromStop && toStop) {
        setDriverPos({
          x: fromStop.coords.x + (toStop.coords.x - fromStop.coords.x) * t,
          y: fromStop.coords.y + (toStop.coords.y - fromStop.coords.y) * t,
        });
      }
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [tripType]);

  const stopsAway = myStopIndex - currentIndex;
  const isChildPickedUp = myStop?.status === "picked_up";
  const eta = myStop?.time;

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Fredoka+One&display=swap" rel="stylesheet" />
      <div style={{
        width: "100%", maxWidth: "480px", margin: "0 auto",
        minHeight: "100vh", background: dark,
        fontFamily: "'Nunito', sans-serif", position: "relative",
        overflow: "hidden", display: "flex", flexDirection: "column",
      }}>

        {/* Top bar */}
        <div style={{
          padding: "16px 20px 12px",
          background: "rgba(15,15,26,0.95)", backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          zIndex: 20, position: "relative",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontFamily: "'Fredoka One', cursive", fontSize: "22px", color: "#fff" }}>🚐 RideKidz</span>
          </div>
          {/* Morning / Afternoon toggle */}
          <div style={{
            display: "flex", background: "rgba(255,255,255,0.08)",
            borderRadius: "12px", padding: "3px", gap: "2px",
          }}>
            {["morning", "afternoon"].map(t => (
              <button
                key={t}
                onClick={() => setTripType(t)}
                style={{
                  padding: "6px 14px", borderRadius: "10px", border: "none",
                  background: tripType === t ? `linear-gradient(135deg, ${accent}, ${yellow})` : "transparent",
                  color: tripType === t ? dark : "rgba(255,255,255,0.5)",
                  fontSize: "12px", fontWeight: 800, cursor: "pointer",
                  fontFamily: "'Nunito', sans-serif",
                  transition: "all 0.2s",
                }}
              >
                {t === "morning" ? "☀️ AM" : "🌇 PM"}
              </button>
            ))}
          </div>
        </div>

        {/* Status Banner */}
        <div style={{
          margin: "12px 16px 0",
          background: isChildPickedUp
            ? `linear-gradient(135deg, rgba(34,197,94,0.2), rgba(34,197,94,0.05))`
            : `linear-gradient(135deg, rgba(255,107,53,0.2), rgba(108,78,242,0.1))`,
          borderRadius: "18px",
          padding: "14px 18px",
          border: `1.5px solid ${isChildPickedUp ? "rgba(34,197,94,0.3)" : "rgba(255,107,53,0.3)"}`,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          zIndex: 10,
        }}>
          <div>
            <p style={{ margin: 0, color: "rgba(255,255,255,0.5)", fontSize: "11px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px" }}>
              {isChildPickedUp ? "✅ Status" : "🔴 Live Status"}
            </p>
            <p style={{ margin: "3px 0 0", color: "#fff", fontSize: "15px", fontWeight: 800 }}>
              {isChildPickedUp
                ? tripType === "morning" ? "Zara is on the way to school 🏫" : "Zara is on the way home 🏠"
                : `Driver is ${stopsAway} stop${stopsAway !== 1 ? "s" : ""} away`}
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ margin: 0, color: "rgba(255,255,255,0.4)", fontSize: "10px", fontWeight: 700, textTransform: "uppercase" }}>ETA</p>
            <p style={{ margin: 0, color: yellow, fontSize: "20px", fontWeight: 900 }}>{eta}</p>
          </div>
        </div>

        {/* Stop progress bar */}
        <div style={{ padding: "12px 16px 0" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
            <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px" }}>
              Stop {myStopIndex + 1} of {stops.length} • Your child
            </span>
            <span style={{ color: green, fontSize: "11px", fontWeight: 800 }}>{pickedUp} picked up</span>
          </div>
          <div style={{ height: "6px", background: "rgba(255,255,255,0.08)", borderRadius: "999px", overflow: "hidden" }}>
            <div style={{
              height: "100%", borderRadius: "999px",
              width: `${(pickedUp / (stops.length - 1)) * 100}%`,
              background: `linear-gradient(90deg, ${green}, ${yellow})`,
              transition: "width 0.5s ease",
            }} />
          </div>
        </div>

        {/* Map */}
        <div style={{ flex: 1, margin: "12px 16px", borderRadius: "22px", overflow: "hidden", minHeight: "260px", border: "1px solid rgba(255,255,255,0.08)" }}>
          <MapCanvas stops={stops} driverPos={driverPos} tripType={tripType} />
        </div>

        {/* Driver card */}
        <div style={{
          margin: "0 16px",
          background: cardBg,
          borderRadius: "20px",
          padding: "14px 18px",
          border: "1px solid rgba(255,255,255,0.08)",
          display: "flex", alignItems: "center", gap: "14px",
        }}>
          <div style={{
            width: "48px", height: "48px", borderRadius: "50%",
            background: `linear-gradient(135deg, ${purple}, ${accent})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "24px", flexShrink: 0,
          }}>{DRIVER.avatar}</div>
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontWeight: 900, color: "#fff", fontSize: "14px" }}>{DRIVER.name}</p>
            <p style={{ margin: "2px 0 0", color: "rgba(255,255,255,0.4)", fontSize: "12px" }}>
              {DRIVER.vehicle} • {DRIVER.plate}
            </p>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button style={{
              width: "38px", height: "38px", borderRadius: "12px",
              background: `rgba(34,197,94,0.15)`, border: `1.5px solid rgba(34,197,94,0.3)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "18px", cursor: "pointer",
            }}>📞</button>
            <button style={{
              width: "38px", height: "38px", borderRadius: "12px",
              background: `rgba(108,78,242,0.15)`, border: `1.5px solid rgba(108,78,242,0.3)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "18px", cursor: "pointer",
            }}>💬</button>
          </div>
        </div>

        {/* Stops list toggle */}
        <button
          onClick={() => setShowStops(!showStops)}
          style={{
            margin: "10px 16px 0",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "16px", padding: "12px 18px",
            color: "rgba(255,255,255,0.6)", fontSize: "13px", fontWeight: 800,
            cursor: "pointer", fontFamily: "'Nunito', sans-serif",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            width: "calc(100% - 32px)",
          }}
        >
          <span>📍 View All Stops ({stops.length})</span>
          <span style={{ transition: "transform 0.2s", transform: showStops ? "rotate(180deg)" : "none" }}>▾</span>
        </button>

        {/* Stops list */}
        {showStops && (
          <div style={{ margin: "8px 16px 0", background: cardBg, borderRadius: "18px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)" }}>
            {stops.map((stop, i) => {
              const isPicked = stop.status === "picked_up";
              const isCurrent = stop.status === "current";
              const isSchool = stop.status === "school";
              return (
                <div key={stop.id} style={{
                  display: "flex", alignItems: "center", gap: "12px",
                  padding: "12px 16px",
                  borderBottom: i < stops.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                  background: stop.isMyChild ? "rgba(108,78,242,0.1)" : "transparent",
                }}>
                  <div style={{
                    width: "32px", height: "32px", borderRadius: "50%", flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "15px",
                    background: isSchool ? `rgba(255,214,10,0.15)` : isPicked ? `rgba(34,197,94,0.15)` : isCurrent ? `rgba(255,107,53,0.15)` : "rgba(255,255,255,0.05)",
                    border: `1.5px solid ${isSchool ? yellow : isPicked ? green : isCurrent ? accent : "rgba(255,255,255,0.1)"}`,
                  }}>
                    {isSchool ? "🏫" : isPicked ? "✅" : isCurrent ? "🔴" : `${i + 1}`}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontWeight: 800, color: stop.isMyChild ? yellow : "#fff", fontSize: "13px" }}>
                      {stop.name} {stop.isMyChild ? "⭐" : ""}
                    </p>
                    <p style={{ margin: 0, color: "rgba(255,255,255,0.35)", fontSize: "11px" }}>{stop.address}</p>
                  </div>
                  <span style={{ color: isPicked ? green : isCurrent ? accent : "rgba(255,255,255,0.3)", fontSize: "12px", fontWeight: 800 }}>
                    {stop.time}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* End Trip / Drop-off confirm button (simulate driver action) */}
        <div style={{ padding: "14px 16px 24px" }}>
          <button
            onClick={() => setShowSummary(true)}
            style={{
              width: "100%", padding: "16px", borderRadius: "18px", border: "none",
              background: `linear-gradient(135deg, ${green}, #16a34a)`,
              color: "#fff", fontSize: "16px", fontWeight: 900,
              cursor: "pointer", fontFamily: "'Nunito', sans-serif",
              boxShadow: "0 8px 28px rgba(34,197,94,0.25)",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
            }}
          >
            <span>🏁</span> Simulate: Child Dropped Off
          </button>
          <p style={{ textAlign: "center", color: "rgba(255,255,255,0.2)", fontSize: "11px", margin: "8px 0 0" }}>
            This button is for preview — driver triggers this on their side
          </p>
        </div>

        {showSummary && <TripSummaryModal onClose={() => setShowSummary(false)} tripType={tripType} />}
      </div>
    </>
  );
}
