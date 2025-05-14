// carrega todo o estado, ou inicia vazio
function loadState() {
  const raw = localStorage.getItem("appState");
  if (raw) return JSON.parse(raw);
  return { users: {}, currentUser: null };
}

// salva todo o estado
function saveState(state) {
  localStorage.setItem("appState", JSON.stringify(state));
}

// cadastra um novo usuário
export function registerUser({ name, email, password }) {
  const state = loadState();
  if (state.users[email]) {
    throw new Error("Este e-mail já está em uso.");
  }
  state.users[email] = { name, password, contacts: [] };
  saveState(state);
}

// faz login de um usuário existente
export function loginUser({ email, password }) {
  const state = loadState();
  const user = state.users[email];
  if (!user || user.password !== password) {
    throw new Error("E-mail ou senha inválidos.");
  }
  state.currentUser = email;
  saveState(state);
}

// Pegar usuário logado
export function getCurrentUser() {
  const state = loadState();
  return state.currentUser ? state.users[state.currentUser] : null;
}
