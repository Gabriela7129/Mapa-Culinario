import React from 'react';
import { useApp } from '../../contexts/AppContext.jsx';
import {
  TIPO_LOCAL,
  TIPO_LOCAL_LABEL,
  STATUS_LOCAL,
  STATUS_LOCAL_LABEL,
  FILTROS_PADRAO
} from '../../utils/tipos.js';

export default function FiltrosMapa({ filtros, onChange, onClose, totalResultados }) {
  function handleChange(campo, valor) {
    onChange(prev => ({ ...prev, [campo]: valor }));
  }

  function resetar() {
    onChange({ ...FILTROS_PADRAO });
  }

  const ativos =
    filtros.status !== 'todos' ||
    filtros.tipo !== 'todos' ||
    filtros.notaMin !== -1 ||
    filtros.notaMax !== 5;

  return (
    <div
      className="filtros-mapa fade-in"
      style={{
        position: 'absolute',
        top: '60px',
        right: '12px',
        zIndex: 1001,
        width: '280px',
        maxWidth: 'calc(100vw - 24px)',
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius)',
        boxShadow: 'var(--shadow-hover)',
        padding: '20px',
        fontFamily: 'var(--font)',
        maxHeight: 'calc(100vh - 100px)',
        overflowY: 'auto'
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px'
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: '16px',
            fontWeight: 600,
            color: 'var(--text)'
          }}
        >
          Filtros
        </h3>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '18px',
            cursor: 'pointer',
            color: 'var(--text-secondary)',
            padding: '4px',
            lineHeight: 1
          }}
        >
          &#10005;
        </button>
      </div>

      {/* Status */}
      <div style={{ marginBottom: '16px' }}>
        <label
          style={{
            display: 'block',
            fontSize: '12px',
            fontWeight: 600,
            color: 'var(--text-secondary)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: '8px'
          }}
        >
          Status
        </label>
        <div className="tabs" style={{ background: 'var(--bg)' }}>
          {[
            { value: 'todos', label: 'Todos' },
            { value: STATUS_LOCAL.VISITADO, label: STATUS_LOCAL_LABEL[STATUS_LOCAL.VISITADO] },
            { value: STATUS_LOCAL.PLANEJADO, label: STATUS_LOCAL_LABEL[STATUS_LOCAL.PLANEJADO] }
          ].map(op => (
            <button
              key={op.value}
              className={`tab ${filtros.status === op.value ? 'active' : ''}`}
              onClick={() => handleChange('status', op.value)}
              style={{ fontSize: '12px', padding: '8px 6px' }}
            >
              {op.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tipo */}
      <div style={{ marginBottom: '16px' }}>
        <label
          style={{
            display: 'block',
            fontSize: '12px',
            fontWeight: 600,
            color: 'var(--text-secondary)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: '8px'
          }}
        >
          Tipo
        </label>
        <div className="tabs" style={{ background: 'var(--bg)' }}>
          {[
            { value: 'todos', label: 'Todos' },
            { value: TIPO_LOCAL.RESTAURANTE, label: TIPO_LOCAL_LABEL[TIPO_LOCAL.RESTAURANTE] },
            { value: TIPO_LOCAL.CULTURAL, label: TIPO_LOCAL_LABEL[TIPO_LOCAL.CULTURAL] }
          ].map(op => (
            <button
              key={op.value}
              className={`tab ${filtros.tipo === op.value ? 'active' : ''}`}
              onClick={() => handleChange('tipo', op.value)}
              style={{ fontSize: '12px', padding: '8px 6px' }}
            >
              {op.label}
            </button>
          ))}
        </div>
      </div>

      {/* Nota minima */}
      <div style={{ marginBottom: '16px' }}>
        <label
          style={{
            display: 'block',
            fontSize: '12px',
            fontWeight: 600,
            color: 'var(--text-secondary)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: '8px'
          }}
        >
          Nota minima: <strong style={{ color: 'var(--text)' }}>{filtros.notaMin}</strong>
        </label>
        <input
          type="range"
          min={-1}
          max={5}
          step={1}
          value={filtros.notaMin}
          onChange={e => handleChange('notaMin', parseInt(e.target.value, 10))}
          className="input"
          style={{
            padding: 0,
            accentColor: 'var(--accent)',
            cursor: 'pointer'
          }}
        />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '11px',
            color: 'var(--text-secondary)',
            marginTop: '4px'
          }}
        >
          <span>-1</span>
          <span>5</span>
        </div>
      </div>

      {/* Nota maxima */}
      <div style={{ marginBottom: '16px' }}>
        <label
          style={{
            display: 'block',
            fontSize: '12px',
            fontWeight: 600,
            color: 'var(--text-secondary)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: '8px'
          }}
        >
          Nota maxima: <strong style={{ color: 'var(--text)' }}>{filtros.notaMax}</strong>
        </label>
        <input
          type="range"
          min={-1}
          max={5}
          step={1}
          value={filtros.notaMax}
          onChange={e => handleChange('notaMax', parseInt(e.target.value, 10))}
          className="input"
          style={{
            padding: 0,
            accentColor: 'var(--accent)',
            cursor: 'pointer'
          }}
        />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '11px',
            color: 'var(--text-secondary)',
            marginTop: '4px'
          }}
        >
          <span>-1</span>
          <span>5</span>
        </div>
      </div>

      {/* Resultados e acoes */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '10px',
          paddingTop: '12px',
          borderTop: '1px solid var(--border)'
        }}
      >
        <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500 }}>
          {totalResultados} resultado{totalResultados !== 1 ? 's' : ''}
        </span>
        {ativos && (
          <button
            className="btn btn-small btn-secondary"
            onClick={resetar}
            style={{ fontSize: '12px', padding: '6px 12px' }}
          >
            Limpar
          </button>
        )}
      </div>

      <style>{`
        @media (max-width: 640px) {
          .filtros-mapa {
            top: 8px !important;
            left: 8px !important;
            right: 8px !important;
            width: auto !important;
            max-width: none !important;
            max-height: calc(100vh - 80px) !important;
          }
        }
      `}</style>
    </div>
  );
}
