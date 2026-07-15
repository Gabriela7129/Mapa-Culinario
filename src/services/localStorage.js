const STORAGE_KEY = 'mapa_culinario_dados';
const CONFIG_KEY = 'mapa_culinario_config';

export const localStorageService = {
  getDados() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : { locais: [], paraVisitar: [] };
    } catch {
      return { locais: [], paraVisitar: [] };
    }
  },
  
  setDados(dados) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dados));
  },
  
  getLocais() {
    return this.getDados().locais || [];
  },
  
  setLocais(locais) {
    const dados = this.getDados();
    dados.locais = locais;
    this.setDados(dados);
  },
  
  addLocal(local) {
    const locais = this.getLocais();
    local.id = local.id || Date.now().toString();
    local.criadoEm = local.criadoEm || new Date().toISOString();
    locais.push(local);
    this.setLocais(locais);
    return local;
  },
  
  updateLocal(id, updates) {
    const locais = this.getLocais();
    const idx = locais.findIndex(l => l.id === id);
    if (idx >= 0) {
      locais[idx] = { ...locais[idx], ...updates, atualizadoEm: new Date().toISOString() };
      this.setLocais(locais);
      return locais[idx];
    }
    return null;
  },
  
  deleteLocal(id) {
    const locais = this.getLocais();
    const filtered = locais.filter(l => l.id !== id);
    this.setLocais(filtered);
  },
  
  getParaVisitar() {
    return this.getDados().paraVisitar || [];
  },
  
  setParaVisitar(lista) {
    const dados = this.getDados();
    dados.paraVisitar = lista;
    this.setDados(dados);
  },
  
  addParaVisitar(item) {
    const lista = this.getParaVisitar();
    item.id = item.id || Date.now().toString();
    item.criadoEm = item.criadoEm || new Date().toISOString();
    lista.push(item);
    this.setParaVisitar(lista);
    return item;
  },
  
  deleteParaVisitar(id) {
    const lista = this.getParaVisitar();
    this.setParaVisitar(lista.filter(i => i.id !== id));
  },
  
  moverParaVisitado(idParaVisitar, dadosLocal) {
    this.deleteParaVisitar(idParaVisitar);
    return this.addLocal(dadosLocal);
  },
  
  getConfig() {
    try {
      const raw = localStorage.getItem(CONFIG_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  },
  
  setConfig(config) {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
  },
  
  exportarJSON() {
    return JSON.stringify(this.getDados(), null, 2);
  },
  
  importarJSON(json) {
    try {
      const dados = JSON.parse(json);
      this.setDados(dados);
      return true;
    } catch {
      return false;
    }
  }
};
