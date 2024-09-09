import  { Text, View, StyleSheet, ScrollView, TouchableOpacity, TextInput, Button } from 'react-native';
import { useState, useEffect } from 'react';
import React from 'react';
import { IMonster } from './monster-interface';

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
        height: "80%",
    }
  });

const AddMonster = ({ route, navigation }: any) => {
    const [monsters, setMonsters] = useState<IMonster[]>([]);
    const [searchQuery, setSearchQuery] = useState();

    const getMonsters = async (query?: string | undefined) => {
        let response;
        
        if (query !== undefined) {
            response = await fetch('https://www.dnd5eapi.co/api/monsters/?name=' + query);
        } else {
            response = await fetch('https://www.dnd5eapi.co/api/monsters/');
        }
        response = await response.json();
        let monsters: IMonster[] = response.results;
        
        let tempMonster: IMonster = {
            index: "aaaa",
            name: "Temp monster",
            size: 'Medium',
            type: "Tiny",
            alignment: 'Chaotic evil',
            armor_class: [{ type: "natural", value: 18 }],
            hit_points: 420,
            hit_dice: 'd12',
            hit_points_roll: '150d4 + 20',
            speed: { walk: "100f" },
            strength: 20,
            dexterity: 20,
            constitution: 20,
            intelligence: 20,
            wisdom: 20,
            charisma: 20,
            proficiencies: [],
            damage_vulnerabilities: [],
            damage_resistances: [],
            damage_immunities: [],
            condition_immunities: [],
            senses: {},
            languages: 'Common',
            challenge_rating: 99,
            proficiency_bonus: 8,
            xp: 99999,
            special_abilities: [],
            actions: [{
                "name": "Claw",
                "desc": "Melee Weapon Attack: +11 to hit, reach 5 ft., one target. Hit: 13 (2d6 + 6) slashing damage.",
                "attack_bonus": 11,
                "damage": [
                    {
                        "damage_type": {
                            "index": "slashing",
                            "name": "Slashing",
                            "url": "/api/damage-types/slashing"
                        },
                        "damage_dice": "2d6+6"
                    }
                ],
                "actions": []
            }],
            legendary_actions: [],
            image: '',
            url: ''
        };

        monsters.push(tempMonster);

        monsters.sort((a: IMonster, b: IMonster) => {                
            return a.index.localeCompare(b.index);
        });
        
        setMonsters(monsters);
    }

    useEffect(() => {
        getMonsters();
    }, []);

    const search = (value: string) => {
        getMonsters(value);
    }

    return (
        <View>
            <Button
                onPress={() => {
                    navigation.navigate("CreateMonster");
                }}
                title='Create new monster'
             />
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