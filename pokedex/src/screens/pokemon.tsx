
import { FlatList, StyleSheet, Text, View } from 'react-native';

export default function Pokemon (){
    const URL = "https://pokeapi.co/api/v2/pokemon?limit=20"
    

    return(
        <View style={styles.container}>
            <Text style={styles.title}>Lista de pokemons</Text>
        </View>
    )};


    const styles = StyleSheet.create({
        container:{
            flex:1,
            backgroundColor:"#f1111",
            alignItems:"flex-start",
            justifyContent:"flex-start",
            padding: 10
        },
        title:{
            fontSize:24
        }
    });