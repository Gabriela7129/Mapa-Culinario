import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useApp } from '../context/AppContext';
import { LocalVisitado } from '../types';
import { formatNota } from '../utils/formatters';
import { deleteLocalVisitado } from '../database/operations';

export default function LocalVisitadoListScreen() {
  const navigation = useNavigation<any>();
  const { locaisVisitados, refreshData } = useApp();

  async function handleDelete(local: LocalVisitado) {
    Alert.alert(
      'Excluir',
      `Deseja excluir "${local.nome}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            if (local.id) {
              await deleteLocalVisitado(local.id);
              await refreshData();
            }
          },
        },
      ]
    );
  }

  function renderItem({ item }: { item: LocalVisitado }) {
    return (
      <TouchableOpacity style={styles.card} onLongPress={() => handleDelete(item)}>
        <Text style={styles.nome}>{item.nome}</Text>
        <Text style={styles.tipo}>{item.tipo === 'restaurante' ? '🍽️ Restaurante' : '🏢 Espaço'}</Text>
        <Text style={styles.nota}>{formatNota(item.nota)}</Text>
        <Text style={styles.descricao} numberOfLines={2}>{item.descricao}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={locaisVisitados}
        keyExtractor={(item) => item.id?.toString() || ''}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>Nenhum local visitado</Text>}
      />
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('LocalForm')}>
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
  empty: { textAlign: 'center', color: '#999', marginTop: 50, fontSize: 16 },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4ECDC4',
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
