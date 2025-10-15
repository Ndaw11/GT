import React, { useContext } from 'react';
import { Drawer } from 'expo-router/drawer';
import { AuthContext } from '../context/AuthContext';
import { Redirect } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

export default function ProtectedLayout() {
  const { role, isAuthenticated, userId } = useContext(AuthContext);

  // Rediriger si non authentifié
  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return (
    <Drawer
      screenOptions={{
        headerTitle: 'TaxePay',
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: '700',
          color: '#fff',
        },
        headerStyle: {
          backgroundColor: '#007bff',
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: '#fff',
        drawerType: 'slide',
        drawerStyle: {
          backgroundColor: '#ffffff',
          width: 280,
        },
        drawerActiveTintColor: '#007bff',
        drawerInactiveTintColor: '#64748b',
        drawerLabelStyle: {
          fontSize: 14,
          fontWeight: '500',
          marginLeft: -16,
        },
        drawerActiveBackgroundColor: '#f1f5f9',
      }}
    >
      {/* Écran Agent */}
      <Drawer.Screen 
        name="agent" 
        options={{ 
          title: 'Dashboard Agent',
          drawerLabel: '  Agent',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
          drawerItemStyle: { 
            display: role === 'agent' ? 'flex' : 'none',
            marginHorizontal: 8,
            borderRadius: 8,
            marginTop: 8,
            marginBottom: 11
          }
        }} 
      />
      
      {/* Écran Conducteur */}
      <Drawer.Screen 
        name="conducteur" 
        options={{ 
          title: 'Mes Factures',
          drawerLabel: '  Mes Factures',
          drawerIcon: ({ color, size }) => (
            <MaterialIcons name="receipt-long" size={size} color={color} />
          ),
          drawerItemStyle: { 
            display: role === 'conducteur' ? 'flex' : 'none',
            marginHorizontal: 8,
            borderRadius: 8,
            marginTop: 8,
            marginBottom: 11
          }
        }} 
      />

      {/* Déconnexion avec style distinct */}
      <Drawer.Screen
        name="logout"
        options={{ 
          title: 'Déconnexion',
          drawerLabel: '  Déconnexion',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="log-out-outline" size={size} color="#dc2626" />
          ),
          drawerItemStyle: { 
            marginTop: 'auto',
            marginHorizontal: 8,
            marginBottom: 16,
            borderRadius: 8,
            backgroundColor: '#fef2f2',
            borderLeftWidth: 3,
            borderLeftColor: '#dc2626',
          }
        }}
      />
    </Drawer>
  );
}