import React from 'react'
import { View, Button, Text } from 'react-native'
import Icon from './loginRegisterIcon' ;
import FormField from './formfield' ;
import Title from './title' ;
import LogRegButton from './logRegButton' ;
import Warningtext from './warningtext'


export default function register(props) {

  let passwordMatch ;
   passwordMatch = (
     <Warningtext text='passwords are not matching'/>
   ); 
  
  return (
    <View>
      <Title title='REGISTER'></Title>
      <Icon iconName='person-add-outline' />
      <FormField placeholder='Firstname' maxLength={20} secure={false}/> 
      <FormField placeholder='Lastname' maxLength={20} secure={false}/> 
      <FormField placeholder='Username' maxLength={20} secure={false}/> 
      <FormField placeholder='phonenumber' maxLength={20} secure={false}/> 
      <FormField placeholder='email' maxLength={20} secure={false}/> 
      <FormField placeholder='Password' maxLength={20} secure={true}/> 
      <FormField placeholder='Confirm Password' maxLength={20} secure={true}/> 
      <LogRegButton text='Register'></LogRegButton>
      <Text onPress={() => props.navigation.navigate('login')}>I have already an account, to login</Text>
    </View>
  )
}
