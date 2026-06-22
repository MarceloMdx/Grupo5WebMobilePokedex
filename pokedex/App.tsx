    import { createStackNavigator } from '@react-navigation/stack'
    import { NavigationContainer } from '@react-navigation/native'

    import Pokemon from './src/app/screens/Pokemon'
    import PokemonBusca from './src/app/screens/PokemonBusca'
    import PokemonDetails from './src/app/screens/PokemonDetails'

    export type RootStackParamList = {
    Pokemon: undefined;
    PokemonBusca: undefined;
    PokemonDetails: { url: string };
    };

    const Stack = createStackNavigator<RootStackParamList>();

    export default function App() {
        return (
            <NavigationContainer>
        <Stack.Navigator>
            
            <Stack.Screen
            name="Pokemon"
            component={Pokemon}
            options={{ title: 'Pokemon' }}
            />

            <Stack.Screen
            name="PokemonBusca"
            component={PokemonBusca}
            options={{ title: 'Busca Pokemon' }}
            />


            <Stack.Screen
            name="PokemonDetails"
            component={PokemonDetails}
            options={{ title: 'Detalhe Pokemon' }}
            />

        </Stack.Navigator>
        </NavigationContainer>
    );
    }