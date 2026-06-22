import { getPokemonDescription } from "../util/getPokemonDescription";
import { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ActivityIndicator, Image, TouchableOpacity } from 'react-native'
import { PokemonTypeTranslation } from "../constants/pokemonTypes";
import { formatStats } from "../util/formatStats";
interface pokemonInfo {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number;

  sprites: {
    front_default: string;
    front_shiny: string;
  };

  types: {
    type: {
      name: string;
    };
  }[];

  abilities: {
    ability: {
      name: string;
    };
  }[];

  species: {
    url: string;
  };

  stats: {
    base_stat: number;
    stat: {
      name: string;
    };
  }[];
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
  const [error, setError] = useState<string | null>(null)
  const [showShiny, setShowShiny] = useState(false);
  const [speciesData, setSpeciesData] = useState<any>(null);
  const description = speciesData?getPokemonDescription(speciesData):"Carregando descrição...";
  const stats = formatStats(pokemons?.stats || []);

  

  console.log('route', route.params.url)

  async function getDetails() {
    setLoading(true)
    try {
      const response = await fetch(url)
      const data = await response.json();
      setPokemons(data);
      getDescription(data.species.url);
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

  async function getDescription(url: string) {
  try {
    const response = await fetch(url);
    const data = await response.json();

    setSpeciesData(data);
  } catch (error) {
    console.log(error);
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
        <Text style={styles.title}>Pokemon Detalhes</Text>
        <Image style={styles.image} source={{uri: showShiny?pokemons?.sprites.front_shiny:pokemons?.sprites.front_default}}/>
        <Text style={styles.name}> Nome: {pokemons?.name}</Text>
        <Text style={styles.id}> ID: {pokemons?.id}</Text>
        <Text style={styles.altura}> Altura: {pokemons?.height}</Text>
        <Text style={styles.peso}> Peso: {pokemons?.weight}</Text>
        <Text style={styles.experiencia}> Experiência: {pokemons?.base_experience}</Text>
        <Text style={styles.tipo}> Tipo: {" "} {pokemons?.types?.map(item => PokemonTypeTranslation[item.type.name] || item.type.name).join(", ")}</Text>
        <Text style={styles.habilidades}> Habilidades: {" "} {pokemons?.abilities?.map(item => item.ability.name).join(", ")}</Text>
        <Text style={styles.descricao}> {"\n"} Descrição: {"\n\n"} {description}</Text>

	<View style={styles.statsContainer}>
  	<Text style={styles.statsTitle}>Estatísticas</Text>

	<View style={styles.statsGrid}>
    	<View style={styles.statsColumn}>
      		<View style={styles.statRow}>
        	<Text style={styles.statLabel}>❤️ HP</Text>
        	<Text style={styles.statValue}>{stats.hp}</Text>
      	</View>

      	<View style={styles.statRow}>
  	<Text style={styles.statLabel}>⚔️ ATQ</Text>
        <Text style={styles.statValue}>{stats.attack}</Text>
	</View>

	<View style={styles.statRow}>
        <Text style={styles.statLabel}>🛡️ DEF</Text>
        <Text style={styles.statValue}>{stats.defense}</Text>
      	</View>
    </View>

    <View style={styles.statsColumn}>
      <View style={styles.statRow}>
        <Text style={styles.statLabel}>⚡ SPD</Text>
        <Text style={styles.statValue}>{stats.speed}</Text>
      </View>

      <View style={styles.statRow}>
        <Text style={styles.statLabel}>✨ SPC ATQ</Text>
        <Text style={styles.statValue}>{stats.specialAttack}</Text>
      </View>

      <View style={styles.statRow}>
        <Text style={styles.statLabel}>🛡️ SPC DEF</Text>
        <Text style={styles.statValue}>{stats.specialDefense}</Text>
      </View>
    </View>
  </View>
</View>

        <TouchableOpacity style={styles.button} onPress={() => setShowShiny(!showShiny)}>
          <Text style={styles.buttonText}> {showShiny ? "Ver imagem normal" : "Ver versão Shiny"}</Text>
          </TouchableOpacity>
        
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
  screenTitle: {
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
    width: "95%",

  },
  image: {
    margin: 6,
    width: 120,
    height: 120,
  },

  button: {
  backgroundColor: "#ef5350",

  padding: 10,

  borderRadius: 8,

  marginVertical: 10,
},

buttonText: {
  color: "#fff",

  fontWeight: "bold",
},



statsContainer: {
  marginTop: 20,
  padding: 15,
  backgroundColor: "#1e1e1e",
  borderRadius: 12,
  width: "100%",
},

statsTitle: {
  fontSize: 18,
  fontWeight: "bold",
  marginBottom: 15,
  color: "#fff",
  textAlign: "center",
},

statsGrid: {
  flexDirection: "row",
  justifyContent: "space-between",
},

statsColumn: {
  flex: 1,
  paddingHorizontal: 8,
},

statRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  paddingVertical: 8,
  borderBottomWidth: 0.5,
  borderBottomColor: "#333",
},

statLabel: {
  color: "#81d4fa",
  fontWeight: "bold",
  fontSize: 14,
},

statValue: {
  color: "#ffffff",
  fontWeight: "600",
  fontSize: 14,
},

})