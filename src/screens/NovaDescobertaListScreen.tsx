import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useApp } from '../context/AppContext';
import { NovaDescoberta } from '../types';
import { deleteNovaDescoberta } from '../database/operations';

export default function NovaDescobertaListScreen() {
  const navigation = useNavigation<any>();
  const { novasDescobertas, refreshData } = useApp();

  async function handleDelete(descoberta: NovaDescoberta) {
    Alert.alert(
      'Excluir',
      `Deseja excluir "${descoberta.nome}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            if (descoberta.id) {
              await deleteNovaDescoberta(descoberta.id);
              await refreshData();
            }
          },
        },
      ]
    );
  }

  function handleJaFui(descoberta: NovaDescoberta) {
    navigation.navigate('JaFui', { descoberta });
  }

  function openLink(url: string | null) {
    if (url) {
      Linking.openURL(url).catch(() => Alert.alert('Erro', 'Não foi possível abrir o link'));
    }
  }

  function renderItem({ item }: { item: NovaDescoberta }) {
    return (
      <TouchableOpacity style={styles.card} onLongPress={() => handleDelete(item)}>
        <Text style={styles.nome}>{item.nome}</Text>
        <Text style={styles.descricao} numberOfLines={2}>{item.descricao}</Text>
        <Text style={styles.endereco}>📍 {item.localizacao.endereco}</Text>
        {item.linkVideo && (
          <TouchableOpacity onPress={() => openLink(item.linkVideo)}>
            <Text style={styles.link}>🎥 Ver vídeo</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.jaFuiButton} onPress={() => handleJaFui(item)}>
          <Text style={styles.jaFuiText}>✅ Já fui!</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={novasDescobertas}
        keyExtractor={(item) => item.id?.toString() || ''}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>Nenhuma descoberta cadastrada</Text>}
      />
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('DescobertaForm')}>
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
  descricao: { fontSize: 14, color: '#666', marginTop: 8 },
  endereco: { fontSize: 14, color: '#999', marginTop: 8 },
  link: { fontSize: 14, color: '#1976D2', marginTop: 8, fontWeight: '600' },
  jaFuiButton: {
    backgroundColor: '#FFF3E0',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  jaFuiText: { color: '#E65100', fontWeight: 'bold', fontSize: 16 },
  empty: { textAlign: 'center', color: '#999', marginTop: 50, fontSize: 16 },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFD93D',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  fabText: { fontSize: 28, color: '#333', fontWeight: 'bold' },
});