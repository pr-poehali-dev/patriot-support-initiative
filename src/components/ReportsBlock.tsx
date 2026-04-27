import { useState } from "react";
import { createPortal } from "react-dom";

type Item = { type: string; date: string; title: string; text: string; stats: { l: string; v: string }[]; url?: string; image?: string; images?: string[] };

const ITEMS: Item[] = [
  {
    type: "photo",
    date: "Март 2026 · г. Артём",
    title: "Волонтёрская мастерская — плетение маскировочных изделий",
    text: "Коллектив Приморского государственного аграрно-технологического университета (ГАТУ) передал нам партию изготовленных сетей.",
    stats: [{ l: "участника", v: "34" }, { l: "изделий", v: "12" }],
    images: [
      "https://cdn.poehali.dev/projects/288ea0fa-c5c5-44d8-97d3-8a430533290a/bucket/c594d149-7d1e-46c3-a134-8bb6c6bb01fb.jpg",
      "https://cdn.poehali.dev/projects/288ea0fa-c5c5-44d8-97d3-8a430533290a/bucket/2ceb7938-2f57-479d-b389-c8b89c86e780.jpg",
      "https://cdn.poehali.dev/projects/288ea0fa-c5c5-44d8-97d3-8a430533290a/bucket/985fb507-05f8-48cc-a4c0-be47548e2f12.jpg",
      "https://cdn.poehali.dev/projects/288ea0fa-c5c5-44d8-97d3-8a430533290a/bucket/61e7c463-ea90-45b6-a770-af2a3992024f.jpg",
    ],
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
    date: "Февраль 2026 · Школа №3, г. Артём",
    title: "Урок мужества с ветераном — фотоотчёт",
    text: "В городе Артёме, в стенах средней общеобразовательной школы №3, развернулась уникальная инициатива, ставшая ярким примером гражданской сознательности и патриотизма.\nПо инициативе депутата Думы Артёмовского городского округа, руководителя АНО \"ПАТРИОТ ДВ\" Алексея Михайленко, при активном содействии директора образовательного учреждения Валентины Александровны Ле, была проведена акция в поддержку военнослужащих, находящихся в зоне проведения Специальной Военной Операции. Основной акцент сделан на освоении техники плетения тактических браслетов – незаменимых аксессуаров для участников СВО.\n\nБраслет носится на руке и в случае необходимости превращается в верёвку длиной 4 метра, которая выдерживает нагрузку до 250 кг. Используется для транспортировки раненых, снятия взрывных устройств, спуска со второго этажа и тд.",
    stats: [{ l: "ученика", v: "62" }, { l: "класса", v: "2" }],
    images: [
      "https://cdn.poehali.dev/projects/288ea0fa-c5c5-44d8-97d3-8a430533290a/bucket/d1773a5c-8423-4d35-903b-40cb7d9d09e2.jpg",
      "https://cdn.poehali.dev/projects/288ea0fa-c5c5-44d8-97d3-8a430533290a/bucket/c7a7565d-0f85-467b-ab8c-47dc9dad4d5c.jpg",
      "https://cdn.poehali.dev/projects/288ea0fa-c5c5-44d8-97d3-8a430533290a/bucket/5ef8a916-290b-4f12-8780-ce3184d996bb.jpg",
      "https://cdn.poehali.dev/projects/288ea0fa-c5c5-44d8-97d3-8a430533290a/bucket/7a1c63c8-4c59-459e-b8a9-cee4b9d82650.jpg",
    ],
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
    title: "Турнир по волейболу памяти В.В. Жириновского",
    text: "В городе Артёме, на спортивной волейбольной площадке физкультурно-оздоровительного комплекса, состоялось открытие товарищеского турнира по волейболу, посвящённого светлой памяти Владимира Вольфовича Жириновского.\n\nСегодня, 9 января, состоялось открытие товарищеского турнира по волейболу, за Кубок памяти Владимира Вольфовича Жириновского, среди ветеранских организаций Артёмовского городского округа.",
    stats: [{ l: "команд", v: "8" }, { l: "ветеранов", v: "96" }],
    images: [
      "https://cdn.poehali.dev/projects/288ea0fa-c5c5-44d8-97d3-8a430533290a/bucket/0653cf21-83e8-468b-b5d0-ed5be87ea46a.png",
      "https://cdn.poehali.dev/projects/288ea0fa-c5c5-44d8-97d3-8a430533290a/bucket/fe5fea08-349d-4bbb-9824-3fd24478452b.png",
      "https://cdn.poehali.dev/projects/288ea0fa-c5c5-44d8-97d3-8a430533290a/bucket/266afe51-e9a5-4cfd-8bc0-d0811bbefada.png",
      "https://cdn.poehali.dev/projects/288ea0fa-c5c5-44d8-97d3-8a430533290a/bucket/90498c98-6ae7-4acd-b070-38a24b49e1b7.png",
      "https://cdn.poehali.dev/projects/288ea0fa-c5c5-44d8-97d3-8a430533290a/bucket/2033f123-90bf-422a-8022-10f8faadb8a9.png",
    ],
  },
  {
    type: "video",
    date: "Декабрь 2025 · г. Артём",
    title: "Новогодняя гуманитарная акция — сбор посылок",
    text: "Жители Приморья собрали праздничные посылки для семей военнослужащих.",
    stats: [{ l: "посылок", v: "47" }, { l: "волонтёр", v: "51" }],
    url: "https://vk.com/video_ext.php?oid=893941164&id=456239056&hash=c7e8f4036bfcee96",
  },
];

