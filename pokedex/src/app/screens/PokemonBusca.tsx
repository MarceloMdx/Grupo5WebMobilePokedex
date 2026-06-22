    import React, { useEffect, useState } from "react";
    import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
    } from "react-native";

    const IMAGE =
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon";

    type PokemonProps = {
    name: string;
    url: string;
    };

    function getPokemonImage(url: string) {
    const pokemonId = url.split("/").filter(Boolean).pop();
    return `${IMAGE}/${pokemonId}.png`;
    }

    export default function PokemonBusca({ navigation }: any) {
    const [pokemons, setPokemons] = useState<PokemonProps[]>([]);
    const [busca, setBusca] = useState("");
    const [loading, setLoading] = useState(false);

    async function listarPokemons() {
        setLoading(true);

        try {
        const response = await fetch(
            "https://pokeapi.co/api/v2/pokemon?limit=9999"
        );

        const data = await response.json();

        setPokemons(data.results);
        } catch (error) {
        console.log(error);
        } finally {
        setLoading(false);
        }
    }

    useEffect(() => {
        listarPokemons();
    }, []);

    const pokemonsFiltrados = pokemons.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(busca.toLowerCase())
    );

    if (loading) {
        return (
        <View style={styles.loading}>
            <ActivityIndicator size="large" color="#ef5350" />
        </View>
        );
    }

    return (
        <View style={styles.container}>
        <Text style={styles.title}>Busca de Pokémon</Text>

        <TextInput
            style={styles.input}
            placeholder="Digite o nome do Pokémon..."
            value={busca}
            onChangeText={setBusca}
        />

        <FlatList
            data={pokemonsFiltrados}
            keyExtractor={(item) => item.name}
            renderItem={({ item }) => (
            <View style={styles.card}>
                <Text style={styles.name}>{item.name}</Text>

                <Image
                style={styles.image}
                source={{
                    uri: getPokemonImage(item.url),
                }}
                />

                <TouchableOpacity
                style={styles.button}
                onPress={() =>
                    navigation.navigate("PokemonDetails", item)
                }
                >
                <Text style={styles.buttonText}>Ver detalhes</Text>
                </TouchableOpacity>
            </View>
            )}
        />
        </View>
    );
    }

    const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: "#2a5db0",
    },

    loading: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#2a5db0",
    },

    title: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 15,
        color: "#ffcb05",
        textShadowColor: "#1d3f8f",
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 1,
    },

    input: {
        backgroundColor: "#fff7d1",
        borderWidth: 2,
        borderColor: "#ffcb05",
        borderRadius: 8,
        padding: 12,
        marginBottom: 15,
        color: "#1d3f8f",
    },

    list: {
        flex: 1,
        minHeight: 0,
    },

    listContent: {
        paddingBottom: 20,
    },

    card: {
        backgroundColor: "#fff7d1",
        borderWidth: 2,
        borderColor: "#ffcb05",
        padding: 15,
        marginBottom: 10,
        borderRadius: 8,
        alignItems: "center",
        shadowColor: "#1d3f8f",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.16,
        shadowRadius: 4,
        elevation: 3,
    },

    name: {
        fontSize: 18,
        fontWeight: "bold",
        textTransform: "capitalize",
        color: "#1d3f8f",
    },

    image: {
        width: 80,
        height: 80,
        marginVertical: 10,
    },

    button: {
        backgroundColor: "#ffcb05",
        borderWidth: 2,
        borderColor: "#1d3f8f",
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 8,
    },

    buttonText: {
        color: "#1d3f8f",
        fontWeight: "bold",
    },
    });