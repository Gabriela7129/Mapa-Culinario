import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  COMIDAS: '@mapa_culinario:comidas',
  LOCAIS: '@mapa_culinario:locais',
  DESCOBERTAS: '@mapa_culinario:descobertas',
};

export async function getStorageItem<T>(key: string): Promise<T[]> {
  try {
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export async function setStorageItem<T>(key: string, value: T[]): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export { KEYS };
