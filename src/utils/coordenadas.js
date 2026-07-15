/**
 * Migra coordenadas legadas (latitude/longitude) para o formato atual (lat/lng).
 * Retorna um novo objeto com lat/lng populados se existirem latitude/longitude.
 */
export function migrarCoordenadas(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  const resultado = { ...obj };
  if (resultado.lat == null && resultado.latitude != null) {
    resultado.lat = parseFloat(resultado.latitude);
  }
  if (resultado.lng == null && resultado.longitude != null) {
    resultado.lng = parseFloat(resultado.longitude);
  }
  return resultado;
}

/**
 * Aplica migrarCoordenadas em cada item de um array.
 */
export function migrarCoordenadasArray(arr) {
  if (!Array.isArray(arr)) return arr;
  return arr.map(migrarCoordenadas);
}
