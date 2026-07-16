import React, { useState } from 'react';
import { notaParaEmoji } from '../../utils/notaEmoji.js';
import { TIPO_LOCAL_LABEL, STATUS_LOCAL_LABEL, STATUS_LOCAL_COR, STATUS_LOCAL } from '../../utils/tipos.js';

export default function MarcadorPopup({ local, onVerDetalhes }) {
  const [fotoAtual, setFotoAtual] = useState(0);

  const getSrc = (foto) => (typeof foto === 'string' ? foto : foto?.base64 || foto?.url || '');

  const fotosLocal = (local.fotos || []).filter(Boolean).map(getSrc).filter(Boolean);
  const fotosComidas = (local.comidas || [])
    .map(c => c.fotos || (c.foto ? [c.foto] : []))
    .flat()
    .filter(Boolean)
    .map(getSrc)
    .filter(Boolean);
  const fotos = [...fotosLocal, ...fotosComidas];
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
    <div className="popup-conteudo fade-in">
      {fotos.length > 0 && (
        <div className="popup-galeria">
          <img
            src={fotos[fotoAtual]}
            alt={`Foto ${fotoAtual + 1} de ${local.nome}`}
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          {fotos.length > 1 && (
            <>
              <button className="popup-galeria-nav popup-galeria-prev" onClick={fotoAnterior}>
                &#8249;
              </button>
              <button className="popup-galeria-nav popup-galeria-next" onClick={fotoProxima}>
                &#8250;
              </button>
              <div className="popup-galeria-dots">
                {fotos.map((_, idx) => (
                  <span
                    key={idx}
                    className={idx === fotoAtual ? 'active' : ''}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      <div className="popup-body">
        <div className="popup-badges">
          <span className="popup-badge popup-badge-tipo">{tipoLabel}</span>
          <span
            className="popup-badge popup-badge-status"
            style={{
              backgroundColor: STATUS_LOCAL_COR[local.status] || STATUS_LOCAL_COR[STATUS_LOCAL.VISITADO],
              color: '#fff'
            }}
          >
            {statusLabel}
          </span>
        </div>

        <h3 className="popup-nome">{local.nome}</h3>

        {local.endereco && <p className="popup-endereco">{local.endereco}</p>}

        <div className="popup-meta">
          <div className="nota-display" style={{ fontSize: '16px' }}>{notaStr}</div>
          {visitas > 1 && (
            <span className="popup-visitas">{visitas} {visitas === 1 ? 'visita' : 'visitas'}</span>
          )}
        </div>

        {local.descricao && <p className="popup-descricao">{local.descricao}</p>}

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
