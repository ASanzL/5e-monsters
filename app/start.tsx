import  { Text, Image, View, StyleSheet, TouchableOpacity, ScrollView, Button } from 'react-native';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import { IMonster } from './monster-interface';


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

const Start = ({navigation}: any) => {
    
    const [monsters, setMonsters] = useState<IMonster[]>([]);
    const isFocused = useIsFocused();
    
    useEffect(() => {
        if (isFocused) {
            getMonsters();
        }
    }, [isFocused]);

    const getMonsters = async () => {
        let monsters: IMonster[] = [];
        // Get official monsters
        try {
            let storageValue = await AsyncStorage.getItem('monsters');
            storageValue = storageValue ? storageValue : "";
            
            let value: IMonster[] = JSON.parse(storageValue);
                        
            if (value !== null) {
                monsters = monsters.concat(value);
            } else {
                
            }
          } catch (error) {
            // Error retrieving data
          }

        // Get homebrew monsters
        try {
            let storageValue = await AsyncStorage.getItem('homebrew-monsters');
            storageValue = storageValue ? storageValue : "";
            
            let value: IMonster[] = JSON.parse(storageValue);
                        
            if (value !== null) {   
                monsters = monsters.concat(value);
            } else {
                
            }
          } catch (error) {
            // Error retrieving data
          }

          monsters.sort((a: IMonster, b: IMonster) => {                
            return a.index.localeCompare(b.index);
        });
        setMonsters(monsters);
    }
    
    if (monsters !== undefined && monsters.length !== 0) {
        return (
            <View>
            <Button onPress={() => navigation.navigate('Roller' )} title='Roll dice' />
            <Button onPress={() => navigation.navigate('AddMonster' )} title='Add monster' />
            <ScrollView>
                {monsters.map((monster) => 
                <TouchableOpacity style={styles.monsterBox} onPress={() => navigation.navigate('Monster', { index: monster.index, isHomebrew: true } )} key={monster.index}>
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