import { Platform } from 'react-native';

const DATABASE_NAME = 'mapaCulinario.db';

export async function getDatabase(): Promise<any> {
  const { openDatabaseAsync } = await import('expo-sqlite');
  return await openDatabaseAsync(DATABASE_NAME);
}

export async function initDatabase(): Promise<void> {
  if (Platform.OS === 'web') return;
  
  const db = await getDatabase();

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS comidas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tipo TEXT NOT NULL,
      nome TEXT NOT NULL,
      latitude REAL,
      longitude REAL,
      endereco TEXT,
      data_visita TEXT,
      descricao TEXT NOT NULL,
      tem_home_office INTEGER DEFAULT 0,
      nota REAL CHECK(nota >= -1 AND nota <= 5),
      nota_unanime INTEGER DEFAULT 0,
      foto TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS itens_comida (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      comida_id INTEGER NOT NULL,
      nome TEXT NOT NULL,
      foto TEXT,
      descricao TEXT,
      nota REAL CHECK(nota >= -1 AND nota <= 5),
      nota_unanime INTEGER DEFAULT 0,
      preco REAL CHECK(preco >= -1 AND preco <= 5),
      FOREIGN KEY (comida_id) REFERENCES comidas(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS locais_visitados (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tipo TEXT NOT NULL,
      nome TEXT NOT NULL,
      latitude REAL,
      longitude REAL,
      endereco TEXT,
      data_visita TEXT,
      descricao TEXT NOT NULL,
      nota REAL CHECK(nota >= -1 AND nota <= 5),
      foto TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS novas_descobertas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      descricao TEXT NOT NULL,
      link_video TEXT,
      latitude REAL,
      longitude REAL,
      endereco TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);
}
