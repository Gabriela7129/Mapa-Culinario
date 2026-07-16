import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useApp } from '../context/AppContext';
import { Comida } from '../types';
import { formatNota } from '../utils/formatters';
import { deleteComida } from '../database/operations';

export default function ComidaListScreen() {
  const navigation = useNavigation<any>();
  const { comidas, refreshData } = useApp();

  async function handleDelete(comida: Comida) {
    Alert.alert(
      'Excluir',
      `Deseja excluir "${comida.nome}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            if (comida.id) {
              await deleteComida(comida.id);
              await refreshData();
            }
          },
        },
      ]
    );
  }

  function renderItem({ item }: { item: Comida }) {
    return (
      <TouchableOpacity style={styles.card} onLongPress={() => handleDelete(item)}>
        <Text style={styles.nome}>{item.nome}</Text>
        <Text style={styles.tipo}>{item.tipo === 'restaurante' ? '🍽️ Restaurante' : '🏢 Espaço'}</Text>
        <Text style={styles.nota}>{formatNota(item.nota, item.notaUnanime)}</Text>
        <Text style={styles.descricao} numberOfLines={2}>{item.descricao}</Text>
        {item.temHomeOffice && <Text style={styles.badge}>💻 Home Office</Text>}
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={comidas}
        keyExtractor={(item) => item.id?.toString() || ''}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>Nenhuma comida cadastrada</Text>}
      />
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('ComidaForm')}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  list: { padding: 16 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  nome: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  tipo: { fontSize: 14, color: '#666', marginTop: 4 },
  nota: { fontSize: 16, marginTop: 8 },
  descricao: { fontSize: 14, color: '#666', marginTop: 8 },
  badge: { fontSize: 12, color: '#4CAF50', marginTop: 8, fontWeight: 'bold' },
  empty: { textAlign: 'center', color: '#999', marginTop: 50, fontSize: 16 },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  fabText: { fontSize: 28, color: '#fff', fontWeight: 'bold' },
});
