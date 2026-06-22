import { Feather } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ListRenderItem,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
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

export default function Pokemon({ navigation }: any) {
  const [offset, setOffset] = useState(0);
  const [pokemons, setPokemons] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  const renderItem: ListRenderItem<PokemonProps> = ({ item }) => {
    return (
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
    );
  };

  async function listarPokemons() {
    setLoading(true);
    setError(undefined);
    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon?limit=20&offset=${offset}`,
      );
      const data = await response.json();
      setPokemons(data.results);

      if (!response.ok) {
        throw new Error("Não foi possível carregar os pokémons");
      }
    } catch (error: any) {
      console.error("Ocorreu um erro:", error.message);
      setError(error.message);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  }

  useEffect(() => {
    listarPokemons();
  }, [offset]);

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator animating={loading} size="large" color="#7c3aed" />
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
      <TouchableOpacity
        style={styles.searchButton}
        activeOpacity={0.75}
        onPress={() => navigation.navigate("PokemonBusca")}
      >
        <Feather name="search" size={18} color="#ffffff" />

        <Text style={styles.searchButtonText}>Buscar Pokémon</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.pageButton, offset === 0 && styles.pageButtonDisabled]}
          disabled={offset === 0}
          onPress={() => setOffset(offset - 20)}
        >
          <Text
            style={[
              styles.pageButtonText,
              offset === 0 && styles.pageButtonTextDisabled,
            ]}
          >
            ⬅ Anterior
          </Text>
        </TouchableOpacity>

        <Text style={styles.pageIndicator}>Página {offset / 20 + 1}</Text>

        <TouchableOpacity
          style={styles.pageButton}
          onPress={() => setOffset(offset + 20)}
        >
          <Text style={styles.pageButtonText}>Próximo ➡</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>Pokédex</Text>

      <FlatList
        data={pokemons}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        columnWrapperStyle={styles.columnWrappeper}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2a5db0",
    paddingHorizontal: 10,
    paddingTop: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#ffcb05',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: 1,
    textShadowColor: '#1d3f8f',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 1,
  },
  loading: {
    flex: 1,
    backgroundColor: "#2a5db0",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  loadingText: {
    color: '#ffcb05',
    fontSize: 15,
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    backgroundColor: "#2a5db0",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  errorIcon: {
    fontSize: 34,
    marginBottom: 10,
  },
  errorTitle: {
    color: "#ffcb05",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  errorMessage: {
    color: "#fff7d1",
    fontSize: 15,
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: "#ffcb05",
    borderWidth: 2,
    borderColor: "#1d3f8f",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 18,
  },
  retryButtonText: {
    color: "#1d3f8f",
    fontWeight: "bold",
  },
  listContent: {
    paddingBottom: 24,
  },
  columnWrappeper: {
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  list: {
    flex: 1,
    minHeight: 0,
    overflow: 'scroll',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 10,
  },
  card: {
    backgroundColor: "#fff7d1",
    borderWidth: 2,
    borderColor: '#ffcb05',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 10,
    width: '48%',
    alignItems: 'center',
    shadowColor: '#1d3f8f',
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
    fontWeight: '700',
    color: '#1d3f8f',
    marginBottom: 8,
    textAlign: 'center',
  },
  detailButton: {
    backgroundColor: '#ffcb05',
    borderWidth: 2,
    borderColor: '#2a5db0',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 14,
  },
  detailButtonText: {
    color: '#1d3f8f',
    fontSize: 12,
    fontWeight: '600',
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 6,
    borderTopWidth: 1,
    borderTopColor: '#ffcb05',
  },
  pageButton: {
    backgroundColor: '#ffcb05',
    borderWidth: 2,
    borderColor: '#1d3f8f',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  pageButtonDisabled: {
    backgroundColor: '#7fa3dc',
  },
  pageButtonText: {
    color: '#1d3f8f',
    fontWeight: '700',
    fontSize: 13,
  },
  pageButtonTextDisabled: {
    color: '#dbe8ff',
  },
  pageIndicator: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffcb05',
  },
  searchButton: {
  flexDirection: 'row',          // Coloca a lupa ao lado do texto
  alignItems: 'center',          // Alinha verticalmente no centro
  justifyContent: 'center',      // Centraliza o conteúdo horizontalmente
  backgroundColor: '#ffcb05',
  borderWidth: 2,
  borderColor: '#1d3f8f',
  paddingVertical: 12,
  paddingHorizontal: 24,
  borderRadius: 12,              // Cantos arredondados modernos
  gap: 10,                       // Espaçamento perfeito entre a lupa e o texto
  
  // Controla o tamanho para não esticar na tela inteira
  width: '90%',
  maxWidth: 320,
  alignSelf: 'center',           // Centraliza o botão na tela
  marginVertical: 15,

  // Sombra para dar profundidade (iOS)
  shadowColor: '#1d3f8f',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.2,
  shadowRadius: 5,
  // Sombra para Android
  elevation: 4, 
},

searchButtonText: {
  color: '#1d3f8f',
  fontSize: 16,
  fontWeight: '600',
},
})
