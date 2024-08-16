import  { Text, Image, View, StyleSheet, Button, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const styles = StyleSheet.create({
    main: {
      padding: 10,
    },
    title: {
        fontSize: 30,
    },
    titleSmall: {
        fontSize: 26,
        marginTop: 8,
    },
    detailTextNormal: {
        fontSize: 17,
        textAlign: "center"
    },
    detailTextBold: {
        fontWeight: "bold",
        fontSize: 17,
        textAlign: "center"
    },
    line: {
        borderBottomColor: 'gray',
        borderBottomWidth: 2,
        marginTop: 15,
        marginBottom: 10,
    },
    statBox: {
        flexDirection: "row",
    },
    statCell: {
        flexDirection: "column",
        width: "33%",
        margin: 1,
        backgroundColor: "#e1eaf7",
        marginTop: 5,
        padding: 8,
        borderRadius: 5,
    },
    action: {
        backgroundColor: "#e1eaf7",
        marginTop: 5,
        padding: 4,
        borderRadius: 5,
    },
    multiattack: {
        padding: 3,
        borderRadius: 5,
        
    }
  });

const Monster = ({ route, navigation }) => {
    const { index } = route.params;
    const [monster, setMonster] = useState();
    const [monsters, setMonsters] = useState();
    
    const getMonster = async () => {
        let response = await fetch('https://www.dnd5eapi.co/api/monsters/' + index);
        response = await response.json();
        navigation.setOptions({title: response.name })
        setMonster(response);
    }
    
    useEffect(() => {
        getMonster();
        getMonsters();
    }, []);

    const addMonster = async () => {
        try {
            monsters.push(monster);
            await AsyncStorage.setItem(
            'monsters',
            JSON.stringify(monsters),
            );
            navigation.navigate('Start');
        } catch (error) {
            // Error saving data
        }
    }

    const removeMonster = async () => {
        let index = monsters.findIndex((m) => m.index === monster.index);
        monsters.splice(index, 1);
        try {
            await AsyncStorage.setItem(
            'monsters',
            JSON.stringify(monsters),
            );
            navigation.navigate('Start');            
        } catch (error) {
            // Error saving data
        }
    }

    const getMonsters = async () => {
        try {
            const value = await AsyncStorage.getItem('monsters');
            if (value !== null) {
                setMonsters(JSON.parse(value));
            } else {
                setMonsters([]);
            }
          } catch (error) {
            // Error retrieving data
          }
    }

    const UpdateListButton = () => {
        if (monsters.some((m) => m.index === monster.index)) {
            return (
                <Button 
                    onPress={removeMonster}
                    title='Remove from start screen'
                    color="#d1463d"
                />
            );
        } else {
            return (
                <Button 
                    onPress={addMonster}
                    title='Add to start screen'
                />
            );
        }
    }

    const DetailText = (props) => {
        let descString = props.desc;
        if (Array.isArray(props.desc)) {
            descString = descString.join(", ");
        }
        if (!props.hide) {
            return (
                <Text>
                <Text style={styles.detailTextBold}>{ props.title } </Text>
                <Text style={styles.detailTextNormal}>{ descString }</Text>
            </Text>
        );
        } else {
            return (
                <View></View>
            );
        }
    }

    const Line = (props) => {
        if (props.hide) {
            return (<View></View>);
        } else {
            return <View
                style={styles.line}
            />;
        }
    }

    const StatCell = (props) => {
        return (
            <View style={styles.statCell}>
                <Text style={styles.detailTextBold}>{ props.name }</Text>
                <Text style={styles.detailTextNormal}>{ props.value }</Text>
            </View>
        );
    }
    
    if(monster !== undefined) {
        const acString = monster.armor_class[0].value + " (" + monster.armor_class[0].type + " armor)";
        const hpString = monster.hit_points + " (" + monster.hit_points_roll + ")";
        let speedArray = [];
        for (const s in monster.speed) {
            let speedString = s === "walk" ? "" : s + " ";
            speedString += monster.speed[s];
            speedArray.push(speedString);
        }

        const getAbilityScore = (value) => {
            const score = Math.floor((value - 10) / 2);
            const sign =  score >= 0 ? "+" : "";
            return { score , string: value + " (" + sign + score + ")" };
        }

        const proficienciesStringArray = (typeString) => {
            let stringArray = [];

            monster.proficiencies.map((p) => {
                let string = "";
                if (String(p.proficiency.name).includes(typeString)) {
                    const nameIndex = p.proficiency.name.indexOf(": ");
                    string += p.proficiency.name.slice(nameIndex + 2) + " ";
                    string += p.value >= 0 ? "+" : "";
                    string += p.value;
    
                    stringArray.push(string);
                }
            });
            
            return stringArray.join(", ");
        }

        const objectToString = (object) => {
            let returnArray = [];
            Object.keys(object).map((k) => {
                returnArray.push(k + " " + object[k]);                
            });
            return returnArray.join(", ");
        }

        const getActionJSX = (action) => {                        
            if (action.name === "Multiattack" || action.dc) {
                return (
                <View style={styles.multiattack}>
                    <DetailText title={ action.name } desc={ action.desc } />
                </View>
                );
            }
            return (
            <TouchableOpacity style={styles.action} onPress={() => {
                const array = Array.from(action.damage, (d) => {                                    
                    return d.damage_dice + "["+ d.damage_type.index + "]";
                });
                let rollString = array.join(", ");
                
                navigation.navigate('Roller', { rollProp: "{".concat(rollString, "}") });
            }}>
                <DetailText title={ action.name } desc={ action.desc } />
            </TouchableOpacity>
            );
            
        }

        const getHPJSX = (hit_points, hit_points_roll) => {
            return (
                <TouchableOpacity style={styles.action} onPress={() => {
                    navigation.navigate('Roller', { rollProp: hit_points_roll + "[hitpoints]"
                     });
                }}>
                <DetailText title="Hit Points" desc={hit_points + " (" + hit_points_roll + ")"}  />
            </TouchableOpacity>
            );
        }

        const getStatJSX = (statAbbr, statScore) => {
            let abilityScore = getAbilityScore(statScore);
            console.log(abilityScore.score);
            
            return (
                <TouchableOpacity style={styles.statCell} onPress={() => {
                    navigation.navigate('Roller', { rollProp: "1d20 + " + abilityScore.score
                     });
                }}>
                <Text style={styles.detailTextBold}>{ statAbbr }</Text>
                <Text style={styles.detailTextNormal}>{ abilityScore.string }</Text>
            </TouchableOpacity>
            );
        }



        return (
            <ScrollView>
                <UpdateListButton />
                <View style={styles.main}>
                    <Text style={styles.title}>{ monster.name }</Text>
                    <Text style={styles.detailText}>{ monster.size } { monster.type }, { monster.alignment }</Text>

                    <Line />

                    <DetailText title="Armor class" desc={acString}  />
                    { getHPJSX(monster.hit_points, monster.hit_points_roll) }
                    <DetailText title="Speed" desc={speedArray.join(", ")}  />

                    <Line />

                    <View style={styles.statBox}>
                        { getStatJSX("STR", monster.strength) }
                        { getStatJSX("DEX", monster.dexterity) }
                        { getStatJSX("CON", monster.constitution) }
                    </View>
                    <View style={styles.statBox}>
                        { getStatJSX("INT", monster.intelligence) }
                        { getStatJSX("WIS", monster.wisdom) }
                        { getStatJSX("CON", monster.charisma) }
                    </View>

                    <Line />

                    <DetailText title="Saving Throws" desc={ proficienciesStringArray("Saving Throw") }  />
                    <DetailText title="Skills" desc={ proficienciesStringArray("Skill") }  />
                    <DetailText title="Damage Vulnerabilities" desc={monster.damage_vulnerabilities } hide={monster.damage_vulnerabilities.length === 0} />
                    <DetailText title="Damage Resistances" desc={monster.damage_resistances } hide={monster.damage_resistances.length === 0} />
                    <DetailText title="Damage Immunities" desc={monster.damage_immunities } hide={monster.damage_immunities.length === 0} />
                    <DetailText title="Senses" desc={ objectToString(monster.senses).replace("_", " ") } />
                    <DetailText title="Languages" desc={ monster.languages == "" ? "—" : monster.languages } />
                    <DetailText title="Challenge Rating" desc={ monster.challenge_rating + " (" + monster.xp + " XP)"} />
                    <DetailText title="Proficiency Bonus" desc={ monster.proficiency_bonus } />

                    <Line />

                    {
                        monster.special_abilities.map(ability =>
                            <DetailText title={ ability.name === "Legendary Resistance" ? ability.name + " (" + ability.usage.times + " " + ability.usage.type + ")" : ability.name } desc={ ability.desc } />
                        )
                    }

                    <Text style={styles.titleSmall}>Actions</Text>
                    <Line />

                    {
                        monster.actions.map(action => getActionJSX(action))
                    }
                    
                    { monster.legendary_actions.length > 0 && <Text style={styles.titleSmall}>Legendary Action</Text> }
                    <Line hide={ monster.legendary_actions.length === 0 } />

                    {
                        monster.legendary_actions.map(action =>
                            <DetailText title={ action.name } desc={ action.desc } />
                        )
                    }

                </View>
            </ScrollView>
        );
    } else {
        return (
            <View>
                <ActivityIndicator />
            </View>
        )
    }


}

export default Monster;