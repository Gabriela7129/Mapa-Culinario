import React, { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useApp } from '../../contexts/AppContext.jsx';
import { STATUS_LOCAL, STATUS_LOCAL_COR, ABAS } from '../../utils/tipos.js';
import MarcadorPopup from './MarcadorPopup.jsx';
import PopupParaVisitar from './PopupParaVisitar.jsx';
import FiltrosMapa from './FiltrosMapa.jsx';

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
  const { locais, paraVisitar, filtros, setFiltros, filtrarLocais, abrirFormulario, abrirFormularioDeVisitar, setAbaAtiva } = useApp();
  const [filtrosVisiveis, setFiltrosVisiveis] = useState(false);

  const locaisVisitadosFiltrados = useMemo(() => filtrarLocais(), [filtrarLocais]);

  const paraVisitarFiltrados = useMemo(() => {
    if (filtros.status === STATUS_LOCAL.VISITADO) return [];
    let base = paraVisitar;
    if (filtros.tipo !== 'todos') {
      base = base.filter(p => p.tipo === filtros.tipo);
    }
    return base;
  }, [paraVisitar, filtros]);

  const todosOsPontos = useMemo(() => {
    const visitados = locaisVisitadosFiltrados.map(l => ({ ...l, _origem: 'visitado' }));
    const desejos = paraVisitarFiltrados.map(p => ({ ...p, _origem: 'paraVisitar', status: STATUS_LOCAL.PLANEJADO }));
    return [...visitados, ...desejos];
  }, [locaisVisitadosFiltrados, paraVisitarFiltrados]);

  const totalNoMapa = todosOsPontos.length;
  const totalLocais = locais.length;
  const totalParaVisitar = paraVisitar.length;
  const filtrosAtivos = locaisVisitadosFiltrados.length !== totalLocais || paraVisitarFiltrados.length !== totalParaVisitar;

  const centroPadrao = [-23.5505, -46.6333]; // Sao Paulo

  return (
    <div className="mapa-wrapper">
      <button
        className="btn btn-small mapa-filtros-toggle"
        onClick={() => setFiltrosVisiveis(v => !v)}
        aria-label="Mostrar filtros"
        title="Filtros"
      >
        {filtrosVisiveis ? '✕' : 'Filtros'}
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
          const cor = isParaVisitar
            ? STATUS_LOCAL_COR[STATUS_LOCAL.PLANEJADO]
            : (STATUS_LOCAL_COR[local.status] || STATUS_LOCAL_COR[STATUS_LOCAL.VISITADO]);
          return (
            <CircleMarker
              key={`${local._origem}-${local.id}`}
              center={[local.lat, local.lng]}
              radius={8}
              pathOptions={{
                fillColor: cor,
                color: '#FFFFFF',
                weight: 1.5,
                fillOpacity: 0.9,
                opacity: 1
              }}
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
                    onVerDetalhes={() => setAbaAtiva(ABAS.LISTA)}
                  />
                )}
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}
