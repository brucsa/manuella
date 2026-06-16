/* store.jsx — estado via PHP/MySQL (api.php) */

const API = 'api.php';

async function apiCall(action, data) {
  try {
    const res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, ...data })
    });
    return await res.json();
  } catch (e) {
    console.error('API error:', e);
    return { error: e.message };
  }
}

const uid = () => Math.random().toString(36).slice(2, 9);

let state = { invites: [], gifts: [], messages: [] };
const listeners = new Set();

function notify() { listeners.forEach((l) => l({ ...state })); }

async function loadAll() {
  const data = await apiCall('getAll', {});
  if (data && !data.error) { state = data; notify(); }
}

loadAll();
setInterval(loadAll, 30000);

const actions = {
  async addInvite({ members, note }) {
    const clean = (members || []).filter((m) => m.name);
    if (!clean.length) return;
    await apiCall('addInvite', { id: uid(), members: clean, note: note || '' });
    await loadAll();
  },
  async removeInvite(id) {
    await apiCall('removeInvite', { id });
    await loadAll();
  },
  async setMemberStatus(inviteId, idx, status) {
    await apiCall('setMemberStatus', { inviteId, idx, status });
    await loadAll();
  },
  async confirmInvite(inviteId, statuses, note) {
    await apiCall('confirmInvite', { id: inviteId, statuses, note });
    await loadAll();
  },
  async addGift(g) {
    await apiCall('addGift', { id: uid(), ...g });
    await loadAll();
  },
  async updateGift(id, patch) {
    await apiCall('updateGift', { id, ...patch });
    await loadAll();
  },
  async removeGift(id) {
    await apiCall('removeGift', { id });
    await loadAll();
  },
  async claimGift(id, name) {
    await apiCall('claimGift', { id, name });
    await loadAll();
  },
  async addMessage(m) {
    await apiCall('addMessage', { id: uid(), ...m });
    await loadAll();
  },
  async removeMessage(id) {
    await apiCall('removeMessage', { id });
    await loadAll();
  },
};

function norm(s) {
  return (s || '').toString().normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
}

function inviteStats(invites) {
  let people = 0, going = 0, declined = 0, pending = 0;
  (invites || []).forEach((iv) => (iv.members || []).forEach((m) => {
    people++;
    if (m.status === 'yes') going++;
    else if (m.status === 'no') declined++;
    else pending++;
  }));
  const answered = (invites || []).filter((iv) => iv.confirmedAt).length;
  return { people, going, declined, pending, answered, groups: (invites || []).length };
}

function searchInvites(invites, query) {
  const q = norm(query);
  if (q.length < 2) return [];
  return (invites || []).filter((iv) => (iv.members || []).some((m) => norm(m.name).includes(q)));
}

function useStore() {
  const [s, set] = React.useState(state);
  React.useEffect(() => {
    const l = (ns) => set(ns);
    listeners.add(l);
    set({ ...state });
    return () => listeners.delete(l);
  }, []);
  return [s, actions];
}

Object.assign(window, { useStore, storeActions: actions, inviteStats, searchInvites, normName: norm });
