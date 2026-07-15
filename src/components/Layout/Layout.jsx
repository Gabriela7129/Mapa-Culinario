import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext.jsx';
import { ABAS, ABAS_LABEL } from '../../utils/tipos.js';

export default function Layout({ children }) {
  const {
    abaAtiva,
    setAbaAtiva,
    googleAutenticado,
    sincronizarGoogle,
    locais,
    paraVisitar
  } = useApp();

  const [syncing, setSyncing] = useState(false);
  const [mostrarMenu, setMostrarMenu] = useState(false);

  const handleSync = async () => {
    if (!googleAutenticado || syncing) return;
    setSyncing(true);
    try {
      await sincronizarGoogle();
    } catch (e) {
      console.error('Erro ao sincronizar:', e);
    } finally {
      setSyncing(false);
    }
  };

  const totalItens = locais.length + paraVisitar.length;

  return (
    <div className="layout-container">
      {/* Header */}
      <header className="layout-header">
        <div className="header-brand">
          <span className="header-icon">&#127860;</span>
          <h1 className="header-title">Mapa Culinario</h1>
        </div>
        <div className="header-actions">
          {googleAutenticado && (
            <button
              className={`btn btn-small ${syncing ? 'btn-syncing' : ''}`}
              onClick={handleSync}
              title="Sincronizar com Google Drive"
              disabled={syncing}
            >
              {syncing ? (
                <span className="sync-spinner">&#128260;</span>
              ) : (
                <span>&#128260;</span>
              )}
              <span className="sync-label">Sync</span>
            </button>
          )}
          <button
            className="btn btn-small btn-secondary menu-toggle"
            onClick={() => setMostrarMenu(v => !v)}
            title="Menu"
          >
            <span>&#9776;</span>
          </button>
        </div>
      </header>

      {/* Menu mobile dropdown */}
      {mostrarMenu && (
        <div className="menu-dropdown fade-in">
          <div className="menu-info">
            <p className="menu-info-line">
              <span className="menu-info-label">Locais visitados:</span>
              <span className="menu-info-value">{locais.length}</span>
            </p>
            <p className="menu-info-line">
              <span className="menu-info-label">Para visitar:</span>
              <span className="menu-info-value">{paraVisitar.length}</span>
            </p>
            <p className="menu-info-line">
              <span className="menu-info-label">Total:</span>
              <span className="menu-info-value">{totalItens}</span>
            </p>
          </div>
          {googleAutenticado && (
            <p className="menu-status menu-status--connected">
              &#9989; Google Drive conectado
            </p>
          )}
          {!googleAutenticado && (
            <p className="menu-status menu-status--disconnected">
              &#9888; Google Drive nao conectado
            </p>
          )}
        </div>
      )}

      {/* Tabs de navegacao */}
      <nav className="layout-tabs">
        <div className="tabs">
          {Object.values(ABAS).map((aba) => (
            <button
              key={aba}
              className={`tab ${abaAtiva === aba ? 'active' : ''}`}
              onClick={() => setAbaAtiva(aba)}
              aria-pressed={abaAtiva === aba}
            >
              {ABAS_LABEL[aba]}
            </button>
          ))}
        </div>
      </nav>

      {/* Conteudo principal */}
      <main className="layout-main">
        {children}
      </main>

      <style>{`
        .layout-container {
          display: flex;
          flex-direction: column;
          height: 100vh;
          overflow: hidden;
          background: var(--bg);
        }

        .layout-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          background: var(--bg-card);
          border-bottom: 1px solid var(--border);
          box-shadow: var(--shadow);
          flex-shrink: 0;
          z-index: 10;
        }

        .header-brand {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .header-icon {
          font-size: 24px;
          line-height: 1;
        }

        .header-title {
          font-size: 18px;
          font-weight: 600;
          color: var(--text);
          letter-spacing: -0.3px;
          margin: 0;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .sync-label {
          display: none;
        }

        .btn-syncing {
          opacity: 0.7;
          pointer-events: none;
        }

        .sync-spinner {
          display: inline-block;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .menu-toggle {
          display: none;
        }

        .menu-dropdown {
          background: var(--bg-card);
          border-bottom: 1px solid var(--border);
          padding: 12px 16px;
          flex-shrink: 0;
        }

        .menu-info {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          margin-bottom: 8px;
        }

        .menu-info-line {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          margin: 0;
          color: var(--text);
        }

        .menu-info-label {
          color: var(--text-secondary);
        }

        .menu-info-value {
          font-weight: 600;
          color: var(--accent);
        }

        .menu-status {
          font-size: 12px;
          margin: 4px 0 0;
          padding: 4px 8px;
          border-radius: var(--radius-sm);
          display: inline-block;
        }

        .menu-status--connected {
          background: rgba(123, 175, 140, 0.12);
          color: var(--success);
        }

        .menu-status--disconnected {
          background: rgba(232, 168, 124, 0.12);
          color: var(--alert);
        }

        .layout-tabs {
          padding: 8px 12px;
          background: var(--bg-card);
          border-bottom: 1px solid var(--border);
          flex-shrink: 0;
        }

        .layout-main {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          padding: 16px;
          -webkit-overflow-scrolling: touch;
        }

        /* Desktop: mostrar labels e ajustar espacamentos */
        @media (min-width: 640px) {
          .layout-header {
            padding: 14px 24px;
          }

          .header-title {
            font-size: 20px;
          }

          .sync-label {
            display: inline;
          }

          .layout-tabs {
            padding: 10px 24px;
          }

          .layout-main {
            padding: 20px 24px;
          }
        }

        /* Mobile: menu toggle visivel */
        @media (max-width: 639px) {
          .menu-toggle {
            display: inline-flex;
          }

          .header-actions .btn {
            padding: 8px 10px;
          }
        }
      `}</style>
    </div>
  );
}
