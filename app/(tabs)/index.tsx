import React, { useState } from "react";
import { View, Text, Button, FlatList, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { useObstacles, Obstacle } from "@/storage/storageObstacles";
import EditObstacleModal from "@/components/EditObstacleModal";



export default function Index() {
  const { obstacles, removeObstacle, updateObstacle, reload } = useObstacles();


  const [modalVisible, setModalVisible] = useState(false);
  const [selectedObstacle, setSelectedObstacle] = useState<Obstacle | null>(null);

  const openEdit = (obstacle: Obstacle) => {
    setSelectedObstacle(obstacle);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Liste des obstacles sur votre route</Text>
      {obstacles.length > 0 ? (
        <FlatList
          data={obstacles}
          extraData={obstacles}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ alignItems: "center" }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Titre: {item.title}</Text>
              <Text style={styles.cardDescription}>Description: {item.description}</Text>
              {item.latitude && item.longitude && (
                <Text style={styles.cardCoords}>
                  Latitude: {item.latitude.toFixed(4)}, Longitude: {item.longitude.toFixed(4)}
                </Text>
              )}
              <Button title="Modifier" onPress={() => openEdit(item)} />
              <Button
                title="Supprimer"
                color="red"
                onPress={() => removeObstacle(item.id)}
              />
            </View>
          )}
        />
      ) : (
        <Text style={styles.emptyText}>Vous êtes chanceux, aucun obstacle sur votre route</Text>
      )}

      <EditObstacleModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        obstacle={selectedObstacle}
        onUpdate={updateObstacle}
        onUpdated={reload}
      />

      <View style={styles.buttons}>
        <View style={styles.buttonWrapper}>
          <Link href="/addObstacles" asChild>
            <Button title="Ajouter un obstacle" />
          </Link>
        </View>

        <View style={styles.buttonWrapper}>
          <Link href="/contact" asChild>
            <Button title="Voir les contacts utiles" />
          </Link>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 40,
    backgroundColor: "#f5f6fa",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    color: "#555",
    marginTop: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 12,
    width: 280,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  cardTitle: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    marginBottom: 6,
    textAlign: "center",
  },
  cardCoords: {
    fontSize: 13,
    marginBottom: 8,
    color: "#333",
  },
  buttons: {
    marginTop: 30,
    alignItems: "center",
  },
  buttonWrapper: {
    marginVertical: 6,
    width: 220,
  },
});
