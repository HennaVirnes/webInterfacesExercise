import React, {useState} from 'react'
import { View, Button, Text } from 'react-native'
import Icon from './loginRegisterIcon' ;
import FormField from './formfield' ;
import Title from './title' ;
import LogRegButton from './logRegButton' ;
import Warningtext from './warningtext'


export default function register(props) {

  const [firstName, setFirstName] = useState('') ;
  const [lastName, setLastName] = useState('') ;
  const [userName, setUserName] = useState('') ;
  const [phoneNumber, setPhoneNumber] = useState('') ;
  const [email, setEmail] = useState('') ;
  const [password, setPassword] = useState('') ;
  const [confirmPassword, setConfirmPassword] = useState('') ;


  let passwordMatch ;
  if(password != confirmPassword) {
    passwordMatch = (
      <Warningtext text='passwords are not matching'/>
    ); 
  }
  
  return (
    <View>
      <Title title='REGISTER'></Title>
      <Icon iconName='person-add-outline' />
      <FormField placeholder='Firstname' maxLength={20} secure={false} setTextField={setFirstName} textField={firstName}/> 
      <FormField placeholder='Lastname' maxLength={20} secure={false} setTextField={setLastName} textField={lastName}/> 
      <FormField placeholder='Username' maxLength={20} secure={false} setTextField={setUserName} textField={userName}/> 
      <FormField placeholder='phonenumber' maxLength={20} secure={false} setTextField={setPhoneNumber} textField={phoneNumber}/> 
      <FormField placeholder='email' maxLength={20} secure={false} setTextField={setEmail} textField={email}/> 
      <FormField placeholder='Password' maxLength={20} secure={true} setTextField={setPassword} textField={password}/> 
      <FormField placeholder='Confirm Password' maxLength={20} secure={true} setTextField={setConfirmPassword} textField={confirmPassword}/> 
      {passwordMatch}
      <LogRegButton text='Register'></LogRegButton>
      <Text onPress={() => props.navigation.navigate('login')}>I have already an account, to login</Text>
    </View>
  )
}
