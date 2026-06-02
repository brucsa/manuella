/* public.jsx — Site público dos 15 anos da Manu */
const { useState: uS, useEffect: uE, useRef: uR } = React;

const EVENT = {
  dateLabel: "03 de Abril de 2027",
  weekday: "Sábado",
  time: "19h00 às 01h00",
  venue: "Buffet Uriel",
  address: "Av. General Florêncio, 868 — Quitaúna, Osasco",
  mapUrl: "https://www.google.com/maps/search/?api=1&query=Buffet+Uriel+Av+General+Florencio+868+Quitauna+Osasco",
  target: Date.parse("2027-04-03T19:00:00-03:00")
};
const HERO_PHOTO = "assets/manu-hero.jpg";
const fmtDate = (ts) => new Date(ts).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });

/* ============== NAV ============== */
function Nav({ theme, onToggleTheme, onDashboard }) {
  const [scrolled, setScrolled] = uS(false);
  uE(() => {
    const h = () => setScrolled(window.scrollY > 40);
    h();window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);
  return (
    <nav className={"nav" + (scrolled ? " scrolled" : "")}>
      <a href="#hero" className="nav-brand"><span className="brand-crest"><img src="assets/crest.png" alt="Brasão de Manu XV" style={{ objectFit: "fill", width: "60px", height: "60px" }} /><Cheshire /></span> <span className="brand-word"> <span className="dot"></span> <span className="serif-italic"></span></span></a>
      <div className="nav-links">
        <a href="#sobre">Sobre</a>
        <a href="#evento">Evento</a>
        <a href="#dresscode">Traje</a>
        <a href="#presentes">Presentes</a>
        <a href="#mural">Mural</a>
      </div>
      <div className="nav-tools">
        <MusicButton />
        <button className="mode-toggle" onClick={onToggleTheme} aria-label="Alternar tema" title={theme === "dark" ? "Modo prata" : "Modo vinho"}>
          {theme === "dark" ? "☾" : "☀"}
        </button>
        <a href="#rsvp" className="btn btn-silver" style={{ minHeight: 46, padding: "11px 20px", color: "rgb(18, 30, 57)" }}>Confirmar</a>
        <button className="mode-toggle" onClick={onDashboard} aria-label="Área da Manu" title="Área da Manu"><PocketWatch size={20} /></button>
      </div>
    </nav>);

}

/* ============== HERO ============== */
function Hero() {
  return (
    <header className="hero" id="hero">
      <div className="hero-photo"><img src={HERO_PHOTO} alt="Manu" /></div>
      <div className="hero-inner wrap">
        <div className="hero-eyebrow"><Sparkle size={13} /><span className="eyebrow">Manu faz 15 · 03.04.2027</span></div>
        <h1 className="hero-quote display">O segredo é rodear-se de pessoas que façam <em>sorrir o coração</em>.</h1>
        <p className="hero-sub">"E então, e só então, você estará no País das Maravilhas." Venha viver essa noite mágica comigo.</p>
        <p className="hero-name">— com carinho, Manuela</p>
      </div>
      <a href="#sobre" className="scroll-cue">
        <span className="rabbit-pop"><RabbitMark size={26} /></span>
        <span>Siga o coelho branco</span>
        <span className="arrow" />
      </a>
    </header>);

}

/* ============== SOBRE ============== */
function About() {
  return (
    <section className="section" id="sobre">
      <div className="wrap">
        <div className="about-grid">
          <div className="about-text reveal">
            <span className="eyebrow">Sobre a Manu</span>
            <p style={{ marginTop: 18 }}>Tem gente que lê histórias, e tem gente que vive intensamente cada uma delas. A Manu é as duas coisas. Nossa "garota dos livros" mostrou, desde pequenininha, ser uma verdadeira força: intensa, alegre e sempre disposta a sonhar acordada.</p>
            <p>Nessa jornada de quinze anos, ela cresceu abraçando o mundo com a mesma curiosidade de Alice. Ela aprendeu que a magia acontece quando a gente ousa ser quem realmente é. Afinal, como diria o Chapeleiro: "As melhores pessoas são as loucas". E é exatamente essa essência única, brilhante e maravilhosa que vamos celebrar.</p>
            <p>Da menina cheia de energia à jovem que encara a vida de frente, chegou a hora do nosso baile de gala. Siga o coelho branco e venha viver essa noite com a gente!</p>
          </div>
          <div className="about-portrait reveal d2"><img src={HERO_PHOTO} alt="Retrato da Manu" /></div>
        </div>
      </div>
    </section>);

}

/* ============== EVENTO ============== */
function Event() {
  return (
    <section className="section section-sm" id="evento">
      <div className="wrap">
        <div className="sec-head reveal">
          <Divider label="O grande dia" />
          <h2>Quando o relógio marcar a magia</h2>
          <p>Faltam poucos giros do ponteiro para a festa começar.</p>
        </div>
        <div className="event-card glass reveal d1 tilt">
          <RabbitRunner />
          <Countdown target={EVENT.target} />
          <div className="event-meta">
            <div className="cell"><div className="k">Data</div><div className="v">{EVENT.dateLabel}<small>{EVENT.weekday}</small></div></div>
            <div className="cell"><div className="k">Horário</div><div className="v">{EVENT.time}<small>Recepção a partir das 19h</small></div></div>
            <div className="cell"><div className="k">Local</div><div className="v">{EVENT.venue}<small>Salão principal</small></div></div>
          </div>
          <div className="event-address">
            <div className="addr"><strong>{EVENT.venue}</strong>{EVENT.address}</div>
            <a href={EVENT.mapUrl} target="_blank" rel="noopener" className="btn btn-ghost">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11Z" stroke="currentColor" strokeWidth="1.5" /><circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5" /></svg>
              Abrir no Mapa
            </a>
          </div>
        </div>
      </div>
    </section>);

}

/* ============== DRESS CODE ============== */
function DressCode() {
  return (
    <section className="section" id="dresscode">
      <div className="wrap">
        <div className="dress">
          <div className="dress-card glass reveal tilt">
            <span className="eyebrow">Dress code</span>
            <div className="big display">Elegância no <em>País das Maravilhas</em></div>
            <p className="muted" style={{ fontSize: "1.05rem", maxWidth: "42ch" }}>
              Prepare-se para uma noite onde a sofisticação encontra a magia. Nosso encontro será um baile de gala inesquecível! Para embarcarmos juntos nessa atmosfera, pedimos a delicadeza do traje <strong style={{ color: "var(--text)" }}>Esporte Fino</strong>. Sinta-se livre para escolher sua paleta de cores favorita e traga sua melhor energia para essa noite de luzes e encantos.
            </p>
          </div>
          <div className="dress-aside reveal d2">
            <div className="hatter-bow"><TopHat size={84} /><span className="hatter-cap">O Chapeleiro lhe faz uma reverência</span></div>
            <div className="line">✨ <strong>Cores Livres:</strong> O País das Maravilhas é feito de todas as cores. Escolha a sua favorita e sinta-se deslumbrante.</div>
            <div className="line">🎩 <strong>Traje Esporte Fino:</strong> A medida perfeita de elegância e conforto para o nosso baile de gala.</div>
            <div className="line">🕰️ <strong>A Magia não Espera:</strong> Chegue no horário para não perder nenhum instante desse capítulo especial.</div>
          </div>
        </div>
      </div>
    </section>);

}

/* ============== PRESENTES ============== */
const SUITS = ["heart", "spade", "diamond", "club"];
const RANKS = ["A", "K", "Q", "J", "10", "9", "8", "7", "6", "5", "4", "3", "2"];

function Gifts() {
  const [store] = useStore();
  const [copiedId, setCopiedId] = uS(null);

  function copyPix(g) {
    navigator.clipboard?.writeText(g.value);
    setCopiedId(g.id);
    showToast("Chave PIX copiada! 💙");
    setTimeout(() => setCopiedId(null), 2400);
  }

  return (
    <section className="section" id="presentes">
      <div className="wrap">
        <div className="sec-head reveal">
          <Divider label="Lista de presentes" />
          <h2>Um mimo para a aniversariante</h2>
          <p>Sua presença já é o maior presente — mas se quiser carinho extra, escolha uma carta.</p>
        </div>

        <div className="deck-block reveal d1">
          <div className="deck-grid">
            {store.gifts.map((g, i) => {
              const isPix = g.kind === "pix";
              const copied = copiedId === g.id;
              const inner =
                <>
                  <span className="pc-index tl"><b>{RANKS[i % RANKS.length]}</b><CardSuit type={SUITS[i % 4]} size={13} /></span>
                  <span className="pc-center"><CardSuit type={SUITS[i % 4]} size={30} /></span>
                  <span className="pc-name">{g.title}</span>
                  <span className="pc-desc">{g.desc}</span>
                  <span className="pc-go">
                    {isPix ? (copied ? "Copiada ✓" : "Copiar PIX") : "Visitar loja"}
                    {!isPix &&
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M7 17 17 7M9 7h8v8" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    }
                  </span>
                  <span className="pc-index br"><b>{RANKS[i % RANKS.length]}</b><CardSuit type={SUITS[i % 4]} size={13} /></span>
                </>;
              return isPix ?
                <button key={g.id} type="button" className={"play-card pc-pix" + (copied ? " ok" : "")} style={{ "--i": i }} onClick={() => copyPix(g)}>{inner}</button> :
                <a key={g.id} className="play-card" href={g.value} target="_blank" rel="noopener" style={{ "--i": i }}>{inner}</a>;
            })}
          </div>
        </div>
      </div>
    </section>);

}

/* ============== MURAL ============== */
function Mural() {
  const [store, act] = useStore();
  const [name, setName] = uS("");
  const [text, setText] = uS("");
  function send(e) {
    e.preventDefault();
    if (!name.trim() || !text.trim()) return;
    act.addMessage({ name: name.trim(), text: text.trim() });
    showToast("Recado enviado para a Manu 💫");
    setName("");setText("");
  }
  return (
    <section className="section" id="mural">
      <div className="wrap">
        <div className="sec-head reveal">
          <Divider label="Mural de recados" />
          <h2>Deixe um pouquinho de você</h2>
          <p>Uma frase, um desejo, uma lembrança — tudo guardado com carinho.</p>
        </div>
        <div className="mural-layout">
          <form className="mural-form glass reveal" onSubmit={send}>
            <div className="field" style={{ marginBottom: 16 }}>
              <label>Seu nome</label>
              <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Quem está escrevendo?" />
            </div>
            <div className="field" style={{ marginBottom: 18 }}>
              <label>Recado</label>
              <textarea className="input" value={text} onChange={(e) => setText(e.target.value)} placeholder="Escreva algo mágico para a Manu..." maxLength={280} />
            </div>
            <button className="btn btn-accent btn-block" type="submit">Enviar recado</button>
          </form>
          <div className="mural-list">
            {store.messages.length === 0 && <p className="muted">Seja o primeiro a deixar um recado.</p>}
            {store.messages.map((m, i) =>
            <div key={m.id} className={"mural-msg glass reveal d" + (i % 3 + 1)}>
                <div className="txt">"{m.text}"</div>
                <div className="by"><CardSuit type="heart" size={11} /> {m.name} <span className="date">· {fmtDate(m.at)}</span></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>);

}

/* ============== RSVP (busca por nome → confirmação por pessoa) ============== */
function MemberToggle({ name, status, onChange }) {
  return (
    <div className={"member-row" + (status === "yes" ? " is-yes" : status === "no" ? " is-no" : "")}>
      <span className="member-name"><CardSuit type="heart" size={12} /> {name}</span>
      <div className="confirm-toggle" role="radiogroup" aria-label={`Confirmação de ${name}`}>
        <button type="button" className={"ct-opt yes" + (status === "yes" ? " on" : "")} role="radio" aria-checked={status === "yes"} onClick={() => onChange("yes")}>
          <Sparkle size={12} /> Vou
        </button>
        <button type="button" className={"ct-opt no" + (status === "no" ? " on" : "")} role="radio" aria-checked={status === "no"} onClick={() => onChange("no")}>
          Não vou
        </button>
      </div>
    </div>);

}

function Rsvp() {
  const [store, act] = useStore();
  const [query, setQuery] = uS("");
  const [selected, setSelected] = uS(null); // invite escolhido
  const [statuses, setStatuses] = uS([]); // status por membro (edição local)
  const [note, setNote] = uS("");
  const [done, setDone] = uS(false);
  const burstRef = uR(null);

  const results = searchInvites(store.invites, query);

  function openInvite(iv) {
    setSelected(iv);
    setStatuses(iv.members.map((m) => m.status === "no" ? "no" : "yes")); // pré-marca "Vou"
    setNote(iv.note || "");
    setDone(false);
  }
  function reset() {
    setSelected(null);setStatuses([]);setNote("");setQuery("");setDone(false);
  }
  function confirm() {
    act.confirmInvite(selected.id, statuses, note.trim());
    setDone(true);
    if (burstRef.current) sparkleBurst(burstRef.current);
    showToast("Presença confirmada! Até lá 🐇");
  }

  const goingCount = statuses.filter((s) => s === "yes").length;
  const firstName = selected ? (selected.members[0]?.name || "").split(" ")[0] : "";

  return (
    <section className="section" id="rsvp">
      <div className="wrap">
        <div className="sec-head reveal">
          <Divider label="RSVP" />
          <h2>Confirme sua presença</h2>
          <p>Digite seu nome para encontrar seu convite e confirmar quem vai à festa.</p>
        </div>

        <div className="rsvp-card glass reveal d1" ref={burstRef}>
          {/* ---------- estado: sucesso ---------- */}
          {done ?
          <div className="rsvp-success">
              <div className="ring"><Sparkle size={32} /></div>
              <h3 className="display" style={{ fontSize: "1.9rem", marginBottom: 8 }}>
                {goingCount > 0 ? "Presença confirmada!" : "Resposta registrada"}
              </h3>
              <p className="muted" style={{ maxWidth: "36ch", margin: "0 auto 22px" }}>
                {goingCount > 0 ?
              `Que alegria, ${firstName}! ${goingCount === 1 ? "Você vai" : `Vocês ${goingCount} vão`} fazer parte dessa noite mágica. Guarde a data: ${EVENT.dateLabel}.` :
              `Tudo bem, ${firstName}. Vamos sentir sua falta — obrigada por avisar com carinho.`}
              </p>
              <button className="btn btn-ghost" onClick={reset}>Buscar outro nome</button>
            </div>

          /* ---------- estado: convite selecionado ---------- */ :
          selected ?
          <div className="rsvp-invite">
              <button className="back-link" onClick={() => setSelected(null)}>← voltar à busca</button>
              <div className="invite-head">
                <span className="eyebrow">Convite encontrado</span>
                <h3 className="display">Quem vai com você?</h3>
                <p className="muted">Marque <strong style={{ color: "var(--accent-hex)" }}>Vou</strong> ou <strong>Não vou</strong> para cada pessoa do convite.</p>
              </div>
              <div className="member-list">
                {selected.members.map((m, i) =>
              <MemberToggle key={i} name={m.name} status={statuses[i]}
              onChange={(v) => setStatuses((arr) => arr.map((s, idx) => idx === i ? v : s))} />
              )}
              </div>
              <button className="btn btn-silver btn-block" style={{ marginTop: 22 }} onClick={confirm}>
                Confirmar Presença
              </button>
            </div>

          /* ---------- estado: busca ---------- */ :

          <div className="rsvp-find">
              <div className="search-field">
                <span className="search-ic"><RabbitMark size={20} /></span>
                <input className="input search-input" value={query} autoComplete="off"
              onChange={(e) => setQuery(e.target.value)} placeholder="Digite seu nome..." aria-label="Buscar seu nome" />
              </div>
              {query.trim().length >= 2 &&
            <div className="search-results">
                  {results.length === 0 ?
              <div className="no-result">
                      <p>Não encontramos <strong>“{query.trim()}”</strong> na lista.</p>
                      <p className="muted">Confira a grafia ou fale com a Manu pelo <a href="#mural" style={{ color: "var(--accent-hex)" }}>mural</a>.</p>
                    </div> :

              results.map((iv) => {
                const names = iv.members.map((m) => m.name);
                return (
                  <button key={iv.id} className="result-row" onClick={() => openInvite(iv)}>
                          <span className="rr-suit"><CardSuit type="diamond" size={15} /></span>
                          <span className="rr-body">
                            <span className="rr-title">{names[0]}{names.length > 1 ? ` + ${names.length - 1}` : ""}</span>
                            <span className="rr-sub">{names.join(" · ")}</span>
                          </span>
                          {iv.confirmedAt ?
                    <span className="rr-tag done">já respondido</span> :
                    <span className="rr-tag">abrir →</span>}
                        </button>);

              })
              }
                </div>
            }
              {query.trim().length < 2 &&
            <p className="search-hint muted">Seu nome foi cadastrado pela Manu junto com seus acompanhantes. Comece a digitar para encontrá-lo. 🐇</p>
            }
            </div>
          }
        </div>
      </div>
    </section>);

}

/* ============== FOOTER + ACTION BAR ============== */
function Footer() {
  return (
    <footer className="foot">
      <img className="foot-crest" src="assets/crest.png" alt="Brasão de Manu · XV" />
      <Divider />
      <p style={{ marginTop: 24, fontFamily: "var(--font-display)", fontSize: "1.4rem", color: "var(--text)" }}>Manuela · XV</p>
      <p style={{ marginTop: 8, fontSize: "0.86rem" }}>{EVENT.dateLabel} · {EVENT.venue} · Osasco</p>
      <p style={{ marginTop: 18, fontSize: "0.78rem" }}>Feito com <span className="heart">♡</span> no País das Maravilhas</p>
    </footer>);

}

function ActionBar() {
  return (
    <div className="action-bar">
      <a href="#presentes" className="btn btn-ghost">Presentes</a>
      <a href="#rsvp" className="btn btn-silver">Confirmar Presença</a>
    </div>);

}

function PublicSite({ theme, onToggleTheme, onDashboard }) {
  useReveals();
  return (
    <main>
      <Nav theme={theme} onToggleTheme={onToggleTheme} onDashboard={onDashboard} />
      <Hero />
      <About />
      <Event />
      <DressCode />
      <Gifts />
      <Mural />
      <Rsvp />
      <Footer />
      <ActionBar />
    </main>);

}

Object.assign(window, { PublicSite, EVENT, fmtDate });