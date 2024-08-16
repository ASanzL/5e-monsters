import  { Text, Image, View, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useState, useEffect } from 'react';

const styles = StyleSheet.create({
    monsterBox: {
      marginLeft: 10,
    },
    title: {
        fontSize: 30,
    },
    monsterName: {
        fontSize: 18,
        padding: 5,
    },
    searchBar: {
        fontSize: 25,
        margin: 15,
        padding: 6,
        backgroundColor: "lightblue",
    },
    scrollView: {
        height: "85%",
    }
  });

const AddMonster = ({ route, navigation }) => {
    const [monsters, setMonsters] = useState([{ lol: "xD" }]);
    const [searchQuery, setSearchQuery] = useState();

    const getMonsters = async (query?: string | undefined) => {
        let response;
        
        if (query !== undefined) {
            response = await fetch('https://www.dnd5eapi.co/api/monsters/?name=' + query);
        } else {
            response = await fetch('https://www.dnd5eapi.co/api/monsters/');
        }
        response = await response.json();
        
        setMonsters(response.results);
    }

    useEffect(() => {
        getMonsters();
    }, []);

    const search = (value) => {
        getMonsters(value);
    }

    return (
        <View>
        <TextInput 
        style={styles.searchBar}
        cursorColor="black"
        placeholder='Search'
        onChangeText={(value) => {
            search(value);            
        }}
        value={searchQuery}
        />
        <ScrollView style={styles.scrollView}>
            {monsters.map((monster, index) => 
                <TouchableOpacity style={styles.monsterBox} onPress={() => navigation.navigate('Monster', { index: monster.index} )} key={index}>
                    <Text style={styles.monsterName}>{monster.name}</Text>
                </TouchableOpacity>
            )} 
        </ScrollView>
        </View>
    );

}

export default AddMonster;