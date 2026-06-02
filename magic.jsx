/* magic.jsx — elementos mágicos do tema Alice cyber-fairy
   Exporta: Particles(init), Countdown, useReveals, CardSuit, Cheshire,
            RabbitMark, PocketWatch, Sparkle, Divider */

const { useState, useEffect, useRef, useCallback } = React;

/* ---------- Partículas de prata flutuantes (canvas vanilla) ---------- */
function startParticles(canvas, getDensity) {
  const ctx = canvas.getContext("2d");
  let raf, w, h, dpr, parts = [];
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.width = innerWidth * dpr;
    h = canvas.height = innerHeight * dpr;
    canvas.style.width = innerWidth + "px";
    canvas.style.height = innerHeight + "px";
    build();
  }
  function build() {
    const base = Math.round((innerWidth * innerHeight) / 26000);
    const n = Math.max(8, Math.round(base * (getDensity() ?? 1)));
    parts = Array.from({ length: n }, () => spawn());
  }
  function spawn() {
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      r: (Math.random() * 1.6 + 0.4) * dpr,
      vx: (Math.random() - 0.5) * 0.12 * dpr,
      vy: -(Math.random() * 0.22 + 0.05) * dpr,
      a: Math.random() * 0.5 + 0.15,
      tw: Math.random() * Math.PI * 2,
      tws: Math.random() * 0.02 + 0.005,
    };
  }
  function frame() {
    ctx.clearRect(0, 0, w, h);
    for (const p of parts) {
      p.x += p.vx; p.y += p.vy; p.tw += p.tws;
      if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
      if (p.x < -10) p.x = w + 10; if (p.x > w + 10) p.x = -10;
      const tw = (Math.sin(p.tw) * 0.5 + 0.5);
      const alpha = p.a * (0.35 + tw * 0.65);
      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
      grad.addColorStop(0, `rgba(224,232,244,${alpha})`);
      grad.addColorStop(0.5, `rgba(150,205,232,${alpha * 0.5})`);
      grad.addColorStop(1, "rgba(150,205,232,0)");
      ctx.fillStyle = grad;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2); ctx.fill();
    }
    if (!reduce) raf = requestAnimationFrame(frame);
  }
  resize();
  addEventListener("resize", resize);
  if (reduce) { frame(); } else { frame(); }
  return () => { cancelAnimationFrame(raf); removeEventListener("resize", resize); };
}

/* ---------- Reveal on scroll ---------- */
function useReveals(dep) {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal:not(.in)");
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [dep]);
}

/* ---------- Countdown ---------- */
function Countdown({ target }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const id = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(id); }, []);
  const diff = Math.max(0, target - now);
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  const cells = [["dias", d], ["horas", h], ["min", m], ["seg", s]];
  return (
    <div className="countdown">
      {cells.map(([label, val], i) => (
        <React.Fragment key={label}>
          <div className="cd-cell">
            <div className="cd-num">{String(val).padStart(2, "0")}</div>
            <div className="cd-lab">{label}</div>
          </div>
          {i < 3 && <div className="cd-sep">:</div>}
        </React.Fragment>
      ))}
    </div>
  );
}

