/**
 * Google Drive Integration
 * 
 * Fluxo:
 * 1. Usuário faz login com Google OAuth (via gapi ou manual)
 * 2. Busca pasta 'Mapa-Culinario-Data' no Drive
 * 3. Se não existe, cria a pasta + subpastas de fotos
 * 4. Sync bidirecional: download JSON → merge com local → upload JSON
 * 5. Fotos: upload para subpasta, salva fileId
 * 
 * Requisitos:
 * - OAuth Client ID configurado no Google Cloud Console
 * - Scopes: https://www.googleapis.com/auth/drive.file
 */

const APP_FOLDER_NAME = 'Mapa-Culinario-Data';
const DATA_FILE_NAME = 'mapa-culinario-dados.json';

export const googleDriveService = {
  accessToken: null,
  folderId: null,
  dataFileId: null,
  
  // Inicializar com token do OAuth
  setAccessToken(token) {
    this.accessToken = token;
  },
  
  async init() {
    if (!this.accessToken) throw new Error('Token não configurado');
    await this.findOrCreateFolder();
    await this.findOrCreateDataFile();
  },
  
  async apiRequest(url, options = {}) {
    const res = await fetch(url, {
      ...options,
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        ...options.headers
      }
    });
    if (!res.ok) throw new Error(`Drive API error: ${res.status}`);
    return res.json();
  },
  
  async findOrCreateFolder() {
    // Busca pasta existente
    const search = await this.apiRequest(
      `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(
        `name='${APP_FOLDER_NAME}' and mimeType='application/vnd.google-apps.folder' and trashed=false`
      )}&spaces=drive`
    );
    
    if (search.files?.length > 0) {
      this.folderId = search.files[0].id;
    } else {
      // Cria pasta
      const metadata = {
        name: APP_FOLDER_NAME,
        mimeType: 'application/vnd.google-apps.folder'
      };
      const res = await fetch('https://www.googleapis.com/drive/v3/files', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(metadata)
      });
      const folder = await res.json();
      this.folderId = folder.id;
    }
  },
  
  async findOrCreateDataFile() {
    const search = await this.apiRequest(
      `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(
        `name='${DATA_FILE_NAME}' and '${this.folderId}' in parents and trashed=false`
      )}&spaces=drive`
    );
    
    if (search.files?.length > 0) {
      this.dataFileId = search.files[0].id;
    } else {
      // Cria arquivo JSON vazio
      const metadata = {
        name: DATA_FILE_NAME,
        parents: [this.folderId],
        mimeType: 'application/json'
      };
      const res = await fetch('https://www.googleapis.com/drive/v3/files', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(metadata)
      });
      const file = await res.json();
      this.dataFileId = file.id;
      // Escreve conteúdo inicial
      await this.uploadData({ locais: [], paraVisitar: [] });
    }
  },
  
  async uploadData(data) {
    if (!this.dataFileId) throw new Error('Arquivo de dados não inicializado');
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify({})], { type: 'application/json' }));
    form.append('file', blob);
    
    await fetch(`https://www.googleapis.com/upload/drive/v3/files/${this.dataFileId}?uploadType=multipart`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${this.accessToken}` },
      body: form
    });
  },
  
  async downloadData() {
    if (!this.dataFileId) throw new Error('Arquivo de dados não inicializado');
    
    const res = await fetch(`https://www.googleapis.com/drive/v3/files/${this.dataFileId}?alt=media`, {
      headers: { Authorization: `Bearer ${this.accessToken}` }
    });
    if (!res.ok) throw new Error('Falha ao baixar dados');
    return res.json();
  },
  
  async uploadFoto(file, subpasta = 'fotos-locais') {
    if (!this.folderId) throw new Error('Pasta não inicializada');
    
    // Encontra ou cria subpasta
    const search = await this.apiRequest(
      `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(
        `name='${subpasta}' and '${this.folderId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`
      )}&spaces=drive`
    );
    
    let subpastaId;
    if (search.files?.length > 0) {
      subpastaId = search.files[0].id;
    } else {
      const res = await fetch('https://www.googleapis.com/drive/v3/files', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: subpasta,
          parents: [this.folderId],
          mimeType: 'application/vnd.google-apps.folder'
        })
      });
      const folder = await res.json();
      subpastaId = folder.id;
    }
    
    // Upload do arquivo
    const metadata = { name: file.name, parents: [subpastaId] };
    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file', file);
    
    const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
      method: 'POST',
      headers: { Authorization: `Bearer ${this.accessToken}` },
      body: form
    });
    const result = await res.json();
    return result.id; // fileId
  },
  
  async getFotoUrl(fileId) {
    return `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;
  },
  
  async sync(dadosLocais) {
    try {
      await this.init();
      const dadosNuvem = await this.downloadData();
      
      // Merge simples: usa timestamps para decidir
      const merged = this.mergeDados(dadosLocais, dadosNuvem);
      
      await this.uploadData(merged);
      return merged;
    } catch (e) {
      console.error('Sync error:', e);
      return dadosLocais; // Fallback: mantém dados locais
    }
  },
  
  mergeDados(local, nuvem) {
    const locais = [];
    const todosLocais = [...(local.locais || []), ...(nuvem.locais || [])];
    const porId = {};
    
    todosLocais.forEach(l => {
      if (!porId[l.id] || new Date(l.atualizadoEm) > new Date(porId[l.id].atualizadoEm)) {
        porId[l.id] = l;
      }
    });
    
    const paraVisitar = [];
    const todosVisitar = [...(local.paraVisitar || []), ...(nuvem.paraVisitar || [])];
    const porIdVisitar = {};
    
    todosVisitar.forEach(v => {
      if (!porIdVisitar[v.id] || new Date(v.atualizadoEm) > new Date(porIdVisitar[v.id].atualizadoEm)) {
        porIdVisitar[v.id] = v;
      }
    });
    
    return {
      locais: Object.values(porId),
      paraVisitar: Object.values(porIdVisitar)
    };
  }
};
