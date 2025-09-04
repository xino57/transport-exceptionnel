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
      setObstacles(data ? JSON.parse(data) : []);
    } catch (error) {
      console.error("Erreur lors du chargement:", error);
    }
  };

  const reload = useCallback(load, []);

  useEffect(() => {
    load();
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [])
  );

  const persist = async (list: Obstacle[]) => {
    try {
      await AsyncStorage.setItem("obstacles", JSON.stringify(list));
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
    }
  };

  const addObstacle = async (obs: Obstacle) => {
    setObstacles(prev => {
      const updated = [...prev, obs];
      persist(updated);
      return updated;
    });
  };

  const removeObstacle = async (id: string) => {
    setObstacles(prev => {
      const updated = prev.filter(o => o.id !== id);
      persist(updated);
      return updated;
    });
  };

  const updateObstacle = async (id: string, updatedFields: Partial<Obstacle>) => {
    setObstacles(prev => {
      const updated = prev.map(o => (o.id === id ? { ...o, ...updatedFields } : o));
      persist(updated);
      return updated;
    });
  };

  return { obstacles, addObstacle, removeObstacle, updateObstacle, reload };
}
