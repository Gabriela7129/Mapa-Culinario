import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext.jsx';
import {
  TIPO_LOCAL_LABEL,
  TIPO_LOCAL_ICON,
  STATUS_LOCAL,
  STATUS_LOCAL_LABEL,
  STATUS_LOCAL_COR
} from '../../utils/tipos.js';
import { notaParaEmoji } from '../../utils/notaEmoji.js';

export default function CardLocal({ local, modo, onVer }) {
  const { excluirParaVisitar, abrirFormularioDeVisitar } = useApp();
  const [confirmandoExclusao, setConfirmandoExclusao] = useState(false);

  const isVisitado = modo === 'visitado';
  const tipoLabel = TIPO_LOCAL_LABEL[local.tipo] || 'Local';
  const tipoIcon = TIPO_LOCAL_ICON[local.tipo] || '📍';
  const statusLabel = STATUS_LOCAL_LABEL[local.status] || 'Local';
  const statusCor = STATUS_LOCAL_COR[local.status] || STATUS_LOCAL_COR[STATUS_LOCAL.VISITADO];

  const handleExcluir = () => {
    if (confirmandoExclusao) {
      excluirParaVisitar(local.id);
    } else {
      setConfirmandoExclusao(true);
      setTimeout(() => setConfirmandoExclusao(false), 3000);
    }
  };

  const handleMarcarVisitado = () => {
    abrirFormularioDeVisitar(local);
  };

  const handleVer = () => {
    if (onVer) onVer(local);
  };

  const links = local.links || {};
  const temLinks = links.site || links.tiktok || links.instagram;

  return (
    <div className="card card-local">
      <div className="card-local-header">
        <div className="card-local-badges">
          <span className="card-local-badge" title={tipoLabel}>
            <span>{tipoIcon}</span>
            <span>{tipoLabel}</span>
          </span>
          <span
            className="card-local-badge card-local-badge--status"
            style={{ backgroundColor: statusCor }}
          >
            {statusLabel}
          </span>
        </div>
        {isVisitado && local.nota != null && (
          <span className="card-local-nota nota-display">
            {notaParaEmoji(local.nota, local.unanime || false)}
          </span>
        )}
      </div>

      <h3 className="card-local-nome">{local.nome}</h3>

      {local.endereco && (
        <p className="card-local-endereco">{local.endereco}</p>
      )}

      {local.descricao && (
        <p className="card-local-descricao">{local.descricao}</p>
      )}

      {isVisitado && local.visitas != null && local.visitas > 1 && (
        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>
          {local.visitas} visitas
        </p>
      )}

      {temLinks && (
        <div className="card-local-links">
          {links.site && (
            <a
              href={links.site}
              target="_blank"
              rel="noopener noreferrer"
              className="card-local-link"
              title="Site"
            >
              Site
            </a>
          )}
          {links.instagram && (
            <a
              href={links.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="card-local-link"
              title="Instagram"
            >
              Instagram
            </a>
          )}
          {links.tiktok && (
            <a
              href={links.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              className="card-local-link"
              title="TikTok"
            >
              TikTok
            </a>
          )}
        </div>
      )}

      <div className="card-local-acoes">
        {isVisitado ? (
          <button
            className="btn btn-small card-local-btn"
            onClick={handleVer}
            title="Ver local"
          >
            Ver
          </button>
        ) : (
          <>
            <button
              className="btn btn-success btn-small card-local-btn"
              onClick={handleMarcarVisitado}
              title="Marcar como visitado e abrir formulário"
            >
              Visitei
            </button>
            <button
              className={`btn btn-small card-local-btn ${confirmandoExclusao ? 'btn-danger' : 'btn-secondary'}`}
              onClick={handleExcluir}
            >
              {confirmandoExclusao ? 'Confirmar?' : 'Excluir'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
