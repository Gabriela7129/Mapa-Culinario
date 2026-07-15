/**
 * Converte nota numérica para string de emojis
 * -1 → ☁️☁️, 0 → ☁️, 1→⭐, 2→⭐⭐, 3→⭐⭐⭐, 4→⭐⭐⭐⭐, 5→⭐⭐⭐⭐⭐
 * Fracionado → adiciona ✨️
 * Unanime → adiciona 💖 no final
 */
export function notaParaEmoji(nota, unanime = false) {
  const int = Math.floor(nota);
  const frac = nota - int;
  
  let base = '';
  if (int <= -1) base = '☁️☁️';
  else if (int === 0) base = '☁️';
  else if (int >= 1 && int <= 5) base = '⭐'.repeat(int);
  else base = '☁️';
  
  let result = base;
  if (frac > 0 && frac < 1) result += '✨️';
  if (unanime) result += '💖';
  
  return result;
}

export function precoParaEmoji(preco) {
  const int = Math.floor(preco);
  const frac = preco - int;
  
  let base = '';
  if (int <= -1) base = '🪾🪾';
  else if (int === 0) base = '🪾';
  else if (int >= 1 && int <= 5) base = '🌸'.repeat(int);
  else base = '🪾';
  
  if (frac > 0 && frac < 1) base += '🌷';
  
  return base;
}

export function labelNota(nota) {
  if (nota <= -1) return 'Péssimo';
  if (nota === 0) return 'Ruim';
  if (nota === 1) return 'Regular';
  if (nota === 2) return 'Bom';
  if (nota === 3) return 'Muito bom';
  if (nota === 4) return 'Excelente';
  if (nota === 5) return 'Perfeito';
  return 'Indefinido';
}

export function labelPreco(preco) {
  if (preco <= -1) return 'Muito caro';
  if (preco === 0) return 'Caro';
  if (preco === 1) return 'Razoável';
  if (preco === 2) return 'Barato';
  if (preco === 3) return 'Muito barato';
  if (preco === 4) return 'Extremamente barato';
  if (preco === 5) return 'De graça';
  return 'Indefinido';
}
