import { useState } from "react";
import { createPortal } from "react-dom";

type Item = { type: string; date: string; title: string; text: string; stats: { l: string; v: string }[]; url?: string; image?: string };

const ITEMS: Item[] = [
  {
    type: "photo",
    date: "Март 2026 · г. Артём",
    title: "Волонтёрская мастерская — плетение маскировочных изделий",
    text: "Коллектив Приморского государственного аграрно-технологического университета (ГАТУ) передал нам партию изготовленных сетей.",
    stats: [{ l: "участника", v: "34" }, { l: "изделий", v: "12" }],
    image: "https://cdn.poehali.dev/projects/288ea0fa-c5c5-44d8-97d3-8a430533290a/bucket/c594d149-7d1e-46c3-a134-8bb6c6bb01fb.jpg",
  },
  {
    type: "video",
    date: "Февраль 2026 · г. Артём",
    title: "Передача гуманитарной помощи — видеорепортаж",
    text: "Как собранные посылки отправились к военнослужащим и их семьям.",
    stats: [{ l: "посылок", v: "28" }, { l: "мин", v: "4" }],
    url: "https://vk.ru/patriotdvprim",
  },
  {
    type: "photo",
    date: "Февраль 2026 · Школа №14",
    title: "Урок мужества с ветераном — фотоотчёт",
    text: "Встреча ветерана с учениками 8–9 классов. Живая история — не по учебнику.",
    stats: [{ l: "ученика", v: "62" }, { l: "класса", v: "2" }],
  },
  {
    type: "video",
    date: "Январь 2026 · Приморский край",
    title: "Итоги января — видеосводка акций по краю",
    text: "Сводный видеоотчёт о всех мероприятиях организации за месяц.",
    stats: [{ l: "акций", v: "6" }, { l: "мин", v: "7" }],
    url: "https://vk.ru/patriotdvprim",
  },
  {
    type: "photo",
    date: "Январь 2026 · г. Артём",
    title: "Патриотический турнир среди школьников",
    text: "8 команд, конкурсы, награждение победителей.",
    stats: [{ l: "участников", v: "96" }, { l: "команд", v: "8" }],
  },
  {
    type: "photo",
    date: "Декабрь 2025 · г. Артём",
    title: "Новогодняя гуманитарная акция — сбор посылок",
    text: "Жители Приморья собрали праздничные посылки для семей военнослужащих.",
    stats: [{ l: "посылок", v: "47" }, { l: "волонтёр", v: "51" }],
  },
];

const TABS = ["📷 Фотоотчёты", "🎥 Видеоотчёты", "Все материалы"];

export default function ReportsBlock() {
  const [tab, setTab] = useState(2);
  const [lightbox, setLightbox] = useState<string | null>(null);

  const filtered = ITEMS.filter((item) => {
    if (tab === 0) return item.type === "photo";
    if (tab === 1) return item.type === "video";
    return true;
  });

  return (
    <>
    <div className="sec bg-r">
      <div className="c">
        <div className="shdr">
          <span className="lbl g">Отчёты</span>
          <h2>Каждое мероприятие — в открытом доступе</h2>
          <p>Публикуем фото и видео после каждой акции. Следите за нашей работой и убеждайтесь сами.</p>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 28, flexWrap: "wrap" }}>
          {TABS.map((t, i) => (
            <button
              key={t}
              onClick={() => setTab(i)}
              style={{
                padding: "7px 16px",
                borderRadius: 8,
                border: `1px solid ${tab === i ? "var(--red)" : "var(--border)"}`,
                background: tab === i ? "var(--red)" : "var(--white)",
                color: tab === i ? "#fff" : "var(--text)",
                cursor: "pointer",
                fontFamily: "inherit",
                fontSize: "0.85rem",
                fontWeight: tab === i ? 700 : 400,
                transition: "all .2s",
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
          {filtered.map((item) => (
            <div
              key={item.title}
              style={{
                background: "var(--white)",
                borderRadius: 12,
                boxShadow: "var(--shadow)",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Header */}
              <div
                style={{
                  height: 180,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "2.8rem",
                  background: item.type === "video"
                    ? "linear-gradient(135deg,#1a1a2e,#16213e)"
                    : "linear-gradient(135deg,#2E4A7A,#3A6098)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    onClick={() => setLightbox(item.image!)}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", cursor: "zoom-in" }}
                  />
                ) : (
                  item.type === "video" ? "🎥" : "📷"
                )}
                {item.type === "video" && (
                  <div style={{
                    position: "absolute",
                    bottom: 8,
                    right: 10,
                    background: "rgba(255,255,255,0.15)",
                    borderRadius: 4,
                    padding: "2px 8px",
                    fontSize: "0.7rem",
                    color: "#fff",
                  }}>
                    ВИДЕО
                  </div>
                )}
              </div>

              {/* Body */}
              <div style={{ padding: "14px 16px", flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ fontSize: "0.72rem", color: "var(--muted)" }}>{item.date}</div>
                <div style={{ fontWeight: 700, fontSize: "0.9rem", lineHeight: 1.4 }}>{item.title}</div>
                <div style={{ fontSize: "0.82rem", color: "var(--muted)", lineHeight: 1.5 }}>{item.text}</div>

                {/* Stats */}
                <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
                  {item.stats.map((s) => (
                    <div key={s.l} style={{ textAlign: "center" }}>
                      <div style={{ fontWeight: 800, fontSize: "1.2rem", color: "var(--red)" }}>{s.v}</div>
                      <div style={{ fontSize: "0.7rem", color: "var(--muted)" }}>{s.l}</div>
                    </div>
                  ))}
                </div>

                {/* Video link */}
                {item.url && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      marginTop: 10,
                      display: "inline-block",
                      fontSize: "0.8rem",
                      color: "var(--red)",
                      fontWeight: 600,
                      textDecoration: "none",
                    }}
                  >
                    Смотреть в VK →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div
          style={{
            marginTop: 36,
            background: "var(--light)",
            borderRadius: 12,
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
            textAlign: "center",
          }}
        >
          <a
            href="https://vk.ru/patriotdvprim"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: "var(--red)",
              color: "#fff",
              padding: "10px 24px",
              borderRadius: 8,
              textDecoration: "none",
              fontWeight: 700,
              fontSize: "0.88rem",
              whiteSpace: "nowrap",
            }}
          >
            Открыть все отчёты в VK →
          </a>
          <p style={{ margin: 0, fontSize: "0.82rem", color: "var(--muted)" }}>
            Все отчёты и фотоальбомы — в нашем официальном сообществе ВКонтакте
          </p>
        </div>
      </div>
    </div>

    {lightbox && createPortal(
      <div
        onClick={() => setLightbox(null)}
        style={{
          position: "fixed", inset: 0, zIndex: 9999,
          background: "rgba(0,0,0,0.85)",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "zoom-out",
        }}
      >
        <img
          src={lightbox}
          alt=""
          style={{ maxWidth: "92vw", maxHeight: "90vh", borderRadius: 10, boxShadow: "0 8px 40px rgba(0,0,0,0.6)" }}
        />
        <button
          onClick={() => setLightbox(null)}
          style={{
            position: "absolute", top: 16, right: 20,
            background: "rgba(255,255,255,0.15)", border: "none",
            color: "#fff", fontSize: "1.5rem", cursor: "pointer",
            borderRadius: "50%", width: 40, height: 40, lineHeight: "40px", textAlign: "center",
          }}
        >×</button>
      </div>,
      document.body
    )}
    </>
  );
}