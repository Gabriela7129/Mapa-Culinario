import { Platform } from 'react-native';
import { Comida, ItemComida, LocalVisitado, NovaDescoberta } from '../types';
import { getStorageItem, setStorageItem, KEYS } from './storage';

// Web: AsyncStorage | Mobile: SQLite
const isWeb = Platform.OS === 'web';

let db: any = null;

async function getDb() {
  if (!isWeb && !db) {
    const { getDatabase } = await import('./database');
    db = await getDatabase();
  }
  return db;
}

// ========== COMIDAS ==========

export async function createComida(comida: Comida): Promise<number> {
  if (isWeb) {
    const comidas = await getStorageItem<Comida>(KEYS.COMIDAS);
    const id = Date.now();
    comidas.push({ ...comida, id });
    await setStorageItem(KEYS.COMIDAS, comidas);
    return id;
  }

  const database = await getDb();
  const result = await database.runAsync(
    `INSERT INTO comidas (tipo, nome, latitude, longitude, endereco, data_visita, descricao, tem_home_office, nota, nota_unanime, foto)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    comida.tipo,
    comida.nome,
    comida.localizacao.latitude,
    comida.localizacao.longitude,
    comida.localizacao.endereco,
    comida.dataVisita,
    comida.descricao,
    comida.temHomeOffice ? 1 : 0,
    comida.nota,
    comida.notaUnanime ? 1 : 0,
    comida.foto
  );

  const comidaId = result.lastInsertRowId;

  for (const item of comida.comidas) {
    await database.runAsync(
      `INSERT INTO itens_comida (comida_id, nome, foto, descricao, nota, nota_unanime, preco)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      comidaId,
      item.nome,
      item.foto,
      item.descricao,
      item.nota,
      item.notaUnanime ? 1 : 0,
      item.preco
    );
  }

  return comidaId;
}

export async function getComidas(): Promise<Comida[]> {
  if (isWeb) {
    return await getStorageItem<Comida>(KEYS.COMIDAS);
  }

  const database = await getDb();
  const rows = await database.getAllAsync<any>(
    `SELECT * FROM comidas ORDER BY created_at DESC`
  );

  const comidas: Comida[] = [];

  for (const row of rows) {
    const itens = await database.getAllAsync<any>(
      `SELECT * FROM itens_comida WHERE comida_id = ?`,
      row.id
    );

    comidas.push({
      id: row.id,
      tipo: row.tipo,
      nome: row.nome,
      localizacao: {
        latitude: row.latitude,
        longitude: row.longitude,
        endereco: row.endereco,
      },
      dataVisita: row.data_visita,
      descricao: row.descricao,
      temHomeOffice: row.tem_home_office === 1,
      nota: row.nota,
      notaUnanime: row.nota_unanime === 1,
      foto: row.foto,
      comidas: itens.map((item: any) => ({
        id: item.id,
        comida_id: item.comida_id,
        nome: item.nome,
        foto: item.foto,
        descricao: item.descricao,
        nota: item.nota,
        notaUnanime: item.nota_unanime === 1,
        preco: item.preco,
      })),
    });
  }

  return comidas;
}

export async function deleteComida(id: number): Promise<void> {
  if (isWeb) {
    const comidas = await getStorageItem<Comida>(KEYS.COMIDAS);
    await setStorageItem(KEYS.COMIDAS, comidas.filter(c => c.id !== id));
    return;
  }

  const database = await getDb();
  await database.runAsync(`DELETE FROM comidas WHERE id = ?`, id);
}

// ========== LOCAIS VISITADOS ==========

