import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Switch, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import { Comida, ItemComida, Localizacao } from '../types';
import { createComida } from '../database/operations';
import { useApp } from '../context/AppContext';
import { NOTA_OPTIONS, formatNota, formatPreco } from '../utils/formatters';

export default function ComidaFormScreen() {
  const navigation = useNavigation<any>();
  const { refreshData } = useApp();

  const [tipo, setTipo] = useState<'restaurante' | 'espaco'>('restaurante');
  const [nome, setNome] = useState('');
  const [endereco, setEndereco] = useState('');
  const [dataVisita, setDataVisita] = useState('');
  const [descricao, setDescricao] = useState('');
  const [temHomeOffice, setTemHomeOffice] = useState(false);
  const [nota, setNota] = useState(3);
  const [notaUnanime, setNotaUnanime] = useState(false);
  const [foto, setFoto] = useState<string | null>(null);
  const [comidas, setComidas] = useState<ItemComida[]>([]);

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

  function addComida() {
    setComidas([...comidas, {
      nome: '',
      foto: null,
      descricao: '',
      nota: 3,
      notaUnanime: false,
      preco: 3,
    }]);
  }

  function updateComida(index: number, field: keyof ItemComida, value: any) {
    const updated = [...comidas];
    updated[index] = { ...updated[index], [field]: value };
    setComidas(updated);
  }

  async function pickComidaImage(index: number) {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled) {
      updateComida(index, 'foto', result.assets[0].uri);
    }
  }

  function removeComida(index: number) {
    setComidas(comidas.filter((_, i) => i !== index));
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

    const comida: Comida = {
      tipo,
      nome: nome.trim(),
      localizacao,
      dataVisita: dataVisita || null,
      descricao: descricao.trim(),
      temHomeOffice,
      nota,
      notaUnanime,
      foto,
      comidas: comidas.filter(c => c.nome.trim() !== ''),
    };

    try {
      await createComida(comida);
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
      <TextInput style={styles.input} value={nome} onChangeText={setNome} placeholder="Nome do restaurante/espaço" />

      <Text style={styles.label}>Localização *</Text>
      <TextInput style={styles.input} value={endereco} onChangeText={setEndereco} placeholder="Endereço" />

      <Text style={styles.label}>Data da visita</Text>
      <TextInput style={styles.input} value={dataVisita} onChangeText={setDataVisita} placeholder="YYYY-MM-DD" />

      <Text style={styles.label}>Descrição *</Text>
      <TextInput style={[styles.input, styles.textArea]} value={descricao} onChangeText={setDescricao} placeholder="Descrição da experiência" multiline numberOfLines={4} />

      <View style={styles.row}>
        <Text style={styles.label}>Tem home office? 💻</Text>
        <Switch value={temHomeOffice} onValueChange={setTemHomeOffice} />
      </View>

      <Text style={styles.label}>Nota: {nota} {formatNota(nota, notaUnanime)}</Text>
      <View style={styles.pickerContainer}>
        <Picker selectedValue={nota} onValueChange={(v) => setNota(v)}>
          {NOTA_OPTIONS.map(v => (
            <Picker.Item key={v} label={`${v} ${formatNota(v)}`} value={v} />
          ))}
        </Picker>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Nota unânime? 💖</Text>
        <Switch value={notaUnanime} onValueChange={setNotaUnanime} />
      </View>

      <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
        <Text style={styles.imageButtonText}>{foto ? '📷 Trocar foto' : '📷 Adicionar foto'}</Text>
      </TouchableOpacity>
      {foto && <Image source={{ uri: foto }} style={styles.image} />}

      <Text style={styles.sectionTitle}>Comidas</Text>
      {comidas.map((item, index) => (
        <View key={index} style={styles.comidaCard}>
          <TextInput style={styles.input} value={item.nome} onChangeText={(v) => updateComida(index, 'nome', v)} placeholder="Nome da comida" />
          
          <TouchableOpacity style={styles.imageButton} onPress={() => pickComidaImage(index)}>
            <Text style={styles.imageButtonText}>{item.foto ? '📷 Trocar foto' : '📷 Foto da comida'}</Text>
          </TouchableOpacity>
          {item.foto && <Image source={{ uri: item.foto }} style={styles.comidaImage} />}

          <TextInput style={styles.input} value={item.descricao} onChangeText={(v) => updateComida(index, 'descricao', v)} placeholder="Descrição" />

          <Text>Nota: {item.nota} {formatNota(item.nota, item.notaUnanime)}</Text>
          <View style={styles.pickerContainer}>
            <Picker selectedValue={item.nota} onValueChange={(v) => updateComida(index, 'nota', v)}>
              {NOTA_OPTIONS.map(v => (
                <Picker.Item key={v} label={`${v} ${formatNota(v)}`} value={v} />
              ))}
            </Picker>
          </View>

          <View style={styles.row}>
            <Text>Nota unânime? 💖</Text>
            <Switch value={item.notaUnanime} onValueChange={(v) => updateComida(index, 'notaUnanime', v)} />
          </View>

          <Text>Quão barato: {item.preco} {formatPreco(item.preco)}</Text>
          <View style={styles.pickerContainer}>
            <Picker selectedValue={item.preco} onValueChange={(v) => updateComida(index, 'preco', v)}>
              {NOTA_OPTIONS.map(v => (
                <Picker.Item key={v} label={`${v} ${formatPreco(v)}`} value={v} />
              ))}
            </Picker>
          </View>

          <TouchableOpacity style={styles.removeButton} onPress={() => removeComida(index)}>
            <Text style={styles.removeButtonText}>🗑️ Remover comida</Text>
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity style={styles.addButton} onPress={addComida}>
        <Text style={styles.addButtonText}>+ Adicionar comida</Text>
      </TouchableOpacity>

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
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 },
  imageButton: { backgroundColor: '#E3F2FD', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  imageButtonText: { color: '#1976D2', fontWeight: '600' },
  image: { width: '100%', height: 200, borderRadius: 8, marginTop: 8 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginTop: 24, marginBottom: 12, color: '#333' },
  comidaCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#eee' },
  comidaImage: { width: '100%', height: 150, borderRadius: 8, marginTop: 8 },
  removeButton: { backgroundColor: '#FFEBEE', padding: 10, borderRadius: 8, alignItems: 'center', marginTop: 12 },
  removeButtonText: { color: '#C62828', fontWeight: '600' },
  addButton: { backgroundColor: '#E8F5E9', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  addButtonText: { color: '#2E7D32', fontWeight: 'bold', fontSize: 16 },
  saveButton: { backgroundColor: '#FF6B6B', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 24 },
  saveButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
});
