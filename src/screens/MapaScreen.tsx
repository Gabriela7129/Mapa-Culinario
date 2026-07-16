import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
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
  const navigation = useNavigation<any>();
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

  const initialRegion = {
    latitude: -23.5505,
    longitude: -46.6333,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

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
  map: {
    width: width,
    height: height,
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
