import React, { useState } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import InvoiceCard from "@/components/InvoiceCard";
import { Invoice } from "@/types/invoice";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation";

type Props = NativeStackScreenProps<RootStackParamList, "Dashboard">;

export default function DashboardScreen({ navigation }: Props) {
  // Données mock pour l’instant
  const [invoices] = useState<Invoice[]>([
    { id: 1, title: "Taxe Moto Septembre", amount: 5000, status: "unpaid" },
    { id: 2, title: "Taxe Moto Août", amount: 5000, status: "paid" },
  ]);

  return (
    <View style={styles.container}>
      <FlatList
        data={invoices}
        keyExtractor={(i) => i.id.toString()}
        renderItem={({ item }) => (
          <InvoiceCard
            invoice={item}
            onPress={() =>
              navigation.navigate("Invoice", { invoiceId: item.id })
            }
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, padding: 8 } });
