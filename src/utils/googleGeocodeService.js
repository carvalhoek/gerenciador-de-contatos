import axios from "axios";

/**
 * Instância axios configurada para o endpoint de Geocoding do Google Maps.
 * A URL base já inclui o formato JSON.
 */
const geocodeApi = axios.create({
  baseURL: "https://maps.googleapis.com/maps/api/geocode/json",
  timeout: 5000,
});

/**
 * Monta o parâmetro “address” para a query string a partir dos campos do contato.
 * @param {Object} contact
 * @param {string} contact.cep
 * @param {string} contact.state
 * @param {string} contact.city
 * @param {string} contact.address
 * @param {string} contact.number
 * @param {string} [contact.complement]
 * @returns {string} endereço formatado para a API
 */
function formatAddressParam({ cep, state, city, address, number, complement }) {
  const parts = [
    address.trim(),
    number.trim(),
    city.trim(),
    state.trim(),
    "Brasil",
  ];
  if (complement) parts.splice(2, 0, complement.trim());
  // se houver CEP, podemos colocar no fim para maior precisão
  if (cep) parts.push(cep.trim());
  return parts.filter(Boolean).join(", ");
}

/**
 * Consulta a API do Google Geocoding e retorna latitude/longitude.
 * @param {Object} contact — objeto com os campos de endereço
 * @param {string} apiKey — chave de API do Google Maps
 * @returns {Promise<{ lat: number, lng: number }>}
 * @throws {Error} em caso de falha na requisição ou sem resultados
 */
export async function getCoordinatesByContact(contact, apiKey) {
  const addressParam = formatAddressParam(contact);
  const response = await geocodeApi.get("", {
    params: {
      address: addressParam,
      key: apiKey,
    },
  });
  const { status, results } = response.data;
  if (status !== "OK" || !results.length) {
    throw new Error(`Geocoding falhou: ${status}`);
  }
  const { lat, lng } = results[0].geometry.location;
  return { lat, lng };
}

/**
 * Consulta a API do Google Geocoding a partir de um texto livre.
 * @param {string} addressString
 * @param {string} apiKey
 * @returns {Promise<{ lat: number, lng: number }>}
 */
export async function getCoordinatesByAddressString(addressString, apiKey) {
  const response = await geocodeApi.get("", {
    params: {
      address: addressString,
      key: apiKey,
    },
  });
  const { status, results } = response.data;
  if (status !== "OK" || !results.length) {
    throw new Error(`Geocoding falhou: ${status}`);
  }
  return {
    lat: results[0].geometry.location.lat,
    lng: results[0].geometry.location.lng,
  };
}
