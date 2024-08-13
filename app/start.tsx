import  { Text, Image, View, StyleSheet, TouchableOpacity, ScrollView, Button } from 'react-native';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';


const styles = StyleSheet.create({
    monsterBox: {
        backgroundColor: "lightblue",
        margin: 3,
        padding: 4,
        borderRadius: 2,
        shadowColor: "#000",
        shadowOffset: {
            width: 1,
            height: 2,
        },
        shadowOpacity: 1,
        shadowRadius: 2,

        elevation: 3,
    },
    addMonsterButton: {
        backgroundColor: "lightgray",
        padding: 8,
        fontSize: 30,
    },
    monsterName: {
        fontSize: 28,
    },
    monsterCr: {
        fontSize: 18,
    },
  });

const Stack = createNativeStackNavigator();

const Start = ({navigation}) => {
    
    const [monsters, setMonsters] = useState([]);
    const isFocused = useIsFocused();
    
    useEffect(() => {
        if (isFocused) {
            getMonsters();
        }
    }, [isFocused]);

    const getMonsters = async () => {
        try {
            let value = await AsyncStorage.getItem('monsters');
            
            value = JSON.parse(value);
            value.sort((a, b) => {                
                return a.index.localeCompare(b.index);
            });
                        
            if (value !== null) {
              setMonsters(value);
            } else {
                
            }
          } catch (error) {
            // Error retrieving data
          }
    }
    
    if (monsters !== undefined && monsters.length !== 0) {
        return (
            <View>
            <Button style={styles.searchBox} onPress={() => navigation.navigate('Roller' )} title='Roll dice' />
            <Button style={styles.searchBox} onPress={() => navigation.navigate('AddMonster' )} title='Add monster' />
            <ScrollView>
                {monsters.map((monster) => 
                <TouchableOpacity style={styles.monsterBox} onPress={() => navigation.navigate('Monster', { index: monster.index} )} key={monster.index}>
                    <Text style={styles.monsterName}>{monster.name}</Text>
                    <Text style={styles.monsterCr}>CR: {monster.challenge_rating}</Text>
                </TouchableOpacity>
            )} 
            </ScrollView>
    
            </View>
        );
    } else {
        return (
        <View>
            <TouchableOpacity style={styles.monsterBox} onPress={() => navigation.navigate('AddMonster' )}>
                <Text>Add monster</Text>
            </TouchableOpacity>
        </View>
        );
    }

}



export default Start;