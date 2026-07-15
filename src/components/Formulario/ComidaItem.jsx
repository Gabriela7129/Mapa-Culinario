import React from 'react';
import { notaParaEmoji, precoParaEmoji, labelNota, labelPreco } from '../../utils/notaEmoji.js';
import FotoUploader from './FotoUploader.jsx';

/**
 * ComidaItem - Card de um item de comida dentro do form de restaurante.
 * Recebe: comida (obj), index (num), onChange, onRemove, erroNome (string)
 */
export default function ComidaItem({ comida, index, onChange, onRemove, erroNome }) {
  const handleChange = (field, value) => {
    onChange(index, { ...comida, [field]: value });
  };

  const handleFotoChange = (fotos) => {
    onChange(index, { ...comida, foto: fotos[0] || null });
  };

  return (
    <div className="card" style={cardStyle}>
      <div style={headerStyle}>
        <span style={tituloStyle}>Item {index + 1}</span>
        <button type="button" onClick={() => onRemove(index)} className="btn btn-danger btn-small">
          Remover
        </button>
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>Nome do prato</label>
        <input
          type="text"
          className="input"
          value={comida.nome || ''}
          onChange={(e) => handleChange('nome', e.target.value)}
          placeholder="Ex: Filé ao molho madeira"
        />
        {erroNome && <span style={erroStyle}>{erroNome}</span>}
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>Descrição</label>
        <textarea
          className="input"
          value={comida.descricao || ''}
          onChange={(e) => handleChange('descricao', e.target.value)}
          placeholder="Ingredientes, observações..."
          rows={2}
          style={{ resize: 'vertical', minHeight: '60px' }}
        />
      </div>

      <div style={rowStyle}>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>
            Nota
            <span style={previewStyle}> {notaParaEmoji(comida.nota || 0)}</span>
            <span style={labelPreviewStyle}> {labelNota(comida.nota || 0)}</span>
          </label>
          <input
            type="range"
            min={-1}
            max={5}
            step={0.5}
            value={comida.nota ?? 0}
            onChange={(e) => handleChange('nota', parseFloat(e.target.value))}
            style={sliderStyle}
          />
          <div style={sliderLabelsStyle}>
            <span style={sliderLabelStyle}>-1</span>
            <span style={sliderLabelStyle}>5</span>
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <label style={labelStyle}>
            Preço
            <span style={previewStyle}> {precoParaEmoji(comida.preco || 0)}</span>
            <span style={labelPreviewStyle}> {labelPreco(comida.preco || 0)}</span>
          </label>
          <input
            type="range"
            min={-1}
            max={5}
            step={0.5}
            value={comida.preco ?? 0}
            onChange={(e) => handleChange('preco', parseFloat(e.target.value))}
            style={sliderStyle}
          />
          <div style={sliderLabelsStyle}>
            <span style={sliderLabelStyle}>-1</span>
            <span style={sliderLabelStyle}>5</span>
          </div>
        </div>
      </div>

      <div style={fieldStyle}>
        <FotoUploader
          fotos={comida.foto ? [comida.foto] : []}
          onChange={handleFotoChange}
          maxFotos={1}
          label="Foto do prato"
        />
      </div>
    </div>
  );
}

/* Styles */
const cardStyle = {
  marginBottom: '16px',
  borderLeft: '3px solid var(--accent)'
};

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '14px'
};

const tituloStyle = {
  fontSize: '14px',
  fontWeight: 600,
  color: 'var(--text)'
};

const fieldStyle = {
  marginBottom: '14px'
};

const labelStyle = {
  display: 'block',
  fontSize: '13px',
  fontWeight: 500,
  color: 'var(--text-secondary)',
  marginBottom: '6px',
  textTransform: 'uppercase',
  letterSpacing: '0.5px'
};

const rowStyle = {
  display: 'flex',
  gap: '16px',
  marginBottom: '14px',
  flexWrap: 'wrap'
};

const previewStyle = {
  fontSize: '16px',
  letterSpacing: '2px',
  marginLeft: '4px'
};

const labelPreviewStyle = {
  fontSize: '11px',
  color: 'var(--text-secondary)',
  fontWeight: 400,
  textTransform: 'none',
  letterSpacing: 'normal',
  marginLeft: '4px'
};

const sliderStyle = {
  width: '100%',
  accentColor: 'var(--accent)',
  cursor: 'pointer'
};

const sliderLabelsStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  marginTop: '2px'
};

const sliderLabelStyle = {
  fontSize: '10px',
  color: 'var(--text-secondary)'
};

const erroStyle = {
  display: 'block',
  fontSize: '12px',
  color: 'var(--danger)',
  marginTop: '4px'
};
