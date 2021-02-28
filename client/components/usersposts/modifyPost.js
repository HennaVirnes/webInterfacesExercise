import React, {useState} from 'react'
import { View, Text, Image } from 'react-native'
import FormField from '../loginRegister/formfield' ;
import DropDown from '../search/dropDown' ;
import CheckBox from '@react-native-community/checkbox';
import Button from '../loginRegister/logRegButton' ;
import {apiAddress} from '../apiAddress' ;
import Warningtext from '../loginRegister/warningtext';

const axios = require('axios');

export default function modifyPost(props) {
  
  const [title, setTitle] = useState(props.route.params.title)
  const [description, setDescription] = useState(props.route.params.description)
  const [category, setCategory] = useState(props.route.params.category)
  const [zipCode, setZipCode] = useState((props.route.params.location.zipCode).toString())
  const [city, setCity] = useState(props.route.params.location.city)
  const [askingPrice, setAskingPrice] = useState((props.route.params.askingPrice).toString())
  const [shipping, setShipping] = useState(props.route.params.deliveryType.shipping)
  const [pickUp, setPickUp] = useState(props.route.params.deliveryType.pickup)

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
    axios.put(apiAddress+'items/'+ props.route.params.id , {
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
        'Authorization': `Bearer ${props.accessToken}`
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
      <Text style={{alignSelf:'center'}}>Modify this item:</Text>
      <Image source={{uri: props.route.params.imageNames[0]}} style={{width: 100, height: 100, alignSelf:'center'}}></Image>
      <FormField placeholder='Title' maxLength={50} secure={false} setTextField={setTitle} textField={title}/> 
      <FormField placeholder='Description' maxLength={200} secure={false} setTextField={setDescription} textField={description}/>
      <DropDown defaultValue={category} items={props.categories} placeHolder='Category' onChangeItem={setCategory}/>
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
