import { View, TextInput, Button, Text, StyleSheet } from "react-native";
import { useForm, Controller } from "react-hook-form";
import * as Location from "expo-location";
import { useObstacles } from "@/storage/storageObstacles";
import { router } from "expo-router";
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { useState } from "react";

export default function AddObstacle() {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: { title: "", description: "" },
    });

    const { addObstacle } = useObstacles();
    const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

    const getLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status === "granted") {
            const loc = await Location.getCurrentPositionAsync({});
            setCoords({ lat: loc.coords.latitude, lng: loc.coords.longitude });
        } else {
            console.log("Permission refusée");
        }
    };

    const onSubmit = async (data: any) => {
        const newObstacle = {
            id: uuidv4(),
            title: data.title,
            description: data.description,
            latitude: coords?.lat,
            longitude: coords?.lng,
        };

        console.log("Obstacle:", newObstacle);
        await addObstacle(newObstacle);
        router.back();
    };

    return (
        <View style={styles.container}>
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
                    />
                )}
            />
            {errors.title && <Text style={styles.error}>{errors.title.message}</Text>}

            <Controller
                control={control}
                name="description"
                render={({ field: { onChange, value } }) => (
                    <TextInput
                        placeholder="Description"
                        onChangeText={onChange}
                        value={value}
                        style={styles.input}
                    />
                )}
            />

            <View style={styles.buttonWrapper}>
                <Button title="Ajouter ma position GPS" onPress={getLocation} />
            </View>

            {coords && (
                <Text style={styles.coords}>
                    Latitude: {coords.lat.toFixed(4)} | Longitude: {coords.lng.toFixed(4)}
                </Text>
            )}

            <View style={styles.buttonWrapper}>
                <Button title="Enregistrer" onPress={handleSubmit(onSubmit)} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
        backgroundColor: "#f5f6fa",
    },
    input: {
        width: "80%",
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        borderRadius: 8,
        marginBottom: 12,
        backgroundColor: "#fff",
    },
    buttonWrapper: {
        width: "80%",
        marginTop: 10,
    },
    coords: {
        marginVertical: 12,
        fontSize: 16,
        fontWeight: "500",
        color: "#333",
    },
    error: {
        color: "red",
        marginBottom: 8,
    },
});
