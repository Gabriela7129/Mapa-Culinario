import React, { useState, useRef } from 'react';
import { notaParaEmoji, precoParaEmoji } from '../../utils/notaEmoji.js';
import { TIPO_LOCAL, TIPO_LOCAL_LABEL, STATUS_LOCAL_LABEL } from '../../utils/tipos.js';

export default function VisualizacaoLocal({ local, onEditar, onFechar }) {
  const [midiaAberta, setMidiaAberta] = useState(null);
  const videoRef = useRef(null);

  const isRestaurante = local.tipo === TIPO_LOCAL.RESTAURANTE;
  const tipoLabel = TIPO_LOCAL_LABEL[local.tipo] || 'Local';
  const statusLabel = STATUS_LOCAL_LABEL[local.status] || 'visitado';
  const vezes = local.visitas || 1;

  const observacoes = (local.observacoes || '')
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean);

  const midiasLocal = (local.fotos || []).map((m, i) => ({ ...m, id: `local-${i}` }));
  const midiasComidas = isRestaurante
    ? (local.comidas || []).flatMap((c, ci) =>
        (c.fotos || []).map((m, fi) => ({
          ...m,
          id: `comida-${ci}-${fi}`,
          comidaNome: c.nome
        }))
      )
    : [];
  const todasMidias = [...midiasLocal, ...midiasComidas];

  const abrirMidia = (midia) => {
    setMidiaAberta(midia);
  };

  const fecharMidia = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setMidiaAberta(null);
  };

  const renderMidiaThumb = (midia) => {
    const isVideo = (midia?.tipo === 'video') || (midia?.url && midia.url.toLowerCase().endsWith('.mp4'));
    return (
      <button
        key={midia.id}
        className="visualizacao-midia-thumb"
        onClick={() => abrirMidia(midia)}
      >
        {isVideo ? (
          <video src={midia.url} muted playsInline preload="metadata" />
        ) : (
          <img src={midia.url} alt="" loading="lazy" />
        )}
      </button>
    );
  };

  return (
    <div className="visualizacao-local fade-in">
      <div className="visualizacao-header">
        <button className="btn btn-secondary" onClick={onFechar}>← Voltar</button>
        <button className="btn" onClick={onEditar}>Editar</button>
      </div>

      <div className="visualizacao-conteudo">
        {observacoes.length > 0 && (
          <div className="visualizacao-observacoes">
            {observacoes.map((obs, idx) => (
              <p key={idx} className="visualizacao-observacao">• {obs}</p>
            ))}
          </div>
        )}

        <div className="visualizacao-local-info">
          <h2 className="visualizacao-nome">{local.nome}</h2>
          <p className="visualizacao-meta">
            {tipoLabel.toLowerCase()} {statusLabel.toLowerCase()} {vezes} {vezes === 1 ? 'vez' : 'vezes'}
          </p>
          {local.endereco && (
            <p className="visualizacao-endereco">{local.endereco}</p>
          )}
          <p className="visualizacao-nota">{notaParaEmoji(local.nota, local.notaUnanime)}</p>
          {local.descricao && (
            <p className="visualizacao-descricao">{local.descricao}</p>
          )}
        </div>

        {midiasLocal.length > 0 && (
          <div className="visualizacao-midias">
            {midiasLocal.map(renderMidiaThumb)}
          </div>
        )}

        {isRestaurante && local.comidas?.length > 0 && (
          <div className="visualizacao-comidas">
            {local.comidas.map((comida, idx) => (
              <div key={idx} className="visualizacao-comida">
                <h3 className="visualizacao-comida-nome">{comida.nome}</h3>
                <p className="visualizacao-comida-nota">
                  {notaParaEmoji(comida.nota, comida.notaUnanime)}{' '}
                  {precoParaEmoji(comida.preco)}
                </p>
                {comida.descricao && (
                  <p className="visualizacao-comida-descricao">{comida.descricao}</p>
                )}
                {(comida.fotos || []).length > 0 && (
                  <div className="visualizacao-midias">
                    {comida.fotos.map((m, i) =>
                      renderMidiaThumb({ ...m, id: `comida-${idx}-${i}` })
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {midiaAberta && (
        <div className="visualizacao-midia-overlay" onClick={fecharMidia}>
          <div
            className="visualizacao-midia-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="visualizacao-midia-fechar" onClick={fecharMidia}>✕</button>
            {(midiaAberta?.tipo === 'video') || (midiaAberta?.url && midiaAberta.url.toLowerCase().endsWith('.mp4')) ? (
              <video
                ref={videoRef}
                src={midiaAberta.url}
                controls
                autoPlay
                playsInline
              />
            ) : (
              <img src={midiaAberta.url} alt="" />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
