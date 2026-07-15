import React, { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useApp } from '../../contexts/AppContext.jsx';
import { TIPO_LOCAL, STATUS_LOCAL, STATUS_LOCAL_COR, TIPO_LOCAL_ICON } from '../../utils/tipos.js';
import MarcadorPopup from './MarcadorPopup.jsx';
import FiltrosMapa from './FiltrosMapa.jsx';
import { notaParaEmoji } from '../../utils/notaEmoji.js';

// Fix Leaflet default marker icons: use CDN fallback since Vite bundling can break paths
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = defaultIcon;

function MarcadoresAtualizaveis({ locaisFiltrados }) {
  const map = useMap();

  useEffect(() => {
    if (locaisFiltrados.length > 0) {
      const bounds = L.latLngBounds(
        locaisFiltrados
          .filter(l => l.lat != null && l.lng != null)
          .map(l => [l.lat, l.lng])
      );
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
      }
    }
  }, [locaisFiltrados, map]);

  return null;
}

export default function Mapa() {
  const { locais, paraVisitar, filtros, setFiltros, filtrarLocais, abrirFormulario, abrirFormularioDeVisitar } = useApp();
  const [filtrosVisiveis, setFiltrosVisiveis] = useState(false);

  const locaisVisitadosFiltrados = useMemo(() => filtrarLocais(), [filtrarLocais]);

  // Para visitar também aparece no mapa quando o filtro permite
  const paraVisitarFiltrados = useMemo(() => {
    if (filtros.status === STATUS_LOCAL.VISITADO) return [];
    let base = paraVisitar;
    if (filtros.tipo !== 'todos') {
      base = base.filter(p => p.tipo === filtros.tipo);
    }
    return base;
  }, [paraVisitar, filtros]);

  // Combine tudo para o mapa
  const todosOsPontos = useMemo(() => {
    const visitados = locaisVisitadosFiltrados.map(l => ({ ...l, _origem: 'visitado' }));
    const desejos = paraVisitarFiltrados.map(p => ({ ...p, _origem: 'paraVisitar', status: STATUS_LOCAL.PLANEJADO }));
    return [...visitados, ...desejos];
  }, [locaisVisitadosFiltrados, paraVisitarFiltrados]);

  const centroPadrao = [-23.5505, -46.6333]; // Sao Paulo

  function criarIconCustom(local) {
    const isParaVisitar = local._origem === 'paraVisitar';
    const cor = isParaVisitar
      ? STATUS_LOCAL_COR[STATUS_LOCAL.PLANEJADO]
      : (STATUS_LOCAL_COR[local.status] || STATUS_LOCAL_COR[STATUS_LOCAL.VISITADO]);
    const icone = TIPO_LOCAL_ICON[local.tipo] || TIPO_LOCAL_ICON[TIPO_LOCAL.RESTAURANTE];

    // Para visitar: mostra ícone de interrogação em vez de nota
    const notaStr = isParaVisitar
      ? '🔜'
      : notaParaEmoji(local.nota || 0, local.unanime || false);

    return L.divIcon({
      className: 'mapa-marcador-custom',
      html: `
        <div class="marcador-pin" style="background-color: ${cor};">
          <span class="marcador-icone">${icone}</span>
        </div>
        <div class="marcador-nota">${notaStr}</div>
      `,
      iconSize: [40, 50],
      iconAnchor: [20, 50],
      popupAnchor: [0, -50]
    });
  }

  const totalNoMapa = todosOsPontos.length;
  const totalLocais = locais.length;
  const totalParaVisitar = paraVisitar.length;
  const filtrosAtivos = locaisVisitadosFiltrados.length !== totalLocais || paraVisitarFiltrados.length !== totalParaVisitar;

  return (
    <div className="mapa-wrapper">
      <button
        className="btn btn-small mapa-filtros-toggle"
        onClick={() => setFiltrosVisiveis(v => !v)}
      >
        <span style={{ marginRight: '6px' }}>{filtrosVisiveis ? '✕' : '🔍'}</span>
        Filtros
        {filtrosAtivos && (
          <span className="mapa-contador-badge">{totalNoMapa}</span>
        )}
      </button>

      {filtrosVisiveis && (
        <FiltrosMapa
          filtros={filtros}
          onChange={setFiltros}
          onClose={() => setFiltrosVisiveis(false)}
          totalResultados={totalNoMapa}
        />
      )}

      <div className="mapa-contador">
        {totalNoMapa} {totalNoMapa === 1 ? 'local' : 'locais'}
      </div>

      <MapContainer
        center={centroPadrao}
        zoom={13}
        style={{ height: '100%', width: '100%', minHeight: '400px' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MarcadoresAtualizaveis locaisFiltrados={todosOsPontos} />
        {todosOsPontos.map(local => {
          if (local.lat == null || local.lng == null) return null;
          const isParaVisitar = local._origem === 'paraVisitar';
          return (
            <Marker
              key={`${local._origem}-${local.id}`}
              position={[local.lat, local.lng]}
              icon={criarIconCustom(local)}
            >
              <Popup
                maxWidth={320}
                closeButton={false}
                className="popup-culinario"
              >
                {isParaVisitar ? (
                  <PopupParaVisitar
                    local={local}
                    onMarcarVisitado={() => abrirFormularioDeVisitar(local)}
                  />
                ) : (
                  <MarcadorPopup
                    local={local}
                    onVerDetalhes={() => abrirFormulario(local)}
                  />
                )}
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}

function PopupParaVisitar({ local, onMarcarVisitado }) {
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
