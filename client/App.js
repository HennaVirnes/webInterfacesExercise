import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer, StackActions } from '@react-navigation/native' ;
import { createStackNavigator } from '@react-navigation/stack' ;
import login from './components/loginRegister/login' ;
import register from './components/loginRegister/register' ;
import main from './components/main' ;

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer> 
      <Stack.Navigator>
        <Stack.Screen name="main" component={main} option={{title: 'shop'}} />
        <Stack.Screen name="login" component={login} />
        <Stack.Screen name="register" component={register} options={{ title: '' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


