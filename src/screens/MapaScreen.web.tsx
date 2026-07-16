import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { useApp } from '../context/AppContext';

const { width, height } = Dimensions.get('window');

type Category = 'all' | 'comida' | 'local' | 'descoberta';

const CATEGORIES: { key: Category; label: string }[] = [
  { key: 'all', label: 'Todos' },
  { key: 'comida', label: 'Comida' },
  { key: 'local', label: 'Visitado' },
  { key: 'descoberta', label: 'Para ir' },
];

export default function MapaScreen() {
  const { comidas, locaisVisitados, novasDescobertas } = useApp();
  const [selectedType, setSelectedType] = useState<Category>('all');

  const allItems = [
    ...comidas.map(c => ({ ...c, category: 'comida' as const })),
    ...locaisVisitados.map(l => ({ ...l, category: 'local' as const })),
    ...novasDescobertas.map(d => ({ ...d, category: 'descoberta' as const })),
  ];

  const filteredItems = selectedType === 'all'
    ? allItems
    : allItems.filter(item => item.category === selectedType);

  function getMarkerColor(category: Category) {
    switch (category) {
      case 'comida': return '#9CA3AF'; // cinza neutro
      case 'local': return '#FBBF24'; // amarelo
      case 'descoberta': return '#3B82F6'; // azul
      default: return '#9CA3AF';
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.mapPlaceholder}>
        <Text style={styles.mapTitle}>Mapa</Text>
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
        {CATEGORIES.map(cat => {
          const active = selectedType === cat.key;
          return (
            <TouchableOpacity
              key={cat.key}
              style={[
                styles.filterButton,
                active && styles.filterActive,
              ]}
              onPress={() => setSelectedType(cat.key)}
            >
              <Text style={[styles.filterText, active && styles.filterTextActive]}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  mapPlaceholder: {
    width: width,
    height: height - 200,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  mapTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  mapSubtext: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 24,
  },
  markerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
    width: '80%',
  },
  markerDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  markerText: {
    fontSize: 14,
    color: '#374151',
  },
  filterContainer: {
    position: 'absolute',
    top: 52,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    padding: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    marginHorizontal: 2,
    borderRadius: 999,
  },
  filterActive: {
    backgroundColor: '#111827',
  },
  filterText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
});
