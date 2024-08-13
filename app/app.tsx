import { NavigationContainer } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Monster from './monster';
import Start from './start';
import AddMonster from './add-monster';
import { useState } from 'react';
import Roller from './dice-roller';

const Stack = createNativeStackNavigator();

const App = () => {
    return (
        <NavigationContainer independent={true}>
            <Stack.Navigator>
                <Stack.Screen
                name="Start"
                component={Start}
                options={{ title: "Home page" }}
                />
                <Stack.Screen
                name="Monster"
                component={Monster}
                options={{ title: "Monster" }}
                />
                <Stack.Screen
                name="AddMonster"
                component={AddMonster}
                options={{ title: "Monsters" }}
                />
                <Stack.Screen
                name="Roller"
                component={Roller}
                options={{ title: "Roll dice" }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );

}

export default App;