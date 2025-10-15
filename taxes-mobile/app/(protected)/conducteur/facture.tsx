import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Pressable,
  Alert,
} from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { fetchFacturesConducteur, payerFacture } from '@/services/api';

export default function FactureScreen() {
  const { token, userId } = useContext(AuthContext);
  const [factures, setFactures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, payee, non_payee

  useEffect(() => {
    if (!token || !userId) return;

    (async () => {
      try {
        const data = await fetchFacturesConducteur(userId, token);
        setFactures(data.factures || []);
      } catch (e) {
        console.error('Erreur récupération factures', e);
        Alert.alert('Erreur', 'Impossible de récupérer vos factures.');
      } finally {
        setLoading(false);
      }
    })();
  }, [token, userId]);

  const handlePayer = async (id: number) => {
    if (!token || !userId) return;

    try {
      const res = await payerFacture(id, token, userId);
      Alert.alert('Succès', res.message);

      setFactures((prev) =>
        prev.map((f) => (f.id === id ? { ...f, statut: 'payee' } : f))
      );
    } catch (err: any) {
      console.error(err);
      Alert.alert('Erreur', err.response?.data?.detail || 'Impossible de payer cette facture.');
    }
  };

  const filteredFactures = factures.filter((f) => {
    if (filter === 'all') return true;
    if (filter === 'payee') return f.statut === 'payee';
    return f.statut !== 'payee';
  });

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  const renderItem = ({ item }: { item: any }) => {
    const isPaid = item.statut?.toLowerCase() === 'payee';

    const vehiculeInfo = [
      item.immatriculation || '-',
      item.type_vehicule || '-',
      item.modele_vehicule || '-',
      item.annee_vehicule ? item.annee_vehicule.toString() : '-',
    ].join(' | ');

    return (
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <Text style={styles.periode}>{item.periode}</Text>
          <View
            style={[
              styles.badge,
              { backgroundColor: isPaid ? '#4CAF50' : '#E53935' },
            ]}
          >
            <Text style={styles.badgeText}>{isPaid ? 'Payée' : 'Impayée'}</Text>
          </View>
        </View>

        <Text style={styles.detail}>{vehiculeInfo}</Text>

        <View style={styles.rowBetween}>
          <Text style={styles.amount}>{item.montantDu?.toLocaleString()} FCFA</Text>
          <View style={styles.rowRight}>
            <Text style={styles.date}>Émise le: {item.dateEmission}</Text>
            {!isPaid && (
              <Pressable style={styles.payButton} onPress={() => handlePayer(item.id)}>
                <Text style={styles.payButtonText}>Payer</Text>
              </Pressable>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.filterRow}>
        <Pressable
          style={[styles.filterBtn, filter === 'all' && styles.activeFilter]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterText, filter === 'all' && styles.activeFilterText]}>Toutes</Text>
        </Pressable>
        <Pressable
          style={[styles.filterBtn, filter === 'payee' && styles.activeFilter]}
          onPress={() => setFilter('payee')}
        >
          <Text style={[styles.filterText, filter === 'payee' && styles.activeFilterText]}>Payées</Text>
        </Pressable>
        <Pressable
          style={[styles.filterBtn, filter === 'non_payee' && styles.activeFilter]}
          onPress={() => setFilter('non_payee')}
        >
          <Text style={[styles.filterText, filter === 'non_payee' && styles.activeFilterText]}>Non payées</Text>
        </Pressable>
      </View>

      <FlatList
        data={filteredFactures}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text>Aucune facture disponible.</Text>
          </View>
        }
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    backgroundColor: '#fff',
    elevation: 2,
    marginHorizontal: 16,
    borderRadius: 12,
    marginTop: 16,
    marginBottom: 8,
  },
  filterBtn: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  activeFilter: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  filterText: { color: '#333', fontWeight: '600' },
  activeFilterText: { color: '#fff' },

  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    minHeight: 110,
  },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  periode: { fontSize: 16, fontWeight: '700', color: '#222' },
  badge: { borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4 },
  badgeText: { color: '#fff', fontWeight: '600', fontSize: 12 },
  detail: { fontSize: 14, color: '#555', marginBottom: 8 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rowRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  amount: { fontSize: 18, fontWeight: 'bold', color: '#007bff' },
  date: { fontSize: 12, color: '#999' },
  payButton: { backgroundColor: '#007bff', paddingVertical: 6, paddingHorizontal: 16, borderRadius: 8 },
  payButtonText: { color: '#fff', fontWeight: '600', fontSize: 14 },
});