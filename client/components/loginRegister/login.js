import React from 'react'
import { View, Text, Button } from 'react-native'
import Icon from './loginRegisterIcon' ;
import FormField from './formfield' ;
import Title from './title' ;
import LogRegButton from './logRegButton' ;

export default function login(props) {

  return (
    <View>
      <Title title='LOGIN'></Title>
      <Icon iconName='person-outline' />
      <FormField placeholder='Username' maxLength={20} secure={false}/> 
      <FormField placeholder='Password' maxLength={50} secure={true}/> 
      <LogRegButton text='Login'></LogRegButton>
      <Text onPress={() => props.navigation.navigate('register')}>Don't have account yet, to register</Text>
    </View>
  )
}
