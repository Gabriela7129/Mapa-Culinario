import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import { LocalVisitado, Localizacao } from '../types';
import { createLocalVisitado } from '../database/operations';
import { useApp } from '../context/AppContext';
import { NOTA_OPTIONS, formatNota } from '../utils/formatters';

export default function LocalVisitadoFormScreen() {
  const navigation = useNavigation<any>();
  const { refreshData } = useApp();

  const [tipo, setTipo] = useState<'restaurante' | 'espaco'>('restaurante');
  const [nome, setNome] = useState('');
  const [endereco, setEndereco] = useState('');
  const [dataVisita, setDataVisita] = useState('');
  const [descricao, setDescricao] = useState('');
  const [nota, setNota] = useState(3);
  const [foto, setFoto] = useState<string | null>(null);

  async function pickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled) {
      setFoto(result.assets[0].uri);
    }
  }

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

    const local: LocalVisitado = {
      tipo,
      nome: nome.trim(),
      localizacao,
      dataVisita: dataVisita || null,
      descricao: descricao.trim(),
      nota,
      foto,
    };

    try {
      await createLocalVisitado(local);
      await refreshData();
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar');
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.label}>Tipo *</Text>
      <View style={styles.pickerContainer}>
        <Picker selectedValue={tipo} onValueChange={(v) => setTipo(v)}>
          <Picker.Item label="Restaurante" value="restaurante" />
          <Picker.Item label="Espaço" value="espaco" />
        </Picker>
      </View>

      <Text style={styles.label}>Nome do local *</Text>
      <TextInput style={styles.input} value={nome} onChangeText={setNome} placeholder="Nome do local" />

      <Text style={styles.label}>Localização *</Text>
      <TextInput style={styles.input} value={endereco} onChangeText={setEndereco} placeholder="Endereço" />

      <Text style={styles.label}>Data da visita</Text>
      <TextInput style={styles.input} value={dataVisita} onChangeText={setDataVisita} placeholder="YYYY-MM-DD" />

      <Text style={styles.label}>Descrição *</Text>
      <TextInput style={[styles.input, styles.textArea]} value={descricao} onChangeText={setDescricao} placeholder="Descrição da experiência" multiline numberOfLines={4} />

      <Text style={styles.label}>Nota: {nota} {formatNota(nota)}</Text>
      <View style={styles.pickerContainer}>
        <Picker selectedValue={nota} onValueChange={(v) => setNota(v)}>
          {NOTA_OPTIONS.map(v => (
            <Picker.Item key={v} label={`${v} ${formatNota(v)}`} value={v} />
          ))}
        </Picker>
      </View>

      <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
        <Text style={styles.imageButtonText}>{foto ? '📷 Trocar foto' : '📷 Adicionar foto'}</Text>
      </TouchableOpacity>
      {foto && <Image source={{ uri: foto }} style={styles.image} />}

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
  pickerContainer: { backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#ddd', marginBottom: 8 },
  imageButton: { backgroundColor: '#E3F2FD', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  imageButtonText: { color: '#1976D2', fontWeight: '600' },
  image: { width: '100%', height: 200, borderRadius: 8, marginTop: 8 },
  saveButton: { backgroundColor: '#4ECDC4', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 24 },
  saveButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
});