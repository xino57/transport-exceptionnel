import { View, TextInput, Button, Text, StyleSheet, Modal } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { Obstacle } from "@/storage/storageObstacles";
import { useEffect } from "react";

type EditObstacleModalProps = {
  visible: boolean;
  onClose: () => void;
  obstacle: Obstacle | null;
  onUpdate: (id: string, updatedFields: Partial<Obstacle>) => Promise<void>;
  onUpdated?: () => void; 
};

export default function EditObstacleModal({
  visible,
  onClose,
  obstacle,
  onUpdate,
  onUpdated,
}: EditObstacleModalProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: obstacle?.title || "",
      description: obstacle?.description || "",
    },
  });

  useEffect(() => {
    if (obstacle) {
      reset({
        title: obstacle.title,
        description: obstacle.description,
      });
    }
  }, [obstacle, reset]);

  const onSubmit = async (data: any) => {
    if (obstacle) {
      await onUpdate(obstacle.id, {
        title: data.title,
        description: data.description,
      });
      onUpdated?.();
    }
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Modifier l’obstacle</Text>
          
          <Text style={styles.label}>Titre</Text>
          <Controller
            control={control}
            name="title"
            rules={{ required: "Titre obligatoire" }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                placeholder="Nom de l’obstacle"
                onChangeText={onChange}
                value={value}
                style={styles.input}
                accessibilityLabel="Saisir le titre"
              />
            )}
          />
          {errors.title && <Text style={styles.error}>{errors.title.message}</Text>}

          <Text style={styles.label}>Description</Text>
          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, value } }) => (
              <TextInput
                placeholder="Description"
                onChangeText={onChange}
                value={value}
                style={styles.input}
                accessibilityLabel="Saisir la description"
                multiline
              />
            )}
          />

          <View style={styles.buttons}>
            <Button title="Annuler" onPress={onClose} />
            <Button title="Mettre à jour" onPress={handleSubmit(onSubmit)} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
  modalContent: { width: "90%", padding: 20, backgroundColor: "#fff", borderRadius: 10, elevation: 5 },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 16, textAlign: "center" },
  label: { fontSize: 14, fontWeight: "600", marginBottom: 6, alignSelf: "flex-start" },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 8, marginBottom: 12, backgroundColor: "#f9f9f9", width: "100%" },
  buttons: { flexDirection: "row", justifyContent: "space-between", marginTop: 12 },
  error: { color: "red", marginBottom: 8, alignSelf: "flex-start" },
});
