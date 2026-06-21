import { View, Text, StyleSheet, FlatList, ListRenderItem, ActivityIndicator, Image, TouchableOpacity, Button } from 'react-native'
import React, { useEffect, useState } from 'react'

const IMAGE = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon"

type PokemonProps = {
  name: string;
  url: string;
}

function getPokemonImage(url: string) {
  const pokemonId = url.split('/').filter(Boolean).pop();
  console.log("pokeid:", `${IMAGE}/${pokemonId}.png`)
  return (
    `${IMAGE}/${pokemonId}.png`
  )
}


export default function Pokemon({ navigation }: any) {

  const [offset, setOffset] = useState(0);

  const [pokemons, setPokemons] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  const renderItem: ListRenderItem<PokemonProps> = ({ item }) => {
    return (
      <View style={styles.card}>
        <Text>{item.name}</Text>
        <Image style={styles.image} source={{
          uri: getPokemonImage(item.url),
        }} />
        <TouchableOpacity onPress={() => navigation.navigate("PokemonDetails", item)}>
          <Text>Detalhe</Text>
        </TouchableOpacity>

      </View>
    )
  }

  async function listarPokemons() {
    setLoading(true)
    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon?limit=20&offset=${offset}`
      );
      const data = await response.json()
      console.log('resposta', data.results)
      setPokemons(data.results)

      if (!response.ok) {
        throw new Error("Nao foi possivel carregar os pokemons")
      }

    } catch (error: any) {
      console.error('Ocorreu um erro:', error.message);
      setError(error.message)

    } finally {
      setTimeout(() => {
        setLoading(false)
      }, 1000) //arrumar depois

    }
  }

  useEffect(() => {
    listarPokemons();
  }, [offset])

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator animating={loading} size={'small'} color={"#d30d0d"} />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
            <TouchableOpacity
              disabled={offset === 0}
              onPress={() => setOffset(offset - 20)}
            >
              <Text>⬅ Anterior</Text>
            </TouchableOpacity>

            <Text>Página {offset / 20 + 1}</Text>

            <TouchableOpacity
              onPress={() => setOffset(offset + 20)}
            >
              <Text>Próximo ➡</Text>
            </TouchableOpacity>
          </View>
      <FlatList
        data={pokemons}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        scrollEnabled={true}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5", // Corrigido para 6 dígitos
    padding: 10,
  },
  title: {
    fontSize: 24,
  },
  loading: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#cebceb",
    margin: 4,
    borderRadius: 8,
    alignSelf: 'center',
    width: '45%',
    alignItems: 'center',
  },
  image: {
    margin: 6,
    width: 60,
    height: 60,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  }
})