import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { localStorageService } from '../services/localStorage.js';
import { googleDriveService } from '../services/googleDrive.js';
import { ABAS, TIPO_LOCAL, STATUS_LOCAL } from '../utils/tipos.js';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [abaAtiva, setAbaAtiva] = useState(ABAS.MAPA);
  const [locais, setLocais] = useState([]);
  const [paraVisitar, setParaVisitar] = useState([]);
  const [localEditando, setLocalEditando] = useState(null);
  const [googleAutenticado, setGoogleAutenticado] = useState(false);
  const [googleToken, setGoogleToken] = useState(null);
  const [senhaConfigurada, setSenhaConfigurada] = useState(false);
  const [autenticado, setAutenticado] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({
    status: 'todos',
    tipo: 'todos',
    notaMin: -1,
    notaMax: 5
  });

  // Carregar dados ao iniciar
  useEffect(() => {
    const config = localStorageService.getConfig();
    const dados = localStorageService.getDados();
    setLocais(dados.locais || []);
    setParaVisitar(dados.paraVisitar || []);
    setSenhaConfigurada(!!config.senha);
    setAutenticado(!config.senha); // Se não tem senha, já está autenticado
    setLoading(false);
  }, []);

  // Persistir quando mudar
  useEffect(() => {
    if (!loading) {
      localStorageService.setDados({ locais, paraVisitar });
    }
  }, [locais, paraVisitar, loading]);

  const salvarLocal = useCallback((local) => {
    if (local.id) {
      const atualizado = localStorageService.updateLocal(local.id, local);
      if (atualizado) {
        setLocais(prev => prev.map(l => l.id === local.id ? atualizado : l));
      }
    } else {
      const novo = localStorageService.addLocal(local);
      setLocais(prev => [...prev, novo]);
    }
  }, []);

  const excluirLocal = useCallback((id) => {
    localStorageService.deleteLocal(id);
    setLocais(prev => prev.filter(l => l.id !== id));
  }, []);

  const salvarParaVisitar = useCallback((item) => {
    if (item.id) {
      // Atualizar existente
      const lista = localStorageService.getParaVisitar();
      const idx = lista.findIndex(i => i.id === item.id);
      if (idx >= 0) {
        lista[idx] = { ...item, atualizadoEm: new Date().toISOString() };
        localStorageService.setParaVisitar(lista);
        setParaVisitar(lista);
      }
    } else {
      const novo = localStorageService.addParaVisitar(item);
      setParaVisitar(prev => [...prev, novo]);
    }
  }, []);

  const excluirParaVisitar = useCallback((id) => {
    localStorageService.deleteParaVisitar(id);
    setParaVisitar(prev => prev.filter(i => i.id !== id));
  }, []);

  const moverParaVisitado = useCallback((idParaVisitar, dadosLocal) => {
    const local = localStorageService.moverParaVisitado(idParaVisitar, dadosLocal);
    setParaVisitar(prev => prev.filter(i => i.id !== idParaVisitar));
    setLocais(prev => [...prev, local]);
    return local;
  }, []);

  const abrirFormulario = useCallback((local = null, abaOrigem = ABAS.MAPA) => {
    setLocalEditando(local);
    setAbaAtiva(ABAS.FORMULARIO);
  }, []);

  const abrirFormularioDeVisitar = useCallback((item) => {
    const prefill = {
      nome: item.nome,
      endereco: item.endereco,
      tipo: item.tipo || TIPO_LOCAL.RESTAURANTE,
      status: STATUS_LOCAL.VISITADO,
      links: item.links || {},
      _idParaVisitar: item.id
    };
    setLocalEditando(prefill);
    setAbaAtiva(ABAS.FORMULARIO);
  }, []);

  const verificarSenha = useCallback((senha) => {
    const config = localStorageService.getConfig();
    if (config.senha === senha) {
      setAutenticado(true);
      return true;
    }
    return false;
  }, []);

  const definirSenha = useCallback((senha) => {
    const config = localStorageService.getConfig();
    config.senha = senha;
    localStorageService.setConfig(config);
    setSenhaConfigurada(true);
    setAutenticado(true);
  }, []);

  const conectarGoogle = useCallback((token) => {
    setGoogleToken(token);
    googleDriveService.setAccessToken(token);
    setGoogleAutenticado(true);
  }, []);

  const sincronizarGoogle = useCallback(async () => {
    if (!googleToken) return;
    try {
      const merged = await googleDriveService.sync({ locais, paraVisitar });
      setLocais(merged.locais || []);
      setParaVisitar(merged.paraVisitar || []);
      return true;
    } catch (e) {
      console.error('Sync failed:', e);
      return false;
    }
  }, [googleToken, locais, paraVisitar]);

  const filtrarLocais = useCallback(() => {
    return locais.filter(l => {
      if (filtros.status !== 'todos' && l.status !== filtros.status) return false;
      if (filtros.tipo !== 'todos' && l.tipo !== filtros.tipo) return false;
      if (l.nota < filtros.notaMin || l.nota > filtros.notaMax) return false;
      return true;
    });
  }, [locais, filtros]);

  const value = {
    abaAtiva, setAbaAtiva,
    locais, setLocais,
    paraVisitar, setParaVisitar,
    localEditando, setLocalEditando,
    salvarLocal, excluirLocal,
    salvarParaVisitar, excluirParaVisitar, moverParaVisitado,
    abrirFormulario, abrirFormularioDeVisitar,
    autenticado, senhaConfigurada, verificarSenha, definirSenha,
    googleAutenticado, googleToken, conectarGoogle, sincronizarGoogle,
    filtros, setFiltros, filtrarLocais,
    loading
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp deve ser usado dentro de AppProvider');
  return ctx;
}
