import React from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import { usePokemon } from '../contexts/PokemonContext';

export default function PokemonListScreen() {
const { pokemons, loading, error, refreshPokemons } = usePokemon();

if (loading) {
return (
    <View style={styles.center}>
    <ActivityIndicator size="large" color="#3B4CCA" />
    <Text style={styles.loadingText}>Carregando Pokédex...</Text>
    </View>
);
}

if (error) {
return (
    <View style={styles.center}>
    <Text style={styles.errorText}>{error}</Text>
    <TouchableOpacity style={styles.button} onPress={refreshPokemons}>
        <Text style={styles.buttonText}>Tentar Novamente</Text>
    </TouchableOpacity>
    </View>
);
}

return (
<SafeAreaView style={styles.container}>
    <Text style={styles.title}>Pokédex Inicial</Text>
    <FlatList
    data={pokemons}
    keyExtractor={(item) => item.name}
    onRefresh={refreshPokemons}
    refreshing={loading}
    renderItem={({ item }) => (
        <View style={styles.pokeCard}>
        {/* Renderiza a imagem do Pokémon vinda do estado */}
        <Image 
            source={{ uri: item.image }} 
            style={styles.pokeImage} 
        />
        <Text style={styles.pokeText}>
            #{item.id} - {item.name.toUpperCase()}
        </Text>
        </View>
    )}
    />
</SafeAreaView>
);
}

const styles = StyleSheet.create({
container: {
flex: 1,
backgroundColor: '#fff',
paddingTop: 20,
paddingHorizontal: 20,
},
center: {
flex: 1,
justifyContent: 'center',
alignItems: 'center',
backgroundColor: '#fff',
},
loadingText: {
marginTop: 10,
color: '#333',
fontSize: 16,
},
errorText: {
color: '#CC0000',
marginBottom: 15,
fontSize: 16,
textAlign: 'center',
},
title: {
fontSize: 26,
fontWeight: 'bold',
textAlign: 'center',
color: '#FFDE00',
textShadowColor: '#3B4CCA',
textShadowOffset: { width: 1, height: 1 },
textShadowRadius: 2,
marginBottom: 20,
},
pokeCard: {
flexDirection: 'row', // Coloca a imagem ao lado do texto
alignItems: 'center',
backgroundColor: '#f8f9fa',
padding: 10,
marginVertical: 8,
borderRadius: 10,
borderWidth: 1,
borderColor: '#e0e0e0',
elevation: 2,
shadowColor: '#000',
shadowOffset: { width: 0, height: 1 },
shadowOpacity: 0.2,
shadowRadius: 1.41,
},
pokeImage: {
width: 70,
height: 70,
marginRight: 15,
},
pokeText: {
fontSize: 16,
fontWeight: '600',
color: '#333',
},
button: {
backgroundColor: '#3B4CCA',
paddingVertical: 10,
paddingHorizontal: 20,
borderRadius: 5,
},
buttonText: {
color: '#fff',
fontWeight: 'bold',
},
});