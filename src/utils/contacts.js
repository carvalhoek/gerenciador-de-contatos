import { loadState, saveState } from "./auth"; // ajuste o caminho conforme seu projeto

/**
 * Recupera todos os contatos do usuário atualmente logado.
 * @returns {Array<{ id: string, name: string, cpf: string, phone: string }>}
 */
export function getCurrentUserContacts() {
  const state = loadState();
  const email = state.currentUser;
  if (!email) {
    throw new Error("Nenhum usuário está logado.");
  }
  return state.users[email].contacts;
}

/**
 * Adiciona um novo contato ao usuário atual.
 * Garante que não haja outro contato com o mesmo CPF.
 * Retorna a lista atualizada de contatos.
 * @param {{ id: string, name: string, cpf: string, phone: string }} contact
 * @returns {Array<{ id: string, name: string, cpf: string, phone: string }>}
 */
export function addContact(contact) {
  const state = loadState();
  const email = state.currentUser;
  if (!email) {
    throw new Error("Nenhum usuário está logado.");
  }
  const user = state.users[email];
  if (user.contacts.some((c) => c.cpf === contact.cpf)) {
    throw new Error("Já existe um contato com este CPF.");
  }
  user.contacts.push(contact);
  saveState(state);
  return user.contacts;
}

/**
 * Atualiza um contato existente do usuário atual.
 * Garante unicidade de CPF entre os demais contatos.
 * Retorna a lista atualizada de contatos.
 * @param {{ id: string, name: string, cpf: string, phone: string }} contact
 * @returns {Array<{ id: string, name: string, cpf: string, phone: string }>}
 */
export function updateContact(contact) {
  const state = loadState();
  const email = state.currentUser;
  if (!email) {
    throw new Error("Nenhum usuário está logado.");
  }
  const user = state.users[email];
  const idx = user.contacts.findIndex((c) => c.id === contact.id);
  if (idx === -1) {
    throw new Error("Contato não encontrado.");
  }
  if (user.contacts.some((c) => c.cpf === contact.cpf && c.id !== contact.id)) {
    throw new Error("Já existe outro contato com este CPF.");
  }
  user.contacts[idx] = contact;
  saveState(state);
  return user.contacts;
}

/**
 * Remove um contato do usuário atual pelo ID.
 * Retorna a lista atualizada de contatos.
 * @param {string} contactId
 * @returns {Array<{ id: string, name: string, cpf: string, phone: string }>}
 */
export function deleteContact(contactId) {
  const state = loadState();
  const email = state.currentUser;
  if (!email) {
    throw new Error("Nenhum usuário está logado.");
  }
  const user = state.users[email];
  const originalCount = user.contacts.length;
  user.contacts = user.contacts.filter((c) => c.id !== contactId);
  if (user.contacts.length === originalCount) {
    throw new Error("Contato não encontrado.");
  }
  saveState(state);
  return user.contacts;
}
