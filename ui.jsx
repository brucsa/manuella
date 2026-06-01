/* ui.jsx — Modal + Toast compartilhados */
const { useState: useStateUI, useEffect: useEffectUI } = React;

let _toastTimer;
function showToast(msg, icon = "sparkle") {
  const ev = new CustomEvent("manu-toast", { detail: { msg, icon } });
  window.dispatchEvent(ev);
}

function ToastHost() {
  const [t, setT] = useStateUI(null);
  useEffectUI(() => {
    const h = (e) => {
      setT(e.detail);
      clearTimeout(_toastTimer);
      _toastTimer = setTimeout(() => setT(null), 3200);
    };
    window.addEventListener("manu-toast", h);
    return () => window.removeEventListener("manu-toast", h);
  }, []);
  return (
    <div className={"toast" + (t ? " show" : "")} role="status" aria-live="polite">
      {t && (<><Sparkle size={15} /><span>{t.msg}</span></>)}
    </div>
  );
}

function Modal({ title, onClose, children, maxWidth }) {
  useEffectUI(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, []);
  return (
    <div className="modal-back" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal glass" style={maxWidth ? { maxWidth } : null} role="dialog" aria-modal="true">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, marginBottom: 18 }}>
          <h3>{title}</h3>
          <button className="mode-toggle" style={{ width: 38, height: 38, flex: "none" }} onClick={onClose} aria-label="Fechar">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

Object.assign(window, { showToast, ToastHost, Modal });
