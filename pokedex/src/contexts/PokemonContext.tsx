import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import axios from 'axios';

// 1. Atualizamos a interface para guardar o ID e a URL da Imagem
interface Pokemon {
name: string;
url: string;
id: number;
image: string;
}

interface PokemonContextData {
pokemons: Pokemon[];
loading: boolean;
error: string | null;
refreshPokemons: () => Promise<void>;
}

interface PokemonProviderProps {
children: ReactNode;
}

const PokemonContext = createContext<PokemonContextData>({} as PokemonContextData);

export function PokemonProvider({ children }: PokemonProviderProps) {
const [pokemons, setPokemons] = useState<Pokemon[]>([]);
const [loading, setLoading] = useState<boolean>(true);
const [error, setError] = useState<string | null>(null);

const fetchPokemons = async () => {
try {
    setLoading(true);
    const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=20');
    
    // 2. Mapeamos os resultados para extrair o ID e gerar o link da imagem usando a sua constante
    const imageBaseUrl = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon";
    
    const formattedPokemons = response.data.results.map((pokemon: { name: string; url: string }) => {
    // Extrai o ID cortando a barra final da URL da PokeAPI (ex: ".../pokemon/1/" vira "1")
    const id = Number(pokemon.url.split('/').filter(Boolean).pop());
    
    return {
        ...pokemon,
        id,
        image: `${imageBaseUrl}/${id}.png` // Monta o link final da imagem (.png)
    };
    });

    setPokemons(formattedPokemons);
    setError(null);
} catch (err) {
    setError('Não foi possível carregar os Pokémon.');
    console.error(err);
} finally {
    setLoading(false);
}
};

useEffect(() => {
fetchPokemons();
}, []);

return (
<PokemonContext.Provider value={{ pokemons, loading, error, refreshPokemons: fetchPokemons }}>
    {children}
</PokemonContext.Provider>
);
}

export function usePokemon() {
return useContext(PokemonContext);
}