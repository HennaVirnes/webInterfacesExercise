import React, {useState, useEffect} from 'react'
import { View, Text } from 'react-native'
import FormField from './loginRegister/formfield' ;
import DropDown from './search/dropDown' ;
import CheckBox from '@react-native-community/checkbox';
import Button from './loginRegister/logRegButton' ;
import {apiAddress} from './apiAddress' ;
import * as SecureStore from 'expo-secure-store';
import Warningtext from './loginRegister/warningtext';


const axios = require('axios');



export default function newItem(props) {

const [title, setTitle] = useState('')
const [description, setDescription] = useState('')
const [category, setCategory] = useState('')
const [zipCode, setZipCode] = useState('')
const [city, setCity] = useState('')
const [askingPrice, setAskingPrice] = useState('')
const [shipping, setShipping] = useState(false)
const [pickUp, setPickUp] = useState(false)
const [accessToken, setAccessToken] = useState('')

let zipCodeIsNumber ;
if(isNaN(zipCode)== true) {
  zipCodeIsNumber = (
    <Warningtext text='ZipCode must be number'/>
  ); 
}

let priceIsNumber ;
if(isNaN(askingPrice)== true) {
  priceIsNumber = (
    <Warningtext text='Price must be number'/>
  ); 
}

async function getAccessToken() {
  let result = await SecureStore.getItemAsync('token');
  setAccessToken(result) ;
}

React.useEffect(() => {
  getAccessToken();
}, []);


function pressButton() {
  const warnings = [];
  if (title.length == 0
    || description.length == 0
    || askingPrice.length == 0
    || city.length == 0) {
      warnings.push('\nPlease, fill all fields'); 
    }
  if (isNaN(zipCode)== true) {
    warnings.push('\nZip Code has invalid value')
  }
  if (shipping == false && pickUp == false) {
    warnings.push('\nYou must have delivery type selected')
  }
  if (!category) {
    warnings.push('\nPlease, select category')
  }
  if (warnings.length != 0 ) {
    alert(warnings);
  }
  else {
    axios.post(apiAddress+'items', {
      title: title,
      description: description,
      category: category,
      location: {
        zipCode: parseInt(zipCode),
        city: city
      },
      imageNames: [],
      askingPrice: parseInt(askingPrice),
      deliveryType: {
        shipping: shipping,
        pickup: pickUp
      }
    }, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })
    .then(function (response) {
      props.navigation.navigate('addPhoto', {itemId: response.data.id}) ;
    })
    .catch((error) => {
      alert(error) ;
    })
  }
}

  return (
    <View style={{padding: 20}}>
      <Text style={{alignSelf:'center'}}>Create new item</Text>
      <FormField placeholder='Title' maxLength={50} secure={false} setTextField={setTitle} textField={title}/> 
      <FormField placeholder='Description' maxLength={200} secure={false} setTextField={setDescription} textField={description}/>
      <DropDown items={props.categories} placeHolder='Category' onChangeItem={setCategory}/>
      <FormField placeholder='Zip Code' maxLength={7} secure={false} setTextField={setZipCode} textField={zipCode}/> 
      {zipCodeIsNumber}
      <FormField placeholder='City' maxLength={20} secure={false} setTextField={setCity} textField={city}/> 
      <FormField placeholder='Price' maxLength={10} secure={false} setTextField={setAskingPrice} textField={askingPrice}/> 
      {priceIsNumber}
      <Text>Delivery</Text>
      <View style={{flexDirection:'row'}}>
        <CheckBox value = {shipping} onValueChange={(newValue) => setShipping(newValue)}/>
        <Text style ={{paddingTop: 5}}>Shipping</Text>
      </View>
      <View style={{flexDirection:'row'}}>
        <CheckBox value = {pickUp} onValueChange={(newValue) => setPickUp(newValue)}/>
        <Text style ={{paddingTop: 5}}>Pickup</Text>
      </View>
      <Button pressButton={pressButton} color='lightgrey' text='Submit'></Button>
    </View>
  )
}
