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

function capitalize(name: string) {
return name.charAt(0).toUpperCase() + name.slice(1);
}

export default function PokemonBusca({ navigation }: any) {
const [pokemons, setPokemons] = useState<PokemonProps[]>([]);
const [busca, setBusca] = useState("");
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | undefined>();

async function listarPokemons() {
    setLoading(true);
    setError(undefined);
    try {
    const response = await fetch(
        "https://pokeapi.co/api/v2/pokemon?limit=9999"
    );
    const data = await response.json();
    setPokemons(data.results);
    } catch (err: any) {
    console.error("Ocorreu um erro:", err.message);
    setError(err.message);
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
    <ActivityIndicator size="large" color="#7c3aed" />
    <Text style={styles.loadingText}>Carregando Pokémons...</Text>
    </View>
    );
}

if (error) {
    return (
    <View style={styles.errorContainer}>
    <Text style={styles.errorIcon}>⚠️</Text>
    <Text style={styles.errorTitle}>Algo deu errado</Text>
    <Text style={styles.errorMessage}>{error}</Text>
    <TouchableOpacity style={styles.retryButton} onPress={listarPokemons}>
    <Text style={styles.retryButtonText}>Tentar novamente</Text>
    </TouchableOpacity>
    </View>
    );
}

return (
    <View style={styles.container}>
    <Text style={styles.title}>Busca de Pokémon</Text>

    <TextInput
    style={styles.input}
    placeholder="Digite o nome do Pokémon..."
    placeholderTextColor="#a78bbf"
    value={busca}
    onChangeText={setBusca}
    />

    <FlatList
    data={pokemonsFiltrados}
    keyExtractor={(item) => item.name}
    numColumns={2}
    columnWrapperStyle={styles.columnWrapper}
    contentContainerStyle={styles.listContent}
    showsVerticalScrollIndicator={false}
    renderItem={({ item }) => (
        <TouchableOpacity
        style={styles.card}
        activeOpacity={0.75}
        onPress={() => navigation.navigate("PokemonDetails", item)}
    >
            <Image
            style={styles.image}
            source={{ uri: getPokemonImage(item.url) }}
            />
            <Text style={styles.pokemonName}>{capitalize(item.name)}</Text>
            <View style={styles.detailButton}>
            <Text style={styles.detailButtonText}>Ver detalhes →</Text>
            </View>
        </TouchableOpacity>
        )}
    />
    </View>
);
}

const styles = StyleSheet.create({
container: {
    flex: 1,
    backgroundColor: "#f0eaf8",
    paddingHorizontal: 10,
    paddingTop: 12,
},
    title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#4a1c96",
    textAlign: "center",
    marginBottom: 12,
    letterSpacing: 1,
},
    loading: {
    flex: 1,
    backgroundColor: "#f0eaf8",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
},
    loadingText: {
    color: "#7c3aed",
    fontSize: 15,
    fontWeight: "500",
},
    input: {
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: "#b39ddb",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 14,
    fontSize: 14,
    color: "#2d0a6e",
},
listContent: {
    paddingBottom: 8,
},
columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 10,
},
    card: {
    backgroundColor: "#cebceb",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 10,
    width: "48%",
    alignItems: "center",
    shadowColor: "#4a1c96",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
},
    image: {
    width: 72,
    height: 72,
    marginBottom: 6,
},
    pokemonName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#2d0a6e",
    marginBottom: 8,
    textAlign: "center",
},
    detailButton: {
    backgroundColor: "#7c3aed",
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 14,
  },
  detailButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
},
    errorContainer: {
    flex: 1,
    backgroundColor: "#f0eaf8",
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    gap: 12,
},
    errorIcon: {
    fontSize: 48,
},
    errorTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2d0a6e",
},
    errorMessage: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
},
    retryButton: {
    marginTop: 8,
    backgroundColor: "#7c3aed",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 28,
},
    retryButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
},
});
