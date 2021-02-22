import React, {useState} from 'react'
import { View, Text, Button } from 'react-native'
import Icon from './loginRegisterIcon' ;
import FormField from './formfield' ;
import Title from './title' ;
import LogRegButton from './logRegButton' ;

export default function login(props) {

  const [userName, setUserName] = useState('') ;
  const [password, setPassword] = useState('') ;

  function pressButton() {
    if (userName.length == 0 || password.length == 0 ) {
      alert('Username and password fields are both required'); 
    }
  }

  return (
    <View>
      <Title title='LOGIN'></Title>
      <Icon iconName='person-outline' />
      <FormField placeholder='Username' maxLength={20} secure={false} setTextField={setUserName} textField={userName}/> 
      <FormField placeholder='Password' maxLength={20} secure={true} setTextField={setPassword} textField={password}/>
      <LogRegButton pressButton={pressButton} color='lightgrey' text='Login'></LogRegButton>
      <Text style={{padding:20}} onPress={() => props.navigation.navigate('register')}>Don't have account yet, to register</Text>
      <Text style={{padding:20}} onPress={() => props.navigation.navigate('main')}>I want to browse without login, to shop</Text>
    </View>
  )
}
