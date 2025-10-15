import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Invoice } from '@/types/invoice';

const fakeInvoices: Invoice[] = [
  { id: 1, title: 'Facture #001', amount: 10000, status: 'paid' },
  { id: 2, title: 'Facture #002', amount: 12500, status: 'unpaid' },
  { id: 3, title: 'Facture #003', amount: 8000, status: 'paid' },
];

export default function InvoiceScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const invoice = fakeInvoices.find(inv => inv.id.toString() === id);

  if (!invoice) {
    return (
      <View style={styles.container}>
        <Text>Facture introuvable</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{invoice.title}</Text>
      <Text>Montant : {invoice.amount} FCFA</Text>
      <Text>Status : {invoice.status === 'paid' ? 'Payé' : 'Non payé'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, justifyContent:'center', alignItems:'center', padding: 16 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
});
