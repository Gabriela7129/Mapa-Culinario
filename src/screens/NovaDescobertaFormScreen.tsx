import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NovaDescoberta, Localizacao } from '../types';
import { createNovaDescoberta } from '../database/operations';
import { useApp } from '../context/AppContext';

export default function NovaDescobertaFormScreen() {
  const navigation = useNavigation<any>();
  const { refreshData } = useApp();

  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [linkVideo, setLinkVideo] = useState('');
  const [endereco, setEndereco] = useState('');

  async function handleSave() {
    if (!nome.trim() || !descricao.trim()) {
      Alert.alert('Erro', 'Nome e descrição são obrigatórios');
      return;
    }

    const localizacao: Localizacao = {
      latitude: 0,
      longitude: 0,
      endereco: endereco,
    };

    const descoberta: NovaDescoberta = {
      nome: nome.trim(),
      descricao: descricao.trim(),
      linkVideo: linkVideo || null,
      localizacao,
    };

    try {
      await createNovaDescoberta(descoberta);
      await refreshData();
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar');
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.label}>Nome do local *</Text>
      <TextInput style={styles.input} value={nome} onChangeText={setNome} placeholder="Nome do local" />

      <Text style={styles.label}>Descrição *</Text>
      <TextInput style={[styles.input, styles.textArea]} value={descricao} onChangeText={setDescricao} placeholder="Descrição" multiline numberOfLines={4} />

      <Text style={styles.label}>Link do vídeo</Text>
      <TextInput style={styles.input} value={linkVideo} onChangeText={setLinkVideo} placeholder="https://..." />

      <Text style={styles.label}>Localização *</Text>
      <TextInput style={styles.input} value={endereco} onChangeText={setEndereco} placeholder="Endereço" />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>💾 Salvar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { padding: 16, paddingBottom: 40 },
  label: { fontSize: 16, fontWeight: '600', marginTop: 16, marginBottom: 8, color: '#333' },
  input: { backgroundColor: '#fff', borderRadius: 8, padding: 12, fontSize: 16, borderWidth: 1, borderColor: '#ddd' },
  textArea: { height: 100, textAlignVertical: 'top' },
  saveButton: { backgroundColor: '#FFD93D', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 24 },
  saveButtonText: { color: '#333', fontWeight: 'bold', fontSize: 18 },
});
