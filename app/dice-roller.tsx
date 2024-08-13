import  { Text, Image, View, StyleSheet, TouchableOpacity, ScrollView, Button, TextInput, LogBox } from 'react-native';
import { useState, useEffect } from 'react';
import { useIsFocused } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { DiceRoller } from 'dice-roller-parser';



const styles = StyleSheet.create({
    searchBar: {
        fontSize: 25,
        margin: 15,
        padding: 6,
        backgroundColor: "lightblue",
    },
    rollOutput: {
        fontSize: 100,
        textAlign: "center",
        margin: 20,
    },
    rollOutputDetailed: {
        fontSize: 16,
        marginLeft: 10,
    },
  });

const Stack = createNativeStackNavigator();

const Roller = ({ route, navigation }) => {
    const { rollProp } = route.params ? route.params : "";    
    
    const [rollString, setRollString] = useState(rollProp ? rollProp : "");
    const [rollOutput, setRollOutput] = useState("");
    const [rollOutputDetailed, setRollOutputDetailed] = useState([]);
    const [rollOutputDetailedString, setRollOutputDetailedString] = useState("");
    const isFocused = useIsFocused();
    
    const diceRoller = new DiceRoller();
    let roll;

    useEffect(() => {
        if (isFocused) {

        }
    }, [isFocused]);

    const makeRoll = () => {
        try {
            // roll = diceRoller.roll("{2d20 + 5, 3d4 + 20}");
            // roll = diceRoller.roll("2d20 + 5 + 3d4 + 20[Fire]");
            roll = diceRoller.roll(rollProp);
            setRollOutput(roll.value);
            setRollOutputDetailedString(setDetailedOutput(roll));
                        
            return roll.value;           
        } catch (e) {
            return -1;
        }
    }

    const setDetailedOutput = (roll) => {     
        const rollsToJSX = (rolls, label) => {            
            return rolls.map((r, index) => {                                                            
                return (<Text style={styles.rollOutputDetailed} key={index}>d{r.die}({label}): {r.value}</Text>);
            });     
        }
        if (roll.dice) {            
            if (Array.isArray(roll.dice)) {                
                return roll.dice.map((d, index) => {                    
                    if (Array.isArray(d.rolls)) {
                        return rollsToJSX(d.rolls, d.label);
                    } else if (d.dice) {
                        return d.dice.map((d2, index) => {
                            if (d2.rolls) {                                                                                                
                                return rollsToJSX(d2.rolls, d.dice[1].label);
                            } else if (d2.type === "number") {
                                return (<Text style={styles.rollOutputDetailed} key={index}>Constant({d2.label}): {d2.value}</Text>);
                            }
                        })
                    } else if (d.type === "number") {                        
                        return (<Text style={styles.rollOutputDetailed} key={index}>Constant({d.label}): {d.value}</Text>);
                    }
                });
                 
            }
        }  
    }

   return (
   <View>
        <TextInput 
            style={styles.searchBar}
            placeholder='roll string'
            value={rollString}
            onChangeText={(value) => {
                setRollOutput("");
                setRollOutputDetailedString("");
                setRollString(value);                
            }
        }
        />
        <Button style={styles.searchBox} onPress={() => {
            setRollOutput(makeRoll());            
        }
            
        } title='Roll' />

        <ScrollView>
            <Text style={styles.rollOutput}>{ rollOutput }</Text>
        </ScrollView>

        { rollOutputDetailedString }

   </View>)
   ;
}



export default Roller;