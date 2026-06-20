import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Pokemon from './src/screens/pokemon'

export default function App() {
const Stack = createNativeStackNavigator<any>();
return (
<NavigationContainer>
<Stack.Navigator>
    <Stack.Screen
        name="Pokemon"
        component={Pokemon}
        options={{ title: 'Pokemon' }}
    >
    </Stack.Screen>
</Stack.Navigator>
</NavigationContainer>
);
}

const styles = StyleSheet.create({
container: {
flex: 1,
backgroundColor: '#fff',
alignItems: 'center',
justifyContent: 'center',
},
});
