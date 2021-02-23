import React, {useState} from 'react'
import { View, Button, Text, ScrollView } from 'react-native'
import Icon from './loginRegisterIcon' ;
import FormField from './formfield' ;
import Title from './title' ;
import LogRegButton from './logRegButton' ;
import Warningtext from './warningtext' ;
import {apiAddress} from '../apiAddress' ;
const axios = require('axios');


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

  function pressButton() {
    const warnings = [];
    if (firstName.length == 0
      || lastName.length == 0
      || phoneNumber.length == 0
      || email.length == 0) {
        warnings.push('\nAll fields are required'); 
      }
    if (userName.length <= 3) {
      warnings.push('\nUsername must be longer than 2 characters')
    }
    if (password.length <= 5) {
      warnings.push('\nPassword must be longer than 5 characters')
    }
    if (password != confirmPassword) {
      warnings.push('\nPasswords are not matching')
    }
    if (warnings.length != 0 ) {
      alert(warnings);
    }
    else {
      axios.post(apiAddress+'users/register', {
        username: userName,
        password: password,
        fName: firstName,
        lName: lastName,
        phoneNumber: phoneNumber,
        email: email
      })
      .then(function (response) {
        props.navigation.navigate('login') ;
      })
      .catch((error) => {
        alert(error) ;
      })
    }
  }
  
  return (
    <View style={{flex: 1}}>
      <ScrollView>
        <Title paddingTop={'10%'} title='REGISTER'></Title>
        <Icon iconName='person-add-outline' />
        <FormField placeholder='Firstname' maxLength={20} secure={false} setTextField={setFirstName} textField={firstName}/> 
        <FormField placeholder='Lastname' maxLength={20} secure={false} setTextField={setLastName} textField={lastName}/> 
        <FormField placeholder='Username' maxLength={20} secure={false} setTextField={setUserName} textField={userName}/> 
        <FormField placeholder='phonenumber' maxLength={20} secure={false} setTextField={setPhoneNumber} textField={phoneNumber}/> 
        <FormField placeholder='email' maxLength={50} secure={false} setTextField={setEmail} textField={email}/> 
        <FormField placeholder='Password' maxLength={50} secure={true} setTextField={setPassword} textField={password}/> 
        <FormField placeholder='Confirm Password' maxLength={50} secure={true} setTextField={setConfirmPassword} textField={confirmPassword}/> 
        {passwordMatch}
        <LogRegButton text='Register' color='lightgrey' pressButton={pressButton}></LogRegButton>
        <Text style={{padding: 20, alignSelf:'center'}} onPress={() => props.navigation.navigate('login')}>
          <Text>I have already an account, </Text>
          <Text style={{textDecorationLine:'underline', color:'blue'}}>to login</Text>
        </Text>
      </ScrollView>
    </View>
  )
}
