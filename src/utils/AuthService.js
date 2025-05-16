/**
 * Carrega todo o estado da aplicação (usuários e currentUser) do localStorage.
 * @returns {{ users: Record<string, { name: string, password: string, contacts: any[] }>, currentUser: string | null }}
 */
export function loadState() {
  const raw = localStorage.getItem("appState");
  if (raw) return JSON.parse(raw);
  return { users: {}, currentUser: null };
}

/**
 * Persiste todo o estado da aplicação (usuários e currentUser) no localStorage.
 * @param {{ users: Record<string, { name: string, password: string, contacts: any[] }>, currentUser: string | null }} state
 */
export function saveState(state) {
  localStorage.setItem("appState", JSON.stringify(state));
}

/**
 * Registra um novo usuário e torna-o o usuário atual.
 * @param {{ name: string, email: string, password: string }} params
 * @throws {Error} Se o e-mail já estiver em uso.
 */
export function registerUser({ name, email, password }) {
  const state = loadState();
  if (state.users[email]) {
    throw new Error("Este e-mail já está em uso.");
  }
  state.users[email] = { name, password, contacts: [] };
  state.currentUser = email;
  saveState(state);
}

/**
 * Realiza o login de um usuário existente.
 * @param {{ email: string, password: string }} params
 * @throws {Error} Se o e-mail não existir ou a senha estiver incorreta.
 */
export function loginUser({ email, password }) {
  const state = loadState();
  const user = state.users[email];
  if (!user || user.password !== password) {
    throw new Error("E-mail ou senha inválidos.");
  }
  state.currentUser = email;
  saveState(state);
}

/**
 * Desloga o usuário atual, limpando a referência no estado.
 */
export function logoutUser() {
  const state = loadState();
  state.currentUser = null;
  saveState(state);
}

/**
 * Deleta o usuário atualmente logado, removendo-o do estado.
 * @throws {Error} Se nenhum usuário estiver logado.
 */
export function deleteCurrentUser() {
  const state = loadState();
  const email = state.currentUser;
  if (!email) {
    throw new Error("Nenhum usuário está logado.");
  }
  delete state.users[email];
  state.currentUser = null;
  saveState(state);
}

/**
 * Retorna os dados do usuário que está logado no momento.
 * @returns {{ name: string, password: string, contacts: any[] } | null}
 */
export function getCurrentUser() {
  const state = loadState();
  return state.currentUser ? state.users[state.currentUser] : null;
}

/**
 * Confirma se a senha fornecida corresponde à do usuário atual.
 * @param {string} password
 * @returns {boolean} true se a senha estiver correta, ou false caso contrário.
 */
export function confirmCurrentUserPassword(password) {
  const currentUser = getCurrentUser();
  if (!currentUser || currentUser.password !== password) {
    return false;
  }
  return true;
}
