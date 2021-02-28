import React, {useState, useEffect} from 'react'
import { View, Text } from 'react-native'
import DropDown from './dropDown';
import {apiAddress} from '../apiAddress' ;
const axios = require('axios');


export default function search(props) {

  const [searchActive, changeActivity]  = useState(false)
  const [searchCategory, setSearchCategory] = useState(null)
  const [searchCity, setSearchCity] = useState(null)
  const [citiesFromServer, setCities] = useState('')

  useEffect(() => {
    axios.get(apiAddress+'cities')
    .then((response) => {
      setCities(response.data);
    })
    .catch((error) => {
      alert(error) ;
    })
  },[]);


  function searchItems() {
    axios.get(apiAddress+'items', {
      params: {
        category: searchCategory,
        city: searchCity
      }
    })
    .then((response) => {
      props.setItems(response.data);
    })
    .catch((error) => {
      alert(error) ;
    })
  }

  function searchActivity() {
    if (searchActive == true) {
      setSearchCategory(null);
      setSearchCity(null);
      searchItems();
    }
    changeActivity(!searchActive);
  }

  const cities = [
    {label: 'nothing', value: null},
  ]


  function getCities() {
    for (let i = 0; i<citiesFromServer.length; i++) {
      cities.push({label: citiesFromServer[i], value: citiesFromServer[i]}) ;
    }
  }

  getCities();



  let output ;
  if(searchActive == true) {
    output = 
    <View>
      <DropDown items={props.categories} placeHolder='Search by category' onChangeItem={setSearchCategory} searchItems={searchItems}/>
      <DropDown items={cities} placeHolder='Search by city' onChangeItem={setSearchCity} searchItems={searchItems}/>
    </View>
  }

  return (
    <View>
      <Text style={{paddingLeft: 30, paddingBottom:10, paddingTop:10}} onPress={()=> searchActivity()}>Press for search options</Text>
      {output}
    </View>
  )
}
