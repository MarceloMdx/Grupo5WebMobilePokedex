import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ListRenderItem,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from 'react-native'
import React, { useEffect, useState } from 'react'

const IMAGE = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon"

type PokemonProps = {
  name: string;
  url: string;
}

function getPokemonImage(url: string) {
  const pokemonId = url.split('/').filter(Boolean).pop();
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
    )
  }

  async function listarPokemons() {
    setLoading(true)
    setError(undefined)
    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon?limit=20&offset=${offset}`
      );
      const data = await response.json()
      setPokemons(data.results)

      if (!response.ok) {
        throw new Error("Não foi possível carregar os pokémons")
      }

    } catch (error: any) {
      console.error('Ocorreu um erro:', error.message);
      setError(error.message)

    } finally {
      setTimeout(() => {
        setLoading(false)
      }, 1000)
    }
  }

  useEffect(() => {
    listarPokemons();
  }, [offset])

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator animating={loading} size="large" color="#7c3aed" />
        <Text style={styles.loadingText}>Carregando Pokémons...</Text>
      </View>
    )
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
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pokédex</Text>

      <FlatList
        data={pokemons}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.pageButton, offset === 0 && styles.pageButtonDisabled]}
          disabled={offset === 0}
          onPress={() => setOffset(offset - 20)}
        >
          <Text style={[styles.pageButtonText, offset === 0 && styles.pageButtonTextDisabled]}>
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
    </View>
  )
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
    fontWeight: 'bold',
    color: '#4a1c96',
    textAlign: 'center',
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
    color: '#7c3aed',
    fontSize: 15,
    fontWeight: '500',
  },
  listContent: {
    paddingBottom: 8,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#cebceb",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 10,
    width: '48%',
    alignItems: 'center',
    shadowColor: '#4a1c96',
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
    color: '#2d0a6e',
    marginBottom: 8,
    textAlign: 'center',
  },
  detailButton: {
    backgroundColor: '#7c3aed',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 14,
  },
  detailButtonText: {
    color: '#fff',
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
    borderTopColor: '#d8c8f0',
  },
  pageButton: {
    backgroundColor: '#7c3aed',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  pageButtonDisabled: {
    backgroundColor: '#c4b5d8',
  },
  pageButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },
  pageButtonTextDisabled: {
    color: '#eee',
  },
  pageIndicator: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4a1c96',
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#f0eaf8',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 12,
  },
  errorIcon: {
    fontSize: 48,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2d0a6e',
  },
  errorMessage: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 8,
    backgroundColor: '#7c3aed',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 28,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
})
