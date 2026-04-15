import { useState } from "react";

const steps = [
  { id: 1, label: "Account", icon: "👤" },
  { id: 2, label: "Child", icon: "🎒" },
  { id: 3, label: "Address", icon: "📍" },
];

const InputField = ({ label, type = "text", placeholder, value, onChange, icon }) => (
  <div style={{ marginBottom: "18px" }}>
    <label style={{
      display: "block",
      fontFamily: "'Nunito', sans-serif",
      fontWeight: 800,
      fontSize: "11px",
      letterSpacing: "1.5px",
      textTransform: "uppercase",
      color: "#1a1a2e",
      marginBottom: "7px",
    }}>{label}</label>
    <div style={{ position: "relative" }}>
      {icon && (
        <span style={{
          position: "absolute", left: "14px", top: "50%",
          transform: "translateY(-50%)", fontSize: "18px", zIndex: 1,
        }}>{icon}</span>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        style={{
          width: "100%",
          padding: icon ? "14px 14px 14px 44px" : "14px 16px",
          borderRadius: "14px",
          border: "2.5px solid #e8e0ff",
          background: "#fafafe",
          fontFamily: "'Nunito', sans-serif",
          fontSize: "15px",
          fontWeight: 600,
          color: "#1a1a2e",
          outline: "none",
          boxSizing: "border-box",
          transition: "border-color 0.2s, box-shadow 0.2s",
        }}
        onFocus={e => {
          e.target.style.borderColor = "#ff6b35";
          e.target.style.boxShadow = "0 0 0 4px rgba(255,107,53,0.12)";
        }}
        onBlur={e => {
          e.target.style.borderColor = "#e8e0ff";
          e.target.style.boxShadow = "none";
        }}
      />
    </div>
  </div>
);

const SelectField = ({ label, options, value, onChange, icon }) => (
  <div style={{ marginBottom: "18px" }}>
    <label style={{
      display: "block",
      fontFamily: "'Nunito', sans-serif",
      fontWeight: 800,
      fontSize: "11px",
      letterSpacing: "1.5px",
      textTransform: "uppercase",
      color: "#1a1a2e",
      marginBottom: "7px",
    }}>{label}</label>
    <div style={{ position: "relative" }}>
      {icon && (
        <span style={{
          position: "absolute", left: "14px", top: "50%",
          transform: "translateY(-50%)", fontSize: "18px", zIndex: 1,
        }}>{icon}</span>
      )}
      <select
        value={value}
        onChange={onChange}
        style={{
          width: "100%",
          padding: icon ? "14px 14px 14px 44px" : "14px 16px",
          borderRadius: "14px",
          border: "2.5px solid #e8e0ff",
          background: "#fafafe",
          fontFamily: "'Nunito', sans-serif",
          fontSize: "15px",
          fontWeight: 600,
          color: value ? "#1a1a2e" : "#aaa",
          outline: "none",
          appearance: "none",
          boxSizing: "border-box",
          cursor: "pointer",
        }}
      >
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <span style={{
        position: "absolute", right: "14px", top: "50%",
        transform: "translateY(-50%)", fontSize: "16px", pointerEvents: "none",
      }}>▾</span>
    </div>
  </div>
);

export default function ScholarTransportRegister() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "", password: "",
    childName: "", childAge: "", grade: "", school: "",
    street: "", suburb: "", city: "", province: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const accent = "#ff6b35";
  const purple = "#6c4ef2";
  const yellow = "#ffd60a";
  const dark = "#1a1a2e";

  if (submitted) {
    return (
      <>
        <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Fredoka+One&display=swap" rel="stylesheet" />
        <div style={{
          minHeight: "100vh", background: `linear-gradient(135deg, ${purple} 0%, #a855f7 50%, ${accent} 100%)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "'Nunito', sans-serif", padding: "20px",
        }}>
          <div style={{
            background: "#fff", borderRadius: "32px", padding: "56px 40px",
            textAlign: "center", maxWidth: "400px", width: "100%",
            boxShadow: "0 30px 80px rgba(0,0,0,0.25)",
          }}>
            <div style={{ fontSize: "72px", marginBottom: "16px" }}>🎉</div>
            <h2 style={{ fontFamily: "'Fredoka One', cursive", fontSize: "32px", color: dark, margin: "0 0 12px" }}>
              You're Registered!
            </h2>
            <p style={{ color: "#666", fontSize: "16px", lineHeight: 1.6, marginBottom: "32px" }}>
              Welcome to <span style={{ color: purple, fontWeight: 800 }}>RideKidz</span>! Your account is ready. Browse drivers and book your child's transport today.
            </p>
            <button
              onClick={() => { setSubmitted(false); setStep(1); }}
              style={{
                background: `linear-gradient(135deg, ${purple}, ${accent})`,
                color: "#fff", border: "none", borderRadius: "16px",
                padding: "16px 40px", fontSize: "16px", fontWeight: 800,
                cursor: "pointer", letterSpacing: "0.5px",
              }}
            >
              Go to Dashboard →
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Fredoka+One&display=swap" rel="stylesheet" />
      <div style={{
        minHeight: "100vh",
        background: `linear-gradient(160deg, ${dark} 0%, #16213e 40%, ${purple} 100%)`,
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "flex-start", padding: "32px 20px 40px",
        fontFamily: "'Nunito', sans-serif",
      }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "10px",
            background: "rgba(255,255,255,0.08)", borderRadius: "20px",
            padding: "10px 22px", marginBottom: "16px",
            border: "1.5px solid rgba(255,255,255,0.15)",
          }}>
            <span style={{ fontSize: "28px" }}>🚐</span>
            <span style={{
              fontFamily: "'Fredoka One', cursive", fontSize: "24px",
              color: "#fff", letterSpacing: "1px",
            }}>RideKidz</span>
          </div>
          <h1 style={{
            fontFamily: "'Fredoka One', cursive", fontSize: "34px",
            color: "#fff", margin: "0 0 6px", lineHeight: 1.1,
          }}>
            Parent Registration
          </h1>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px", margin: 0 }}>
            Safe & reliable scholar transport 🎒
          </p>
        </div>

        {/* Step Indicators */}
        <div style={{
          display: "flex", alignItems: "center", gap: "0",
          marginBottom: "28px", width: "100%", maxWidth: "420px",
        }}>
          {steps.map((s, i) => (
            <div key={s.id} style={{ display: "flex", alignItems: "center", flex: 1 }}>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{
                  width: "44px", height: "44px", borderRadius: "50%",
                  background: step >= s.id
                    ? `linear-gradient(135deg, ${accent}, ${yellow})`
                    : "rgba(255,255,255,0.12)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: step > s.id ? "18px" : "20px",
                  border: step === s.id ? `3px solid ${yellow}` : "3px solid transparent",
                  boxShadow: step === s.id ? `0 0 20px rgba(255,214,10,0.5)` : "none",
                  transition: "all 0.3s",
                  fontWeight: 900,
                  color: step >= s.id ? dark : "rgba(255,255,255,0.4)",
                }}>
                  {step > s.id ? "✓" : s.icon}
                </div>
                <span style={{
                  fontSize: "10px", fontWeight: 800, letterSpacing: "0.5px",
                  color: step >= s.id ? yellow : "rgba(255,255,255,0.35)",
                  marginTop: "5px", textTransform: "uppercase",
                }}>{s.label}</span>
              </div>
              {i < steps.length - 1 && (
                <div style={{
                  height: "3px", flex: 0.8, marginBottom: "18px",
                  background: step > s.id
                    ? `linear-gradient(90deg, ${accent}, ${yellow})`
                    : "rgba(255,255,255,0.12)",
                  borderRadius: "2px", transition: "background 0.3s",
                }} />
              )}
            </div>
          ))}
        </div>

        {/* Card */}
        <div style={{
          background: "#fff", borderRadius: "28px",
          padding: "32px 28px", width: "100%", maxWidth: "420px",
          boxShadow: "0 24px 60px rgba(0,0,0,0.35)",
          animation: "slideUp 0.4s ease",
        }}>
          <style>{`
            @keyframes slideUp {
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}</style>

          {/* Step 1: Account */}
          {step === 1 && (
            <div>
              <h3 style={{ fontFamily: "'Fredoka One', cursive", fontSize: "22px", color: dark, margin: "0 0 6px" }}>
                👤 Your Account
              </h3>
              <p style={{ color: "#888", fontSize: "13px", marginBottom: "24px" }}>Create your parent login</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 12px" }}>
                <InputField label="First Name" placeholder="Jane" value={form.firstName} onChange={update("firstName")} icon="✏️" />
                <InputField label="Last Name" placeholder="Doe" value={form.lastName} onChange={update("lastName")} icon="✏️" />
              </div>
              <InputField label="Email Address" type="email" placeholder="jane@email.com" value={form.email} onChange={update("email")} icon="📧" />
              <InputField label="Phone Number" type="tel" placeholder="+27 82 000 0000" value={form.phone} onChange={update("phone")} icon="📱" />
              <InputField label="Password" type="password" placeholder="Min. 8 characters" value={form.password} onChange={update("password")} icon="🔒" />
            </div>
          )}

          {/* Step 2: Child */}
          {step === 2 && (
            <div>
              <h3 style={{ fontFamily: "'Fredoka One', cursive", fontSize: "22px", color: dark, margin: "0 0 6px" }}>
                🎒 Your Child's Info
              </h3>
              <p style={{ color: "#888", fontSize: "13px", marginBottom: "24px" }}>Tell us about the learner</p>
              <InputField label="Child's Full Name" placeholder="Liam Doe" value={form.childName} onChange={update("childName")} icon="🧒" />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 12px" }}>
                <InputField label="Age" type="number" placeholder="8" value={form.childAge} onChange={update("childAge")} icon="🎂" />
                <SelectField
                  label="Grade"
                  icon="📚"
                  value={form.grade}
                  onChange={update("grade")}
                  options={[
                    { value: "", label: "Select grade" },
                    ...["Grade R", "Grade 1", "Grade 2", "Grade 3", "Grade 4",
                      "Grade 5", "Grade 6", "Grade 7", "Grade 8", "Grade 9",
                      "Grade 10", "Grade 11", "Grade 12"].map(g => ({ value: g, label: g }))
                  ]}
                />
              </div>
              <InputField label="School Name" placeholder="Greenfield Primary" value={form.school} onChange={update("school")} icon="🏫" />

              {/* Photo upload placeholder */}
              <div style={{
                border: "2.5px dashed #e8e0ff", borderRadius: "16px",
                padding: "20px", textAlign: "center", cursor: "pointer",
                background: "#fafafe",
              }}>
                <div style={{ fontSize: "32px", marginBottom: "8px" }}>📷</div>
                <p style={{ margin: 0, fontWeight: 700, color: purple, fontSize: "14px" }}>Upload Child's Photo</p>
                <p style={{ margin: "4px 0 0", color: "#aaa", fontSize: "12px" }}>Helps drivers identify your child</p>
              </div>
            </div>
          )}

          {/* Step 3: Address */}
          {step === 3 && (
            <div>
              <h3 style={{ fontFamily: "'Fredoka One', cursive", fontSize: "22px", color: dark, margin: "0 0 6px" }}>
                📍 Pickup Address
              </h3>
              <p style={{ color: "#888", fontSize: "13px", marginBottom: "24px" }}>Where should the driver collect your child?</p>
              <InputField label="Street Address" placeholder="12 Acacia Road" value={form.street} onChange={update("street")} icon="🏠" />
              <InputField label="Suburb" placeholder="Sandton" value={form.suburb} onChange={update("suburb")} icon="🏘️" />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 12px" }}>
                <InputField label="City" placeholder="Johannesburg" value={form.city} onChange={update("city")} icon="🌆" />
                <SelectField
                  label="Province"
                  icon="🗺️"
                  value={form.province}
                  onChange={update("province")}
                  options={[
                    { value: "", label: "Province" },
                    "Gauteng", "Western Cape", "KwaZulu-Natal", "Eastern Cape",
                    "Limpopo", "Mpumalanga", "North West", "Free State", "Northern Cape"
                  ].map(p => typeof p === "string" ? { value: p, label: p } : p)}
                />
              </div>

              {/* Map placeholder */}
              <div style={{
                borderRadius: "16px", overflow: "hidden", height: "120px",
                background: `linear-gradient(135deg, #e8f4f8, #d4e8ff)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                border: "2px solid #e8e0ff", cursor: "pointer",
              }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "28px" }}>🗺️</div>
                  <p style={{ margin: "6px 0 0", fontWeight: 700, color: purple, fontSize: "13px" }}>
                    Tap to pin your location
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div style={{ display: "flex", gap: "12px", marginTop: "28px" }}>
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                style={{
                  flex: 1, padding: "15px", borderRadius: "16px",
                  border: `2.5px solid ${purple}`, background: "transparent",
                  color: purple, fontSize: "15px", fontWeight: 800,
                  cursor: "pointer", fontFamily: "'Nunito', sans-serif",
                }}
              >
                ← Back
              </button>
            )}
            <button
              onClick={() => step < 3 ? setStep(step + 1) : setSubmitted(true)}
              style={{
                flex: 2, padding: "15px", borderRadius: "16px",
                border: "none",
                background: `linear-gradient(135deg, ${accent} 0%, ${yellow} 100%)`,
                color: dark, fontSize: "16px", fontWeight: 900,
                cursor: "pointer", fontFamily: "'Nunito', sans-serif",
                letterSpacing: "0.3px",
                boxShadow: `0 8px 24px rgba(255,107,53,0.35)`,
                transition: "transform 0.1s, box-shadow 0.1s",
              }}
              onMouseDown={e => e.currentTarget.style.transform = "scale(0.97)"}
              onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
            >
              {step < 3 ? "Continue →" : "🎉 Register Now"}
            </button>
          </div>

          <p style={{ textAlign: "center", marginTop: "20px", fontSize: "13px", color: "#999" }}>
            Already have an account?{" "}
            <span style={{ color: purple, fontWeight: 800, cursor: "pointer" }}>Sign In</span>
          </p>
        </div>

        {/* Driver CTA */}
        <div style={{
          marginTop: "24px", textAlign: "center",
          background: "rgba(255,255,255,0.06)", borderRadius: "18px",
          padding: "16px 28px", maxWidth: "420px", width: "100%",
          border: "1.5px solid rgba(255,255,255,0.12)",
        }}>
          <p style={{ color: "rgba(255,255,255,0.7)", margin: 0, fontSize: "13px" }}>
            Are you a driver?{" "}
            <span style={{ color: yellow, fontWeight: 800, cursor: "pointer" }}>
              Register here →
            </span>
          </p>
        </div>
      </div>
    </>
  );
}