/* ---------- Pocket watch (relógio derretido minimalista) ---------- */
function PocketWatch({ size = 26 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <circle cx="16" cy="17" r="10.5" stroke="currentColor" strokeWidth="1.3" opacity="0.85" />
      <path d="M16 6.5 V3 M13.5 3.2 h5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M16 17 V11.5 M16 17 l4 2.4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

/* ---------- Cartola do Chapeleiro (faz reverência) ---------- */
function TopHat({ size = 80 }) {
  return (
    <svg className="tophat" width={size} height={size} viewBox="0 0 80 80" fill="none" aria-hidden="true">
      <g className="th-body">
        <rect x="27" y="8" width="26" height="38" rx="3" fill="currentColor" />
        <rect x="24" y="34" width="32" height="7" rx="1.5" fill="var(--accent-hex)" />
        <ellipse cx="40" cy="48" rx="33" ry="7" fill="currentColor" />
        <ellipse cx="40" cy="46.5" rx="33" ry="7" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
        <rect x="50" y="12" width="9" height="6" rx="1" fill="none" stroke="var(--accent-hex)" strokeWidth="1.4" opacity="0.9" />
        <text x="54.5" y="17" fontSize="5" fill="var(--accent-hex)" textAnchor="middle" fontFamily="serif">10/6</text>
      </g>
    </svg>
  );
}

/* ---------- Cena: coelho atrasado correndo com o relógio ---------- */
function RabbitRunner() {
  return (
    <div className="rabbit-lane" aria-hidden="true">
      <div className="rabbit-runner">
        <span className="rr-rabbit"><RabbitMark size={30} /></span>
        <span className="rr-watch"><PocketWatch size={22} /></span>
      </div>
    </div>
  );
}

/* ---------- Card suit marks (cartas geométricas) ---------- */
function CardSuit({ type = "heart", size = 16 }) {
  const p = {
    heart: "M8 14 C2 9.5 2.5 4.5 5.6 4.5 C7 4.5 8 5.8 8 5.8 C8 5.8 9 4.5 10.4 4.5 C13.5 4.5 14 9.5 8 14 Z",
    spade: "M8 2.5 C8 2.5 13 7 13 10 C13 12 11.4 12.6 10 11.8 C10.4 13 11 13.5 11 13.5 H5 C5 13.5 5.6 13 6 11.8 C4.6 12.6 3 12 3 10 C3 7 8 2.5 8 2.5 Z",
    diamond: "M8 2.5 L13 8 L8 13.5 L3 8 Z",
    club: "M8 2.6 a2.4 2.4 0 1 1 -1.6 4.2 a2.4 2.4 0 1 1 -1 4.4 a2.4 2.4 0 1 1 5.2 0 a2.4 2.4 0 1 1 -1 -4.4 A2.4 2.4 0 0 1 8 2.6 M7.2 11 H8.8 L9.4 13.6 H6.6 Z",
  }[type];
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d={p} />
    </svg>
  );
}

/* ---------- Cheshire grin (aparece no hover) ---------- */
function Cheshire() {
  return (
    <span className="cheshire" aria-hidden="true">
      <svg width="64" height="34" viewBox="0 0 64 34" fill="none">
        <path className="ch-grin" d="M6 10 Q32 40 58 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
        <g className="ch-teeth" stroke="currentColor" strokeWidth="1.1">
          <path d="M16 16 l2 4 l2 -3 l2 4 l2 -3 l2 4 l2 -3 l2 4 l2 -3 l2 4 l2 -3 l2 4 l2 -3" fill="none" opacity="0.85"/>
        </g>
        <circle className="ch-eye" cx="18" cy="6" r="2.2" fill="currentColor" />
        <circle className="ch-eye" cx="46" cy="6" r="2.2" fill="currentColor" />
      </svg>
    </span>
  );
}

/* ---------- Coelho branco (CTA de scroll) ---------- */
function RabbitMark({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <ellipse cx="9" cy="6" rx="1.7" ry="4.2" transform="rotate(-12 9 6)" stroke="currentColor" strokeWidth="1.3" />
      <ellipse cx="14.5" cy="6" rx="1.7" ry="4.2" transform="rotate(10 14.5 6)" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="11.8" cy="14" r="5.6" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="10" cy="13.4" r="0.9" fill="currentColor" />
      <circle cx="13.6" cy="13.4" r="0.9" fill="currentColor" />
      <path d="M11.8 15.4 v1.2 M10.6 16.6 h2.4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

function Sparkle({ size = 14, className = "" }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2 C12.6 7.5 16.5 11.4 22 12 C16.5 12.6 12.6 16.5 12 22 C11.4 16.5 7.5 12.6 2 12 C7.5 11.4 11.4 7.5 12 2 Z" fill="currentColor" />
    </svg>
  );
}

function Divider({ label }) {
  return (
    <div className="divider" aria-hidden="true">
      <span className="divider-line" />
      <CardSuit type="diamond" size={11} />
      {label && <span className="divider-label">{label}</span>}
      <CardSuit type="heart" size={11} />
      <span className="divider-line" />
    </div>
  );
}

/* ---------- Burst de brilhos (confirmação) — WAAPI, sem CSS ---------- */
function sparkleBurst(el) {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !el) return;
  const cs = getComputedStyle(el);
  const accent = cs.getPropertyValue("--accent-hex").trim() || "#7fd3ec";
  const glow = cs.getPropertyValue("--accent-glow").trim() || "rgba(127,211,236,.55)";
  if (cs.position === "static") el.style.position = "relative";
  const rect = el.getBoundingClientRect();
  const cx = rect.width / 2, cy = Math.min(rect.height / 2, 130);
  const layer = document.createElement("div");
  layer.style.cssText = "position:absolute;inset:0;pointer-events:none;overflow:visible;z-index:6;";
  el.appendChild(layer);
  const N = 26;
  for (let i = 0; i < N; i++) {
    const s = document.createElement("span");
    const size = 4 + Math.random() * 8;
    const heart = Math.random() < 0.28;
    s.style.cssText = `position:absolute;left:${cx}px;top:${cy}px;width:${size}px;height:${size}px;` +
      (heart
        ? `background:${accent};clip-path:path('M8 14 C2 9.5 2.5 4.5 5.6 4.5 C7 4.5 8 5.8 8 5.8 C8 5.8 9 4.5 10.4 4.5 C13.5 4.5 14 9.5 8 14 Z');`
        : `border-radius:50%;background:radial-gradient(circle,#eaf3ff,${accent} 62%,transparent);`) +
      `box-shadow:0 0 9px ${glow};`;
    layer.appendChild(s);
    const ang = Math.random() * Math.PI * 2;
    const dist = 50 + Math.random() * 150;
    const dx = Math.cos(ang) * dist, dy = Math.sin(ang) * dist - 24;
    s.animate([
      { transform: "translate(-50%,-50%) scale(.2) rotate(0deg)", opacity: 1 },
      { transform: `translate(${dx}px,${dy}px) scale(1) rotate(180deg)`, opacity: 0.95, offset: 0.7 },
      { transform: `translate(${dx * 1.25}px,${dy * 1.25 + 56}px) scale(.15) rotate(320deg)`, opacity: 0 },
    ], { duration: 950 + Math.random() * 550, easing: "cubic-bezier(.2,.7,.3,1)" });
  }
  setTimeout(() => layer.remove(), 1700);
}

/* ---------- Rastro de brilho prateado no cursor (desktop) ---------- */
function startCursorTrail() {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || window.matchMedia("(pointer: coarse)").matches) return () => {};
  let last = 0;
  function move(e) {
    const now = performance.now();
    if (now - last < 36) return; last = now;
    const s = document.createElement("span");
    s.className = "cursor-spark";
    const size = 3 + Math.random() * 5;
    s.style.left = e.clientX + "px"; s.style.top = e.clientY + "px";
    s.style.width = s.style.height = size + "px";
    document.body.appendChild(s);
    s.animate(
      [{ opacity: 0.85, transform: "translate(-50%,-50%) scale(1)" },
       { opacity: 0, transform: "translate(-50%,-50%) translateY(16px) scale(.2)" }],
      { duration: 760 + Math.random() * 300, easing: "ease-out" }
    ).onfinish = () => s.remove();
  }
  window.addEventListener("pointermove", move, { passive: true });
  return () => window.removeEventListener("pointermove", move);
}

