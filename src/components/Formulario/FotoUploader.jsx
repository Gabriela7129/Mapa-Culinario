import React, { useCallback } from 'react';
import { useApp } from '../../contexts/AppContext.jsx';
import { googleDriveService } from '../../services/googleDrive.js';

/**
 * FotoUploader - Componente de upload de fotos com preview.
 * Recebe: fotos (array de strings base64 ou {base64, fileId}), onChange
 */
export default function FotoUploader({ fotos = [], onChange, maxFotos = 20, label = 'Fotos' }) {
  const { googleAutenticado } = useApp();

  const handleFileChange = useCallback(async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const disponivel = maxFotos - fotos.length;
    const arquivosParaProcessar = files.slice(0, disponivel);

    const novasFotos = await Promise.all(
      arquivosParaProcessar.map(async (file) => {
        const base64 = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(file);
        });

        let fileId = null;
        if (googleAutenticado) {
          try {
            fileId = await googleDriveService.uploadFoto(file, 'fotos-locais');
          } catch (err) {
            console.error('Erro ao enviar foto para Drive:', err);
          }
        }

        return { base64, fileId, nome: file.name };
      })
    );

    onChange([...fotos, ...novasFotos]);
    e.target.value = '';
  }, [fotos, onChange, maxFotos, googleAutenticado]);

  const handleRemover = useCallback((idx) => {
    const atualizado = fotos.filter((_, i) => i !== idx);
    onChange(atualizado);
  }, [fotos, onChange]);

  return (
    <div className="foto-uploader">
      <label style={labelStyle}>{label}</label>

      <div style={gridStyle}>
        {fotos.map((foto, idx) => {
          const src = typeof foto === 'string' ? foto : foto.base64;
          return (
            <div key={idx} style={thumbContainerStyle}>
              <img src={src} alt={`Foto ${idx + 1}`} style={thumbStyle} />
              <button
                type="button"
                onClick={() => handleRemover(idx)}
                style={removerBtnStyle}
                title="Remover foto"
              >
                x
              </button>
            </div>
          );
        })}

        {fotos.length < maxFotos && (
          <label style={addBtnStyle}>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <span style={addIconStyle}>+</span>
            <span style={addTextStyle}>Adicionar</span>
          </label>
        )}
      </div>

      <p style={contadorStyle}>
        {fotos.length} / {maxFotos} fotos
        {googleAutenticado && ' (sync com Drive)'}
      </p>
    </div>
  );
}

/* Styles */
const labelStyle = {
  display: 'block',
  fontSize: '13px',
  fontWeight: 500,
  color: 'var(--text-secondary)',
  marginBottom: '8px',
  textTransform: 'uppercase',
  letterSpacing: '0.5px'
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))',
  gap: '10px'
};

const thumbContainerStyle = {
  position: 'relative',
  aspectRatio: '1',
  borderRadius: 'var(--radius-sm)',
  overflow: 'hidden',
  boxShadow: 'var(--shadow)'
};

const thumbStyle = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  display: 'block'
};

const removerBtnStyle = {
  position: 'absolute',
  top: '4px',
  right: '4px',
  width: '22px',
  height: '22px',
  borderRadius: '50%',
  border: 'none',
  background: 'var(--danger)',
  color: 'white',
  fontSize: '11px',
  fontWeight: 700,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  lineHeight: 1
};

const addBtnStyle = {
  aspectRatio: '1',
  borderRadius: 'var(--radius-sm)',
  border: '2px dashed var(--border)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  background: 'var(--bg)',
  color: 'var(--text-secondary)'
};

const addIconStyle = {
  fontSize: '24px',
  fontWeight: 300,
  lineHeight: 1,
  marginBottom: '4px'
};

const addTextStyle = {
  fontSize: '10px',
  fontWeight: 500
};

const contadorStyle = {
  fontSize: '11px',
  color: 'var(--text-secondary)',
  marginTop: '8px'
};
