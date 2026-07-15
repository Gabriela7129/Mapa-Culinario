import React, { useState, useMemo } from 'react';
import { useApp } from '../../contexts/AppContext.jsx';
import CardVisitar from './CardVisitar.jsx';

export default function ListaVisitar() {
  const { paraVisitar, abrirFormulario } = useApp();
  const [busca, setBusca] = useState('');

  const itensFiltrados = useMemo(() => {
    if (!busca.trim()) return paraVisitar;
    const termo = busca.toLowerCase().trim();
    return paraVisitar.filter(item =>
      item.nome?.toLowerCase().includes(termo) ||
      item.endereco?.toLowerCase().includes(termo) ||
      item.descricao?.toLowerCase().includes(termo)
    );
  }, [paraVisitar, busca]);

  const handleBuscaChange = (e) => {
    setBusca(e.target.value);
  };

  const handleLimparBusca = () => {
    setBusca('');
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.titulo}>Locais para Visitar</h2>
        <span style={styles.contador}>
          {paraVisitar.length} {paraVisitar.length === 1 ? 'local' : 'locais'}
        </span>
      </div>

      <div style={styles.buscaContainer}>
        <input
          type="text"
          className="input"
          placeholder="Buscar por nome, endereço..."
          value={busca}
          onChange={handleBuscaChange}
          style={styles.inputBusca}
        />
        {busca && (
          <button
            className="btn btn-secondary btn-small"
            style={styles.btnLimpar}
            onClick={handleLimparBusca}
            title="Limpar busca"
          >
            ✕
          </button>
        )}
      </div>

      {itensFiltrados.length === 0 ? (
        <div style={styles.vazio}>
          <div style={styles.vazioIcon}>📋</div>
          <p style={styles.vazioTitulo}>
            {busca.trim() ? 'Nenhum local encontrado' : 'Nenhum local para visitar'}
          </p>
          <p style={styles.vazioSub}>
            {busca.trim()
              ? 'Tente outro termo de busca'
              : 'Adicione locais pelo mapa ou formulário'
            }
          </p>
          {!busca.trim() && (
            <button
              className="btn"
              style={styles.btnAdicionar}
              onClick={() => abrirFormulario()}
            >
              + Adicionar local
            </button>
          )}
        </div>
      ) : (
        <div style={styles.lista}>
          {busca.trim() && (
            <p style={styles.resultadoInfo}>
              {itensFiltrados.length} {itensFiltrados.length === 1 ? 'resultado' : 'resultados'} para "{busca}"
            </p>
          )}
          {itensFiltrados.map(item => (
            <CardVisitar key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '16px',
    maxWidth: '720px',
    margin: '0 auto',
    width: '100%'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
    flexWrap: 'wrap',
    gap: '8px'
  },
  titulo: {
    fontSize: '22px',
    fontWeight: 700,
    color: 'var(--text)',
    margin: 0
  },
  contador: {
    fontSize: '13px',
    fontWeight: 500,
    color: 'var(--text-secondary)',
    padding: '4px 10px',
    borderRadius: 'var(--radius-sm)',
    background: 'rgba(0,0,0,0.04)'
  },
  buscaContainer: {
    display: 'flex',
    gap: '8px',
    marginBottom: '16px',
    alignItems: 'center'
  },
  inputBusca: {
    flex: 1
  },
  btnLimpar: {
    padding: '12px 14px',
    minWidth: '44px'
  },
  lista: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  resultadoInfo: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
    margin: '0 0 8px 4px'
  },
  vazio: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '48px 24px',
    textAlign: 'center'
  },
  vazioIcon: {
    fontSize: '48px',
    marginBottom: '16px',
    opacity: 0.5
  },
  vazioTitulo: {
    fontSize: '17px',
    fontWeight: 600,
    color: 'var(--text)',
    margin: '0 0 6px 0'
  },
  vazioSub: {
    fontSize: '14px',
    color: 'var(--text-secondary)',
    margin: '0 0 20px 0',
    lineHeight: 1.4
  },
  btnAdicionar: {
    minWidth: '180px'
  }
};
