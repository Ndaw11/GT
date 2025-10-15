import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TextInput,
  Pressable,
} from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { fetchConducteurs, fetchFacturesByConducteur } from '@/services/api';

export default function ConducteurScreen() {
  const { token } = useContext(AuthContext);
  const [conducteurs, setConducteurs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<any | null>(null);
  const [factures, setFactures] = useState<any[]>([]);
  const [facturesLoading, setFacturesLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'payee' | 'non_payee'>('all');

  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        const data = await fetchConducteurs(token);
        setConducteurs(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  const filtered = conducteurs.filter(c => {
    const fullName = `${c.prenom} ${c.nom}`.toLowerCase();
    const tel = c.tel.toLowerCase();
    const vehicules = (c.vehicules || [])
      .map((v: any) => v.immatriculation.toLowerCase())
      .join(' ');
    const q = search.toLowerCase();
    return fullName.includes(q) || tel.includes(q) || vehicules.includes(q);
  });

  const loadFactures = async (c: any) => {
    if (!token) return;
    setSelected(c);
    setFacturesLoading(true);
    try {
      const data = await fetchFacturesByConducteur(token, c.id);
      const facturesArray = Array.isArray(data.factures) ? data.factures : [];
      setFactures(facturesArray);
      setFilter('all');
    } catch (err) {
      console.error('Erreur chargement factures:', err);
      setFactures([]);
    } finally {
      setFacturesLoading(false);
    }
  };

  const filteredFactures = factures.filter(f => {
    if (filter === 'all') return true;
    if (filter === 'payee') return f.statut === 'payee';
    if (filter === 'non_payee') return f.statut === 'non_payee';
    return true;
  });

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  if (selected) {
    return (
      <View style={styles.container}>
        <Text style={styles.selectedTitle}>
          Factures de {selected.prenom} {selected.nom}
        </Text>

        {/* Boutons filtre */}
        <View style={styles.filterRow}>
          {['all', 'payee', 'non_payee'].map(f => (
            <Pressable
              key={f}
              style={[styles.filterBtn, filter === f && styles.activeFilter]}
              onPress={() => setFilter(f as any)}
            >
              <Text style={styles.filterText}>
                {f === 'all' ? 'Toutes' : f === 'payee' ? 'Payées' : 'Non payées'}
              </Text>
            </Pressable>
          ))}
        </View>

        {facturesLoading ? (
          <ActivityIndicator size="large" color="#4CAF50" />
        ) : (
          <FlatList
            data={filteredFactures}
            keyExtractor={f => f.id.toString()}
            contentContainerStyle={{ paddingBottom: 20 }}
            renderItem={({ item }) => (
              <View style={styles.factureCard}>
                <View style={styles.factureHeader}>
                  <Text style={styles.factureLeft}>
                    {item.dateEmission} | {item.immatriculation}
                  </Text>
                  <Text
                    style={[
                      styles.badge,
                      item.statut === 'payee' ? styles.payee : styles.nonPayee,
                    ]}
                  >
                    {item.statut === 'payee' ? 'Payée' : 'Non payée'}
                  </Text>
                </View>
                <Text style={styles.factureAmount}>Montant: {item.montantDu} FCFA</Text>
              </View>
            )}
            ListEmptyComponent={
              <Text style={{ textAlign: 'center', marginTop: 20, color: '#444' }}>
                Aucune facture trouvée
              </Text>
            }
          />
        )}

        <Pressable style={styles.backBtn} onPress={() => setSelected(null)}>
          <Text style={styles.backText}>← Retour aux conducteurs</Text>
        </Pressable>
      </View>
    );
  }

  const renderItem = ({ item }: { item: any }) => (
    <Pressable style={styles.card} onPress={() => loadFactures(item)}>
      <View style={styles.headerRow}>
        <Text style={styles.name}>{item.prenom} {item.nom}</Text>
        <Text style={styles.tel}>{item.tel}</Text>
      </View>
      <View style={styles.vehiculeRow}>
        {(item.vehicules || []).map((v: any) => (
          <View key={v.id} style={styles.vehiculeBadge}>
            <Text style={styles.vehiculeText}>
              {v.immatriculation} | {v.type} | {v.marque}
            </Text>
          </View>
        ))}
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Recherche nom, tel ou immatriculation…"
        placeholderTextColor="#555"
        value={search}
        onChangeText={setSearch}
      />
      <FlatList
        data={filtered}
        keyExtractor={c => c.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 20, color: '#444' }}>
            Aucun conducteur trouvé
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  searchInput: {
    margin: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    backgroundColor: '#fff',
    color: '#000',
  },

  card: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  name: { fontSize: 16, fontWeight: '700', color: '#333' },
  tel: { fontSize: 14, color: '#666' },
  vehiculeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  vehiculeBadge: {
    backgroundColor: '#E0F7FA',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 6,
    marginTop: 4,
  },
  vehiculeText: { fontSize: 12, color: '#00796B' },

  selectedTitle: { fontSize: 18, fontWeight: '700', color: '#333', textAlign: 'center', marginTop: 16, marginBottom: 8 },

  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  filterBtn: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 8, backgroundColor:'#1976D2' },
  activeFilter: { backgroundColor: '#0D47A1' },
  filterText: { fontSize: 14, color: '#fff', fontWeight: '600' },

  factureCard: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  factureHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  factureLeft: { fontSize: 14, color: '#333', fontWeight: '600' },
  factureAmount: { fontSize: 14, fontWeight: '700', color: '#333' },

  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12, fontSize: 12, fontWeight: '600', color: '#fff' },
  payee: { backgroundColor: '#4CAF50' },
  nonPayee: { backgroundColor: '#F44336' },

  backBtn: { padding: 12, margin: 16, backgroundColor: '#ddd', borderRadius: 12, alignItems: 'center' },
  backText: { fontWeight: '600', color: '#333' },
});
