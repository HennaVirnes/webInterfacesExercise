import React, {useState, useEffect} from 'react'
import { View, Text } from 'react-native'
import Item from '../items/item'
import {apiAddress} from '../apiAddress' ;

const axios = require('axios');

export default function allPosts(props) {

const [items, setItems] = useState('')


useEffect(() => {
  axios.get(apiAddress+'items/'+props.userId)
  .then((response) => {
    setItems(response.data);
  })
  .catch((error) => {
    alert(error) ;
  })
},[]);


function deleteItem(itemId) {
  axios.delete(apiAddress+'items/'+itemId, {headers: {
    'Authorization': `Bearer ${props.accessToken}`
  }})
  .then((response) => {
    alert('we deleted it')
  })
  .catch((error) => {
    console.log(error) ;
  })
}

  let output = 
  <View>
    <Text>You don't have any posts yet</Text>
  </View>

  if(items.length > 0) {
    output = 
    <>
      {items.map(item => <Item key={item.id} id={item.id} price={item.askingPrice} title={item.title} location={item.location.city} source={item.imageNames[0]} delete={deleteItem}/>
                        )}
    </>
  }


  return (
    <View>
      {output}
    </View>
  )
}
