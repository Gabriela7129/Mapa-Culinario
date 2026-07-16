import React from 'react';
import {
  TIPO_LOCAL,
  TIPO_LOCAL_LABEL,
  STATUS_LOCAL,
  STATUS_LOCAL_LABEL,
  STATUS_LOCAL_COR,
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

  const statusOptions = [
    { value: 'todos', label: 'Todos' },
    { value: STATUS_LOCAL.VISITADO, label: STATUS_LOCAL_LABEL[STATUS_LOCAL.VISITADO], cor: STATUS_LOCAL_COR[STATUS_LOCAL.VISITADO] },
    { value: STATUS_LOCAL.PLANEJADO, label: STATUS_LOCAL_LABEL[STATUS_LOCAL.PLANEJADO], cor: STATUS_LOCAL_COR[STATUS_LOCAL.PLANEJADO] }
  ];

  const tipoOptions = [
    { value: 'todos', label: 'Todos' },
    { value: TIPO_LOCAL.RESTAURANTE, label: TIPO_LOCAL_LABEL[TIPO_LOCAL.RESTAURANTE] },
    { value: TIPO_LOCAL.CULTURAL, label: TIPO_LOCAL_LABEL[TIPO_LOCAL.CULTURAL] }
  ];

  return (
    <div className="filtros-mapa fade-in">
      <div className="filtros-mapa-header">
        <h3 className="filtros-mapa-titulo">Filtros</h3>
        <button className="filtros-mapa-fechar" onClick={onClose} aria-label="Fechar filtros">
          &#10005;
        </button>
      </div>

      <div className="filtros-mapa-secao">
        <label className="filtros-mapa-label">Status</label>
        <div className="filtros-mapa-pills">
          {statusOptions.map(op => {
            const active = filtros.status === op.value;
            return (
              <button
                key={op.value}
                className={`filtros-mapa-pill ${active ? 'active' : ''}`}
                onClick={() => handleChange('status', op.value)}
              >
                {op.cor && (
                  <span
                    className="filtros-mapa-dot"
                    style={{ backgroundColor: op.cor }}
                  />
                )}
                <span>{op.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="filtros-mapa-secao">
        <label className="filtros-mapa-label">Tipo</label>
        <div className="filtros-mapa-pills">
          {tipoOptions.map(op => {
            const active = filtros.tipo === op.value;
            return (
              <button
                key={op.value}
                className={`filtros-mapa-pill ${active ? 'active' : ''}`}
                onClick={() => handleChange('tipo', op.value)}
              >
                {op.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="filtros-mapa-secao">
        <label className="filtros-mapa-label">
          Nota mínima: <strong>{filtros.notaMin}</strong>
        </label>
        <input
          type="range"
          min={-1}
          max={5}
          step={1}
          value={filtros.notaMin}
          onChange={e => handleChange('notaMin', parseInt(e.target.value, 10))}
          className="filtros-mapa-range"
        />
        <div className="filtros-mapa-range-labels">
          <span>-1</span>
          <span>5</span>
        </div>
      </div>

      <div className="filtros-mapa-secao">
        <label className="filtros-mapa-label">
          Nota máxima: <strong>{filtros.notaMax}</strong>
        </label>
        <input
          type="range"
          min={-1}
          max={5}
          step={1}
          value={filtros.notaMax}
          onChange={e => handleChange('notaMax', parseInt(e.target.value, 10))}
          className="filtros-mapa-range"
        />
        <div className="filtros-mapa-range-labels">
          <span>-1</span>
          <span>5</span>
        </div>
      </div>

      <div className="filtros-mapa-footer">
        <span className="filtros-mapa-resultados">
          {totalResultados} resultado{totalResultados !== 1 ? 's' : ''}
        </span>
        {ativos && (
          <button className="btn btn-small btn-secondary" onClick={resetar}>
            Limpar
          </button>
        )}
      </div>
    </div>
  );
}
