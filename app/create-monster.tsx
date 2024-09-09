import  { Text, View, StyleSheet, TouchableOpacity, ScrollView, Button, TextInput } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { IMonster } from './monster-interface';
import AsyncStorage from '@react-native-async-storage/async-storage';


const styles = StyleSheet.create({
    main: {
        margin: 10,
    },
    inputBox: {
        backgroundColor: "lightyellow",
        padding: 5,
    },
    textInput: {
        fontSize: 20,
        borderWidth: 1,
        borderColor: "lightgray",
        padding: 2,
    }
  });

const Stack = createNativeStackNavigator();

const CreateMonster = ({navigation}: any) => {
    // Saved monsters on start screen
    const [monsters, setMonsters] = useState<IMonster[]>([]);
    
    const isFocused = useIsFocused();
    
    useEffect(() => {
        loadMonsters();
    }, [isFocused]);

    let monster: IMonster = {
        index: '',
        name: '',
        size: 'Medium',
        type: '',
        alignment: '',
        armor_class: [],
        hit_points: 0,
        hit_dice: '',
        hit_points_roll: '',
        speed: { walk: "30 ft." }, 
        strength: 0,
        dexterity: 0,
        constitution: 0,
        intelligence: 0,
        wisdom: 0,
        charisma: 0,
        proficiencies: [],
        damage_vulnerabilities: [],
        damage_resistances: [],
        damage_immunities: [],
        condition_immunities: [],
        senses: {  },
        languages: '',
        challenge_rating: 0,
        proficiency_bonus: 0,
        xp: 0,
        special_abilities: [],
        actions: [],
        legendary_actions: [],
        image: '',
        url: ''
    };

    const loadMonsters = async () => {
        try {
            const value = await AsyncStorage.getItem('homebrew-monsters');
            if (value !== null) {
                setMonsters(JSON.parse(value));
            } else {
                setMonsters([]);
            }
          } catch (error) {
            // Error retrieving data
          }
    }

    const saveMonster = async () => {
        try {
            console.log(monster.name);
            
            monsters.push(monster);
            await AsyncStorage.setItem(
            'homebrew-monsters',
            JSON.stringify(monsters),
            );
            navigation.navigate('Start');
        } catch (error) {
            // Error saving data
        }
    }

    const InputField = (props: { title: string, placeholder: string, onChange: any }) => {
        return (
            <View style={ styles.inputBox }>
                <Text>{ props.title }</Text>
                <TextInput 
                    style={styles.textInput}
                    onChangeText={ props.onChange }
                    placeholder={ props.placeholder }
                />
            </View>
        );
    }

    const onNameChange = (name: string) => {
        monster.name = name;
        
        let monsterIndex = name;
        monsterIndex = monsterIndex.toLowerCase();
        monsterIndex = monsterIndex.replaceAll(" ", "-");
        
        monster.index = monsterIndex;
    }
    
    return (
        <View style={styles.main}>
            <InputField title='Name' placeholder='Name of the monster' onChange={(value: any) => onNameChange(value)}/>

            <Button
                onPress={() => {
                    saveMonster();
                }}
                title='Save monster'
             />
        </View>
    );

}

export default CreateMonster;