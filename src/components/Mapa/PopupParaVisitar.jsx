import React from 'react';
import { TIPO_LOCAL_LABEL } from '../../utils/tipos.js';

export default function PopupParaVisitar({ local, onMarcarVisitado }) {
  const tipoLabel = TIPO_LOCAL_LABEL[local.tipo] || 'Local';

  return (
    <div
      className="popup-conteudo fade-in"
      style={{
        width: '260px',
        maxWidth: '90vw',
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius)',
        overflow: 'hidden',
        fontFamily: 'var(--font)',
        padding: '16px'
      }}
    >
      <span
        style={{
          fontSize: '11px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          fontWeight: 600,
          color: 'var(--alert)',
          background: 'var(--bg)',
          padding: '3px 8px',
          borderRadius: 'var(--radius-sm)',
          display: 'inline-block',
          marginBottom: '8px'
        }}
      >
        🔜 {tipoLabel} · Quero Visitar
      </span>

      <h3
        style={{
          margin: '0 0 4px',
          fontSize: '17px',
          fontWeight: 600,
          color: 'var(--text)',
          lineHeight: 1.3
        }}
      >
        {local.nome}
      </h3>

      {local.endereco && (
        <p
          style={{
            margin: '0 0 12px',
            fontSize: '13px',
            color: 'var(--text-secondary)',
            lineHeight: 1.4
          }}
        >
          {local.endereco}
        </p>
      )}

      {local.descricao && (
        <p
          style={{
            margin: '0 0 12px',
            fontSize: '13px',
            color: 'var(--text-secondary)',
            lineHeight: 1.45,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {local.descricao}
        </p>
      )}

      <button
        className="btn btn-small btn-success"
        onClick={onMarcarVisitado}
        style={{ width: '100%' }}
      >
        ✓ Marcar como visitado
      </button>
    </div>
  );
}
