import { useState, useEffect } from "react";

const LINKS = [
  { t: "Миссия",   to: "#mission" },
  { t: "Форматы",  to: "#directions" },
  { t: "Отчёты",   to: "#reports" },
  { t: "Помочь",   to: "#donate" },
  { t: "FAQ",      to: "#faq" },
];

const DRAWER_LINKS = [
  { t: "Участвовать",          to: "#form" },
  { t: "Миссия организации",   to: "#mission" },
  { t: "Как мы работаем",      to: "#how" },
  { t: "Форматы участия",      to: "#directions" },
  { t: "Живые истории",        to: "#stories" },
  { t: "Фото и видео отчёты",  to: "#reports" },
  { t: "Финансовая поддержка", to: "#donate" },
  { t: "Частые вопросы",       to: "#faq" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLink = (to: string) => {
    setOpen(false);
    const el = document.querySelector(to);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <nav style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: scrolled ? "rgba(26,26,46,0.97)" : "#1A1A2E",
        backdropFilter: "blur(12px)",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.08)" : "none",
        transition: "all 0.3s",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", height: 60, display: "flex", alignItems: "center", gap: 16 }}>

          {/* Logo */}
          <a href="#" onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", flexShrink: 0 }}>
            <span style={{ fontSize: "1.5rem", lineHeight: 1 }}>🛡</span>
            <div>
              <div style={{ fontSize: "0.9rem", fontWeight: 800, color: "#fff", letterSpacing: "0.04em", lineHeight: 1.1 }}>ПАТРИОТ ДВ</div>
              <div style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.45)", lineHeight: 1 }}>АНО · Приморский край</div>
            </div>
          </a>

          {/* Trust badge */}
          <div style={{
            marginLeft: 16,
            paddingLeft: 16,
            borderLeft: "1px solid rgba(255,255,255,0.12)",
            fontSize: "0.68rem",
            color: "rgba(255,255,255,0.4)",
            lineHeight: 1.5,
            display: "none",
          }} className="nb-trust">
            <div style={{ color: "rgba(255,255,255,0.6)", fontWeight: 600 }}>🔒 Официальная организация</div>
            <div>ОГРН 1242500028583 · ИНН 2502079223</div>
          </div>

          {/* Desktop links */}
          <div style={{ marginLeft: "auto", display: "flex", gap: 4, alignItems: "center" }} className="nb-links">
            {LINKS.map(l => (
              <button key={l.t} onClick={() => handleLink(l.to)}
                style={{
                  background: "none",
                  border: "none",
                  color: "rgba(255,255,255,0.75)",
                  fontSize: "0.82rem",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  padding: "6px 10px",
                  borderRadius: 6,
                  transition: "color .2s, background .2s",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={e => { (e.target as HTMLButtonElement).style.color = "#fff"; (e.target as HTMLButtonElement).style.background = "rgba(255,255,255,0.08)"; }}
                onMouseLeave={e => { (e.target as HTMLButtonElement).style.color = "rgba(255,255,255,0.75)"; (e.target as HTMLButtonElement).style.background = "none"; }}
              >{l.t}</button>
            ))}
            <button onClick={() => handleLink("#form")}
              style={{
                marginLeft: 8,
                background: "#C0272D",
                border: "none",
                color: "#fff",
                fontSize: "0.82rem",
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "inherit",
                padding: "7px 16px",
                borderRadius: 7,
                whiteSpace: "nowrap",
              }}
            >Участвовать</button>
          </div>

          {/* Burger */}
          <button onClick={() => setOpen(true)}
            className="nb-burger"
            style={{
              marginLeft: "auto",
              background: "none",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: 7,
              width: 38,
              height: 38,
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 5,
              padding: 0,
            }}>
            {[0,1,2].map(i => (
              <span key={i} style={{ display: "block", width: 18, height: 2, background: "rgba(255,255,255,0.8)", borderRadius: 2 }} />
            ))}
          </button>
        </div>

        <style>{`
          @media (min-width: 768px) {
            .nb-links { display: flex !important; }
            .nb-burger { display: none !important; }
            .nb-trust { display: block !important; }
          }
          @media (max-width: 767px) {
            .nb-links { display: none !important; }
            .nb-burger { display: flex !important; }
          }
        `}</style>
      </nav>

      {/* Drawer overlay */}
      {open && (
        <div style={{ position: "fixed", inset: 0, zIndex: 1100, display: "flex" }}>
          <div style={{ flex: 1, background: "rgba(0,0,0,0.5)" }} onClick={() => setOpen(false)} />
          <div style={{
            width: 300,
            background: "#1A1A2E",
            height: "100%",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            padding: "20px 0",
          }}>
            {/* Drawer header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px 20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: "1.4rem" }}>🛡</span>
                <div>
                  <div style={{ fontWeight: 800, color: "#fff", fontSize: "0.9rem" }}>ПАТРИОТ ДВ</div>
                  <div style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.4)" }}>АНО · Приморский край</div>
                </div>
              </div>
              <button onClick={() => setOpen(false)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", fontSize: "1.4rem", cursor: "pointer", lineHeight: 1, padding: 4 }}>✕</button>
            </div>

            {/* Drawer links */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2, padding: "0 12px" }}>
              {DRAWER_LINKS.map(l => (
                <button key={l.t} onClick={() => handleLink(l.to)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "rgba(255,255,255,0.8)",
                    fontSize: "0.92rem",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    padding: "11px 12px",
                    borderRadius: 8,
                    textAlign: "left",
                    transition: "background .2s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.07)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "none")}
                >{l.t}</button>
              ))}
            </div>

            {/* CTA buttons */}
            <div style={{ padding: "20px 16px", display: "flex", flexDirection: "column", gap: 10, borderTop: "1px solid rgba(255,255,255,0.08)", marginTop: 12 }}>
              <button onClick={() => handleLink("#form")}
                style={{ background: "#C0272D", border: "none", color: "#fff", fontWeight: 700, fontSize: "0.9rem", fontFamily: "inherit", padding: "12px", borderRadius: 8, cursor: "pointer" }}>
                Хочу участвовать
              </button>
              <button onClick={() => handleLink("#donate")}
                style={{ background: "#E8A838", border: "none", color: "#1A1A2E", fontWeight: 700, fontSize: "0.9rem", fontFamily: "inherit", padding: "12px", borderRadius: 8, cursor: "pointer" }}>
                Поддержать финансово
              </button>
            </div>

            {/* Trust */}
            <div style={{ padding: "12px 20px", fontSize: "0.65rem", color: "rgba(255,255,255,0.3)", lineHeight: 1.6 }}>
              🔒 Официальная организация · ОГРН 1242500028583 · ИНН 2502079223 · г. Артём, Приморский край
            </div>
          </div>
        </div>
      )}
    </>
  );
}