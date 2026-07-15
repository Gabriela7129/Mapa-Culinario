import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext.jsx';
import { TIPO_LOCAL_LABEL, TIPO_LOCAL_ICON } from '../../utils/tipos.js';

export default function CardVisitar({ item }) {
  const { excluirParaVisitar, abrirFormularioDeVisitar } = useApp();
  const [confirmandoExclusao, setConfirmandoExclusao] = useState(false);

  const tipoLabel = TIPO_LOCAL_LABEL[item.tipo] || 'Local';
  const tipoIcon = TIPO_LOCAL_ICON[item.tipo] || '📍';

  const handleExcluir = () => {
    if (confirmandoExclusao) {
      excluirParaVisitar(item.id);
    } else {
      setConfirmandoExclusao(true);
      setTimeout(() => setConfirmandoExclusao(false), 3000);
    }
  };

  const handleMarcarVisitado = () => {
    abrirFormularioDeVisitar(item);
  };

  const links = item.links || {};
  const temLinks = links.site || links.tiktok || links.instagram;

  return (
    <div className="card" style={styles.card}>
      <div style={styles.header}>
        <span style={styles.tipoBadge} title={tipoLabel}>
          <span style={styles.tipoIcon}>{tipoIcon}</span>
          <span style={styles.tipoText}>{tipoLabel}</span>
        </span>
      </div>

      <h3 style={styles.nome}>{item.nome}</h3>

      {item.endereco && (
        <p style={styles.endereco}>{item.endereco}</p>
      )}

      {item.descricao && (
        <p style={styles.descricao}>{item.descricao}</p>
      )}

      {temLinks && (
        <div style={styles.links}>
          {links.site && (
            <a
              href={links.site}
              target="_blank"
              rel="noopener noreferrer"
              style={styles.link}
              title="Site"
            >
              🌐 Site
            </a>
          )}
          {links.instagram && (
            <a
              href={links.instagram}
              target="_blank"
              rel="noopener noreferrer"
              style={styles.link}
              title="Instagram"
            >
              📷 Instagram
            </a>
          )}
          {links.tiktok && (
            <a
              href={links.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              style={styles.link}
              title="TikTok"
            >
              🎵 TikTok
            </a>
          )}
        </div>
      )}

      <div style={styles.acoes}>
        <button
          className="btn btn-success btn-small"
          style={styles.btnVisitar}
          onClick={handleMarcarVisitado}
          title="Marcar como visitado e abrir formulário"
        >
          ✓ Visitei
        </button>
        <button
          className={`btn btn-small ${confirmandoExclusao ? 'btn-danger' : 'btn-secondary'}`}
          style={styles.btnExcluir}
          onClick={handleExcluir}
        >
          {confirmandoExclusao ? 'Confirmar?' : '🗑 Excluir'}
        </button>
      </div>
    </div>
  );
}

const styles = {
  card: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '12px'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  tipoBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 10px',
    borderRadius: 'var(--radius-sm)',
    background: 'rgba(0,0,0,0.04)',
    fontSize: '12px',
    fontWeight: 500,
    color: 'var(--text-secondary)'
  },
  tipoIcon: {
    fontSize: '14px'
  },
  tipoText: {
    fontSize: '12px'
  },
  nome: {
    fontSize: '17px',
    fontWeight: 600,
    color: 'var(--text)',
    lineHeight: 1.3,
    margin: 0
  },
  endereco: {
    fontSize: '13px',
    color: 'var(--text-secondary)',
    lineHeight: 1.4,
    margin: 0
  },
  descricao: {
    fontSize: '13px',
    color: 'var(--text-secondary)',
    lineHeight: 1.4,
    margin: 0,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden'
  },
  links: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px'
  },
  link: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '5px 10px',
    borderRadius: 'var(--radius-sm)',
    background: 'var(--bg)',
    color: 'var(--accent)',
    fontSize: '12px',
    fontWeight: 500,
    textDecoration: 'none',
    transition: 'all 0.2s ease'
  },
  acoes: {
    display: 'flex',
    gap: '8px',
    marginTop: '4px'
  },
  btnVisitar: {
    flex: 1
  },
  btnExcluir: {
    flex: 1
  }
};
