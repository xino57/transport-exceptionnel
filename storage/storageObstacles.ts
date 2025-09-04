import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";

export type Obstacle = {
  id: string;
  title: string;
  description: string;
  latitude?: number;
  longitude?: number;
};

export function useObstacles() {
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);

  const load = async () => {
    try {
      const data = await AsyncStorage.getItem("obstacles");
      if (data) {
        const parsed = JSON.parse(data);
        setObstacles(parsed);
      } else {
        setObstacles([]);
      }
    } catch (error) {
      console.error("Erreur lors du chargement:", error);
    }
  };


  useEffect(() => {
    load();
  }, []);


  useFocusEffect(
    useCallback(() => {
      load();
    }, [])
  );

  const save = async (list: Obstacle[]) => {
    try {
      setObstacles(list);
      await AsyncStorage.setItem("obstacles", JSON.stringify(list));
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
    }
  };


  const addObstacle = async (obs: Obstacle) => {
    try {
      const data = await AsyncStorage.getItem("obstacles");
      const current = data ? JSON.parse(data) : [];
      const updated = [...current, obs];
      await save(updated);
    } catch (error) {
      console.error("Erreur lors de l'ajout:", error);
    }
  };


  const removeObstacle = async (id: string) => {
    try {
      const updated = obstacles.filter((o) => o.id !== id);
      await save(updated);
    } catch (error) {
      console.error(" Erreur lors de la suppression:", error);
    }
  };

  return { obstacles, addObstacle, removeObstacle };
}
