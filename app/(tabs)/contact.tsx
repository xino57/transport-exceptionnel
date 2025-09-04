import React from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Linking, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const contacts = [
  { name: "Police", phone: "17" },
  { name: "Pompiers", phone: "18" },
  { name: "Mairie", phone: "01 23 45 67 89" },
  { name: "Responsable convoi", phone: "06 12 34 56 78" },
  { name: "Chef d'escorte", phone: "06 11 22 33 44" },
  { name: "Gendarmerie locale", phone: "03 12 34 56 78" },
];

export default function ContactsScreen() {
  const callNumber = async (rawPhone: string) => {
    const phone = rawPhone.replace(/\s+/g, "");
    const url = `tel:${phone}`;
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      Linking.openURL(url);
    } else {
      Alert.alert("Appel impossible", `Impossible d'ouvrir: ${rawPhone}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contacts</Text>

      <ScrollView contentContainerStyle={styles.scroll}>
        {contacts.map((c) => (
          <View key={c.name} style={styles.card}>
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{c.name}</Text>
                <Text style={styles.phone}>{c.phone}</Text>
              </View>

              <TouchableOpacity
                onPress={() => callNumber(c.phone)}
                accessibilityRole="button"
                accessibilityLabel={`Appeler ${c.name}`}
                style={styles.callBtn}
              >
                <Ionicons name="call" size={22} />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f5f6fa" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 16, textAlign: "center", marginTop: 30 },
  scroll: { paddingBottom: 20, alignItems: "center" },
  card: {
    width: "90%",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  row: { flexDirection: "row", alignItems: "center" },
  name: { fontSize: 18, fontWeight: "bold", marginBottom: 6 },
  phone: { fontSize: 16, color: "#333" },
  callBtn: {
    padding: 10,
    borderRadius: 999,
    backgroundColor: "#e9ecef",
    marginLeft: 12,
  },
});
