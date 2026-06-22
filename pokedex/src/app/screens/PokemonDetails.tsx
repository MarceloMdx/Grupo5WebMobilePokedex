import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { PokemonTypeTranslation } from "../constants/pokemonTypes";
import { formatStats } from "../util/formatStats";
import { getPokemonDescription } from "../util/getPokemondescription";

interface PokemonInfo {
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

function capitalize(name?: string) {
  if (!name) {
    return "";
  }

  return name.charAt(0).toUpperCase() + name.slice(1);
}

export default function PokemonDetails({ route }: PokemonDetailsProps) {
  const url = route.params.url;

  const [pokemon, setPokemon] = useState<PokemonInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showShiny, setShowShiny] = useState(false);
  const [speciesData, setSpeciesData] = useState<any>(null);

  const description = speciesData
    ? getPokemonDescription(speciesData)
    : "Carregando descricao...";
  const stats = formatStats(pokemon?.stats || []);
  const imageUri = showShiny
    ? pokemon?.sprites.front_shiny
    : pokemon?.sprites.front_default;

  async function getDetails() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error("Nao foi possivel carregar os detalhes");
      }

      setPokemon(data);
      getDescription(data.species.url);
    } catch (error: any) {
      console.error("Ocorreu um erro:", error.message);
      setError(error.message);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
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
  }, []);

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator animating={loading} size="large" color="#ffcb05" />
        <Text style={styles.loadingText}>Carregando detalhes...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Algo deu errado</Text>
        <Text style={styles.errorMessage}>{error}</Text>
        <TouchableOpacity style={styles.button} onPress={getDetails}>
          <Text style={styles.buttonText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Text style={styles.title}>Detalhes do Pokemon</Text>

          <View style={styles.imageFrame}>
            {imageUri ? (
              <Image style={styles.image} source={{ uri: imageUri }} />
            ) : null}
          </View>

          <Text style={styles.name}>{capitalize(pokemon?.name)}</Text>
          <Text style={styles.id}>#{pokemon?.id}</Text>

          <View style={styles.infoGrid}>
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Altura</Text>
              <Text style={styles.infoValue}>{pokemon?.height} M</Text>
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Peso</Text>
              <Text style={styles.infoValue}>{pokemon?.weight} Kg</Text>
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Experiencia</Text>
              <Text style={styles.infoValue}>{pokemon?.base_experience} Exp</Text>
            </View>
          </View>

          <View style={styles.centerSection}>
            <Text style={styles.sectionLabel}>Tipo</Text>
            <Text style={styles.sectionText}>
              {pokemon?.types
                ?.map(
                  (item) =>
                    PokemonTypeTranslation[item.type.name] || item.type.name,
                )
                .join(", ")}
            </Text>
          </View>

          <View style={styles.centerSection}>
            <Text style={styles.sectionLabel}>Habilidades</Text>
            <Text style={styles.sectionText}>
              {pokemon?.abilities?.map((item) => item.ability.name).join(", ")}
            </Text>
          </View>

          <View style={styles.descriptionBox}>
            <Text style={styles.sectionLabel}>Descricao</Text>
            <Text style={styles.descriptionText}>{description}</Text>
          </View>

          <View style={styles.statsContainer}>
            <Text style={styles.statsTitle}>Estatisticas</Text>

            <View style={styles.statsGrid}>
              <View style={styles.statsColumn}>
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>❤️ HP</Text>
                  <Text style={styles.statValue}>{stats.hp}</Text>
                </View>

                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>⚔️  ATQ</Text>
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
                  <Text style={styles.statLabel}>✨ SP ATQ</Text>
                  <Text style={styles.statValue}>{stats.specialAttack}</Text>
                </View>

                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>🛡️ SP DEF</Text>
                  <Text style={styles.statValue}>{stats.specialDefense}</Text>
                </View>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.75}
            onPress={() => setShowShiny(!showShiny)}
          >
            <Text style={styles.buttonText}>
              {showShiny ? "Ver imagem normal" : "Ver versao Shiny"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2a5db0",
  },
  content: {
    padding: 10,
    paddingBottom: 24,
    alignItems: "center",
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2a5db0",
    gap: 12,
  },
  loadingText: {
    color: "#ffcb05",
    fontSize: 15,
    fontFamily: "Arial",
    fontWeight: "500",
  },
  errorContainer: {
    flex: 1,
    backgroundColor: "#2a5db0",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  errorTitle: {
    color: "#ffcb05",
    fontSize: 22,
    fontFamily: "Arial",
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  errorMessage: {
    color: "#fff7d1",
    fontSize: 15,
    fontFamily: "Arial",
    textAlign: "center",
    marginBottom: 16,
  },
  card: {
    width: "100%",
    maxWidth: 520,
    backgroundColor: "#fff7d1",
    borderWidth: 2,
    borderColor: "#ffcb05",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    shadowColor: "#1d3f8f",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.16,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontFamily: "Arial",
    fontWeight: "bold",
    color: "#ffcb05",
    marginBottom: 14,
    letterSpacing: 1,
    textAlign: "center",
    textShadowColor: "#1d3f8f",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 1,
  },
  imageFrame: {
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: "#ffffff",
    borderWidth: 2,
    borderColor: "#ffcb05",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  image: {
    width: 150,
    height: 150,
    resizeMode: "contain",
  },
  name: {
    fontSize: 22,
    fontFamily: "Arial",
    fontWeight: "bold",
    color: "#1d3f8f",
    textAlign: "center",
  },
  id: {
    fontSize: 16,
    fontFamily: "Arial",
    color: "#2a5db0",
    fontWeight: "600",
    marginBottom: 12,
  },
  infoGrid: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginBottom: 12,
  },
  infoBox: {
    flex: 1,
    minHeight: 64,
    backgroundColor: "#ffffff",
    borderWidth: 2,
    borderColor: "#ffcb05",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
  },
  infoLabel: {
    fontSize: 12,
    fontFamily: "Arial",
    fontWeight: "600",
    color: "#2a5db0",
    marginBottom: 4,
    textAlign: "center",
  },
  infoValue: {
    fontSize: 16,
    fontFamily: "Arial",
    fontWeight: "bold",
    color: "#1d3f8f",
    textAlign: "center",
  },
  centerSection: {
    width: "100%",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderWidth: 2,
    borderColor: "#ffcb05",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  sectionLabel: {
    fontSize: 13,
    fontFamily: "Arial",
    fontWeight: "bold",
    color: "#2a5db0",
    marginBottom: 4,
    textAlign: "center",
  },
  sectionText: {
    fontSize: 15,
    fontFamily: "Arial",
    color: "#1d3f8f",
    fontWeight: "600",
    textAlign: "center",
    textTransform: "capitalize",
  },
  descriptionBox: {
    width: "100%",
    backgroundColor: "#ffffff",
    borderWidth: 2,
    borderColor: "#ffcb05",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    alignItems: "center",
  },
  descriptionText: {
    fontSize: 14,
    fontFamily: "Arial",
    color: "#1d3f8f",
    textAlign: "center",
    lineHeight: 20,
  },
  statsContainer: {
    width: "100%",
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 12,
    borderWidth: 2,
    borderColor: "#ffcb05",
    marginBottom: 12,
    alignItems: "center",
  },
  statsTitle: {
    fontSize: 18,
    fontFamily: "Arial",
    fontWeight: "bold",
    color: "#1d3f8f",
    textAlign: "center",
    marginBottom: 12,
  },
  statsGrid: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  statsColumn: {
    flex: 1,
    gap: 8,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff7d1",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#ffcb05",
  },
  statLabel: {
    fontSize: 13,
    fontFamily: "Arial",
    fontWeight: "700",
    color: "#2a5db0",
  },
  statValue: {
    fontSize: 14,
    fontFamily: "Arial",
    fontWeight: "bold",
    color: "#1d3f8f",
  },
  button: {
    backgroundColor: "#ffcb05",
    borderWidth: 2,
    borderColor: "#1d3f8f",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: "90%",
    maxWidth: 320,
    alignItems: "center",
    alignSelf: "center",
    shadowColor: "#1d3f8f",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  buttonText: {
    color: "#1d3f8f",
    fontSize: 16,
    fontFamily: "Arial",
    fontWeight: "700",
    textAlign: "center",
  },
});
