import React, {useState} from 'react'
import { View, Text, Button } from 'react-native'
import Icon from './loginRegisterIcon' ;
import FormField from './formfield' ;
import Title from './title' ;
import LogRegButton from './logRegButton' ;

export default function login(props) {

  const [userName, setUserName] = useState('') ;
  const [password, setPassword] = useState('') ;

  return (
    <View>
      <Title title='LOGIN'></Title>
      <Icon iconName='person-outline' />
      <FormField placeholder='Username' maxLength={20} secure={false} setTextField={setUserName} textField={userName}/> 
      <FormField placeholder='Password' maxLength={20} secure={true} setTextField={setPassword} textField={password}/> 
      <LogRegButton text='Login'></LogRegButton>
      <Text onPress={() => props.navigation.navigate('register')}>Don't have account yet, to register</Text>
      <Text onPress={() => props.navigation.navigate('main')}>to shop</Text>

    </View>
  )
}
