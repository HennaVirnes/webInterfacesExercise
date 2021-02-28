import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer, StackActions } from '@react-navigation/native' ;
import { createStackNavigator, HeaderBackground } from '@react-navigation/stack' ;
import Login from './components/loginRegister/login' ;
import Register from './components/loginRegister/register' ;
import Main from './components/main' ;
import NewItem from './components/newItem' ;
import AddPhoto from './components/photosForNewItem' ;
import AllPosts from './components/usersposts/allPosts';
import ModifyPost from './components/usersposts/modifyPost';
import OneItemView from './components/items/oneItemView';
import * as SecureStore from 'expo-secure-store';
const axios = require('axios');
import {apiAddress} from './components/apiAddress' ;

const Stack = createStackNavigator();

export default function App() {

  const [loggedIn, logInOut] = useState(false)
  const [items, setItems] = useState([])
  const [createdId, setCreatedId] = useState('')
  const [userId, setUserId] = useState('')
  const [accessToken, setAccessToken] = useState('')

  // useEffect(() => {
  //     axios.get(apiAddress+'items')
  //     .then((response) => {
  //       setItems(response.data);
  //     })
  //     .catch((error) => {
  //       alert(error) ;
  //     })
  //     getToken();
  //     getUserId();
  // },[]);
    useEffect(() => {
      getToken();
      getUserId();
  },[]);

  const categories = [
    {label: 'nothing', value: null},
    {label: 'other', value: 'other'},
    {label: 'clothes', value: 'clothes'},
    {label: 'mugs', value: 'mugs'},
    {label: 'animals', value: 'animals'},
    {label: 'toys', value: 'toys'},
    {label: 'electronics', value: 'electronics'},
    {label: 'garden', value: 'garden'},
    {label: 'cars', value: 'cars'},
    {label: 'furniture', value: 'furniture'}
  ]


  async function getToken() {
    let result = await SecureStore.getItemAsync('token');
    if (result) {
      logInOut(true);
      setAccessToken(result);
    } else {
      logInOut(false);
    }
  }

  async function getUserId() {
    let result = await SecureStore.getItemAsync('userId');
    if (result) {
      logInOut(true);
      setUserId(result);
    } else {
      logInOut(false);
    }
  }

  async function logOut() {
    await SecureStore.deleteItemAsync('token');
    await SecureStore.deleteItemAsync('userId');
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
          {props => <Main {...props} loggedIn={loggedIn} logOut={logOut} items={items} categories={categories} />}  
        </Stack.Screen>
        <Stack.Screen name="login">
          {props => <Login {...props} logInOut={logInOut} setUserId={setUserId} />}  
        </Stack.Screen>
        <Stack.Screen name="register"  options={{ title: '' }}>
          {props => <Register {...props} />}  
        </Stack.Screen>
        <Stack.Screen name="new item">
          {props => <NewItem {...props} categories={categories} setCreatedId={setCreatedId}/>}  
        </Stack.Screen>
        <Stack.Screen name="addPhoto">
          {props => <AddPhoto {...props} createdId={createdId}/>}  
        </Stack.Screen>
        <Stack.Screen name="allPosts" options={{ title: 'My posts' }}>
          {props => <AllPosts {...props} userId={userId} accessToken={accessToken}/>}  
        </Stack.Screen>
        <Stack.Screen name="modifyPost" options={{ title: 'Modify' }}>
          {props => <ModifyPost {...props} categories={categories} accessToken={accessToken}/>}  
        </Stack.Screen>
        <Stack.Screen name="one item" options={{ title: 'Details' }}>
          {props => <OneItemView {...props} />}  
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

