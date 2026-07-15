import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useApp } from '../../contexts/AppContext.jsx';
import {
  TIPO_LOCAL,
  TIPO_LOCAL_LABEL,
  STATUS_LOCAL,
  STATUS_LOCAL_LABEL,
  ABAS
} from '../../utils/tipos.js';
import { notaParaEmoji, labelNota, descricaoNotaLocal } from '../../utils/notaEmoji.js';
import ComidaItem from './ComidaItem.jsx';
import FotoUploader from './FotoUploader.jsx';

const ESTADO_INICIAL = {
  nome: '',
  endereco: '',
  descricao: '',
  nota: 3,
  tipo: TIPO_LOCAL.RESTAURANTE,
  status: STATUS_LOCAL.VISITADO,
  homeoffice: false,
  notaUnanime: false,
  fotos: [],
  comidas: [],
  links: { site: '', tiktok: '', instagram: '' },
  lat: null,
  lng: null,
  dataVisita: ''
};

const MAX_COMIDAS = 10;

export default function Formulario() {
  const {
    salvarLocal,
    salvarParaVisitar,
    setAbaAtiva,
    localEditando,
    setLocalEditando,
    excluirParaVisitar
  } = useApp();

  const [form, setForm] = useState(ESTADO_INICIAL);
  const [erros, setErros] = useState({});
  const [sugestoesEndereco, setSugestoesEndereco] = useState([]);
  const [buscandoEndereco, setBuscandoEndereco] = useState(false);
  const [mostrarSugestoes, setMostrarSugestoes] = useState(false);
  const [sugestoesNome, setSugestoesNome] = useState([]);
  const [mostrarSugestoesNome, setMostrarSugestoesNome] = useState(false);
  const debounceRef = useRef(null);
  const inputEnderecoRef = useRef(null);
  const inputNomeRef = useRef(null);

  const isPlanejado = form.status === STATUS_LOCAL.PLANEJADO;
  const isRestaurante = form.tipo === TIPO_LOCAL.RESTAURANTE;

  // Preencher form quando editando
  useEffect(() => {
    if (localEditando) {
      const prefill = {
        ...ESTADO_INICIAL,
        ...localEditando,
        comidas: localEditando.comidas || [],
        fotos: localEditando.fotos || [],
        links: localEditando.links || { site: '', tiktok: '', instagram: '' }
      };
      // Garantir que dataVisita esteja no formato YYYY-MM-DD para input type="date"
      if (localEditando.dataVisita) {
        const d = new Date(localEditando.dataVisita);
        if (!isNaN(d.getTime())) {
          prefill.dataVisita = d.toISOString().split('T')[0];
        }
      }
      // Backward compatibility: converte foto unica para array de fotos nos pratos
      const comidasMigradas = (prefill.comidas || []).map(c => ({
        ...c,
        fotos: c.fotos || (c.foto ? [c.foto] : []),
        notaUnanime: c.notaUnanime || false,
        valorReais: c.valorReais ?? null
      }));
      prefill.comidas = comidasMigradas;

      setForm(prefill);
    } else {
      setForm(ESTADO_INICIAL);
    }
    setErros({});
  }, [localEditando]);

  // Autocomplete de endereco via Nominatim
  const buscarSugestoes = useCallback(async (query) => {
    if (!query || query.length < 3) {
      setSugestoesEndereco([]);
      return;
    }
    setBuscandoEndereco(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&addressdetails=1`,
        { headers: { 'Accept-Language': 'pt-BR' } }
      );
      const data = await res.json();
      setSugestoesEndereco(data || []);
      setMostrarSugestoes(true);
    } catch (e) {
      console.error('Erro no geocoding:', e);
    } finally {
      setBuscandoEndereco(false);
    }
  }, []);

  const handleEnderecoChange = (value) => {
    setForm(prev => ({ ...prev, endereco: value }));
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => buscarSugestoes(value), 400);
  };

  const selecionarEndereco = (sugestao) => {
    setForm(prev => ({
      ...prev,
      endereco: sugestao.display_name,
      lat: parseFloat(sugestao.lat),
      lng: parseFloat(sugestao.lon)
    }));
    setMostrarSugestoes(false);
    setSugestoesEndereco([]);
  };

  const handleNomeChange = (value) => {
    setForm(prev => ({ ...prev, nome: value }));
    if (erros.nome) {
      setErros(prev => { const n = { ...prev }; delete n.nome; return n; });
    }
    // Autocomplete via Nominatim (igual ao endereço)
    if (value.length >= 3) {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(async () => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(value)}&format=json&limit=5`,
            { headers: { 'Accept-Language': 'pt-BR' } }
          );
          const data = await res.json();
          setSugestoesNome(data || []);
          setMostrarSugestoesNome((data || []).length > 0);
        } catch (e) {
          console.error('Erro ao buscar nome:', e);
        }
      }, 400);
    } else {
      setSugestoesNome([]);
      setMostrarSugestoesNome(false);
    }
  };

  const selecionarNome = (item) => {
    setForm(prev => ({
      ...prev,
      nome: item.name || item.display_name.split(',')[0],
      endereco: item.display_name,
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon)
    }));
    setMostrarSugestoesNome(false);
    setSugestoesNome([]);
  };

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (erros[field]) {
      setErros(prev => { const n = { ...prev }; delete n[field]; return n; });
    }
  };

  const handleLinkChange = (field, value) => {
    setForm(prev => ({ ...prev, links: { ...prev.links, [field]: value } }));
  };

  const handleComidaChange = (idx, comida) => {
    const atualizadas = [...form.comidas];
    atualizadas[idx] = comida;
    setForm(prev => ({ ...prev, comidas: atualizadas }));
  };

  const handleAdicionarComida = () => {
    if (form.comidas.length >= MAX_COMIDAS) return;
    setForm(prev => ({
      ...prev,
      comidas: [...prev.comidas, { id: Date.now().toString(), nome: '', descricao: '', nota: 3, preco: 2, foto: null }]
    }));
  };

  const handleRemoverComida = (idx) => {
    setForm(prev => ({
      ...prev,
      comidas: prev.comidas.filter((_, i) => i !== idx)
    }));
  };

  const validar = () => {
    const e = {};
    if (!form.nome.trim()) e.nome = 'Nome é obrigatório';
    if (!form.endereco.trim()) e.endereco = 'Endereço é obrigatório';
    // Nota e comidas só são validadas quando NÃO é planejado
    if (!isPlanejado) {
      if (form.nota < -1 || form.nota > 5) e.nota = 'Nota deve estar entre -1 e 5';
      if (form.tipo === TIPO_LOCAL.RESTAURANTE) {
        form.comidas.forEach((c, i) => {
          if (!c.nome.trim()) e[`comida_${i}_nome`] = 'Nome do prato é obrigatório';
        });
      }
    }
    setErros(e);
    return Object.keys(e).length === 0;
  };

  const geocodificarEndereco = useCallback(async (endereco) => {
    if (!endereco || endereco.length < 3) return null;
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(endereco)}&format=json&limit=1`,
        { headers: { 'Accept-Language': 'pt-BR' } }
      );
      const data = await res.json();
      if (data && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
          display_name: data[0].display_name
        };
      }
    } catch (e) {
      console.error('Erro no geocoding automatico:', e);
    }
    return null;
  }, []);

  const handleSalvar = async () => {
    if (!validar()) return;

    let payload = { ...form };

    // Geocoding automatico se endereco existe mas sem coordenadas
    if ((payload.lat == null || payload.lng == null) && payload.endereco?.trim()) {
      const resultado = await geocodificarEndereco(payload.endereco.trim());
      if (resultado) {
        payload.lat = resultado.lat;
        payload.lng = resultado.lng;
        if (!payload.endereco.includes(resultado.display_name.substring(0, 20))) {
          payload.endereco = resultado.display_name;
        }
      }
    }

    payload = {
      ...payload,
      id: localEditando?.id || undefined,
      atualizadoEm: new Date().toISOString()
    };

    // Se status é PLANEJADO, salva em "Para Visitar" em vez de locais visitados
    if (isPlanejado) {
      const itemParaVisitar = {
        nome: payload.nome,
        endereco: payload.endereco,
        descricao: payload.descricao,
        tipo: payload.tipo,
        links: payload.links,
        lat: payload.lat,
        lng: payload.lng,
        atualizadoEm: payload.atualizadoEm
      };
      if (localEditando?._idParaVisitar) {
        itemParaVisitar.id = localEditando._idParaVisitar;
      }
      salvarParaVisitar(itemParaVisitar);
    } else {
      salvarLocal(payload);
      // Se veio de "Para Visitar", remover da lista
      if (localEditando?._idParaVisitar) {
        excluirParaVisitar(localEditando._idParaVisitar);
      }
    }

    setLocalEditando(null);
    setAbaAtiva(ABAS.MAPA);
  };

  const handleCancelar = () => {
    setLocalEditando(null);
    setAbaAtiva(ABAS.MAPA);
  };

  return (
    <div className="fade-in" style={containerStyle}>
      <h2 style={titleStyle}>
        {localEditando?.id ? 'Editar Local' : isPlanejado ? 'Adicionar para Visitar' : 'Adicionar Local'}
      </h2>

      {/* Tipo */}
      <div style={fieldStyle}>
        <label style={labelStyle}>Tipo de local</label>
        <div style={toggleGroupStyle}>
          {Object.values(TIPO_LOCAL).map(tipo => (
            <button
              key={tipo}
              type="button"
              onClick={() => handleChange('tipo', tipo)}
              style={{
                ...toggleBtnStyle,
                ...(form.tipo === tipo ? toggleBtnActiveStyle : {})
              }}
            >
              {TIPO_LOCAL_LABEL[tipo]}
            </button>
          ))}
        </div>
      </div>

      {/* Status */}
      <div style={fieldStyle}>
        <label style={labelStyle}>Status</label>
        <div style={toggleGroupStyle}>
          {Object.values(STATUS_LOCAL).map(status => (
            <button
              key={status}
              type="button"
              onClick={() => handleChange('status', status)}
              style={{
                ...toggleBtnStyle,
                ...(form.status === status ? toggleBtnActiveStyle : {})
              }}
            >
              {STATUS_LOCAL_LABEL[status]}
            </button>
          ))}
        </div>
      </div>

      {/* Nome com autocomplete */}
      <div style={fieldStyle}>
        <label style={labelStyle}>Nome do local</label>
        <div style={{ position: 'relative' }}>
          <input
            ref={inputNomeRef}
            type="text"
            className="input"
            value={form.nome}
            onChange={(e) => handleNomeChange(e.target.value)}
            onFocus={() => form.nome.length >= 2 && sugestoesNome.length > 0 && setMostrarSugestoesNome(true)}
            placeholder="Ex: Restaurante do Zé"
          />
          {mostrarSugestoesNome && sugestoesNome.length > 0 && (
            <ul style={sugestoesStyle}>
              {sugestoesNome.map((s, i) => (
                <li
                  key={i}
                  onClick={() => selecionarNome(s)}
                  style={sugestaoItemStyle}
                  onMouseEnter={(e) => e.target.style.background = 'var(--bg)'}
                  onMouseLeave={(e) => e.target.style.background = 'var(--bg-card)'}
                >
                  {s.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>
        {erros.nome && <span style={erroStyle}>{erros.nome}</span>}
      </div>

      {/* Endereco com autocomplete */}
      <div style={fieldStyle}>
        <label style={labelStyle}>Endereço</label>
        <div style={{ position: 'relative' }}>
          <input
            ref={inputEnderecoRef}
            type="text"
            className="input"
            value={form.endereco}
            onChange={(e) => handleEnderecoChange(e.target.value)}
            onFocus={() => form.endereco.length >= 3 && setMostrarSugestoes(true)}
            placeholder="Rua, número, bairro, cidade..."
          />
          {buscandoEndereco && <span style={loadingStyle}>Buscando...</span>}

          {mostrarSugestoes && sugestoesEndereco.length > 0 && (
            <ul style={sugestoesStyle}>
              {sugestoesEndereco.map((s, i) => (
                <li
                  key={i}
                  onClick={() => selecionarEndereco(s)}
                  style={sugestaoItemStyle}
                  onMouseEnter={(e) => e.target.style.background = 'var(--bg)'}
                  onMouseLeave={(e) => e.target.style.background = 'var(--bg-card)'}
                >
                  {s.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>
        {erros.endereco && <span style={erroStyle}>{erros.endereco}</span>}
      </div>

      {/* Descricao */}
      <div style={fieldStyle}>
        <label style={labelStyle}>Descrição</label>
        <textarea
          className="input"
          value={form.descricao}
          onChange={(e) => handleChange('descricao', e.target.value)}
          placeholder="Conte um pouco sobre o local..."
          rows={3}
          style={{ resize: 'vertical', minHeight: '80px' }}
        />
      </div>

      {/* Links */}
      <div style={fieldStyle}>
        <label style={labelStyle}>Links</label>
        <div style={linksGridStyle}>
          <input
            type="url"
            className="input"
            value={form.links.site}
            onChange={(e) => handleLinkChange('site', e.target.value)}
            placeholder="Site"
          />
          <input
            type="url"
            className="input"
            value={form.links.tiktok}
            onChange={(e) => handleLinkChange('tiktok', e.target.value)}
            placeholder="TikTok"
          />
          <input
            type="url"
            className="input"
            value={form.links.instagram}
            onChange={(e) => handleLinkChange('instagram', e.target.value)}
            placeholder="Instagram"
          />
        </div>
      </div>

      {/* Campos exclusivos de locais VISITADOS (não aparecem quando PLANEJADO) */}
      {!isPlanejado && (
        <>
          {/* Nota */}
          <div style={fieldStyle}>
            <label style={labelStyle}>
              Nota geral
              <span style={notaPreviewStyle}>
                {' '}{notaParaEmoji(form.nota, form.notaUnanime)}
              </span>
              <span style={notaLabelStyle}> {labelNota(form.nota)}</span>
            </label>
            <input
              type="range"
              min={-1}
              max={5}
              step={0.5}
              value={form.nota}
              onChange={(e) => handleChange('nota', parseFloat(e.target.value))}
              style={sliderStyle}
            />
            <div style={sliderLabelsStyle}>
              <span style={sliderLabelStyle}>-1</span>
              <span style={sliderLabelStyle}>0</span>
              <span style={sliderLabelStyle}>1</span>
              <span style={sliderLabelStyle}>2</span>
              <span style={sliderLabelStyle}>3</span>
              <span style={sliderLabelStyle}>4</span>
              <span style={sliderLabelStyle}>5</span>
            </div>
            <div style={descricaoSliderStyle}>{descricaoNotaLocal(form.nota)}</div>
          </div>

          {/* Checkboxes */}
          <div style={checkboxRowStyle}>
            <label style={checkboxStyle}>
              <input
                type="checkbox"
                checked={form.notaUnanime}
                onChange={(e) => handleChange('notaUnanime', e.target.checked)}
              />
              <span>Nota unanime</span>
            </label>
            <label style={checkboxStyle}>
              <input
                type="checkbox"
                checked={form.homeoffice}
                onChange={(e) => handleChange('homeoffice', e.target.checked)}
              />
              <span>Homeoffice</span>
            </label>
          </div>

          {/* Data de visita */}
          <div style={fieldStyle}>
            <label style={labelStyle}>Data da visita</label>
            <input
              type="date"
              className="input"
              value={form.dataVisita}
              onChange={(e) => handleChange('dataVisita', e.target.value)}
            />
          </div>

          {/* Fotos do local */}
          <div style={fieldStyle}>
            <FotoUploader
              fotos={form.fotos}
              onChange={(fotos) => handleChange('fotos', fotos)}
              maxFotos={20}
              label="Fotos do local"
            />
          </div>

          {/* Secao Comidas - apenas para restaurante visitado */}
          {isRestaurante && (
            <div style={secaoStyle}>
              <div style={secaoHeaderStyle}>
                <h3 style={secaoTituloStyle}>Pratos provados</h3>
                <span style={contadorStyle}>
                  {form.comidas.length} / {MAX_COMIDAS}
                </span>
              </div>

              {form.comidas.map((comida, idx) => (
                <ComidaItem
                  key={comida.id || idx}
                  comida={comida}
                  index={idx}
                  onChange={handleComidaChange}
                  onRemove={handleRemoverComida}
                  erroNome={erros[`comida_${idx}_nome`]}
                />
              ))}

              {form.comidas.length < MAX_COMIDAS && (
                <button
                  type="button"
                  onClick={handleAdicionarComida}
                  className="btn btn-secondary"
                  style={addComidaBtnStyle}
                >
                  + Adicionar comida
                </button>
              )}
            </div>
          )}
        </>
      )}

      {/* Acoes */}
      <div style={acoesStyle}>
        <button type="button" onClick={handleSalvar} className="btn btn-success" style={{ flex: 1 }}>
          Salvar
        </button>
        <button type="button" onClick={handleCancelar} className="btn btn-secondary" style={{ flex: 1 }}>
          Cancelar
        </button>
      </div>
    </div>
  );
}

/* Styles */
const containerStyle = {
  maxWidth: '720px',
  margin: '0 auto',
  padding: '20px 16px 40px'
};

const titleStyle = {
  fontSize: '22px',
  fontWeight: 700,
  color: 'var(--text)',
  marginBottom: '24px'
};

const fieldStyle = {
  marginBottom: '18px',
  position: 'relative'
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

const toggleGroupStyle = {
  display: 'flex',
  gap: '8px'
};

const toggleBtnStyle = {
  flex: 1,
  padding: '10px 14px',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius-sm)',
  background: 'var(--bg-card)',
  fontFamily: 'var(--font)',
  fontSize: '14px',
  fontWeight: 500,
  color: 'var(--text-secondary)',
  cursor: 'pointer',
  transition: 'all 0.2s ease'
};

const toggleBtnActiveStyle = {
  background: 'var(--accent)',
  color: 'white',
  borderColor: 'var(--accent)',
  boxShadow: 'var(--shadow)'
};

const erroStyle = {
  display: 'block',
  fontSize: '12px',
  color: 'var(--danger)',
  marginTop: '4px'
};

const loadingStyle = {
  position: 'absolute',
  right: '12px',
  top: '38px',
  fontSize: '11px',
  color: 'var(--text-secondary)'
};

const sugestoesStyle = {
  position: 'absolute',
  top: '100%',
  left: 0,
  right: 0,
  zIndex: 10,
  background: 'var(--bg-card)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius-sm)',
  boxShadow: 'var(--shadow-hover)',
  listStyle: 'none',
  maxHeight: '220px',
  overflowY: 'auto',
  margin: '4px 0 0',
  padding: '6px 0'
};

const sugestaoItemStyle = {
  padding: '10px 14px',
  fontSize: '13px',
  cursor: 'pointer',
  color: 'var(--text)',
  borderBottom: '1px solid var(--border)',
  transition: 'background 0.15s'
};

const notaPreviewStyle = {
  fontSize: '18px',
  letterSpacing: '2px'
};

const notaLabelStyle = {
  fontSize: '12px',
  color: 'var(--text-secondary)',
  fontWeight: 400,
  textTransform: 'none',
  letterSpacing: 'normal'
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

const checkboxRowStyle = {
  display: 'flex',
  gap: '20px',
  marginBottom: '18px',
  flexWrap: 'wrap'
};

const checkboxStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  fontSize: '14px',
  cursor: 'pointer',
  color: 'var(--text)'
};

const linksGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
  gap: '10px'
};

const secaoStyle = {
  marginTop: '28px',
  marginBottom: '24px'
};

const secaoHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '16px'
};

const secaoTituloStyle = {
  fontSize: '16px',
  fontWeight: 600,
  color: 'var(--text)'
};

const contadorStyle = {
  fontSize: '12px',
  color: 'var(--text-secondary)',
  fontWeight: 500
};

const addComidaBtnStyle = {
  width: '100%',
  marginTop: '8px'
};

const descricaoSliderStyle = {
  fontSize: '11px',
  color: 'var(--text-secondary)',
  fontStyle: 'italic',
  marginTop: '4px',
  lineHeight: '1.4'
};

const acoesStyle = {
  display: 'flex',
  gap: '12px',
  marginTop: '32px',
  position: 'sticky',
  bottom: '16px',
  background: 'var(--bg)',
  padding: '12px 0',
  zIndex: 5
};
