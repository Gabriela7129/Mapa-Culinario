import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { useApp } from '../context/AppContext';

const { width, height } = Dimensions.get('window');

export default function MapaScreen() {
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

  function getMarkerColor(category: string) {
    switch (category) {
      case 'comida': return '#FF6B6B';
      case 'local': return '#4ECDC4';
      case 'descoberta': return '#FFD93D';
      default: return '#999';
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.mapPlaceholder}>
        <Text style={styles.mapText}>🗺️ Mapa</Text>
        <Text style={styles.mapSubtext}>
          {filteredItems.length} local(is) encontrado(s)
        </Text>
        {filteredItems.map((item, index) => (
          <View key={`${item.category}-${item.id || index}`} style={styles.markerItem}>
            <View style={[styles.markerDot, { backgroundColor: getMarkerColor(item.category) }]} />
            <Text style={styles.markerText}>{item.nome}</Text>
          </View>
        ))}
      </View>

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
  mapPlaceholder: {
    width: width,
    height: height - 200,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  mapText: {
    fontSize: 48,
    marginBottom: 10,
  },
  mapSubtext: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  markerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    width: '80%',
  },
  markerDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  markerText: {
    fontSize: 16,
    color: '#333',
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
