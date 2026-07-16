import React, { createContext, useContext, useState, useEffect } from 'react';
import { initDatabase } from '../database/database';
import { Comida, LocalVisitado, NovaDescoberta } from '../types';
import { getComidas, getLocaisVisitados, getNovasDescobertas } from '../database/operations';

interface AppContextType {
  comidas: Comida[];
  locaisVisitados: LocalVisitado[];
  novasDescobertas: NovaDescoberta[];
  refreshData: () => Promise<void>;
  isLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [comidas, setComidas] = useState<Comida[]>([]);
  const [locaisVisitados, setLocaisVisitados] = useState<LocalVisitado[]>([]);
  const [novasDescobertas, setNovasDescobertas] = useState<NovaDescoberta[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  async function refreshData() {
    setIsLoading(true);
    try {
      const [comidasData, locaisData, descobertasData] = await Promise.all([
        getComidas(),
        getLocaisVisitados(),
        getNovasDescobertas(),
      ]);
      setComidas(comidasData);
      setLocaisVisitados(locaisData);
      setNovasDescobertas(descobertasData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    initDatabase().then(() => refreshData());
  }, []);

  return (
    <AppContext.Provider value={{ comidas, locaisVisitados, novasDescobertas, refreshData, isLoading }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp deve ser usado dentro de AppProvider');
  return context;
}
