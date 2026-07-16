export interface Localizacao {
  latitude: number;
  longitude: number;
  endereco: string;
}

export interface ItemComida {
  id?: number;
  comida_id?: number;
  nome: string;
  foto: string | null;
  descricao: string;
  nota: number;
  notaUnanime: boolean;
  preco: number;
}

export interface Comida {
  id?: number;
  tipo: 'restaurante' | 'espaco';
  nome: string;
  localizacao: Localizacao;
  dataVisita: string | null;
  descricao: string;
  temHomeOffice: boolean;
  nota: number;
  notaUnanime: boolean;
  foto: string | null;
  comidas: ItemComida[];
}

export interface LocalVisitado {
  id?: number;
  tipo: 'restaurante' | 'espaco';
  nome: string;
  localizacao: Localizacao;
  dataVisita: string | null;
  descricao: string;
  nota: number;
  foto: string | null;
}

export interface NovaDescoberta {
  id?: number;
  nome: string;
  descricao: string;
  linkVideo: string | null;
  localizacao: Localizacao;
}
