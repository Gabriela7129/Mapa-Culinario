import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, View } from 'react-native';

import ComidaListScreen from '../screens/ComidaListScreen';
import ComidaFormScreen from '../screens/ComidaFormScreen';
import LocalVisitadoListScreen from '../screens/LocalVisitadoListScreen';
import LocalVisitadoFormScreen from '../screens/LocalVisitadoFormScreen';
import NovaDescobertaListScreen from '../screens/NovaDescobertaListScreen';
import NovaDescobertaFormScreen from '../screens/NovaDescobertaFormScreen';
import JaFuiScreen from '../screens/JaFuiScreen';
import MapaScreen from '../screens/MapaScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function ComidaStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ComidaList" component={ComidaListScreen} options={{ title: '🍽️ Comida' }} />
      <Stack.Screen name="ComidaForm" component={ComidaFormScreen} options={{ title: 'Nova Comida' }} />
    </Stack.Navigator>
  );
}

function LocalStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="LocalList" component={LocalVisitadoListScreen} options={{ title: '📍 Locais Visitados' }} />
      <Stack.Screen name="LocalForm" component={LocalVisitadoFormScreen} options={{ title: 'Novo Local' }} />
    </Stack.Navigator>
  );
}

function DescobertaStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="DescobertaList" component={NovaDescobertaListScreen} options={{ title: '⭐ Novas Descobertas' }} />
      <Stack.Screen name="DescobertaForm" component={NovaDescobertaFormScreen} options={{ title: 'Nova Descoberta' }} />
      <Stack.Screen name="JaFui" component={JaFuiScreen} options={{ title: 'Já Fui!' }} />
    </Stack.Navigator>
  );
}

export default function Navigation() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: { paddingBottom: 5, paddingTop: 5 },
        }}
      >
        <Tab.Screen
          name="ComidaTab"
          component={ComidaStack}
          options={{
            tabBarLabel: 'Comida',
            tabBarIcon: () => <Text style={{ fontSize: 20 }}>🍽️</Text>,
          }}
        />
        <Tab.Screen
          name="LocalTab"
          component={LocalStack}
          options={{
            tabBarLabel: 'Locais',
            tabBarIcon: () => <Text style={{ fontSize: 20 }}>📍</Text>,
          }}
        />
        <Tab.Screen
          name="MapaTab"
          component={MapaScreen}
          options={{
            tabBarLabel: 'Mapa',
            tabBarIcon: () => <Text style={{ fontSize: 20 }}>🗺️</Text>,
          }}
        />
        <Tab.Screen
          name="DescobertaTab"
          component={DescobertaStack}
          options={{
            tabBarLabel: 'Descobertas',
            tabBarIcon: () => <Text style={{ fontSize: 20 }}>⭐</Text>,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
