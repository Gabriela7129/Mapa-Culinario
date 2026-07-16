import React, { useState, useMemo } from 'react';
import { useApp } from '../../contexts/AppContext.jsx';
import {
  LISTA_SUBABAS,
  LISTA_SUBABAS_LABEL
} from '../../utils/tipos.js';
import CardLocal from './CardLocal.jsx';
import VisualizacaoLocal from '../Visualizacao/VisualizacaoLocal.jsx';

export default function ListaVisitar() {
  const { locais, paraVisitar, abrirFormulario } = useApp();
  const [busca, setBusca] = useState('');
  const [subAba, setSubAba] = useState(LISTA_SUBABAS.TODOS);
  const [localVisualizando, setLocalVisualizando] = useState(null);

  const todosLocais = useMemo(() => {
    const visitados = locais.map(l => ({ ...l, _modo: 'visitado' }));
    const desejos = paraVisitar.map(l => ({ ...l, _modo: 'paraVisitar' }));
    return [...visitados, ...desejos];
  }, [locais, paraVisitar]);

  const itensFiltrados = useMemo(() => {
    let base = [];
    if (subAba === LISTA_SUBABAS.TODOS) base = todosLocais;
    else if (subAba === LISTA_SUBABAS.VISITADOS) base = locais.map(l => ({ ...l, _modo: 'visitado' }));
    else if (subAba === LISTA_SUBABAS.PARA_VISITAR) base = paraVisitar.map(l => ({ ...l, _modo: 'paraVisitar' }));

    if (!busca.trim()) return base;
    const termo = busca.toLowerCase().trim();
    return base.filter(item =>
      item.nome?.toLowerCase().includes(termo) ||
      item.endereco?.toLowerCase().includes(termo) ||
      item.descricao?.toLowerCase().includes(termo)
    );
  }, [todosLocais, locais, paraVisitar, subAba, busca]);

  const contadorSubAba = (sub) => {
    if (sub === LISTA_SUBABAS.TODOS) return todosLocais.length;
    if (sub === LISTA_SUBABAS.VISITADOS) return locais.length;
    if (sub === LISTA_SUBABAS.PARA_VISITAR) return paraVisitar.length;
    return 0;
  };

  const handleBuscaChange = (e) => {
    setBusca(e.target.value);
  };

  const handleLimparBusca = () => {
    setBusca('');
  };

  return (
    <div className="lista-container">
      <div className="lista-header">
        <h2 className="lista-titulo">Meus Locais</h2>
        <span className="lista-contador">
          {todosLocais.length} {todosLocais.length === 1 ? 'local' : 'locais'}
        </span>
      </div>

      <div className="lista-busca-container">
        <input
          type="text"
          className="input lista-input-busca"
          placeholder="Buscar por nome, endereço..."
          value={busca}
          onChange={handleBuscaChange}
        />
        {busca && (
          <button
            className="btn btn-secondary btn-small"
            style={{ padding: '12px 14px', minWidth: '44px' }}
            onClick={handleLimparBusca}
            title="Limpar busca"
          >
            ✕
          </button>
        )}
      </div>

      {/* Subtabs */}
      <div className="lista-subtabs">
        {Object.values(LISTA_SUBABAS).map((sub) => (
          <button
            key={sub}
            className={`lista-subtab ${subAba === sub ? 'active' : ''}`}
            onClick={() => setSubAba(sub)}
          >
            {LISTA_SUBABAS_LABEL[sub]}
            <span style={{ marginLeft: '6px', fontSize: '11px', opacity: 0.7 }}>
              ({contadorSubAba(sub)})
            </span>
          </button>
        ))}
      </div>

      {itensFiltrados.length === 0 ? (
        <div className="lista-vazio">
          <div className="lista-vazio-icone">
            {subAba === LISTA_SUBABAS.PARA_VISITAR ? '📋' : '📍'}
          </div>
          <p className="lista-vazio-titulo">
            {busca.trim() ? 'Nenhum local encontrado' : 'Nenhum local aqui'}
          </p>
          <p className="lista-vazio-sub">
            {busca.trim()
              ? 'Tente outro termo de busca'
              : subAba === LISTA_SUBABAS.PARA_VISITAR
                ? 'Adicione locais pelo mapa ou formulário'
                : 'Adicione seu primeiro local na aba "Adicionar"'
            }
          </p>
          {!busca.trim() && subAba === LISTA_SUBABAS.PARA_VISITAR && (
            <button
              className="btn"
              style={{ minWidth: '180px' }}
              onClick={() => abrirFormulario()}
            >
              + Adicionar local
            </button>
          )}
        </div>
      ) : (
        <div className="lista">
          {busca.trim() && (
            <p className="lista-resultado-info">
              {itensFiltrados.length} {itensFiltrados.length === 1 ? 'resultado' : 'resultados'} para &quot;{busca}&quot;
            </p>
          )}
          {itensFiltrados.map(item => (
            <CardLocal
              key={`${item._modo}-${item.id}`}
              local={item}
              modo={item._modo}
              onVer={() => setLocalVisualizando(item)}
            />
          ))}
        </div>
      )}

      {localVisualizando && (
        <VisualizacaoLocal
          local={localVisualizando}
          onEditar={() => {
            abrirFormulario(localVisualizando);
            setLocalVisualizando(null);
          }}
          onFechar={() => setLocalVisualizando(null)}
        />
      )}
    </div>
  );
}
