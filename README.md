# 🗺️ Mapa Culinário

> Seu mapa pessoal de restaurantes e eventos culturais. Privado, sincronizável e feito com carinho.

## ✨ Funcionalidades

- **🗺️ Mapa Interativo** — Visualize todos os locais que você visitou ou planeja visitar em um mapa estilo Google Maps (OpenStreetMap). Marcadores coloridos por status e tipo.
- **📝 Formulário Completo** — Cadastre restaurantes e eventos culturais com notas, fotos, descrições, links e até 10 pratos por restaurante.
- **📋 Lista de Desejos** — Guarde locais que quer conhecer. Com um clique, transforme em "visitado" e preencha o formulário.
- **⭐ Sistema de Notas com Emojis** — Notas de -1 a 5 com emojis intuitivos (☁️, ⭐, ✨️) + marcação de nota unânime (💖).
- **🌸 Sistema de Preço** — Avalie o custo dos pratos com emojis de flores (🌸, 🌷, 🪾).
- **🔒 Acesso Privado** — Protegido por senha. Seus dados são seus.
- **☁️ Sincronização Google Drive** — Opcional: sincronize seus dados e fotos no Google Drive para acesso em qualquer dispositivo.
- **📱 PWA** — Instale como app no celular e use offline!

## 🛠️ Tecnologias

- React 18 + Vite
- Leaflet + OpenStreetMap
- CSS puro (sem framework)
- PWA (Service Worker + Manifest)
- Google Drive API (opcional)

## 🚀 Como rodar localmente

```bash
npm install
npm run dev
```

## 📦 Deploy no GitHub Pages

```bash
npm run build
npm run deploy
```

Acesse em: `https://<seu-usuario>.github.io/Mapa-Culinario/`

## 🔐 Configurar Google Drive (opcional)

1. Vá em [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um projeto e habilite a **Google Drive API**
3. Configure a tela de consentimento OAuth e crie credenciais OAuth 2.0 (Web application)
4. Adicione seu domínio nas origens autorizadas
5. Copie o **Client ID** e configure no app

## 📁 Estrutura de Dados no Drive

```
Mapa-Culinario-Data/
├── mapa-culinario-dados.json  ← todos os seus dados
├── fotos-locais/              ← fotos dos locais
└── fotos-comidas/             ← fotos dos pratos
```

## 🎨 Paleta de Cores

| Cor | Hex | Uso |
|-----|-----|-----|
| Creme | `#FAF7F2` | Fundo |
| Carvão | `#2D2A26` | Texto |
| Terracota | `#D4A574` | Destaque |
| Sálvia | `#8FA89B` | Secundário |
| Pêssego | `#E8A87C` | Alerta |

---

Feito com ❤️ para registrar boas experiências gastronômicas e culturais.
