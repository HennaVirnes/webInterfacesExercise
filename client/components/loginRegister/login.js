import React, {useState} from 'react'
import { View, Text, Button } from 'react-native'
import Icon from './loginRegisterIcon' ;
import FormField from './formfield' ;
import Title from './title' ;
import LogRegButton from './logRegButton' ;
import {apiAddress} from '../apiAddress' ;
import {encode, decode} from 'base-64' ;
import * as SecureStore from 'expo-secure-store';
const axios = require('axios');

if (!global.btoa) {
  global.btoa = encode;
  }
  
  if (!global.atob) {
  global.atob = decode;
  }

export default function login(props) {

  const [userName, setUserName] = useState('') ;
  const [password, setPassword] = useState('') ;

  async function saveToken(key, value) {
    await SecureStore.setItemAsync(key, value);
  }

  function pressButton() {
    if (userName.length == 0 || password.length == 0 ) {
      alert('Username and password fields are both required'); 
    }
    else {
      axios.post(apiAddress+'login', {}, {
        auth: {
          username: userName,
          password: password
        }
      })
      .then(function (response) {
        saveToken('userId', response.data.id);
        saveToken('token', response.data.token);
        props.logInOut(true);    
        props.navigation.navigate('main');
      })
      .catch((error) => {
        alert(error) ;
      })
    }
  }

  return (
    <View>
      <Title paddingTop={'20%'} title='LOGIN'></Title>
      <Icon iconName='person-outline' />
      <FormField placeholder='Username' maxLength={20} secure={false} setTextField={setUserName} textField={userName}/> 
      <FormField placeholder='Password' maxLength={50} secure={true} setTextField={setPassword} textField={password}/>
      <LogRegButton pressButton={pressButton} color='lightgrey' text='Login'></LogRegButton>
      <Text style={{padding:20, alignSelf:'center'}}>
        <Text>Don't have account yet, </Text>
        <Text style={{textDecorationLine:'underline', color:'blue'}} onPress={() => props.navigation.navigate('register')}>to register</Text>        
      </Text>
      <Text style={{padding:20, alignSelf:'center'}} onPress={() => props.navigation.navigate('main')}>
        <Text>I want to browse without login, </Text>
        <Text style={{textDecorationLine:'underline', color:'blue'}}>to shop</Text>
      </Text>
    </View>
  )
}
