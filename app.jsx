/* app.jsx — raiz: tema, partículas, roteamento, tweaks */
const { useState: aS, useEffect: aE, useRef: aR } = React;

const ACCENTS = {
  "Ciano holográfico": { hex: "#7fd3ec", soft: "rgba(127,211,236,0.16)", glow: "rgba(127,211,236,0.55)", hsl: "199 80% 70%" },
  "Roxo neon":         { hex: "#b18cff", soft: "rgba(177,140,255,0.16)", glow: "rgba(177,140,255,0.55)", hsl: "260 100% 78%" },
  "Prata holográfico": { hex: "#cdd2e2", soft: "rgba(205,210,226,0.14)", glow: "rgba(205,210,226,0.5)",  hsl: "228 24% 78%" },
  "Rosa quartzo":      { hex: "#f0a6c8", soft: "rgba(240,166,200,0.16)", glow: "rgba(240,166,200,0.5)",  hsl: "330 72% 80%" },
};
const FONTS = {
  "Cormorant (clássica)": "'Cormorant Garamond', Georgia, serif",
  "Playfair (dramática)": "'Playfair Display', Georgia, serif",
  "Marcellus (etérea)":   "'Marcellus', Georgia, serif",
};

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "dark",
  "accent": "Ciano holográfico",
  "displayFont": "Cormorant (clássica)",
  "particles": 1
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [route, setRoute] = aS(() => (location.hash === "#painel" ? "dash" : "site"));
  const canvasRef = aR(null);
  const densityRef = aR(t.particles);

  // apply theme + accent + font as CSS vars
  aE(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", t.theme);
    const a = ACCENTS[t.accent] || ACCENTS["Ciano holográfico"];
    root.style.setProperty("--accent-hex", a.hex);
    root.style.setProperty("--accent-soft", a.soft);
    root.style.setProperty("--accent-glow", a.glow);
    root.style.setProperty("--accent", a.hsl);
    root.style.setProperty("--font-display", FONTS[t.displayFont] || FONTS["Cormorant (clássica)"]);
  }, [t.theme, t.accent, t.displayFont]);

  // particles (restart when density changes)
  aE(() => {
    densityRef.current = t.particles;
    if (!canvasRef.current) return;
    const stop = startParticles(canvasRef.current, () => densityRef.current);
    return stop;
  }, [t.particles]);

  // magia: rastro de cursor + tilt 3D nos cartões
  aE(() => {
    const stops = [startCursorTrail(), startTilt()];
    return () => stops.forEach((s) => s && s());
  }, []);

  // route <-> hash sync
  aE(() => {
    const onHash = () => setRoute(location.hash === "#painel" ? "dash" : "site");
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  const goDash = () => { location.hash = "painel"; setRoute("dash"); window.scrollTo(0, 0); };
  const goSite = () => { if (location.hash === "#painel") history.replaceState(null, "", location.pathname + location.search); setRoute("site"); window.scrollTo(0, 0); };

  const toggleTheme = () => setTweak("theme", t.theme === "dark" ? "light" : "dark");

  return (
    <>
      <div className="app-bg" />
      <canvas id="particles" ref={canvasRef} />

      {route === "dash"
        ? <Dashboard theme={t.theme} onToggleTheme={toggleTheme} onExit={goSite} />
        : <PublicSite theme={t.theme} onToggleTheme={toggleTheme} onDashboard={goDash} />}

      <ToastHost />

      <TweaksPanel>
        <TweakSection label="Atmosfera" />
        <TweakRadio label="Modo" value={t.theme} options={["dark", "light"]} onChange={(v) => setTweak("theme", v)} />
        <TweakSlider label="Partículas de prata" value={t.particles} min={0} max={2.2} step={0.2} onChange={(v) => setTweak("particles", v)} />
        <TweakSection label="Cor mágica" />
        <TweakSelect label="Acento" value={t.accent} options={Object.keys(ACCENTS)} onChange={(v) => setTweak("accent", v)} />
        <TweakColor label="" value={(ACCENTS[t.accent] || {}).hex} options={Object.values(ACCENTS).map((a) => a.hex)}
          onChange={(hex) => { const name = Object.keys(ACCENTS).find((k) => ACCENTS[k].hex === hex); if (name) setTweak("accent", name); }} />
        <TweakSection label="Tipografia dos títulos" />
        <TweakSelect label="Fonte display" value={t.displayFont} options={Object.keys(FONTS)} onChange={(v) => setTweak("displayFont", v)} />
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
