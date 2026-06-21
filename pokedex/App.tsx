import { View, Text, StyleSheet } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native'
import Pokemon from './src/app/screens/Pokemon'
import PokemonDetails from './src/app/screens/PokemonDetails'

export type RootStackParamList = {
Pokemon: undefined;              
PokemonDetails: { url: string };
};

export default function App() {
const Stack = createStackNavigator<RootStackParamList>()
return (
    <NavigationContainer>
        <Stack.Navigator>
            <Stack.Screen
                name="Pokemon"
                component={Pokemon}
                options={{ title: 'Pokemon' }}
            >
            </Stack.Screen>
            <Stack.Screen
                name="PokemonDetails"
                component={PokemonDetails}
                options={{ title: 'Detalhe Pokemon' }}
            >
            </Stack.Screen>
        </Stack.Navigator>
    </NavigationContainer>
);
}