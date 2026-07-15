import React, { useState } from 'react';
import { notaParaEmoji } from '../../utils/notaEmoji.js';
import { TIPO_LOCAL_LABEL, STATUS_LOCAL_LABEL } from '../../utils/tipos.js';

export default function MarcadorPopup({ local, onVerDetalhes }) {
  const [fotoAtual, setFotoAtual] = useState(0);

  const fotos = local.fotos || [];
  const notaStr = notaParaEmoji(local.nota || 0, local.unanime || false);
  const tipoLabel = TIPO_LOCAL_LABEL[local.tipo] || 'Local';
  const statusLabel = STATUS_LOCAL_LABEL[local.status] || 'Local';
  const visitas = local.visitas || 1;

  function fotoAnterior(e) {
    e.stopPropagation();
    setFotoAtual(prev => (prev > 0 ? prev - 1 : fotos.length - 1));
  }

  function fotoProxima(e) {
    e.stopPropagation();
    setFotoAtual(prev => (prev < fotos.length - 1 ? prev + 1 : 0));
  }

  return (
    <div
      className="popup-conteudo fade-in"
      style={{
        width: '280px',
        maxWidth: '90vw',
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius)',
        overflow: 'hidden',
        fontFamily: 'var(--font)'
      }}
    >
      {/* Galeria de fotos */}
      {fotos.length > 0 && (
        <div
          className="popup-galeria"
          style={{
            position: 'relative',
            width: '100%',
            height: '160px',
            background: 'var(--bg)',
            overflow: 'hidden'
          }}
        >
          <img
            src={fotos[fotoAtual]}
            alt={`Foto ${fotoAtual + 1} de ${local.nome}`}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block'
            }}
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          {fotos.length > 1 && (
            <>
              <button
                onClick={fotoAnterior}
                style={{
                  position: 'absolute',
                  left: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'rgba(255,255,255,0.85)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '28px',
                  height: '28px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.15)'
                }}
              >
                &#8249;
              </button>
              <button
                onClick={fotoProxima}
                style={{
                  position: 'absolute',
                  right: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'rgba(255,255,255,0.85)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '28px',
                  height: '28px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.15)'
                }}
              >
                &#8250;
              </button>
              <div
                style={{
                  position: 'absolute',
                  bottom: '8px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  display: 'flex',
                  gap: '4px'
                }}
              >
                {fotos.map((_, idx) => (
                  <span
                    key={idx}
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: idx === fotoAtual ? 'white' : 'rgba(255,255,255,0.5)',
                      transition: 'background 0.2s'
                    }}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Info */}
      <div style={{ padding: '16px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '4px'
          }}
        >
          <span
            style={{
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              fontWeight: 600,
              color: 'var(--accent)',
              background: 'var(--bg)',
              padding: '3px 8px',
              borderRadius: 'var(--radius-sm)'
            }}
          >
            {tipoLabel}
          </span>
          <span
            style={{
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              fontWeight: 600,
              color: 'var(--text-secondary)',
              background: 'var(--bg)',
              padding: '3px 8px',
              borderRadius: 'var(--radius-sm)'
            }}
          >
            {statusLabel}
          </span>
        </div>

        <h3
          style={{
            margin: '8px 0 4px',
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
              margin: '0 0 8px',
              fontSize: '13px',
              color: 'var(--text-secondary)',
              lineHeight: 1.4
            }}
          >
            {local.endereco}
          </p>
        )}

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '12px',
            flexWrap: 'wrap'
          }}
        >
          <div className="nota-display" style={{ fontSize: '16px' }}>
            {notaStr}
          </div>
          <span
            style={{
              fontSize: '12px',
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <span style={{ fontSize: '14px' }}>👁</span>
            {visitas} {visitas === 1 ? 'visita' : 'visitas'}
          </span>
        </div>

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
          className="btn btn-small"
          onClick={onVerDetalhes}
          style={{ width: '100%', marginTop: '4px' }}
        >
          Ver detalhes
        </button>
      </div>
    </div>
  );
}
