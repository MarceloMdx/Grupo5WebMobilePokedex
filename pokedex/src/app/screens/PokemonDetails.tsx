import { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ActivityIndicator, Image } from 'react-native'
interface pokemonInfo{
  name:string;
  height:number;
  sprites:{
    front_default:string;
  }
}

interface PokemonDetailsProps {
  route: {
    params: {
      url: string;
    };
  };
}

export default function PokemonDetails({ route }: PokemonDetailsProps) {

  let url = route.params.url;


  const [pokemons, setPokemons] = useState<pokemonInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()

  console.log('route', route.params.url)

  async function getDetails() {
    setLoading(true)
    try {
      const response = await fetch(url)
      const data = await response.json();
      setPokemons(data);
      console.log("data:", data)
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
    getDetails();
  }, [])

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator animating={loading} size={'small'} color={"#d30d0d"} />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Pokemon Detalhe</Text>
        <Image style={styles.image} source={{ uri: pokemons?.sprites.front_default }}></Image>
        <Text style={styles.title}>{pokemons?.name}</Text>
        <Text style={styles.title}>{pokemons?.height}</Text>
      </View>



    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 2,
    alignItems: "center",

  },
  title: {
    fontSize: 24,
    paddingBottom: 12,
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
    justifyContent:"center",
    alignItems: "center",

  },
  image: {
    margin: 6,
    width: 120,
    height: 120,
  },

})