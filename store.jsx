/* store.jsx — estado persistente em localStorage
   Coleções: invites (convidados cadastrados pela Manu), gifts, messages.
   Cada convite tem membros (titular + acompanhantes), cada um com status
   de confirmação: "pending" | "yes" | "no". Hook useStore() + helpers. */

const STORE_KEY = "manu15_store_v2";

const SEED = {
  invites: [
    { id: "i1", members: [{ name: "Helena Costa", status: "yes" }, { name: "Marcos Costa", status: "yes" }], note: "Não perderíamos por nada!", at: Date.parse("2026-05-12"), confirmedAt: Date.parse("2026-05-14") },
    { id: "i2", members: [{ name: "Beatriz Campos", status: "yes" }], note: "", at: Date.parse("2026-05-18"), confirmedAt: Date.parse("2026-05-18") },
    { id: "i3", members: [{ name: "Carlos Rezende", status: "pending" }, { name: "Ana Rezende", status: "pending" }, { name: "Lucas Rezende", status: "pending" }], note: "", at: Date.parse("2026-05-21"), confirmedAt: 0 },
    { id: "i4", members: [{ name: "Duda Martins", status: "yes" }, { name: "Sofia Martins", status: "no" }], note: "A Sofia viaja nesse fim de semana 💙", at: Date.parse("2026-05-22"), confirmedAt: Date.parse("2026-05-23") },
  ],
  gifts: [
    { id: "g1", title: "Cofre dos sonhos (PIX)", desc: "Ajude a Manu a realizar a viagem dos sonhos.", kind: "pix", value: "manu.15anos@email.com", claimedBy: "" },
    { id: "g2", title: "Kit câmera instantânea", desc: "Para registrar cada momento mágico.", kind: "link", value: "https://exemplo.com/camera", claimedBy: "Helena Costa" },
    { id: "g3", title: "Fone de ouvido sem fio", desc: "Trilha sonora do País das Maravilhas.", kind: "link", value: "https://exemplo.com/fone", claimedBy: "" },
    { id: "g4", title: "Vale livraria", desc: "Mais histórias para colecionar.", kind: "link", value: "https://exemplo.com/livros", claimedBy: "" },
  ],
  messages: [
    { id: "m1", name: "Vovó Cida", text: "Minha netinha querida, que sua vida seja sempre um conto de fadas. Te amo!", at: Date.parse("2026-05-10") },
    { id: "m2", name: "Duda", text: "15 anos da minha melhor amiga! Bora dançar até 1h da manhã 💫", at: Date.parse("2026-05-19") },
  ],
};

function loadStore() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return structuredClone(SEED);
    const parsed = JSON.parse(raw);
    return { invites: parsed.invites || [], gifts: parsed.gifts || [], messages: parsed.messages || [] };
  } catch (e) { return structuredClone(SEED); }
}

const listeners = new Set();
let state = loadStore();

function persist() {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) {}
  listeners.forEach((l) => l(state));
}
function setState(updater) {
  state = typeof updater === "function" ? updater(state) : updater;
  persist();
}

const uid = () => Math.random().toString(36).slice(2, 9);

/* normalização para busca (sem acento, minúsculo) */
function norm(s) {
  return (s || "").toString().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

const actions = {
  /* --- convites (cadastro feito pela Manu) --- */
  addInvite({ members, note }) {
    const clean = (members || [])
      .map((m) => ({ name: (typeof m === "string" ? m : m.name || "").trim(), status: (m && m.status) || "pending" }))
      .filter((m) => m.name);
    if (!clean.length) return;
    setState((s) => ({ ...s, invites: [{ id: uid(), members: clean, note: note || "", at: Date.now(), confirmedAt: 0 }, ...s.invites] }));
  },
  updateInvite(id, patch) { setState((s) => ({ ...s, invites: s.invites.map((iv) => (iv.id === id ? { ...iv, ...patch } : iv)) })); },
  removeInvite(id) { setState((s) => ({ ...s, invites: s.invites.filter((iv) => iv.id !== id) })); },
  /* define o status de um membro (Manu, no painel) */
  setMemberStatus(inviteId, idx, status) {
    setState((s) => ({
      ...s,
      invites: s.invites.map((iv) => {
        if (iv.id !== inviteId) return iv;
        const members = iv.members.map((m, i) => (i === idx ? { ...m, status } : m));
        return { ...iv, members, confirmedAt: iv.confirmedAt || Date.now() };
      }),
    }));
  },
  /* confirma o convite inteiro a partir do site público */
  confirmInvite(inviteId, statuses, note) {
    setState((s) => ({
      ...s,
      invites: s.invites.map((iv) => {
        if (iv.id !== inviteId) return iv;
        const members = iv.members.map((m, i) => ({ ...m, status: statuses[i] || m.status || "pending" }));
        return { ...iv, members, note: note != null ? note : iv.note, confirmedAt: Date.now() };
      }),
    }));
  },

  /* --- presentes --- */
  addGift(g) { setState((s) => ({ ...s, gifts: [...s.gifts, { id: uid(), kind: "link", value: "", claimedBy: "", ...g }] })); },
  updateGift(id, patch) { setState((s) => ({ ...s, gifts: s.gifts.map((g) => (g.id === id ? { ...g, ...patch } : g)) })); },
  removeGift(id) { setState((s) => ({ ...s, gifts: s.gifts.filter((g) => g.id !== id) })); },
  claimGift(id, name) { setState((s) => ({ ...s, gifts: s.gifts.map((g) => (g.id === id ? { ...g, claimedBy: name } : g)) })); },

  /* --- mural --- */
  addMessage(m) { setState((s) => ({ ...s, messages: [{ id: uid(), at: Date.now(), ...m }, ...s.messages] })); },
  removeMessage(id) { setState((s) => ({ ...s, messages: s.messages.filter((m) => m.id !== id) })); },

  reset() { setState(structuredClone(SEED)); },
};

/* ---------- helpers de agregação ---------- */
function inviteStats(invites) {
  let people = 0, going = 0, declined = 0, pending = 0;
  invites.forEach((iv) => iv.members.forEach((m) => {
    people++;
    if (m.status === "yes") going++;
    else if (m.status === "no") declined++;
    else pending++;
  }));
  const answered = invites.filter((iv) => iv.confirmedAt).length;
  return { people, going, declined, pending, answered, groups: invites.length };
}

/* busca convites cujo algum membro casa com a query */
function searchInvites(invites, query) {
  const q = norm(query);
  if (q.length < 2) return [];
  return invites.filter((iv) => iv.members.some((m) => norm(m.name).includes(q)));
}

function useStore() {
  const [s, set] = React.useState(state);
  React.useEffect(() => {
    const l = (ns) => set(ns);
    listeners.add(l);
    set(state);
    return () => listeners.delete(l);
  }, []);
  return [s, actions];
}

Object.assign(window, { useStore, storeActions: actions, inviteStats, searchInvites, normName: norm });
