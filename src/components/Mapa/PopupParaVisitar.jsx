import React from 'react';
import { TIPO_LOCAL_LABEL, STATUS_LOCAL_COR, STATUS_LOCAL } from '../../utils/tipos.js';

export default function PopupParaVisitar({ local, onMarcarVisitado }) {
  const tipoLabel = TIPO_LOCAL_LABEL[local.tipo] || 'Local';

  return (
    <div className="popup-conteudo fade-in">
      <span
        className="popup-badge"
        style={{
          color: STATUS_LOCAL_COR[STATUS_LOCAL.PLANEJADO],
          background: 'rgba(107, 114, 128, 0.08)'
        }}
      >
        {tipoLabel} · Quero Visitar
      </span>

      <h3 className="popup-nome">{local.nome}</h3>

      {local.endereco && <p className="popup-endereco">{local.endereco}</p>}

      {local.descricao && <p className="popup-descricao">{local.descricao}</p>}

      <button
        className="btn btn-small"
        onClick={onMarcarVisitado}
        style={{ width: '100%', marginTop: '4px' }}
      >
        Marcar como visitado
      </button>
    </div>
  );
}