/* ---------- Tilt 3D em cartões .tilt (delegação) ---------- */
function startTilt() {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || window.matchMedia("(pointer: coarse)").matches) return () => {};
  let active = null;
  function move(e) {
    const t = e.target.closest && e.target.closest(".tilt");
    if (t !== active && active) { active.style.transform = ""; }
    active = t;
    if (!t) return;
    const r = t.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    t.style.transform = `perspective(1100px) rotateX(${(-py * 4.5).toFixed(2)}deg) rotateY(${(px * 5.5).toFixed(2)}deg) translateZ(0)`;
  }
  function leave() { if (active) { active.style.transform = ""; active = null; } }
  document.addEventListener("pointermove", move, { passive: true });
  window.addEventListener("blur", leave);
  return () => { document.removeEventListener("pointermove", move); window.removeEventListener("blur", leave); };
}

/* ---------- Trilha sonora (tema da Alice) ---------- */
function MusicButton() {
  const audioRef = useRef(null);
  const fadeRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [touched, setTouched] = useState(false);
  const VOL = 0.55;

  useEffect(() => {
    const a = audioRef.current; if (!a) return;
    a.volume = 0;
    const t = parseFloat(localStorage.getItem("manu15_music_time") || "0");
    if (t && isFinite(t)) { try { a.currentTime = t; } catch (e) {} }
    const save = () => { try { localStorage.setItem("manu15_music_time", a.currentTime); } catch (e) {} };
    a.addEventListener("timeupdate", save);
    return () => a.removeEventListener("timeupdate", save);
  }, []);

  function fade(to, after) {
    const a = audioRef.current; if (!a) return;
    clearInterval(fadeRef.current);
    const from = a.volume, steps = 22; let i = 0;
    fadeRef.current = setInterval(() => {
      i++; a.volume = Math.max(0, Math.min(1, from + (to - from) * (i / steps)));
      if (i >= steps) { clearInterval(fadeRef.current); if (after) after(); }
    }, 40);
  }

  function toggle() {
    const a = audioRef.current; if (!a) return;
    setTouched(true);
    if (playing) {
      fade(0, () => a.pause());
      setPlaying(false);
    } else {
      const p = a.play();
      if (p && p.then) p.then(() => { setPlaying(true); fade(VOL); }).catch(() => setPlaying(false));
      else { setPlaying(true); fade(VOL); }
    }
  }

  return (
    <>
      <audio ref={audioRef} src="assets/alice-theme.mp3" loop preload="auto" />
      <button
        className={"mode-toggle music-btn" + (playing ? " playing" : "") + (!touched ? " invite" : "")}
        onClick={toggle}
        aria-pressed={playing}
        aria-label={playing ? "Pausar música" : "Tocar música"}
        title={playing ? "Pausar trilha" : "Tocar o tema da Alice"}
      >
        {playing ? (
          <span className="eq" aria-hidden="true"><i /><i /><i /></span>
        ) : (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M9 18V6l10-2v11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="6.5" cy="18" r="2.5" stroke="currentColor" strokeWidth="1.6" />
            <circle cx="16.5" cy="15" r="2.5" stroke="currentColor" strokeWidth="1.6" />
          </svg>
        )}
      </button>
    </>
  );
}

Object.assign(window, {
  startParticles, useReveals, Countdown, PocketWatch, CardSuit, Cheshire, RabbitMark, Sparkle, Divider,
  sparkleBurst, startCursorTrail, startTilt, TopHat, RabbitRunner, MusicButton,
});
