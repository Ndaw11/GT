import React, { useContext } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { Stack, Redirect } from 'expo-router';
import { AuthProvider, AuthContext } from './context/AuthContext';

function RootLayoutNav() {
  const { isAuthenticated, token, role } = useContext(AuthContext);

  // ⏳ Chargement initial
  if (token === undefined) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        // 🚫 Routes publiques
        <Stack.Screen name="(public)" />
      ) : (
        // ✅ Routes protégées - redirection automatique
        <>
          <Stack.Screen name="(protected)" />
          <Redirect href={role === 'agent' ? '../(protected)/agent' : '../(protected)/conducteur'} />
        </>
      )}
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <PaperProvider>
        <RootLayoutNav />
        <StatusBar style="auto" />
      </PaperProvider>
    </AuthProvider>
  );
}