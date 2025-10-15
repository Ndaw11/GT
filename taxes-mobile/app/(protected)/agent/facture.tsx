import React, { useContext, useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  Pressable,
  FlatList,
  Animated,
} from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import {
  fetchStats,
  fetchStatsByMonth,
  fetchAllFactures,
  fetchFacturesPayees,
  fetchFacturesNonPayees,
} from '@/services/api';

// Créer un FlatList animé
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

export default function StatsScreen() {
  const { token } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [facturesList, setFacturesList] = useState<any[]>([]);
  const [listLoading, setListLoading] = useState(false);
  
  const scrollY = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    loadGlobal();
  }, [token]);

  async function loadGlobal() {
    if (!token) return;
    setLoading(true);
    try {
      const data = await fetchStats(token);
      setStats(data);
      setFacturesList([]);
    } finally {
      setLoading(false);
    }
  }

  async function applyFilter() {
    if (!token) return;
    if (!month || !year) {
      loadGlobal();
      return;
    }
    setLoading(true);
    try {
      const list = await fetchStatsByMonth(token, Number(month), Number(year));
      if (!list || list.length === 0) {
        setStats({
          total_factures: 0,
          total_payees: 0,
          total_non_payees: 0,
          montant_total: 0,
          montant_payees: 0,
          montant_non_payees: 0,
        });
        setFacturesList([]);
      } else {
        const total = list.length;
        const payees = list.filter((f: any) => f.statut === 'payee').length;
        const nonPayees = total - payees;
        const montantTotal = list.reduce((s: number, f: any) => s + (f.montantDu || 0), 0);
        const montantPayees = list
          .filter((f: any) => f.statut === 'payee')
          .reduce((s: number, f: any) => s + (f.montantDu || 0), 0);
        setStats({
          total_factures: total,
          total_payees: payees,
          total_non_payees: nonPayees,
          montant_total: montantTotal,
          montant_payees: montantPayees,
          montant_non_payees: montantTotal - montantPayees,
        });
        setFacturesList([]);
      }
    } finally {
      setLoading(false);
    }
  }

  async function showList(type: 'all' | 'payees' | 'non') {
    if (!token) return;
    setListLoading(true);
    try {
      let data: any[] = [];
      if (type === 'all') data = await fetchAllFactures(token);
      else if (type === 'payees') data = await fetchFacturesPayees(token);
      else data = await fetchFacturesNonPayees(token);
      setFacturesList(data);
    } finally {
      setListLoading(false);
    }
  }

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false } // ← CORRIGÉ ICI
  );

  // Animations pour le header
  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [0, -280],
    extrapolate: 'clamp',
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100, 150],
    outputRange: [1, 0.5, 0],
    extrapolate: 'clamp',
  });

  const filterOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const titleScale = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.7],
    extrapolate: 'clamp',
  });

  const scrollToTop = () => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  if (loading || !stats) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Chargement des statistiques...</Text>
      </View>
    );
  }

  const StatutBadge = ({ statut }: { statut: string }) => (
    <View style={[styles.badge, statut === 'payee' ? styles.payee : styles.nonPayee]}>
      <Text style={styles.badgeText}>{statut === 'payee' ? 'Payée' : 'Non payée'}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header qui disparaît complètement */}
      <Animated.View 
        style={[
          styles.header,
          {
            transform: [{ translateY: headerTranslateY }],
            opacity: headerOpacity,
          }
        ]}
      >
        <Animated.Text 
          style={[
            styles.title,
            { transform: [{ scale: titleScale }] }
          ]}
        >
          📊 Tableau de Bord
        </Animated.Text>
        
        <Animated.View 
          style={[
            styles.filterSection,
            { opacity: filterOpacity }
          ]}
        >
          <View style={styles.filterRow}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Mois</Text>
              <TextInput
                style={styles.input}
                placeholder="01-12"
                placeholderTextColor="#94a3b8"
                keyboardType="numeric"
                value={month}
                onChangeText={setMonth}
                maxLength={2}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Année</Text>
              <TextInput
                style={styles.input}
                placeholder="2024"
                placeholderTextColor="#94a3b8"
                keyboardType="numeric"
                value={year}
                onChangeText={setYear}
                maxLength={4}
              />
            </View>
            
            <Pressable style={styles.filterButton} onPress={applyFilter}>
              <Text style={styles.filterButtonText}>🔍 Appliquer</Text>
            </Pressable>
          </View>
        </Animated.View>

        <View style={styles.cardsContainer}>
          <View style={styles.cardsRow}>
            <Card label="📋 Total" value={stats.total_factures} onPress={() => showList('all')} />
            <Card label="✅ Payées" value={stats.total_payees} onPress={() => showList('payees')} />
            <Card label="❌ Impayées" value={stats.total_non_payees} onPress={() => showList('non')} />
          </View>
          <View style={styles.cardsRow}>
            <Card label="💰 Total" value={`${stats.montant_total.toLocaleString()} FCFA`} />
            <Card label="💳 Payé" value={`${stats.montant_payees.toLocaleString()} FCFA`} />
          </View>
        </View>
      </Animated.View>

      {/* Utiliser AnimatedFlatList */}
      <AnimatedFlatList
        ref={flatListRef}
        style={styles.list}
        data={facturesList}
        keyExtractor={(item: any) => item.id.toString()}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ 
          paddingTop: 320,
          paddingBottom: 20,
          paddingHorizontal: 16,
        }}
        showsVerticalScrollIndicator={true}
        ListEmptyComponent={() =>
          !listLoading && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>📭 Aucune facture</Text>
              <Text style={styles.emptySubtitle}>
                {facturesList.length === 0 ? 
                  "Utilisez les boutons ci-dessus pour afficher les factures" : 
                  "Aucune facture ne correspond aux critères"
                }
              </Text>
            </View>
          )
        }
        renderItem={({ item }: { item: any }) => (
          <View style={styles.factureCard}>
            <View style={styles.factureHeader}>
              <Text style={styles.factureMontant}>{(item.montantDu as number)?.toLocaleString()} FCFA</Text>
              <StatutBadge statut={item.statut} />
            </View>
            
            {item.vehicule && typeof item.vehicule === 'object' && (
              <View style={styles.vehiculeInfo}>
                <Text style={styles.factureDetail}>
                  🚗 {item.vehicule.immatriculation} • {item.vehicule.type} • {item.vehicule.marque}
                </Text>
              </View>
            )}
            
            <View style={styles.factureFooter}>
              {item.dateEmission && typeof item.dateEmission === 'string' && (
                <Text style={styles.factureDate}>📅 {item.dateEmission}</Text>
              )}
              {item.conducteur && typeof item.conducteur === 'object' && (
                <Text style={styles.factureConducteur}>👤 {item.conducteur.prenom} {item.conducteur.nom}</Text>
              )}
            </View>
          </View>
        )}
      />
      
      {listLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={styles.loadingText}>Chargement des factures...</Text>
        </View>
      )}

      <Animated.View
        style={[
          styles.floatingButton,
          {
            opacity: scrollY.interpolate({
              inputRange: [100, 200],
              outputRange: [0, 1],
              extrapolate: 'clamp',
            }),
          },
        ]}
      >
        <Pressable onPress={scrollToTop} style={styles.floatingButtonPressable}>
          <Text style={styles.floatingButtonText}>⬆️</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

