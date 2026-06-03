/* dashboard.jsx — Área restrita da Manu (login + gestão) */
const { useState: dS, useMemo: dM } = React;

const DASH_PASS = "alice";

function Login({ onOk, onBack }) {
  const [pass, setPass] = dS("");
  const [err, setErr] = dS(false);
  function submit(e) {
    e.preventDefault();
    if (pass.trim().toLowerCase() === DASH_PASS) onOk();
    else { setErr(true); }
  }
  return (
    <div className="login-wrap">
      <form className="login-card glass" onSubmit={submit}>
        <div className="crest crest-img"><img src="assets/crest.png" alt="Brasão de Manu XV" /></div>
        <h2 className="display">Área da Manu</h2>
        <p className="muted" style={{ marginBottom: 22 }}>Entre com a senha mágica para gerenciar a festa.</p>
        <div className="field" style={{ textAlign: "left" }}>
          <label>Senha</label>
          <input className="input" type="password" value={pass} onChange={(e) => { setPass(e.target.value); setErr(false); }} placeholder="••••••" autoFocus />
        </div>
        {err && <p className="login-err">Senha incorreta. Tente novamente.</p>}
        <button className="btn btn-silver btn-block" type="submit" style={{ marginTop: 18 }}>Entrar</button>
        <button type="button" className="btn btn-ghost btn-block" style={{ marginTop: 10 }} onClick={onBack}>← Voltar ao site</button>
        <p className="login-hint">Dica de demonstração: a senha é <strong>alice</strong></p>
      </form>
    </div>
  );
}

function Metric({ k, v, sub, suit }) {
  return (
    <div className="metric glass">
      <span className="suit"><CardSuit type={suit} size={70} /></span>
      <div className="mk">{k}</div>
      <div className="mv">{v} {sub && <small>{sub}</small>}</div>
    </div>
  );
}

const TrashIcon = () => (<svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M5 7h14M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>);
const EditIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M4 20h4L18 10l-4-4L4 16v4ZM14 6l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>);

const STATUS_LABEL = { yes: "Vai", no: "Não vai", pending: "Aguardando" };

function Overview({ store, setTab }) {
  const st = inviteStats(store.invites);
  const claimed = store.gifts.filter((g) => g.claimedBy).length;
  const recent = [...store.invites].filter((iv) => iv.confirmedAt).sort((a, b) => b.confirmedAt - a.confirmedAt).slice(0, 4);
  return (
    <div>
      <div className="metrics">
        <Metric k="Pessoas confirmadas" v={st.going} sub={`de ${st.people}`} suit="heart" />
        <Metric k="Convites" v={st.groups} sub={`· ${st.answered} responderam`} suit="spade" />
        <Metric k="Aguardando" v={st.pending} suit="club" />
        <Metric k="Presentes" v={store.gifts.length} sub={`· ${claimed} reservados`} suit="diamond" />
      </div>
      <div className="dash-section-title"><h3>Últimas respostas</h3><button className="btn btn-ghost" style={{ minHeight: 42, padding: "9px 16px" }} onClick={() => setTab("convidados")}>Ver todos</button></div>
      {recent.map((iv) => {
        const going = iv.members.filter((m) => m.status === "yes").length;
        const names = iv.members.map((m) => m.name);
        return (
          <div key={iv.id} className="rowcard glass">
            <div className="grow"><div className="name">{names[0]}{names.length > 1 ? ` + ${names.length - 1}` : ""}</div><div className="sub">{names.join(" · ")}{iv.note ? ` · ${iv.note}` : ""}</div></div>
            <span className="pill">{going}/{iv.members.length} vão</span>
          </div>
        );
      })}
      {recent.length === 0 && <div className={"empty"}>{"Ninguém respondeu ainda. Cadastre convidados na aba Convidados."}</div>}
    </div>
  );
}

