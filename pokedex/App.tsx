import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { PokemonProvider } from './src/contexts/PokemonContext';
import PokemonListScreen from './src/screens/pokemon';

export default function App() {
return (
<PokemonProvider>
    <StatusBar style="auto" />
    <PokemonListScreen />
</PokemonProvider>
);
}