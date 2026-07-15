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

/**
 * Descrição detalhada do significado da nota de um local
 * Textos conforme feedback da Gabriela
 */
export function descricaoNotaLocal(nota) {
  if (nota <= -1) return 'inóspito, não consegui comer, atendimento péssimo, sairia';
  if (nota === 0) return 'inóspito, podrão, pé sujo, grosseria';
  if (nota === 1) return 'não vá';
  if (nota === 1.5) return 'evite se possível';
  if (nota === 2) return 'tolerável, alguma coisa foi boa';
  if (nota === 2.5) return 'padrão, esperável';
  if (nota === 3) return 'nada de mais, mas bom, conveniente';
  if (nota === 3.5) return 'bom, acima do esperado';
  if (nota === 4) return 'voltaria, conveniente, é uma opção segura';
  if (nota === 4.5) return 'ótimo, super recomendo';
  if (nota === 5) return 'hospito, atendimento bom, confortável, surpreendente, me senti bem, voltaria';
  return 'Indefinido';
}

/**
 * Descrição detalhada do significado da nota de um prato
 * Textos conforme feedback da Gabriela
 */
export function descricaoNotaPrato(nota) {
  if (nota <= -1) return 'passei mal, joguei fora';
  if (nota === 0) return 'não como, prefiro não comer';
  if (nota === 1) return 'se só tiver aquilo';
  if (nota === 1.5) return 'evite se possível';
  if (nota === 2) return 'se tiver como, mas não compraria';
  if (nota === 2.5) return 'padrão, esperável';
  if (nota === 3) return 'comeria por conveniência';
  if (nota === 3.5) return 'gostei, recomendaria';
  if (nota === 4) return 'se tivesse comeria, é uma opção certa';
  if (nota === 4.5) return 'delicioso, procuraria para comer';
  if (nota === 5) return 'se der voltaria, moveria montanhas para comer novamente';
  return 'Indefinido';
}

/**
 * Descrição detalhada do significado do preço de um prato
 */
export function descricaoPreco(preco) {
  if (preco <= -1) return 'Roubo. Preço absurdamente alto pelo que entrega.';
  if (preco === 0) return 'Caro. Não compensa o custo-benefício.';
  if (preco === 0.5) return 'Preço alto demais para o que oferece.';
  if (preco === 1) return 'Razoável. Preço justo para a qualidade oferecida.';
  if (preco === 1.5) return 'Um pouco caro, mas aceitável.';
  if (preco === 2) return 'Barato. Bom custo-benefício, vale o investimento.';
  if (preco === 2.5) return 'Valor esperado';
  if (preco === 3) return 'Muito barato. Qualidade excelente por um preço baixo.';
  if (preco === 3.5) return 'Ótimo custo-benefício, imperdível.';
  if (preco === 4) return 'Extremamente barato. Quase inacreditável pelo preço.';
  if (preco === 5) return 'De graça. Não custou nada ou valeu cada centavo.';
  return 'Indefinido';
}
