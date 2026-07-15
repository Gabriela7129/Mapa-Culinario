import React, { useState } from 'react';
import { AppProvider, useApp } from './contexts/AppContext.jsx';
import { ABAS } from './utils/tipos.js';
import Layout from './components/Layout/Layout.jsx';
import Mapa from './components/Mapa/Mapa.jsx';
import Formulario from './components/Formulario/Formulario.jsx';
import ListaVisitar from './components/ListaVisitar/ListaVisitar.jsx';
import TelaLogin from './components/Layout/TelaLogin.jsx';

function AppContent() {
  const { abaAtiva, autenticado, loading } = useApp();
  
  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🍽️</div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Carregando seu Mapa Culinário...</p>
        </div>
      </div>
    );
  }
  
  if (!autenticado) {
    return <TelaLogin />;
  }
  
  return (
    <Layout>
      {abaAtiva === ABAS.MAPA && <Mapa />}
      {abaAtiva === ABAS.FORMULARIO && <Formulario />}
      {abaAtiva === ABAS.LISTA && <ListaVisitar />}
    </Layout>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