function Guests({ store, act }) {
  const [members, setMembers] = dS([""]);   // [titular, acompanhante, ...]
  const [note, setNote] = dS("");

  function setMember(i, v) { setMembers((arr) => arr.map((m, idx) => (idx === i ? v : m))); }
  function addMember() { setMembers((arr) => [...arr, ""]); }
  function removeMember(i) { setMembers((arr) => arr.length > 1 ? arr.filter((_, idx) => idx !== i) : arr); }
  function save() {
    const clean = members.map((m) => m.trim()).filter(Boolean);
    if (!clean.length) { showToast("Digite ao menos o nome do convidado"); return; }
    act.addInvite({ members: clean.map((name) => ({ name, status: "pending" })), note: note.trim() });
    showToast("Convidado cadastrado ✨");
    setMembers([""]); setNote("");
  }

  const st = inviteStats(store.invites);
  return (
    <div className="guests-layout">
      {/* ---- formulário de cadastro ---- */}
      <div className="invite-form glass">
        <div className="if-head">
          <h3 className="display">Cadastrar convidado</h3>
          <p className="muted">Adicione o convidado e seus acompanhantes. Eles confirmam presença no site.</p>
        </div>
        <div className="if-members">
          {members.map((m, i) => (
            <div className="if-row" key={i}>
              <span className="if-tag">{i === 0 ? "Titular" : "Acomp."}</span>
              <input className="input" value={m} onChange={(e) => setMember(i, e.target.value)}
                placeholder={i === 0 ? "Nome do convidado" : "Nome do acompanhante"}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addMember(); } }}
                autoFocus={i === members.length - 1 && i > 0} />
              {members.length > 1 && (
                <button className="icon-btn" onClick={() => removeMember(i)} title="Remover"><TrashIcon /></button>
              )}
            </div>
          ))}
        </div>
        <button className="add-member" onClick={addMember}>+ Adicionar acompanhante</button>
        <div className="field" style={{ marginTop: 16 }}>
          <label>Observação (opcional)</label>
          <input className="input" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Família, mesa, parentesco..." />
        </div>
        <button className="btn btn-silver btn-block" style={{ marginTop: 16 }} onClick={save}>Cadastrar convite</button>
      </div>

      {/* ---- lista de convites ---- */}
      <div className="invite-list">
        <div className="dash-section-title"><h3>Convidados</h3><span className="chip">{st.going} vão · {st.pending} aguardando</span></div>
        {store.invites.length === 0 && <div className="empty">Nenhum convidado cadastrado ainda. Use o formulário ao lado.</div>}
        {store.invites.map((iv) => {
          const going = iv.members.filter((m) => m.status === "yes").length;
          return (
            <div key={iv.id} className="invite-card glass">
              <div className="ic-top">
                <div className="ic-title">
                  {iv.members[0]?.name}{iv.members.length > 1 ? <span className="ic-count"> +{iv.members.length - 1}</span> : null}
                  {iv.note ? <span className="ic-note">{iv.note}</span> : null}
                </div>
                <div className="ic-meta">
                  {iv.confirmedAt
                    ? <span className="pill">{going}/{iv.members.length} vão · respondeu {fmtDate(iv.confirmedAt)}</span>
                    : <span className="chip" style={{ color: "var(--text-faint)" }}>aguardando resposta</span>}
                  <button className="icon-btn" onClick={() => act.removeInvite(iv.id)} title="Excluir convite"><TrashIcon /></button>
                </div>
              </div>
              <div className="ic-members">
                {iv.members.map((m, i) => (
                  <div key={i} className={"ic-member s-" + m.status}>
                    <span className="icm-name">{m.name}</span>
                    <div className="confirm-toggle sm" role="radiogroup">
                      {["yes", "no", "pending"].map((s) => (
                        <button key={s} type="button" className={"ct-opt " + s + (m.status === s ? " on" : "")}
                          onClick={() => act.setMemberStatus(iv.id, i, s)} aria-checked={m.status === s} role="radio">
                          {STATUS_LABEL[s]}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function GiftAdmin({ store, act }) {
  const [editing, setEditing] = dS(null); // gift object or "new"
  const blank = { title: "", desc: "", kind: "link", value: "" };
  const [form, setForm] = dS(blank);
  function open(g) { setEditing(g || "new"); setForm(g ? { ...g } : blank); }
  function save() {
    if (!form.title.trim()) { showToast("Dê um nome ao presente"); return; }
    if (editing === "new") { act.addGift(form); showToast("Presente adicionado"); }
    else { act.updateGift(editing.id, form); showToast("Presente atualizado"); }
    setEditing(null);
  }
  return (
    <div>
      <div className="dash-section-title"><h3>Lista de presentes</h3><button className="btn btn-silver" style={{ minHeight: 44, padding: "10px 18px" }} onClick={() => open(null)}>+ Adicionar presente</button></div>
      <div className="gift-admin-grid">
        {store.gifts.map((g) => (
          <div key={g.id} className="gadmin glass">
            <div className="gtop">
              <h4>{g.title}</h4>
              <div className="gactions">
                <button className="icon-btn ok" onClick={() => open(g)} title="Editar"><EditIcon /></button>
                <button className="icon-btn" onClick={() => act.removeGift(g.id)} title="Excluir"><TrashIcon /></button>
              </div>
            </div>
            <p className="muted" style={{ fontSize: "0.9rem" }}>{g.desc}</p>
            <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 4 }}>
              <span className="chip">{g.kind === "pix" ? "PIX" : "Link"}</span>
              {g.claimedBy ? <span className="pill">Reservado · {g.claimedBy}</span> : <span className="sub" style={{ fontSize: "0.8rem", color: "var(--text-faint)" }}>disponível</span>}
            </div>
          </div>
        ))}
      </div>
      {store.gifts.length === 0 && <div className={"empty"}>{"Nenhum presente cadastrado. Clique em + Adicionar presente."}</div>}

      {editing && (
        <Modal title={editing === "new" ? "Novo presente" : "Editar presente"} onClose={() => setEditing(null)}>
          <div className="stack" style={{ gap: 16 }}>
            <div className="field"><label>Nome do item</label><input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Ex: Kit câmera instantânea" autoFocus /></div>
            <div className="field"><label>Descrição</label><textarea className="input" value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} placeholder="Uma frase carinhosa sobre o presente" style={{ minHeight: 80 }} /></div>
            <div className="field"><label>Tipo</label>
              <div className="seg">
                <button className={form.kind === "link" ? "on" : ""} onClick={() => setForm({ ...form, kind: "link" })}>Link da loja</button>
                <button className={form.kind === "pix" ? "on" : ""} onClick={() => setForm({ ...form, kind: "pix" })}>Chave PIX</button>
              </div>
            </div>
            <div className="field"><label>{form.kind === "pix" ? "Chave PIX" : "Link"}</label><input className="input" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} placeholder={form.kind === "pix" ? "email, telefone ou chave" : "https://..."} /></div>
            <button className="btn btn-silver btn-block" onClick={save}>{editing === "new" ? "Adicionar" : "Salvar alterações"}</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function MsgAdmin({ store, act }) {
  return (
    <div>
      <div className="dash-section-title"><h3>Mural de recados</h3><span className="chip">{store.messages.length} recados</span></div>
      {store.messages.length === 0 && <div className="empty">Nenhum recado ainda.</div>}
      {store.messages.map((m) => (
        <div key={m.id} className="rowcard glass" style={{ alignItems: "flex-start" }}>
          <div className="grow">
            <div className="txt serif-italic" style={{ fontSize: "1.1rem", color: "var(--text)" }}>"{m.text}"</div>
            <div className="sub" style={{ marginTop: 8, color: "var(--accent-hex)" }}>{m.name} · {fmtDate(m.at)}</div>
          </div>
          <button className="icon-btn" onClick={() => act.removeMessage(m.id)} title="Remover"><TrashIcon /></button>
        </div>
      ))}
    </div>
  );
}

function Dashboard({ theme, onToggleTheme, onExit }) {
  const [authed, setAuthed] = dS(() => sessionStorage.getItem("manu15_auth") === "1");
  const [tab, setTab] = dS("overview");
  const [store, act] = useStore();
  function login() { sessionStorage.setItem("manu15_auth", "1"); setAuthed(true); }
  function logout() { sessionStorage.removeItem("manu15_auth"); setAuthed(false); onExit(); }
  if (!authed) return <div className="dash"><Login onOk={login} onBack={onExit} /></div>;
  const tabs = [
    ["overview", "Visão geral", null],
    ["convidados", "Convidados", store.invites.length],
    ["presentes", "Presentes", store.gifts.length],
    ["mural", "Mural", store.messages.length],
  ];
  return (
    <div className="dash">
      <div className="dash-top">
        <div className="title"><img className="dash-crest" src="assets/crest.png" alt="" /> Painel da Manu <span className="dot">·</span> <span className="serif-italic">XV</span></div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="mode-toggle" onClick={onToggleTheme} aria-label="Tema">{theme === "dark" ? "☾" : "☀"}</button>
          <button className="btn btn-ghost" style={{ minHeight: 46, padding: "11px 18px" }} onClick={onExit}>Ver site</button>
          <button className="btn btn-ghost" style={{ minHeight: 46, padding: "11px 18px" }} onClick={logout}>Sair</button>
        </div>
      </div>
      <div className="dash-tabs">
        {tabs.map(([id, label, count]) => (
          <button key={id} className={"dash-tab" + (tab === id ? " active" : "")} onClick={() => setTab(id)}>
            {label}{count != null && <span className="badge">{count}</span>}
          </button>
        ))}
      </div>
      <div className="dash-body">
        {tab === "overview" && <Overview store={store} setTab={setTab} />}
        {tab === "convidados" && <Guests store={store} act={act} />}
        {tab === "presentes" && <GiftAdmin store={store} act={act} />}
        {tab === "mural" && <MsgAdmin store={store} act={act} />}
      </div>
    </div>
  );
}

Object.assign(window, { Dashboard });
