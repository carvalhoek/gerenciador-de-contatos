// viaCepService.js
import axios from "axios";

// Cria instância para ViaCEP
const viaCepApi = axios.create({
  baseURL: "https://viacep.com.br/ws", // base da API :contentReference[oaicite:0]{index=0}
  timeout: 5000,
});

/**
 * Busca endereço a partir de um CEP
 * @param {string} cep - CEP com 8 dígitos (com ou sem máscara)
 * @returns {Promise<Object>} endereço completo
 * @throws {Error} se CEP inválido ou não encontrado
 */
export async function getAddressByCEP(cep) {
  const cleanCep = cep.toString().replace(/\D+/g, "");
  if (!/^\d{8}$/.test(cleanCep)) {
    throw new Error("CEP inválido. Deve conter 8 dígitos.");
  }

  const { data } = await viaCepApi.get(`/${cleanCep}/json/`);
  if (data.erro) {
    throw new Error("CEP não encontrado.");
  }
  return data;
}

/**
 * Busca lista de CEPs a partir de UF, cidade e logradouro
 * @param {string} uf      - Unidade federativa (ex: "SP", "RJ")
 * @param {string} city    - Nome da cidade (ex: "São Paulo")
 * @param {string} address - Parte do logradouro (ex: "Avenida Paulista")
 * @returns {Promise<Array<Object>>} lista de endereços com CEPs
 * @throws {Error} em caso de parâmetros inválidos ou falha na requisição
 */
export async function getCepByAddress(uf, city, address) {
  // Escapa parâmetros para URL
  const encCity = encodeURIComponent(city.trim());
  const encAddress = encodeURIComponent(address.trim());

  // Consulta o endpoint /ws/{uf}/{city}/{address}/json/
  const response = await viaCepApi.get(`/${uf}/${encCity}/${encAddress}/json/`);
  const data = response.data;

  // Se retorno não for array, API respondeu erro
  if (!Array.isArray(data)) {
    throw new Error(
      "Nenhum resultado encontrado para os parâmetros informados."
    );
  }
  return data;
}
