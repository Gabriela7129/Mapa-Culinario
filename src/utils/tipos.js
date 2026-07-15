export const TIPO_LOCAL = {
  RESTAURANTE: 'restaurante',
  CULTURAL: 'cultural'
};

export const TIPO_LOCAL_LABEL = {
  [TIPO_LOCAL.RESTAURANTE]: 'Restaurante',
  [TIPO_LOCAL.CULTURAL]: 'Evento Cultural'
};

export const TIPO_LOCAL_ICON = {
  [TIPO_LOCAL.RESTAURANTE]: '🍽️',
  [TIPO_LOCAL.CULTURAL]: '🎭'
};

export const STATUS_LOCAL = {
  VISITADO: 'visitado',
  PLANEJADO: 'planejado'
};

export const STATUS_LOCAL_LABEL = {
  [STATUS_LOCAL.VISITADO]: 'Já Visitei',
  [STATUS_LOCAL.PLANEJADO]: 'Quero Visitar'
};

export const STATUS_LOCAL_COR = {
  [STATUS_LOCAL.VISITADO]: '#7BAF8C',
  [STATUS_LOCAL.PLANEJADO]: '#E8A87C'
};

export const FILTROS_PADRAO = {
  status: 'todos', // 'todos', 'visitado', 'planejado'
  tipo: 'todos',   // 'todos', 'restaurante', 'cultural'
  notaMin: -1,     // -1 a 5
  notaMax: 5
};

export const ABAS = {
  MAPA: 'mapa',
  FORMULARIO: 'formulario',
  LISTA: 'lista'
};

export const ABAS_LABEL = {
  [ABAS.MAPA]: '🗺️ Mapa',
  [ABAS.FORMULARIO]: '➕ Adicionar',
  [ABAS.LISTA]: '📋 Locais'
};

export const LISTA_SUBABAS = {
  TODOS: 'todos',
  VISITADOS: 'visitados',
  PARA_VISITAR: 'paraVisitar'
};

export const LISTA_SUBABAS_LABEL = {
  [LISTA_SUBABAS.TODOS]: 'Todos',
  [LISTA_SUBABAS.VISITADOS]: 'Visitados',
  [LISTA_SUBABAS.PARA_VISITAR]: 'Para Visitar'
};