export async function createLocalVisitado(local: LocalVisitado): Promise<number> {
  if (isWeb) {
    const locais = await getStorageItem<LocalVisitado>(KEYS.LOCAIS);
    const id = Date.now();
    locais.push({ ...local, id });
    await setStorageItem(KEYS.LOCAIS, locais);
    return id;
  }

  const database = await getDb();
  const result = await database.runAsync(
    `INSERT INTO locais_visitados (tipo, nome, latitude, longitude, endereco, data_visita, descricao, nota, foto)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    local.tipo,
    local.nome,
    local.localizacao.latitude,
    local.localizacao.longitude,
    local.localizacao.endereco,
    local.dataVisita,
    local.descricao,
    local.nota,
    local.foto
  );

  return result.lastInsertRowId;
}

export async function getLocaisVisitados(): Promise<LocalVisitado[]> {
  if (isWeb) {
    return await getStorageItem<LocalVisitado>(KEYS.LOCAIS);
  }

  const database = await getDb();
  const rows = await database.getAllAsync<any>(
    `SELECT * FROM locais_visitados ORDER BY created_at DESC`
  );

  return rows.map((row: any) => ({
    id: row.id,
    tipo: row.tipo,
    nome: row.nome,
    localizacao: {
      latitude: row.latitude,
      longitude: row.longitude,
      endereco: row.endereco,
    },
    dataVisita: row.data_visita,
    descricao: row.descricao,
    nota: row.nota,
    foto: row.foto,
  }));
}

export async function deleteLocalVisitado(id: number): Promise<void> {
  if (isWeb) {
    const locais = await getStorageItem<LocalVisitado>(KEYS.LOCAIS);
    await setStorageItem(KEYS.LOCAIS, locais.filter(l => l.id !== id));
    return;
  }

  const database = await getDb();
  await database.runAsync(`DELETE FROM locais_visitados WHERE id = ?`, id);
}

// ========== NOVAS DESCOBERTAS ==========

export async function createNovaDescoberta(descoberta: NovaDescoberta): Promise<number> {
  if (isWeb) {
    const descobertas = await getStorageItem<NovaDescoberta>(KEYS.DESCOBERTAS);
    const id = Date.now();
    descobertas.push({ ...descoberta, id });
    await setStorageItem(KEYS.DESCOBERTAS, descobertas);
    return id;
  }

  const database = await getDb();
  const result = await database.runAsync(
    `INSERT INTO novas_descobertas (nome, descricao, link_video, latitude, longitude, endereco)
     VALUES (?, ?, ?, ?, ?, ?)`,
    descoberta.nome,
    descoberta.descricao,
    descoberta.linkVideo,
    descoberta.localizacao.latitude,
    descoberta.localizacao.longitude,
    descoberta.localizacao.endereco
  );

  return result.lastInsertRowId;
}

export async function getNovasDescobertas(): Promise<NovaDescoberta[]> {
  if (isWeb) {
    return await getStorageItem<NovaDescoberta>(KEYS.DESCOBERTAS);
  }

  const database = await getDb();
  const rows = await database.getAllAsync<any>(
    `SELECT * FROM novas_descobertas ORDER BY created_at DESC`
  );

  return rows.map((row: any) => ({
    id: row.id,
    nome: row.nome,
    descricao: row.descricao,
    linkVideo: row.link_video,
    localizacao: {
      latitude: row.latitude,
      longitude: row.longitude,
      endereco: row.endereco,
    },
  }));
}

export async function deleteNovaDescoberta(id: number): Promise<void> {
  if (isWeb) {
    const descobertas = await getStorageItem<NovaDescoberta>(KEYS.DESCOBERTAS);
    await setStorageItem(KEYS.DESCOBERTAS, descobertas.filter(d => d.id !== id));
    return;
  }

  const database = await getDb();
  await database.runAsync(`DELETE FROM novas_descobertas WHERE id = ?`, id);
}

export async function findDescobertaByLocation(latitude: number, longitude: number): Promise<NovaDescoberta | null> {
  if (isWeb) {
    const descobertas = await getStorageItem<NovaDescoberta>(KEYS.DESCOBERTAS);
    return descobertas.find(d => 
      Math.abs(d.localizacao.latitude - latitude) < 0.0001 &&
      Math.abs(d.localizacao.longitude - longitude) < 0.0001
    ) || null;
  }

  const database = await getDb();
  const row = await database.getFirstAsync<any>(
    `SELECT * FROM novas_descobertas 
     WHERE ABS(latitude - ?) < 0.0001 AND ABS(longitude - ?) < 0.0001
     LIMIT 1`,
    latitude,
    longitude
  );

  if (!row) return null;

  return {
    id: row.id,
    nome: row.nome,
    descricao: row.descricao,
    linkVideo: row.link_video,
    localizacao: {
      latitude: row.latitude,
      longitude: row.longitude,
      endereco: row.endereco,
    },
  };
}
