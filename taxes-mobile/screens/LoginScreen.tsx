import React from "react";
import { View, StyleSheet } from "react-native";
import { Title } from "react-native-paper";

export default function LoginScreen() {
  return (
    <View style={styles.container}>
      <Title>Écran de connexion (à implémenter plus tard)</Title>
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, justifyContent: "center", alignItems: "center" } });