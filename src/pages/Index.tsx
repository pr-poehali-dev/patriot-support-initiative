import { useState, useEffect, useRef } from "react";
import ReportsBlock from "@/components/ReportsBlock";

/* ── helpers ── */
function useCountUp(target: number, duration = 1800, active = false) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setVal(Math.floor(p * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [active, target, duration]);
  return val;
}

function Counter({ n, suffix, label }: { n: number; suffix: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [go, setGo] = useState(false);
  const v = useCountUp(n, 1800, go);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setGo(true); }, { threshold: 0.4 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ textAlign: "center" }}>
      <span style={{ display: "block", fontSize: "2.2rem", fontWeight: 800, color: "var(--gold)", lineHeight: 1 }}>
        {v.toLocaleString("ru-RU")}{suffix}
      </span>
      <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.55)", marginTop: 6, display: "block" }}>{label}</span>
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid var(--border)" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{ width: "100%", background: "none", border: "none", textAlign: "left", padding: "18px 4px", fontSize: "0.95rem", fontWeight: 600, color: "var(--text)", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, fontFamily: "inherit" }}
      >
        {q}
        <span style={{ color: "var(--red)", transition: "transform .25s", transform: open ? "rotate(180deg)" : "none", flexShrink: 0 }}>▾</span>
      </button>
      {open && <div style={{ fontSize: "0.88rem", color: "var(--muted)", padding: "0 4px 18px", lineHeight: 1.65 }}>{a}</div>}
    </div>
  );
}

function copyToClipboard(text: string, setCopied: (v: boolean) => void) {
  navigator.clipboard.writeText(text).catch(() => {
    const ta = document.createElement("textarea");
    ta.value = text; document.body.appendChild(ta); ta.select(); document.execCommand("copy"); document.body.removeChild(ta);
  });
  setCopied(true);
  setTimeout(() => setCopied(false), 2000);
}

