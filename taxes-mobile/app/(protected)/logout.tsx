import { useEffect, useContext } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { AuthContext } from '../context/AuthContext';

export default function Logout() {
  const { logout } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    async function performLogout() {
      await logout();
      router.replace('/(public)/login');
    }
    performLogout();
  }, [logout, router]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
      <Text style={{ marginTop: 10 }}>Déconnexion...</Text>
    </View>
  );
}