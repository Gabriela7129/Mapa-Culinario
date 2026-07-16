import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import { useApp } from '../context/AppContext';
import { Comida, LocalVisitado, NovaDescoberta } from '../types';

const { width, height } = Dimensions.get('window');

export default function MapaScreen() {
  const navigation = useNavigation<any>();
  const { comidas, locaisVisitados, novasDescobertas } = useApp();
  const [selectedType, setSelectedType] = useState<'all' | 'comida' | 'local' | 'descoberta'>('all');

  const allItems = [
    ...comidas.map(c => ({ ...c, category: 'comida' as const })),
    ...locaisVisitados.map(l => ({ ...l, category: 'local' as const })),
    ...novasDescobertas.map(d => ({ ...d, category: 'descoberta' as const })),
  ];

  const filteredItems = selectedType === 'all' 
    ? allItems 
    : allItems.filter(item => item.category === selectedType);

  const initialRegion = {
    latitude: -23.5505,
    longitude: -46.6333,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  function getMarkerColor(category: string) {
    switch (category) {
      case 'comida': return '#FF6B6B';
      case 'local': return '#4ECDC4';
      case 'descoberta': return '#FFD93D';
      default: return '#999';
    }
  }

  function getMarkerEmoji(category: string) {
    switch (category) {
      case 'comida': return '🍽️';
      case 'local': return '📍';
      case 'descoberta': return '⭐';
      default: return '📍';
    }
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
      >
        {filteredItems.map((item, index) => (
          <Marker
            key={`${item.category}-${item.id || index}`}
            coordinate={{
              latitude: item.localizacao.latitude || -23.5505,
              longitude: item.localizacao.longitude || -46.6333,
            }}
            title={item.nome}
            description={item.descricao}
            pinColor={getMarkerColor(item.category)}
          />
        ))}
      </MapView>

      <View style={styles.filterContainer}>
        <TouchableOpacity 
          style={[styles.filterButton, selectedType === 'all' && styles.filterActive]}
          onPress={() => setSelectedType('all')}
        >
          <Text style={styles.filterText}>Todos</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filterButton, selectedType === 'comida' && styles.filterActive]}
          onPress={() => setSelectedType('comida')}
        >
          <Text style={styles.filterText}>🍽️ Comida</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filterButton, selectedType === 'local' && styles.filterActive]}
          onPress={() => setSelectedType('local')}
        >
          <Text style={styles.filterText}>📍 Locais</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filterButton, selectedType === 'descoberta' && styles.filterActive]}
          onPress={() => setSelectedType('descoberta')}
        >
          <Text style={styles.filterText}>⭐ Descobertas</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.legend}>
        <Text style={styles.legendText}>🍽️ Comida | 📍 Local Visitado | ⭐ Descoberta</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: width,
    height: height,
  },
  filterContainer: {
    position: 'absolute',
    top: 50,
    left: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 12,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  filterActive: {
    backgroundColor: '#FF6B6B',
  },
  filterText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  legend: {
    position: 'absolute',
    bottom: 100,
    left: 10,
    right: 10,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  legendText: {
    fontSize: 14,
    color: '#333',
  },
});