const TABS = ["📷 Фотоотчёты", "🎥 Видеоотчёты", "Все материалы"];

function VideoThumb({ item }: { item: Item }) {
  const [modal, setModal] = useState(false);

  return (
    <>
      {/* Заглушка в карточке */}
      <div
        onClick={() => setModal(true)}
        style={{ height: 180, background: "linear-gradient(135deg,#1a1a2e,#16213e)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", position: "relative" }}
      >
        <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(255,255,255,0.15)", border: "2px solid rgba(255,255,255,0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 0, height: 0, borderTop: "12px solid transparent", borderBottom: "12px solid transparent", borderLeft: "20px solid #fff", marginLeft: 4 }} />
        </div>
        <div style={{ position: "absolute", bottom: 8, right: 10, background: "rgba(255,255,255,0.15)", borderRadius: 4, padding: "2px 8px", fontSize: "0.7rem", color: "#fff" }}>ВИДЕО</div>
      </div>

      {/* Модальное окно */}
      {modal && createPortal(
        <div
          onClick={() => setModal(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
        >
          <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: 860, position: "relative" }}>
            <button
              onClick={() => setModal(false)}
              style={{ position: "absolute", top: -36, right: 0, background: "none", border: "none", color: "#fff", fontSize: "1.6rem", cursor: "pointer", lineHeight: 1 }}
            >✕</button>
            <div style={{ aspectRatio: "16/9", background: "#000", borderRadius: 10, overflow: "hidden" }}>
              <iframe
                src={item.url + "&autoplay=1"}
                width="100%"
                height="100%"
                frameBorder="0"
                allowFullScreen
                style={{ display: "block" }}
                allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
              />
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}

function CardImage({ item, onLightbox }: { item: Item; onLightbox: (src: string) => void }) {
  const [idx, setIdx] = useState(0);
  const imgs = item.images ?? (item.image ? [item.image] : []);
  if (imgs.length === 0) {
    if (item.type === "video" && item.url?.includes("vk.com/video_ext")) {
      return <VideoThumb item={item} />;
    }
    return (
      <div style={{ height: 180, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.8rem", background: item.type === "video" ? "linear-gradient(135deg,#1a1a2e,#16213e)" : "linear-gradient(135deg,#2E4A7A,#3A6098)" }}>
        {item.type === "video" ? "🎥" : "📷"}
      </div>
    );
  }
  return (
    <div style={{ position: "relative", height: 180, background: "#111", overflow: "hidden" }}>
      <img
        src={imgs[idx]}
        alt={item.title}
        onClick={() => onLightbox(imgs[idx])}
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", cursor: "zoom-in", transition: "opacity .3s" }}
      />
      {imgs.length > 1 && (
        <>
          <button onClick={(e) => { e.stopPropagation(); setIdx((idx - 1 + imgs.length) % imgs.length); }} style={{ position: "absolute", left: 6, top: "50%", transform: "translateY(-50%)", background: "rgba(0,0,0,0.5)", border: "none", color: "#fff", borderRadius: "50%", width: 28, height: 28, cursor: "pointer", fontSize: "1rem", display: "flex", alignItems: "center", justifyContent: "center" }}>‹</button>
          <button onClick={(e) => { e.stopPropagation(); setIdx((idx + 1) % imgs.length); }} style={{ position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)", background: "rgba(0,0,0,0.5)", border: "none", color: "#fff", borderRadius: "50%", width: 28, height: 28, cursor: "pointer", fontSize: "1rem", display: "flex", alignItems: "center", justifyContent: "center" }}>›</button>
          <div style={{ position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 4 }}>
            {imgs.map((_, i) => (
              <div key={i} onClick={(e) => { e.stopPropagation(); setIdx(i); }} style={{ width: 6, height: 6, borderRadius: "50%", background: i === idx ? "#fff" : "rgba(255,255,255,0.45)", cursor: "pointer" }} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function ReportsBlock() {
  const [tab, setTab] = useState(2);
  const [lightbox, setLightbox] = useState<{ imgs: string[]; idx: number } | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

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
              <div style={{ position: "relative", overflow: "hidden" }}>
                <CardImage item={item} onLightbox={(src) => {
                  const imgs = item.images ?? (item.image ? [item.image] : []);
                  setLightbox({ imgs, idx: imgs.indexOf(src) });
                }} />
                {item.type === "video" && !item.url?.includes("vk.com/video_ext") && (
                  <div style={{ position: "absolute", bottom: 8, right: 10, background: "rgba(255,255,255,0.15)", borderRadius: 4, padding: "2px 8px", fontSize: "0.7rem", color: "#fff" }}>ВИДЕО</div>
                )}
              </div>

              {/* Body */}
              <div style={{ padding: "14px 16px", flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ fontSize: "0.72rem", color: "var(--muted)" }}>{item.date}</div>
                <div style={{ fontWeight: 700, fontSize: "0.9rem", lineHeight: 1.4 }}>{item.title}</div>
                {expanded === item.title && (
                  <div style={{ fontSize: "0.82rem", color: "var(--muted)", lineHeight: 1.5, whiteSpace: "pre-line" }}>{item.text}</div>
                )}
                <button
                  onClick={() => setExpanded(expanded === item.title ? null : item.title)}
                  style={{ alignSelf: "flex-start", background: "none", border: "none", padding: 0, fontSize: "0.78rem", color: "var(--red)", cursor: "pointer", fontFamily: "inherit" }}
                >
                  {expanded === item.title ? "Скрыть ▲" : "Подробнее ▼"}
                </button>

                {/* Stats */}
                <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
                  {item.stats.map((s) => (
                    <div key={s.l} style={{ textAlign: "center" }}>
                      <div style={{ fontWeight: 800, fontSize: "1.2rem", color: "var(--red)" }}>{s.v}</div>
                      <div style={{ fontSize: "0.7rem", color: "var(--muted)" }}>{s.l}</div>
                    </div>
                  ))}
                </div>

                {/* Video link (only for non-embed videos) */}
                {item.url && !item.url.includes("vk.com/video_ext") && (
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
        style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.88)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "zoom-out" }}
      >
        <img
          src={lightbox.imgs[lightbox.idx]}
          alt=""
          onClick={(e) => e.stopPropagation()}
          style={{ maxWidth: "88vw", maxHeight: "88vh", borderRadius: 10, boxShadow: "0 8px 40px rgba(0,0,0,0.6)", cursor: "default" }}
        />
        {lightbox.imgs.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); setLightbox({ ...lightbox, idx: (lightbox.idx - 1 + lightbox.imgs.length) % lightbox.imgs.length }); }}
              style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", fontSize: "2rem", cursor: "pointer", borderRadius: "50%", width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center" }}
            >‹</button>
            <button
              onClick={(e) => { e.stopPropagation(); setLightbox({ ...lightbox, idx: (lightbox.idx + 1) % lightbox.imgs.length }); }}
              style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", fontSize: "2rem", cursor: "pointer", borderRadius: "50%", width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center" }}
            >›</button>
            <div style={{ position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 6 }}>
              {lightbox.imgs.map((_, i) => (
                <div key={i} onClick={(e) => { e.stopPropagation(); setLightbox({ ...lightbox, idx: i }); }} style={{ width: 8, height: 8, borderRadius: "50%", background: i === lightbox.idx ? "#fff" : "rgba(255,255,255,0.4)", cursor: "pointer" }} />
              ))}
            </div>
          </>
        )}
        <button
          onClick={() => setLightbox(null)}
          style={{ position: "absolute", top: 16, right: 20, background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", fontSize: "1.5rem", cursor: "pointer", borderRadius: "50%", width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center" }}
        >×</button>
      </div>,
      document.body
    )}
    </>
  );
}