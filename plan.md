# Mapa Culinário — Plano Técnico

## Visão
Aplicativo web pessoal (PWA) para registrar restaurantes e eventos culturais visitados, com mapa interativo, fotos sincronizadas no Google Drive e acesso via senha.

## Arquitetura
- **Frontend**: React 18 + Vite + PWA (Service Worker + Manifest)
- **Mapa**: Leaflet + OpenStreetMap (gratuito, offline tiles possível)
- **Estilização**: CSS puro, minimalista, baixa saturação, tons quentes
- **Estado**: React Context + localStorage (cache) + Google Drive (fonte verdade)
- **Autenticação**: Google OAuth 2.0 (única forma de login)
- **Fotos**: armazenadas no Google Drive, metadados no app
- **Deploy**: GitHub Pages (gratuito, já integrado)

## Estrutura de Pastas
```
src/
  components/
    Mapa/              — Mapa interativo com marcadores
    Formulario/        — Form de adicionar/editar local
    ListaVisitar/      — Lista de locais para visitar
    NotaDisplay/       — Componente de exibição de notas com emojis
    FotoUpload/        — Upload de fotos (base64 temporário + Drive)
    Filtros/           — Barra de filtros do mapa
    Layout/            — Navegação por abas, header
  contexts/
    AppContext.js      — Estado global (locais, config, auth)
    DriveContext.js    — Integração Google Drive
  services/
    googleDrive.js     — API wrapper para Google Drive
    localStorage.js    — Cache local
  utils/
    notaEmoji.js       — Lógica de notas → emojis
    tipos.js           — Constantes (tipos de local, filtros)
  App.jsx
  main.jsx
public/
  manifest.json        — PWA manifest
  sw.js                — Service Worker
index.html
```

## Funcionalidades por Aba

### Aba Mapa
- Leaflet com tiles OpenStreetMap
- Marcadores personalizados: 🍽️ restaurante, 🎭 cultural
- Cores: verde (visitado), laranja (planejado)
- Popup ao clicar: nome, endereço, nota (emojis), mini galeria de fotos, contador de visitas, botão "Ver detalhes"
- Filtros laterais: visitado/planejado, nota mínima, tipo (restaurante/cultural)
- Geocoding reverso para preencher endereço

### Aba Formulário
- Campos base: nome, endereço (com busca no mapa), descrição, nota (slider -1 a 5), homeoffice (toggle), tipo (select), visitado/planejado (toggle), nota unânime (checkbox), fotos (upload múltiplo)
- Se restaurante: seção "Comidas" com até 10 itens (nome, descrição, nota, preço, foto). Botão "+ Adicionar comida"
- Se cultural: campos simples (descrição, nota, fotos)
- Preview de nota em tempo real com emojis
- Preview de preço em tempo real com emojis
- Endereço com autocomplete (Nominatim/OpenStreetMap)

### Aba Locais para Visitar
- Lista de cards com: nome, endereço, tipo, links (site, TikTok, Instagram)
- Botão "Adicionar à visita" → abre formulário pré-preenchido
- Botão "Marcar como visitado" → abre formulário com tipo preenchido
- Busca por nome

### Sistema de Notas
- -1 = ☁️☁️  |  0 = ☁️  |  1 = ⭐  |  2 = ⭐⭐  |  3 = ⭐⭐⭐  |  4 = ⭐⭐⭐⭐  |  5 = ⭐⭐⭐⭐⭐
- Valor fracionado: adiciona ✨ (ex: 1,5 = ⭐✨️)
- Nota unânime: adiciona 💖 no final

### Sistema de Preço (Comidas)
- -1 = 🪾🪾  |  0 = 🪾  |  1 = 🌸  |  2 = 🌸🌸  |  3 = 🌸🌸🌸  |  4 = 🌸🌸🌸🌸  |  5 = 🌸🌸🌸🌸🌸
- Valor fracionado: adiciona 🌷

## Google Drive Integration
- Pasta raiz: `Mapa-Culinario-Data`
- Subpastas: `fotos-locais/`, `fotos-comidas/`
- Arquivo JSON principal: `mapa-culinario-dados.json` — contém todos os metadados
- Fluxo: login → busca pasta → se não existe, cria → sync bidirecional
- Fotos: upload para Drive, salva fileId no JSON

## PWA
- Manifest com ícones
- Service Worker para cache offline
- Prompt de instalação no mobile
- Funciona offline com cache de dados (read-only, sync ao reconectar)

## Temas Visuais
- Paleta: fundo #FAF7F2 (creme), texto #2D2A26 (carvão), destaque #D4A574 (terracota), secundário #8FA89B (sálvia), alerta #E8A87C (pêssego)
- Fonte: 'Inter' (Google Fonts)
- Arredondamento: 12px nos cards, 8px nos inputs
- Sombra suave: 0 2px 8px rgba(0,0,0,0.06)
