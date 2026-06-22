import { getPokemonDescription } from "../util/getPokemondescription";
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
    backgroundColor: '#dddddd',
    padding: 16,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  image: {
    width: 180,
    height: 180,
    resizeMode: 'contain',
    marginVertical: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 90,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111',
    textTransform: 'capitalize',
    marginBottom: 8,
  },
  id: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
    marginBottom: 12,
  },
  altura: {
    fontSize: 16,
    color: '#444',
    marginBottom: 4,
  },
  peso: {
    fontSize: 16,
    color: '#444',
    marginBottom: 4,
  },
  experiencia: {
    fontSize: 16,
    color: '#444',
    marginBottom: 4,
  },
  tipo: {
    fontSize: 16,
    fontWeight: '600',
    color: '#d30d0d',
    marginVertical: 6,
  },
  habilidades: {
    fontSize: 15,
    color: '#555',
    fontStyle: 'italic',
    marginBottom: 10,
  },
  descricao: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    paddingBottom: 12,
    width: '100%',
    marginVertical: 12,
  },
  // Seção de Estatísticas (Stats)
  statsContainer: {
    width: '100%',
    backgroundColor: '#fcfcfc',
    borderRadius: 15,
    padding: 14,
    borderWidth: 1,
    borderColor: '#eee',
    marginVertical: 15,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statsColumn: {
    flex: 1,
    paddingHorizontal: 6,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    // Pequena sombra para os blocos de status
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  statLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#222',
  },
  // Botão Shiny
  button: {
    backgroundColor: '#d30d0d',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    marginTop: 10,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#d30d0d',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});