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
  const { locais, filtros, setFiltros, filtrarLocais, abrirFormulario } = useApp();
  const [filtrosVisiveis, setFiltrosVisiveis] = useState(false);

  const locaisFiltrados = useMemo(() => filtrarLocais(), [filtrarLocais]);

  const centroPadrao = [-23.5505, -46.6333]; // Sao Paulo

  function criarIconCustom(local) {
    const cor = STATUS_LOCAL_COR[local.status] || STATUS_LOCAL_COR[STATUS_LOCAL.VISITADO];
    const icone = TIPO_LOCAL_ICON[local.tipo] || TIPO_LOCAL_ICON[TIPO_LOCAL.RESTAURANTE];
    const notaStr = notaParaEmoji(local.nota || 0, local.unanime || false);

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

  return (
    <div className="mapa-wrapper" style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* Botao toggle filtros mobile */}
      <button
        className="btn btn-small mapa-filtros-toggle"
        onClick={() => setFiltrosVisiveis(v => !v)}
        style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          zIndex: 1000,
          background: 'var(--bg-card)',
          color: 'var(--text)',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow)',
          padding: '10px 16px',
          borderRadius: 'var(--radius)',
          fontSize: '14px',
          fontWeight: 500
        }}
      >
        <span style={{ marginRight: '6px' }}>{filtrosVisiveis ? '✕' : '🔍'}</span>
        Filtros
        {locaisFiltrados.length !== locais.length && (
          <span
            style={{
              marginLeft: '8px',
              background: 'var(--accent)',
              color: 'white',
              fontSize: '11px',
              padding: '2px 6px',
              borderRadius: '10px'
            }}
          >
            {locaisFiltrados.length}
          </span>
        )}
      </button>

      {/* Painel de filtros */}
      {filtrosVisiveis && (
        <FiltrosMapa
          filtros={filtros}
          onChange={setFiltros}
          onClose={() => setFiltrosVisiveis(false)}
          totalResultados={locaisFiltrados.length}
        />
      )}

      {/* Contador de resultados */}
      <div
        className="mapa-contador"
        style={{
          position: 'absolute',
          bottom: '12px',
          left: '12px',
          zIndex: 1000,
          background: 'var(--bg-card)',
          padding: '8px 14px',
          borderRadius: 'var(--radius)',
          boxShadow: 'var(--shadow)',
          fontSize: '13px',
          color: 'var(--text-secondary)',
          fontWeight: 500
        }}
      >
        {locaisFiltrados.length} {locaisFiltrados.length === 1 ? 'local' : 'locais'}
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
        <MarcadoresAtualizaveis locaisFiltrados={locaisFiltrados} />
        {locaisFiltrados.map(local => {
          if (local.lat == null || local.lng == null) return null;
          return (
            <Marker
              key={local.id}
              position={[local.lat, local.lng]}
              icon={criarIconCustom(local)}
            >
              <Popup
                maxWidth={320}
                closeButton={false}
                className="popup-culinario"
              >
                <MarcadorPopup
                  local={local}
                  onVerDetalhes={() => abrirFormulario(local)}
                />
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      <style>{`
        .mapa-marcador-custom {
          background: transparent !important;
          border: none !important;
        }
        .marcador-pin {
          width: 40px;
          height: 40px;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 6px rgba(0,0,0,0.25);
          border: 3px solid white;
          position: relative;
        }
        .marcador-icone {
          transform: rotate(45deg);
          font-size: 18px;
          line-height: 1;
        }
        .marcador-nota {
          position: absolute;
          bottom: -18px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 11px;
          white-space: nowrap;
          background: rgba(255,255,255,0.95);
          padding: 2px 6px;
          border-radius: 10px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.1);
          font-weight: 500;
          color: var(--text);
        }
        .leaflet-popup-content-wrapper {
          overflow: hidden;
        }
        @media (max-width: 640px) {
          .mapa-filtros-toggle {
            top: 8px !important;
            right: 8px !important;
            padding: 8px 12px !important;
            font-size: 13px !important;
          }
          .mapa-contador {
            bottom: 8px !important;
            left: 8px !important;
            font-size: 12px !important;
          }
        }
      `}</style>
    </div>
  );
}
