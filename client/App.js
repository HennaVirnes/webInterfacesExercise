import { StatusBar } from 'expo-status-bar';
import React, {useState} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer, StackActions } from '@react-navigation/native' ;
import { createStackNavigator, HeaderBackground } from '@react-navigation/stack' ;
import Login from './components/loginRegister/login' ;
import Register from './components/loginRegister/register' ;
import Main from './components/main' ;
import * as SecureStore from 'expo-secure-store';
import { Header } from 'react-native/Libraries/NewAppScreen';

const Stack = createStackNavigator();

export default function App() {

  const [loggedIn, logInOut] = useState(false)

  getToken();

  async function getToken() {
    let result = await SecureStore.getItemAsync('token');
    if (result) {
      logInOut(true);
    } else {
      logInOut(false);
    }
  }

  async function logOut() {
    await SecureStore.deleteItemAsync('token');
    logInOut(false);
  }

  return (
    <NavigationContainer> 
      <Stack.Navigator 
        screenOptions={{
          headerStyle: {
            backgroundColor: '#DAF7A6'
          },
          headerTitleAlign:'center'
      }}>
        <Stack.Screen name="main" options={{ title: 'MarketPalace' }}>
          {props => <Main {...props} loggedIn={loggedIn} logOut={logOut} />}  
        </Stack.Screen>
        <Stack.Screen name="login">
        {props => <Login {...props} logInOut={logInOut} />}  
        </Stack.Screen>
        <Stack.Screen name="register"  options={{ title: '' }}>
        {props => <Register {...props} />}  
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}


// <Stack.Screen name="Home">
//   {props => <HomeScreen {...props} extraData={someData} />}
// </Stack.Screen>