function Card({ label, value, onPress }: { label: string; value: any; onPress?: () => void }) {
  return (
    <Pressable 
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed
      ]} 
      onPress={onPress} 
      disabled={!onPress}
    >
      <Text style={styles.cardLabel}>{label}</Text>
      <Text style={styles.cardValue}>{value}</Text>
    </Pressable>
  );
}

// Garder les mêmes styles que précédemment...
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f8fafc' 
  },
  center: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#f8fafc'
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#64748b',
    fontWeight: '500'
  },
  header: {
    backgroundColor: '#ffffff',
    padding: 24,
    paddingBottom: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    height: 280,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 16,
    textAlign: 'center'
  },
  filterSection: {
    marginBottom: 16,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    gap: 12,
  },
  inputGroup: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748b',
    marginBottom: 6,
    marginLeft: 4,
  },
  input: {
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    color: '#1e293b',
    fontSize: 16,
    fontWeight: '500',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  filterButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#007bff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    minWidth: 100,
  },
  filterButtonText: { 
    color: '#ffffff', 
    fontWeight: '600', 
    fontSize: 14 
  },
  cardsContainer: {
    gap: 8,
  },
  cardsRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    gap: 8,
  },
  card: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    minHeight: 70,
  },
  cardPressed: {
    transform: [{ scale: 0.98 }],
    backgroundColor: '#f8fafc',
  },
  cardLabel: { 
    fontSize: 11, 
    color: '#64748b', 
    marginBottom: 4, 
    textAlign: 'center',
    fontWeight: '600',
  },
  cardValue: { 
    fontSize: 14, 
    fontWeight: '700', 
    color: '#1e293b' 
  },
  list: { 
    flex: 1,
  },
  factureCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#007bff',
  },
  factureHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 12 
  },
  factureMontant: { 
    fontSize: 18, 
    fontWeight: '700', 
    color: '#1e293b' 
  },
  vehiculeInfo: {
    marginBottom: 8,
  },
  factureDetail: { 
    fontSize: 14, 
    color: '#475569',
    fontWeight: '500'
  },
  factureFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  factureDate: { 
    fontSize: 12, 
    color: '#94a3b8',
    fontWeight: '500'
  },
  factureConducteur: { 
    fontSize: 12, 
    color: '#64748b',
    fontStyle: 'italic'
  },
  badge: { 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  payee: { 
    backgroundColor: '#10b981',
    borderWidth: 1,
    borderColor: '#059669'
  },
  nonPayee: { 
    backgroundColor: '#ef4444',
    borderWidth: 1,
    borderColor: '#dc2626'
  },
  badgeText: { 
    color: '#ffffff', 
    fontWeight: '600', 
    fontSize: 12 
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyTitle: { 
    textAlign: 'center', 
    color: '#475569', 
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtitle: {
    textAlign: 'center',
    color: '#94a3b8',
    fontSize: 14,
    lineHeight: 20,
  },
  loadingContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  floatingButtonPressable: {
    backgroundColor: '#007bff',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  floatingButtonText: {
    fontSize: 20,
    color: '#ffffff',
  },
});