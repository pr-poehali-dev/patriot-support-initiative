import { useEffect, useRef, useState } from "react";
import Icon from "@/components/ui/icon";

const HERO_IMG = "https://cdn.poehali.dev/projects/288ea0fa-c5c5-44d8-97d3-8a430533290a/files/8eff0723-31ab-4a73-a341-04fd9fcd227d.jpg";

function useCountUp(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".section-reveal");
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
      { threshold: 0.12 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

function CounterCard({ number, suffix, label }: { number: number; suffix: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);
  const count = useCountUp(number, 2200, started);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setStarted(true); },
      { threshold: 0.3 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="text-center">
      <div className="text-5xl font-oswald font-bold text-white mb-2">
        {count.toLocaleString("ru-RU")}{suffix}
      </div>
      <div className="text-blue-200 font-golos text-sm uppercase tracking-widest">{label}</div>
    </div>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="text-white/80 hover:text-white font-golos text-sm uppercase tracking-wider transition-colors duration-200 hover:text-yellow-300"
    >
      {children}
    </a>
  );
}

export default function Index() {
  useScrollReveal();
  const [formData, setFormData] = useState({ name: "", phone: "", help_type: "Плести сети", agree: false });
  const [sent, setSent] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <div className="min-h-screen bg-brand-light font-golos">

      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-brand-dark/95 backdrop-blur-sm border-b border-white/10">
        <div className="tricolor" />
        <div className="container flex items-center justify-between h-16">
          <a href="#" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-blue flex items-center justify-center">
              <span className="text-white font-oswald font-bold text-sm">П</span>
            </div>
            <span className="font-oswald font-bold text-white text-lg tracking-wider">ПАТРИОТ ДВ</span>
          </a>

          <nav className="hidden md:flex items-center gap-8">
            <NavLink href="#about">О движении</NavLink>
            <NavLink href="#help">Как помочь</NavLink>
            <NavLink href="#reports">Отчёты</NavLink>
            <NavLink href="#partners">Партнёры</NavLink>
            <NavLink href="#contacts">Контакты</NavLink>
          </nav>

          <a
            href="#join"
            className="hidden md:block bg-brand-red text-white font-oswald font-semibold text-sm uppercase tracking-wider px-5 py-2 rounded hover:bg-red-700 transition-colors"
          >
            Помочь
          </a>

          <button className="md:hidden text-white" onClick={() => setMenuOpen(!menuOpen)}>
            <Icon name={menuOpen ? "X" : "Menu"} size={24} />
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-brand-dark border-t border-white/10 px-6 py-4 flex flex-col gap-4">
            {(["#about", "#help", "#reports", "#partners", "#contacts"] as const).map((href, i) => (
              <a
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="text-white/80 hover:text-white font-golos text-sm uppercase tracking-wider"
              >
                {["О движении", "Как помочь", "Отчёты", "Партнёры", "Контакты"][i]}
              </a>
            ))}
            <a href="#join" className="bg-brand-red text-white font-oswald text-sm uppercase tracking-wider px-5 py-2 rounded text-center">
              Помочь
            </a>
          </div>
        )}
      </header>

      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${HERO_IMG})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/80 via-brand-dark/60 to-brand-dark/90" />
        <div className="absolute top-24 left-6 right-6 border-t border-yellow-500/30" />
        <div className="absolute bottom-6 left-6 right-6 border-b border-yellow-500/30" />

        <div className="relative z-10 container text-center animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-brand-blue/80 text-white px-4 py-1.5 rounded-full text-xs font-golos uppercase tracking-widest mb-6 border border-yellow-500/40">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse-slow" />
            г. Артём, Приморский край
          </div>

          <h1 className="font-oswald font-bold text-white leading-tight mb-6"
            style={{ fontSize: "clamp(2.2rem, 6vw, 4.5rem)" }}>
            Патриотизм в действии:<br />
            <span className="text-yellow-400">Артём объединяется</span><br />
            ради своих
          </h1>

          <p className="text-white/80 font-golos text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            Превращаем желание помочь в реальную поддержку — от маскировочных сетей до сбора амуниции. Каждый может внести свой вклад.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#join"
              className="bg-brand-red text-white font-oswald font-semibold text-base uppercase tracking-wider px-8 py-4 rounded hover:bg-red-700 transition-all duration-300 hover:scale-105 shadow-lg shadow-red-900/40"
            >
              Стать волонтёром
            </a>
            <a
              href="#reports"
              className="border border-white/40 text-white font-oswald font-semibold text-base uppercase tracking-wider px-8 py-4 rounded hover:bg-white/10 transition-all duration-300"
            >
              Смотреть отчёты
            </a>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 animate-bounce">
          <Icon name="ChevronDown" size={28} />
        </div>
      </section>

      {/* LIVE STATS */}
      <section className="bg-brand-blue py-16">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 divide-y md:divide-y-0 md:divide-x divide-white/20">
            <CounterCard number={1500} suffix=" м²" label="сетей передано" />
            <CounterCard number={150} suffix="+" label="волонтёров" />
            <CounterCard number={12} suffix="" label="школ-партнёров" />
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-24 bg-white">
        <div className="container max-w-5xl">
          <div className="section-reveal text-center mb-16">
            <div className="ornament mb-4">
              <span className="font-golos text-yellow-600 text-xs uppercase tracking-widest">О нас</span>
            </div>
            <h2 className="font-oswald font-bold text-brand-dark text-4xl md:text-5xl mb-6">О движении</h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto leading-relaxed">
              АНО «ПАТРИОТ ДВ» — добровольческое объединение города Артёма, основанное жителями для жителей.
              Мы соединяем тех, кто хочет помочь, с теми, кому нужна поддержка на передовой.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: "Heart", title: "Наша миссия", desc: "Патриотическое воспитание молодёжи и реальная помощь участникам СВО силами всего города." },
              { icon: "Users", title: "Наше сообщество", desc: "Более 150 волонтёров — школьники, студенты, взрослые горожане — объединились ради одного дела." },
              { icon: "Shield", title: "Наши результаты", desc: "1 500 м² маскировочных сетей, десятки посылок с амуницией и 12 школ, охваченных уроками мужества." },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="section-reveal group bg-brand-light rounded-2xl p-8 border border-brand-blue/10 hover:shadow-xl hover:border-brand-blue/30 transition-all duration-300 hover:-translate-y-1">
                <div className="w-12 h-12 bg-brand-blue/10 rounded-xl flex items-center justify-center mb-5 group-hover:bg-brand-blue transition-all duration-300">
                  <Icon name={icon as "Heart"} size={22} className="text-brand-blue group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-oswald font-semibold text-brand-dark text-xl mb-3">{title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 bg-brand-light">
        <div className="container max-w-4xl">
          <div className="section-reveal text-center mb-16">
            <div className="ornament mb-4">
              <span className="font-golos text-yellow-600 text-xs uppercase tracking-widest">Процесс</span>
            </div>
            <h2 className="font-oswald font-bold text-brand-dark text-4xl md:text-5xl">Как мы работаем</h2>
          </div>
          <div className="relative">
            <div className="hidden md:block absolute top-8 left-12 right-12 h-0.5 bg-brand-blue/20" />
            <div className="grid md:grid-cols-4 gap-8">
              {[
                { step: 1, title: "Запрос", desc: "Получаем заявку от командиров с указанием нужд." },
                { step: 2, title: "Сбор", desc: "Закупаем ткань и собираем вещи всем Артёмом." },
                { step: 3, title: "Дело", desc: "Плетём сети и собираем посылки в мастерских." },
                { step: 4, title: "Доставка", desc: "Отправляем на фронт и публикуем видеоотчёт." },
              ].map(({ step, title, desc }, i) => (
                <div key={step} className="section-reveal text-center relative" style={{ transitionDelay: `${i * 100}ms` }}>
                  <div className="w-16 h-16 rounded-full bg-brand-blue text-white font-oswald font-bold text-2xl flex items-center justify-center mx-auto mb-5 relative z-10 shadow-lg shadow-brand-blue/30">
                    {step}
                  </div>
                  <h3 className="font-oswald font-semibold text-brand-dark text-lg mb-2">{title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* HOW TO HELP */}
      <section id="help" className="py-24 bg-white">
        <div className="container max-w-5xl">
          <div className="section-reveal text-center mb-16">
            <div className="ornament mb-4">
              <span className="font-golos text-yellow-600 text-xs uppercase tracking-widest">Участие</span>
            </div>
            <h2 className="font-oswald font-bold text-brand-dark text-4xl md:text-5xl mb-4">Выберите свой формат</h2>
            <p className="text-muted-foreground">Каждый найдёт возможность помочь — всё зависит от вас</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: "Hand", badge: "Волонтёр", title: "Помочь руками", desc: "Плетение маскировочных сетей и сборка посылок в мастерских города.", color: "bg-brand-blue" },
              { icon: "Package", badge: "Донор", title: "Передать материалы", desc: "Ткань, паракорд, тёплые вещи — всё, что нужно бойцам на передовой.", color: "bg-brand-red" },
              { icon: "School", badge: "Партнёр", title: "Для организаций", desc: "Уроки мужества, совместные проекты и патриотические программы для школ.", color: "bg-yellow-600" },
            ].map(({ icon, badge, title, desc, color }) => (
              <div key={title} className="section-reveal group relative rounded-2xl overflow-hidden border border-brand-blue/10 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white">
                <div className={`${color} h-2`} />
                <div className="p-8">
                  <span className={`inline-block ${color} text-white font-golos text-xs uppercase tracking-wider px-3 py-1 rounded-full mb-5`}>
                    {badge}
                  </span>
                  <div className="mb-4">
                    <Icon name={icon as "Hand"} size={28} className="text-brand-dark" />
                  </div>
                  <h3 className="font-oswald font-bold text-brand-dark text-xl mb-3">{title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
                </div>
                <div className="px-8 pb-6">
                  <a href="#join" className="text-brand-blue font-golos text-sm font-semibold hover:underline flex items-center gap-1">
                    Присоединиться <Icon name="ArrowRight" size={14} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REPORTS */}
      <section id="reports" className="py-24 bg-brand-dark">
        <div className="container max-w-5xl">
          <div className="section-reveal text-center mb-16">
            <div className="ornament mb-4">
              <span className="font-golos text-yellow-400 text-xs uppercase tracking-widest">Прозрачность</span>
            </div>
            <h2 className="font-oswald font-bold text-white text-4xl md:text-5xl mb-4">Отчёты о работе</h2>
            <p className="text-white/60">Каждая помощь документируется — мы публикуем результаты</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              { date: "Февраль 2026", title: "Отправка 80 м² сетей", desc: "Партия маскировочных сетей отправлена в воинскую часть по запросу командования.", icon: "Package" },
              { date: "Январь 2026", title: "Урок мужества в школе №3", desc: "Встреча с ветеранами, мастер-класс по плетению сетей, 120 учеников.", icon: "BookOpen" },
              { date: "Декабрь 2025", title: "Новогодние посылки", desc: "Собрали 45 праздничных посылок с тёплыми вещами, едой и письмами поддержки.", icon: "Gift" },
              { date: "Ноябрь 2025", title: "Пополнение волонтёров", desc: "К движению присоединились 30 новых волонтёров из школ города Артёма.", icon: "Users" },
            ].map(({ date, title, desc, icon }, i) => (
              <div key={title} className="section-reveal bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300" style={{ transitionDelay: `${i * 80}ms` }}>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-blue/30 flex items-center justify-center flex-shrink-0 mt-1">
                    <Icon name={icon as "Package"} size={18} className="text-yellow-400" />
                  </div>
                  <div>
                    <span className="text-yellow-400 font-golos text-xs uppercase tracking-widest">{date}</span>
                    <h3 className="font-oswald font-semibold text-white text-lg mt-1 mb-2">{title}</h3>
                    <p className="text-white/60 text-sm leading-relaxed">{desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PARTNERS */}
      <section id="partners" className="py-24 bg-white">
        <div className="container max-w-4xl">
          <div className="section-reveal text-center mb-16">
            <div className="ornament mb-4">
              <span className="font-golos text-yellow-600 text-xs uppercase tracking-widest">Вместе сильнее</span>
            </div>
            <h2 className="font-oswald font-bold text-brand-dark text-4xl md:text-5xl mb-4">Партнёры</h2>
            <p className="text-muted-foreground">Организации, с которыми мы работаем</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { emoji: "🏫", name: "Школы города", count: "12 партнёров" },
              { emoji: "🏛️", name: "Администрация", count: "г. Артём" },
              { emoji: "🇷🇺", name: "Воинские части", count: "Приморский край" },
              { emoji: "🤝", name: "НКО и фонды", count: "Региональные" },
            ].map(({ emoji, name, count }) => (
              <div key={name} className="section-reveal text-center bg-brand-light rounded-2xl p-6 border border-brand-blue/10 hover:border-brand-blue/30 hover:shadow-lg transition-all duration-300">
                <div className="text-4xl mb-3">{emoji}</div>
                <div className="font-oswald font-semibold text-brand-dark text-sm">{name}</div>
                <div className="text-muted-foreground text-xs mt-1">{count}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* JOIN FORM */}
      <section id="join" className="py-24 bg-brand-blue relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
        <div className="container max-w-xl relative">
          <div className="section-reveal text-center mb-10">
            <div className="ornament mb-4">
              <span className="font-golos text-yellow-400 text-xs uppercase tracking-widest">Вступить</span>
            </div>
            <h2 className="font-oswald font-bold text-white text-4xl md:text-5xl mb-4">Присоединиться к своим</h2>
            <p className="text-blue-200">Оставьте заявку — мы свяжемся и расскажем, как начать</p>
          </div>

          {sent ? (
            <div className="section-reveal bg-white/10 border border-white/20 rounded-2xl p-10 text-center">
              <div className="text-5xl mb-4">🇷🇺</div>
              <h3 className="font-oswald font-bold text-white text-2xl mb-2">Спасибо за отклик!</h3>
              <p className="text-blue-200">Мы свяжемся с вами в ближайшее время.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="section-reveal bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 space-y-5">
              <div>
                <label className="block text-white/80 font-golos text-sm mb-2">Ваше имя</label>
                <input
                  type="text"
                  required
                  placeholder="Иван Петров"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-yellow-400 font-golos"
                />
              </div>
              <div>
                <label className="block text-white/80 font-golos text-sm mb-2">Телефон</label>
                <input
                  type="tel"
                  required
                  placeholder="+7 (___) ___-__-__"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-yellow-400 font-golos"
                />
              </div>
              <div>
                <label className="block text-white/80 font-golos text-sm mb-2">Как хочу помочь</label>
                <select
                  value={formData.help_type}
                  onChange={(e) => setFormData({ ...formData, help_type: e.target.value })}
                  className="w-full bg-brand-blue border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-400 font-golos"
                >
                  <option value="Плести сети">Плести сети</option>
                  <option value="Привезти вещи">Привезти вещи</option>
                  <option value="Помочь деньгами">Помочь деньгами</option>
                  <option value="Другое">Другое</option>
                </select>
              </div>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={formData.agree}
                  onChange={(e) => setFormData({ ...formData, agree: e.target.checked })}
                  className="mt-1 accent-yellow-400"
                />
                <span className="text-white/60 text-xs font-golos leading-relaxed">
                  Согласен(на) с политикой конфиденциальности и обработкой персональных данных
                </span>
              </label>
              <button
                type="submit"
                className="w-full bg-brand-red text-white font-oswald font-bold text-base uppercase tracking-widest py-4 rounded-lg hover:bg-red-700 transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-red-900/40"
              >
                Отправить заявку
              </button>
            </form>
          )}
        </div>
      </section>

      {/* CONTACTS */}
      <section id="contacts" className="py-24 bg-brand-light">
        <div className="container max-w-4xl">
          <div className="section-reveal text-center mb-16">
            <div className="ornament mb-4">
              <span className="font-golos text-yellow-600 text-xs uppercase tracking-widest">Связь</span>
            </div>
            <h2 className="font-oswald font-bold text-brand-dark text-4xl md:text-5xl">Контакты</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: "MapPin", label: "Адрес", value: "г. Артём, Приморский край", href: undefined },
              { icon: "MessageCircle", label: "ВКонтакте", value: "vk.ru/patriotdvprim", href: "https://vk.ru/patriotdvprim" },
              { icon: "Building2", label: "ОГРН", value: "1242500028583", href: undefined },
            ].map(({ icon, label, value, href }) => (
              <div key={label} className="section-reveal bg-white rounded-2xl p-6 border border-brand-blue/10 hover:shadow-lg transition-all duration-300 text-center">
                <div className="w-12 h-12 bg-brand-blue/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Icon name={icon as "MapPin"} size={20} className="text-brand-blue" />
                </div>
                <div className="text-muted-foreground font-golos text-xs uppercase tracking-wider mb-1">{label}</div>
                {href ? (
                  <a href={href} target="_blank" rel="noopener noreferrer" className="font-golos font-semibold text-brand-blue hover:underline text-sm">
                    {value}
                  </a>
                ) : (
                  <div className="font-golos font-semibold text-brand-dark text-sm">{value}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-brand-dark py-8">
        <div className="tricolor" />
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4 pt-8">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-brand-blue flex items-center justify-center">
              <span className="text-white font-oswald font-bold text-xs">П</span>
            </div>
            <span className="font-oswald text-white font-bold">ПАТРИОТ ДВ</span>
          </div>
          <div className="text-white/40 font-golos text-xs text-center">
            АНО «ПАТРИОТ ДВ» · ОГРН 1242500028583 · г. Артём, Приморский край
          </div>
          <a
            href="https://vk.ru/patriotdvprim"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors font-golos text-sm"
          >
            <Icon name="ExternalLink" size={14} />
            ВКонтакте
          </a>
        </div>
      </footer>
    </div>
  );
}
