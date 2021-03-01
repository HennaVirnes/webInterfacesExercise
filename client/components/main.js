import React, {useState, useEffect} from 'react'
import { View, Text, ScrollView } from 'react-native'
import Item from './items/item' ;
import Search from './search/search' ;
import {apiAddress} from './apiAddress' ;
const axios = require('axios');

export default function main(props) {

  const [itemsBySearch, setItems] = useState(props.items)

  function getItems() {
    axios.get(apiAddress+'items')
    .then((response) => {
      setItems(response.data);
    })
    .catch((error) => {
      alert(error) ;
    })
  }
  
  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      getItems();
  }); return unsubscribe; },[props.navigation]);

  let outputEmptySearch ;

  if(itemsBySearch.length == 0) {
    outputEmptySearch = 'No items with given search parameters' ;
  }

  let loginLogout =
  <>
    <Text style={{padding: 20}} onPress={props.logOut}>logout</Text>
    <Text style={{padding: 20}} onPress={() => props.navigation.navigate('new item')}>Create new item</Text>
    <Text style={{padding: 20}} onPress={() => props.navigation.navigate('allPosts')}>See your posts</Text>
  </>

  if (props.loggedIn == false) {
    loginLogout =
    <Text style={{padding: 20}} onPress={() => props.navigation.navigate('login')}>to login</Text>
  }

  return (
    <View style={{flex:1}}>
      <ScrollView>
        <Search setItems={setItems} categories={props.categories}></Search>
        {itemsBySearch.map(item => <Item navigation={props.navigation} item={item} key={item.id} price={item.askingPrice} title={item.title} location={item.location.city} source={item.imageNames[0]}/>)}
        {loginLogout}
        <Text style={{alignSelf:'center', height: 500, fontSize: 20}}>{outputEmptySearch}</Text>
      </ScrollView>
    </View>
  )
}