function PayRow({ icon, label, value, actionLabel = "Копировать", onAction }: { icon: string; label: string; value: string; actionLabel?: string; onAction: () => void }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, background: "var(--light)", borderRadius: 10, padding: "14px 16px", marginBottom: 12 }}>
      <span style={{ fontSize: "1.4rem", flexShrink: 0 }}>{icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: "0.78rem", color: "var(--muted)" }}>{label}</div>
        <div style={{ fontSize: "0.88rem", fontWeight: 700, fontFamily: "monospace", letterSpacing: "0.04em", wordBreak: "break-all" }}>{value}</div>
      </div>
      <button onClick={onAction} style={{ marginLeft: "auto", background: "var(--white)", border: "1px solid var(--border)", padding: "5px 10px", borderRadius: 6, cursor: "pointer", fontSize: "0.72rem", color: "var(--muted)", flexShrink: 0, fontFamily: "inherit" }}>
        {actionLabel}
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────── */
export default function Index() {
  const [formSent, setFormSent] = useState(false);
  const [copied1, setCopied1] = useState(false);
  const [copied2, setCopied2] = useState(false);
  const [copiedPurpose, setCopiedPurpose] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const [showRekvizity, setShowRekvizity] = useState(false);
  const [copiedRekv, setCopiedRekv] = useState(false);
  const REKVIZITY = `Наименование: АНО "ПАТРИОТ ДВ"\nИНН: 2502079223\nКПП: 250201001\nОГРН: 1242500028583\nРасчётный счёт: 40703810850000004163\nБанк: ДАЛЬНЕВОСТОЧНЫЙ БАНК ПАО СБЕРБАНК\nБИК банка: 040813608\nКорсчёт: 30101810600000000608\nИНН банка: 7707083893\nКПП банка: 254002002`;
  const [activeAmount, setActiveAmount] = useState("500 ₽");

  const amountDescs: Record<string, string> = {
    "100 ₽": "100 ₽ — метр ткани для маскировочного изделия",
    "300 ₽": "300 ₽ — расходные материалы для одного занятия в мастерской",
    "500 ₽": "500 ₽ — тёплые вещи для одной гуманитарной посылки",
    "1 000 ₽": "1 000 ₽ — полная комплектация одной посылки с вещами первой необходимости",
    "Своя сумма": "Любая сумма имеет значение и будет направлена на уставную деятельность",
  };

  const PURPOSE = "Добровольное пожертвование на уставную деятельность АНО содействия сохранению исторического наследия и патриотического воспитания «ПАТРИОТ ДВ», ИНН 2502079223, ОГРН 1242500028583. НДС не облагается.";

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", color: "var(--text)", background: "var(--white)", lineHeight: 1.7 }}>
      <style>{`
        :root {
          --red:    #C0272D;
          --dark:   #1A1A2E;
          --navy:   #16213E;
          --gold:   #E8A838;
          --light:  #F5F5F0;
          --white:  #FFFFFF;
          --text:   #2C2C2C;
          --muted:  #666666;
          --border: #E0DDD5;
          --radius: 12px;
          --shadow: 0 4px 24px rgba(0,0,0,0.10);
        }
        h1,h2,h3,h4,h5 { line-height:1.25; margin:0 0 .5em; }
        h1 { font-size: clamp(1.8rem,4vw,2.8rem); font-weight:800; }
        h2 { font-size: clamp(1.4rem,3vw,2rem); font-weight:700; }
        h3 { font-size:1.15rem; font-weight:700; }
        p  { margin-bottom:.8em; }
        a  { text-decoration:none; }
        * { box-sizing:border-box; }
        .c { max-width:1080px; margin:0 auto; padding:0 20px; }
        .sec { padding:72px 0; }
        .btn {
          display:inline-block; padding:14px 28px; border-radius:var(--radius);
          font-weight:700; font-size:.95rem; cursor:pointer; border:none;
          transition:all .2s; text-align:center; font-family:inherit; text-decoration:none;
        }
        .btn-p { background:var(--red); color:#fff; box-shadow:0 4px 16px rgba(192,39,45,.4); }
        .btn-p:hover { background:#A01E23; transform:translateY(-1px); }
        .btn-o { background:transparent; color:#fff; border:2px solid rgba(255,255,255,.3); }
        .btn-o:hover { border-color:#fff; background:rgba(255,255,255,.08); }
        .btn-g { background:var(--gold); color:var(--dark); box-shadow:0 4px 16px rgba(232,168,56,.4); }
        .btn-g:hover { background:#D4942A; }
        .btn-d { background:var(--dark); color:#fff; }
        .btn-d:hover { background:#0d0d1e; }
        .btn-full { width:100%; display:block; }
        .bg-r { background:var(--light); }
        .lbl { display:inline-block; background:var(--red); color:#fff; font-size:.7rem; font-weight:700; letter-spacing:.08em; text-transform:uppercase; padding:4px 12px; border-radius:30px; margin-bottom:12px; }
        .lbl.g { background:var(--gold); color:var(--dark); }
        .lbl.n { background:var(--navy); color:#fff; }
        .shdr { text-align:center; margin-bottom:48px; }
        .shdr p { color:var(--muted); max-width:560px; margin:12px auto 0; }
        .fg { display:flex; gap:12px; flex-wrap:wrap; }
        .fi { margin-bottom:14px; }
        .fi label { display:block; font-size:.8rem; font-weight:600; color:var(--muted); margin-bottom:5px; }
        .fi input,.fi select { width:100%; padding:11px 14px; border:1.5px solid var(--border); border-radius:8px; font-size:.9rem; font-family:inherit; transition:border-color .2s; background:var(--white); }
        .fi input:focus,.fi select:focus { outline:none; border-color:var(--red); }
        .cr { display:flex; gap:8px; align-items:flex-start; margin-bottom:10px; }
        .cr input[type=checkbox] { width:auto; margin-top:3px; accent-color:var(--red); flex-shrink:0; }
        .cr label { font-size:.82rem; color:var(--text); font-weight:400; margin:0; cursor:pointer; }
        .hbadge { display:inline-flex; align-items:center; gap:8px; background:rgba(255,255,255,.08); border:1px solid rgba(255,255,255,.15); padding:6px 14px; border-radius:30px; font-size:.78rem; color:rgba(255,255,255,.7); margin-bottom:20px; }
        .pillar { display:flex; gap:16px; align-items:flex-start; background:var(--white); padding:18px; border-radius:var(--radius); box-shadow:var(--shadow); border-left:4px solid var(--red); margin-bottom:14px; }
        .pillar-i { font-size:1.6rem; flex-shrink:0; }
        .pillar h4 { font-size:.95rem; margin-bottom:4px; }
        .pillar p { font-size:.83rem; color:var(--muted); margin:0; }
        .step { text-align:center; padding:28px 20px; }
        .step-n { width:52px; height:52px; border-radius:50%; background:var(--red); color:#fff; font-size:1.2rem; font-weight:800; display:flex; align-items:center; justify-content:center; margin:0 auto 16px; }
        .step h4 { font-size:.95rem; margin-bottom:8px; }
        .step p { font-size:.82rem; color:var(--muted); margin:0; }
        .pcard { background:var(--white); border-radius:16px; padding:28px; box-shadow:var(--shadow); border-top:4px solid var(--red); display:flex; flex-direction:column; transition:transform .2s, box-shadow .2s; }
        .pcard:hover { transform:translateY(-4px); box-shadow:0 12px 40px rgba(0,0,0,.14); }
        .pcard-i { font-size:2rem; margin-bottom:14px; }
        .pcard h3 { margin-bottom:10px; font-size:1.05rem; }
        .pcard p { font-size:.85rem; color:var(--muted); flex:1; }
        .pcard .btn { margin-top:20px; font-size:.85rem; padding:10px 20px; }
        .tags { display:flex; flex-wrap:wrap; gap:6px; margin:10px 0 0; }
        .tag { font-size:.72rem; background:var(--light); padding:3px 10px; border-radius:20px; color:var(--muted); }
        .scard { background:var(--white); border-radius:var(--radius); overflow:hidden; box-shadow:var(--shadow); }
        .simg { height:140px; display:flex; align-items:center; justify-content:center; font-size:3rem; }
        .sbody { padding:20px; }
        .sbody h4 { font-size:.95rem; margin-bottom:8px; }
        .sbody p { font-size:.82rem; color:var(--muted); margin:0; }
        .squad { font-style:italic; font-size:.85rem; color:var(--text); border-left:3px solid var(--gold); padding-left:12px; margin:10px 0 0; }
        .tbadge { display:flex; align-items:center; gap:8px; background:var(--white); padding:10px 18px; border-radius:30px; font-size:.8rem; box-shadow:0 2px 10px rgba(0,0,0,.07); color:var(--text); }
        .abtn { padding:8px 18px; border-radius:8px; border:2px solid var(--border); background:var(--white); font-size:.85rem; font-weight:600; cursor:pointer; transition:all .2s; color:var(--text); font-family:inherit; }
        .abtn:hover,.abtn.on { border-color:var(--gold); background:var(--gold); color:var(--dark); }
        .pp { background:#FFF8E1; border:1px solid #FFE082; border-radius:10px; padding:14px 16px; margin:16px 0; }
        .pp-l { font-size:.72rem; font-weight:700; color:#B8860B; text-transform:uppercase; letter-spacing:.05em; margin-bottom:6px; }
        .pp-t { font-size:.8rem; color:var(--text); line-height:1.5; }
        .fcol h5 { font-size:.8rem; text-transform:uppercase; letter-spacing:.06em; color:rgba(255,255,255,.7); margin-bottom:10px; }
        .fcol p,.fcol a { font-size:.78rem; color:rgba(255,255,255,.45); display:block; margin-bottom:4px; }
        .fcol a:hover { color:var(--gold); }
        .sticky { display:none; position:fixed; bottom:0; left:0; right:0; background:var(--red); color:#fff; padding:14px 20px; text-align:center; font-weight:700; font-size:.95rem; text-decoration:none; z-index:999; box-shadow:0 -4px 20px rgba(0,0,0,.2); }
        @media(max-width:860px){
          .hero-g{grid-template-columns:1fr !important;}
          .mg{grid-template-columns:1fr !important;}
          .sg{grid-template-columns:repeat(2,1fr) !important;}
          .cg{grid-template-columns:1fr !important;}
          .stg{grid-template-columns:repeat(2,1fr) !important;}
          .xg{grid-template-columns:1fr !important;}
          .sticky{display:block;}
          body{padding-bottom:56px;}
        }
        @media(max-width:480px){
          .sec{padding:48px 0;}
          .sg{grid-template-columns:1fr !important;}
          .stg{grid-template-columns:1fr !important;}
        }
      `}</style>

      {/* HEADER */}
      <header style={{ background: "var(--dark)", padding: "14px 0", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 12px rgba(0,0,0,.3)" }}>
        <div className="c" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 44, height: 44, background: "var(--red)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem" }}>🛡</div>
            <div>
              <strong style={{ display: "block", fontSize: "1rem", letterSpacing: "0.04em", color: "#fff" }}>ПАТРИОТ ДВ</strong>
              <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,.55)" }}>АНО · Приморский край</span>
            </div>
          </div>
          <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,.5)", textAlign: "right", lineHeight: 1.4 }}>
            <strong style={{ color: "rgba(255,255,255,.8)" }}>🔒 Официальная организация</strong><br />
            ОГРН 1242500028583 · ИНН 2502079223
          </div>
        </div>
      </header>

      {/* HERO */}
      <section style={{ background: "linear-gradient(135deg,var(--dark) 0%,var(--navy) 60%,#0F3460 100%)", color: "#fff", padding: "80px 0 72px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
        <div className="c">
          <div className="hero-g" style={{ position: "relative", display: "grid", gridTemplateColumns: "1fr 420px", gap: 48, alignItems: "center" }}>
            <div>
              <div className="hbadge"><span style={{ color: "#6BCB77", fontSize: "0.65rem" }}>●</span> Работаем по всему Приморскому краю</div>
              <h1 style={{ marginBottom: 18 }}>
                Каждый житель Приморья<br />
                может сделать{" "}
                <em style={{ fontStyle: "normal", background: "linear-gradient(90deg,var(--gold),#F7D070)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>что-то конкретное</em><br />
                для тех, кто служит Родине
              </h1>
              <p style={{ fontSize: "1.05rem", color: "rgba(255,255,255,.75)", marginBottom: 28, maxWidth: 520 }}>
                АНО «ПАТРИОТ ДВ» — официальная некоммерческая организация Приморского края. Содействуем сохранению исторического и культурного наследия, патриотическому воспитанию молодёжи и поддержке тех, кто служит Отечеству.
              </p>
              <div style={{ background: "rgba(192,39,45,.15)", borderLeft: "3px solid var(--red)", padding: "14px 18px", borderRadius: "0 8px 8px 0", fontSize: "0.92rem", color: "rgba(255,255,255,.85)", marginBottom: 32, fontStyle: "italic" }}>
                «За одним столом плетут маскировочные сети школьники, ветераны и предприниматели — каждое изделие уходит с сигналом: о вас помнят, вы не одни.»
              </div>
              <div style={{ display: "flex", gap: 24, flexWrap: "wrap", marginBottom: 36 }}>
                {[["120+", "волонтёров в крае"], ["40+", "акций проведено"], ["15+", "школ-партнёров"], ["2024", "год основания"]].map(([n, l]) => (
                  <div key={l} style={{ textAlign: "center" }}>
                    <span style={{ display: "block", fontSize: "1.6rem", fontWeight: 800, color: "var(--gold)", lineHeight: 1 }}>{n}</span>
                    <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,.5)", marginTop: 2 }}>{l}</span>
                  </div>
                ))}
              </div>
              <div className="fg">
                <a href="#form" className="btn btn-p">Хочу участвовать →</a>
                <a href="#directions" className="btn btn-o">Как могу помочь</a>
              </div>
            </div>

            {/* HERO FORM */}
            <div id="form" style={{ background: "var(--white)", borderRadius: 16, padding: 32, boxShadow: "0 20px 60px rgba(0,0,0,.35)", color: "var(--text)" }}>
              {formSent ? (
                <div style={{ textAlign: "center", padding: "32px 0" }}>
                  <div style={{ fontSize: "3rem", marginBottom: 16 }}>✅</div>
                  <h3 style={{ marginBottom: 8 }}>Заявка отправлена!</h3>
                  <p style={{ fontSize: "0.88rem", color: "var(--muted)" }}>Свяжемся с вами в течение рабочего дня.</p>
                </div>
              ) : (
                <>
                  <h3 style={{ fontSize: "1.1rem", marginBottom: 6 }}>Выберите удобный формат участия</h3>
                  <p style={{ fontSize: "0.85rem", color: "var(--muted)", marginBottom: 20 }}>Заполните форму — свяжемся в течение рабочего дня и всё объясним</p>
                  <form onSubmit={(e) => { e.preventDefault(); setFormSent(true); }}>
                    <div className="fi"><label>Ваше имя</label><input type="text" placeholder="Как к вам обращаться?" required /></div>
                    <div className="fi"><label>Телефон или ник ВКонтакте</label><input type="text" placeholder="+7 (___) ___-__-__ или @nik" required /></div>
                    <div className="fi"><label>Город / район Приморья</label><input type="text" placeholder="Артём, Владивосток, Уссурийск…" /></div>
                    <div className="fi">
                      <label>Как хотите участвовать?</label>
                      <select>
                        <option value="">— выберите вариант —</option>
                        <option>Прийти лично — плести, собирать, помогать</option>
                        <option>Передать материалы или вещи</option>
                        <option>Школа / клуб / организация (партнёрство)</option>
                        <option>Информационная поддержка</option>
                        <option>Финансовая помощь</option>
                        <option>Ещё не решил(а) — расскажите подробнее</option>
                      </select>
                    </div>
                    <div className="cr">
                      <input type="checkbox" id="pd" required />
                      <label htmlFor="pd">Согласен(а) на обработку персональных данных. Контакты не передаются третьим лицам.</label>
                    </div>
                    <button type="submit" className="btn btn-p btn-full">Отправить заявку</button>
                    <div style={{ fontSize: "0.72rem", color: "var(--muted)", marginTop: 10, textAlign: "center" }}>🔒 Данные защищены · Ответим в течение дня</div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* MISSION */}
      <div className="sec">
        <div className="c">
          <div className="mg" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "start" }}>
            <div>
              <span className="lbl">Наша миссия</span>
              <h2>Содействие сохранению исторического и культурного наследия Приморья</h2>
              <p style={{ color: "var(--muted)" }}>Мы убеждены: любовь к Родине — это не лозунг, а ежедневные действия. АНО «ПАТРИОТ ДВ» создаёт условия, в которых каждый житель Приморского края может стать частью живой истории своей страны.</p>
              <p style={{ color: "var(--muted)" }}>Работаем с детьми и молодёжью, ветеранами, школами, предприятиями и общественными организациями — от Артёма до самых отдалённых районов Приморского края.</p>
              <p style={{ fontSize: "0.82rem", color: "var(--muted)" }}>Организация официально зарегистрирована и действует в соответствии с Уставом и законодательством Российской Федерации.<br /><strong style={{ color: "var(--text)" }}>ОГРН 1242500028583 · ИНН 2502079223</strong></p>
            </div>
            <div>
              {[
                ["📜", "Историческая и культурная память", "Совместные проекты со школами, музеями и ветеранскими организациями края. Живое слово, а не только учебники."],
                ["🎖", "Патриотическое воспитание молодёжи", "Уроки мужества, встречи с ветеранами, турниры и акции по всему Приморскому краю. Бесплатно для школ."],
                ["🤝", "Поддержка тех, кто служит Отечеству", "Гуманитарные акции, волонтёрские мастерские, адресная помощь военнослужащим и их семьям."],
                ["👨‍👩‍👧‍👦", "Межпоколенческое единство", "За одним столом — школьники, пенсионеры и предприниматели. Преемственность поколений как живая традиция."],
              ].map(([icon, title, desc]) => (
                <div key={title} className="pillar">
                  <div className="pillar-i">{icon}</div>
                  <div><h4>{title}</h4><p>{desc}</p></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* STATS BAR */}
      <div style={{ background: "var(--dark)", color: "#fff", padding: "48px 0" }}>
        <div className="c">
          <div className="stg" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
            <Counter n={120} suffix="+" label="Волонтёров по Приморью" />
            <Counter n={40} suffix="+" label="Проведённых акций" />
            <Counter n={15} suffix="+" label="Школ и клубов-партнёров" />
            <Counter n={100} suffix="%" label="Открытая отчётность" />
          </div>
        </div>
      </div>

      {/* HOW WE WORK */}
      <div className="sec bg-r">
        <div className="c">
          <div className="shdr">
            <span className="lbl n">Как мы работаем</span>
            <h2>Каждый проект — от задачи до публичного отчёта</h2>
            <p>Прозрачная структура работы, которую может проверить любой желающий</p>
          </div>
          <div className="sg" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 24 }}>
            {[
              ["1", "Определяем приоритеты", "Выбираем, кому нужна помощь больше всего: воспитательные программы, историческая память, поддержка ветеранов и их семей."],
              ["2", "Привлекаем участников", "Волонтёры, школы, предприятия и организации Приморского края — рядом с нами те, кому небезразлично."],
              ["3", "Реализуем вместе", "Уроки мужества, патриотические акции, гуманитарные мероприятия и культурные проекты по всему краю."],
              ["4", "Публикуем отчёт", "Фото, видео, цифры — каждое мероприятие задокументировано и доступно в открытом доступе."],
            ].map(([n, title, desc]) => (
              <div key={n} className="step"><div className="step-n">{n}</div><h4>{title}</h4><p>{desc}</p></div>
            ))}
          </div>
        </div>
      </div>

      {/* DIRECTIONS */}
      <div className="sec" id="directions">
        <div className="c">
          <div className="shdr">
            <span className="lbl">Как вы можете помочь</span>
            <h2>Выберите удобный формат участия</h2>
            <p>Не нужен опыт и особые навыки — всему обучим на месте. Главное — желание.</p>
          </div>
          <div className="cg" style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 24 }}>
            {[
              { icon: "🙌", color: "var(--red)", title: "Прийти лично — руки и время", desc: "Плетение маскировочных изделий, упаковка гуманитарных посылок, помощь на мероприятиях и акциях по всему Приморскому краю. Приходите одни или с детьми — всему научим на месте.", tags: ["Без опыта", "С детьми", "Весь край"], btnCls: "btn-p", btnText: "Узнать ближайшую точку →" },
              { icon: "📦", color: "#2176AE", title: "Передать материалы и ресурсы", desc: "Ткань, нити, тёплые вещи, продукты питания, транспорт — по актуальному списку нужд. Можно передать из любого города края.", tags: ["Из любого города", "Актуальный список"], btnCls: "btn-d", btnText: "Получить список нужд →" },
              { icon: "🏫", color: "#4CAF50", title: "Школам, клубам и организациям", desc: "Проведём урок мужества, патриотический турнир или совместный культурный проект. Полностью берём подготовку на себя. Бесплатно для образовательных учреждений.", tags: ["Бесплатно", "Весь край", "Любой возраст"], btnCls: "btn-d", btnText: "Стать партнёром →" },
              { icon: "📢", color: "var(--gold)", title: "Информационная поддержка", desc: "Рассказывайте о наших акциях и привлекайте новых участников. Подходит для блогеров, телеграм-каналов и местных СМИ — даже небольшая аудитория имеет значение.", tags: ["Удалённо", "Любая аудитория"], btnCls: "btn-d", btnText: "Стать инфопартнёром →" },
            ].map(({ icon, color, title, desc, tags, btnCls, btnText }) => (
              <div key={title} className="pcard" style={{ borderTopColor: color }}>
                <div className="pcard-i">{icon}</div>
                <h3>{title}</h3>
                <p>{desc}</p>
                <div className="tags">{tags.map(t => <span key={t} className="tag">{t}</span>)}</div>
                <a href="#form" className={`btn ${btnCls}`}>{btnText}</a>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* STORIES */}
      <div className="sec bg-r">
        <div className="c">
          <div className="shdr">
            <span className="lbl g">Живые истории</span>
            <h2>Не лозунги — конкретные люди и события</h2>
            <p>Жители Приморья, которые уже делают что-то важное рядом с вами</p>
          </div>
          <div className="xg" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
            {[
              { bg: "linear-gradient(135deg,#2E4A7A,#3A6098)", emoji: "🎖", title: "Ветераны Приморья — вместе с молодёжью", desc: "Регулярные встречи, где ветераны передают живую историю — не по учебнику, а лично. Студенты и школьники слушают, задают вопросы и остаются помогать.", quote: "«Когда слышишь это от живого человека — это совсем другое.»" },
              { bg: "linear-gradient(135deg,#1B4332,#2D6A4F)", emoji: "🧵", title: "Школьники за столами мастерской", desc: "Ребята остаются после уроков, чтобы плести изделия и собирать посылки. За одним столом — ученики начальных классов, старшеклассники и пенсионеры.", quote: "«Я не знала, что умею что-то важное. Теперь знаю.»" },
              { bg: "linear-gradient(135deg,#3D0C02,#C0272D)", emoji: "❤️", title: "Семьи военнослужащих — не одни", desc: "Адресная поддержка семей тех, кто сейчас несёт службу. Гуманитарные посылки, психологическая поддержка, совместные мероприятия для детей.", quote: "«Знать, что тебя не забыли — это уже очень много.»" },
            ].map(({ bg, emoji, title, desc, quote }) => (
              <div key={title} className="scard">
                <div className="simg" style={{ background: bg }}>{emoji}</div>
                <div className="sbody"><h4>{title}</h4><p>{desc}</p><div className="squad">{quote}</div></div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 20, justifyContent: "center", marginTop: 48 }}>
            {[["✅", "Официальная НКО, ОГРН 1242500028583"], ["📋", "Открытые отчёты о каждом мероприятии"], ["🗺", "Работаем по всему Приморскому краю"], ["🏫", "Партнёры — школы, ветеранские организации, клубы"]].map(([ic, txt]) => (
              <div key={txt} className="tbadge"><span>{ic}</span>{txt}</div>
            ))}
          </div>
        </div>
      </div>

      {/* DONATION */}
      <div className="sec" id="donate">
        <div className="c">
          <div className="mg" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "start" }}>
            <div>
              <span className="lbl">Финансовая поддержка</span>
              <h2>Помочь деятельности организации</h2>
              <p style={{ color: "var(--muted)", fontSize: "0.95rem" }}>АНО «ПАТРИОТ ДВ» — официально зарегистрированная некоммерческая организация. Добровольные пожертвования направляются исключительно на уставную деятельность.</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, margin: "20px 0" }}>
                {["100 ₽", "300 ₽", "500 ₽", "1 000 ₽", "Своя сумма"].map(a => (
                  <button key={a} className={`abtn${activeAmount === a ? " on" : ""}`} onClick={() => setActiveAmount(a)}>{a}</button>
                ))}
              </div>
              <p style={{ fontSize: "0.8rem", color: "var(--muted)", marginBottom: 24 }}>{amountDescs[activeAmount]}</p>
              <p style={{ fontSize: "0.82rem", color: "var(--muted)" }}>Финансовая отчётность публикуется в открытом доступе в соответствии с требованиями Федерального закона «О некоммерческих организациях».</p>
            </div>
            <div style={{ background: "var(--white)", borderRadius: 16, padding: 28, boxShadow: "var(--shadow)" }}>
              <h3 style={{ fontSize: "1rem", marginBottom: 16 }}>Выберите удобный способ перевода</h3>
              <div style={{ background: "var(--light)", borderRadius: 10, padding: "14px 16px", marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: "1.4rem", flexShrink: 0 }}>🏦</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "0.78rem", color: "var(--muted)" }}>Расчётный счёт организации</div>
                    <div style={{ fontSize: "0.88rem", fontWeight: 700 }}>Реквизиты</div>
                  </div>
                  <button onClick={() => setShowRekvizity(!showRekvizity)} style={{ marginLeft: "auto", background: showRekvizity ? "var(--red)" : "var(--white)", border: `1px solid ${showRekvizity ? "var(--red)" : "var(--border)"}`, padding: "5px 10px", borderRadius: 6, cursor: "pointer", fontSize: "0.72rem", color: showRekvizity ? "#fff" : "var(--muted)", flexShrink: 0, fontFamily: "inherit", transition: "all .2s" }}>
                    {showRekvizity ? "Скрыть" : "Показать"}
                  </button>
                </div>
                {showRekvizity && (
                  <div style={{ marginTop: 14, background: "var(--white)", borderRadius: 8, padding: "14px 16px", fontSize: "0.82rem", lineHeight: 1.9 }}>
                    {[
                      ["Наименование", 'АНО "ПАТРИОТ ДВ"'],
                      ["ИНН", "2502079223"],
                      ["КПП", "250201001"],
                      ["ОГРН", "1242500028583"],
                      ["Расчётный счёт", "40703810850000004163"],
                      ["Банк", "ДАЛЬНЕВОСТОЧНЫЙ БАНК ПАО СБЕРБАНК"],
                      ["БИК банка", "040813608"],
                      ["Корсчёт", "30101810600000000608"],
                      ["ИНН банка", "7707083893"],
                      ["КПП банка", "254002002"],
                    ].map(([k, v]) => (
                      <div key={k} style={{ display: "flex", gap: 8, borderBottom: "1px solid var(--border)", padding: "4px 0" }}>
                        <span style={{ color: "var(--muted)", minWidth: 140, flexShrink: 0 }}>{k}</span>
                        <span style={{ fontWeight: 600, fontFamily: "monospace", wordBreak: "break-all" }}>{v}</span>
                      </div>
                    ))}
                    <button onClick={() => copyToClipboard(REKVIZITY, setCopiedRekv)} style={{ marginTop: 12, display: "block", width: "100%", textAlign: "center", padding: "8px", background: copiedRekv ? "#E8F5E9" : "var(--light)", border: `1px solid ${copiedRekv ? "#A5D6A7" : "var(--border)"}`, borderRadius: 6, cursor: "pointer", fontSize: "0.78rem", fontFamily: "inherit", color: copiedRekv ? "#2E7D32" : "var(--text)", transition: "all .2s" }}>
                      {copiedRekv ? "✅ Реквизиты скопированы" : "📋 Скопировать все реквизиты"}
                    </button>
                  </div>
                )}
              </div>
              <div style={{ background: "var(--light)", borderRadius: 10, padding: "14px 16px", marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: "1.4rem", flexShrink: 0 }}>📷</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "0.78rem", color: "var(--muted)" }}>Оплата по QR-коду</div>
                    <div style={{ fontSize: "0.88rem", fontWeight: 700 }}>Сканируйте камерой телефона</div>
                  </div>
                  <button onClick={() => setShowQr(!showQr)} style={{ marginLeft: "auto", background: showQr ? "var(--red)" : "var(--white)", border: `1px solid ${showQr ? "var(--red)" : "var(--border)"}`, padding: "5px 10px", borderRadius: 6, cursor: "pointer", fontSize: "0.72rem", color: showQr ? "#fff" : "var(--muted)", flexShrink: 0, fontFamily: "inherit", transition: "all .2s" }}>
                    {showQr ? "Скрыть" : "Показать"}
                  </button>
                </div>
                {showQr && (
                  <div style={{ marginTop: 14, textAlign: "center" }}>
                    <img src="https://cdn.poehali.dev/projects/288ea0fa-c5c5-44d8-97d3-8a430533290a/bucket/e6cb1219-083e-46c8-9daa-44b72721b951.jpg" alt="QR-код для оплаты" style={{ width: 200, height: 200, borderRadius: 8, display: "block", margin: "0 auto" }} />
                    <p style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: 8 }}>Наведите камеру телефона на QR-код для перехода к оплате</p>
                  </div>
                )}
              </div>
              <div className="pp">
                <div className="pp-l">⚠️ Обязательное назначение платежа — скопируйте текст</div>
                <div className="pp-t">{PURPOSE}</div>
                <button onClick={() => copyToClipboard(PURPOSE, setCopiedPurpose)} style={{ marginTop: 10, display: "block", width: "100%", textAlign: "center", padding: "8px", background: "var(--white)", border: "1px solid var(--border)", borderRadius: 6, cursor: "pointer", fontSize: "0.78rem", fontFamily: "inherit" }}>
                  {copiedPurpose ? "✅ Скопировано" : "📋 Скопировать назначение платежа"}
                </button>
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--muted)", display: "flex", alignItems: "flex-start", gap: 6, marginTop: 14 }}>
                🔒 Все поступившие средства учитываются в соответствии с требованиями Федерального закона «О некоммерческих организациях».
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* REPORTS */}
      <ReportsBlock />

      {/* FAQ */}
      <div className="sec bg-r">
        <div className="c">
          <div className="shdr">
            <span className="lbl n">Частые вопросы</span>
            <h2>Ответы на то, что волнует больше всего</h2>
          </div>
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            {[
              ["Нет опыта — можно прийти?", "Да, и именно таких участников мы ждём. Опыт не нужен совсем — всему обучим прямо на месте. Приходите — уже через час будете делать что-то полезное."],
              ["Я живу не в Артёме — могу помочь?", "Конечно. Мы работаем по всему Приморскому краю — Владивосток, Уссурийск, Находка и другие города. Также можно помочь дистанционно: передать материалы или стать инфопартнёром из любого города."],
              ["Сколько времени нужно уделять?", "Достаточно 2–3 часов в неделю — или даже разово, если удобно именно так. Мы подберём формат под ваш график. Главное — желание помочь."],
              ["Можно прийти с детьми?", "Да, и это очень приветствуется. Участие детей в совместных делах — лучший урок патриотического воспитания. Дети занимаются рядом со взрослыми, ветеранами, ровесниками."],
              ["Как я узнаю, что помощь дошла?", "Публикуем подробные фото- и видеоотчёты после каждой передачи. Все отчёты доступны в открытом доступе в нашем сообществе ВКонтакте. Можете проверить сами — ничего скрывать не нужно."],
              ["Безопасно ли делать финансовый перевод?", "АНО «ПАТРИОТ ДВ» — официально зарегистрированная некоммерческая организация, ОГРН 1242500028583, ИНН 2502079223. Финансовая отчётность публикуется в соответствии с требованиями законодательства РФ. Вы вправе запросить подтверждение о принятии пожертвования."],
              ["Мы — организация. Как можно сотрудничать?", "Рады партнёрству со школами, спортивными клубами, предприятиями и общественными организациями Приморского края. Проведём урок мужества, патриотический турнир или совместную акцию — бесплатно, с полной подготовкой с нашей стороны. Заполните форму выше и выберите «Партнёрство»."],
            ].map(([q, a]) => <FaqItem key={q} q={q} a={a} />)}
          </div>
        </div>
      </div>

      {/* FINAL CTA */}
      <div style={{ background: "linear-gradient(135deg,var(--dark),var(--navy))", color: "#fff", textAlign: "center", padding: "80px 0" }}>
        <div className="c">
          <h2>Станьте частью живой истории Приморья</h2>
          <p style={{ color: "rgba(255,255,255,.65)", maxWidth: 500, margin: "0 auto 32px" }}>Не нужен опыт, много времени или особые навыки. Нужно только желание сделать что-то важное рядом с теми, кто служит Отечеству.</p>
          <div className="fg" style={{ justifyContent: "center" }}>
            <a href="#form" className="btn btn-p">Заполнить заявку →</a>
            <a href="#donate" className="btn btn-g">Поддержать финансово</a>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ background: "#111", color: "rgba(255,255,255,.5)", padding: "36px 0" }}>
        <div className="c">
          <div className="xg" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 32 }}>
            <div className="fcol">
              <h5>АНО «ПАТРИОТ ДВ»</h5>
              <p>Региональная некоммерческая организация Приморского края</p>
              <p>ОГРН 1242500028583</p>
              <p>ИНН 2502079223</p>
              <p>г. Артём, Приморский край</p>
              <div style={{ marginTop: 14, borderTop: "1px solid rgba(255,255,255,.08)", paddingTop: 14 }}>
                <h5 style={{ marginBottom: 10 }}>Контакты и отчёты</h5>
                <a href="https://vk.ru/patriotdvprim" target="_blank" rel="noopener noreferrer">Сообщество ВКонтакте →</a>
                <p>Телефон: +7-996-424-17-24</p>
                <p>E-mail: <a href="mailto:ano.patriotdv@mail.ru" style={{ color: "rgba(255,255,255,.5)" }}>ano.patriotdv@mail.ru</a></p>
                <p style={{ marginTop: 8, fontSize: "0.72rem", color: "rgba(255,255,255,.3)" }}>
                  Финансовая отчётность публикуется в открытом доступе в соответствии с требованиями законодательства РФ.
                </p>
              </div>
            </div>
            <div className="fcol">
              <h5>Деятельность</h5>
              <p>Историческая и культурная память</p>
              <p>Патриотическое воспитание</p>
              <p>Волонтёрские мастерские</p>
              <p>Поддержка семей военнослужащих</p>
            </div>
            <div className="fcol">
              <h5>Организаторы</h5>
              {[
                { name: "Алексей Викторович Михайленко", role: "Председатель общественной организации ветеранов территориального управления шахты «Амурская», г. Артём" },
                { name: "Ольга Николаевна Таланова", role: "Индивидуальный предприниматель, г. Владивосток" },
                { name: "Марина Викторовна Казакова", role: "Общественный деятель, г. Артём" },
              ].map(({ name, role }) => (
                <div key={name} style={{ marginBottom: 12 }}>
                  <span style={{ display: "block", fontSize: "0.78rem", color: "rgba(255,255,255,.75)", fontWeight: 600 }}>{name}</span>
                  <span style={{ display: "block", fontSize: "0.7rem", color: "rgba(255,255,255,.38)", lineHeight: 1.4 }}>{role}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,.08)", marginTop: 28, paddingTop: 20, textAlign: "center", fontSize: "0.72rem" }}>
            © 2024–2026 АНО содействия сохранению исторического наследия и патриотического воспитания «ПАТРИОТ ДВ» · Все права защищены
          </div>
        </div>
      </footer>

      <a href="#form" className="sticky">Хочу участвовать →</a>
    </div>
  );
}