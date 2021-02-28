import React, {useState, useEffect} from 'react'
import { View, Text } from 'react-native'
import Item from '../items/item'
import {apiAddress} from '../apiAddress' ;

const axios = require('axios');

export default function allPosts(props) {

const [items, setItems] = useState('')
const [modal, setModal] = useState(false)
const [itemId, setItemId] = useState('')


function getItems() {
  axios.get(apiAddress+'items/'+props.userId)
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
});
return unsubscribe;},[props.navigation]);


function deleteItem(itemId) {
  axios.delete(apiAddress+'items/'+itemId, {headers: {
    'Authorization': `Bearer ${props.accessToken}`
  }})
  .then((response) => {
    setModal(false);
    setItemId('');
  })
  .catch((error) => {
    console.log(error) ;
  })
}

let deleteOrNot ;

if (modal == true) {
  deleteOrNot = 
  <View style={{position:'absolute', top: 250, borderRadius: 10, padding:10, backgroundColor:'white', height: 200, width: 250, alignSelf:'center' }}>
    <Text style={{flex: 2, textAlign:'center', fontSize:25}}>Do you really want to delete this item?</Text>
    <View style={{flex: 1, flexDirection:'row', justifyContent: 'space-evenly', paddingTop: 20}}>
      <Text onPress={() => deleteItem(itemId)} style={{backgroundColor: 'red', borderRadius: 5, height: 30, width: 80, textAlign:'center', padding: 5, fontWeight:'bold'}}>DELETE</Text>
      <Text onPress={cancelDelete} style={{backgroundColor: 'lightgrey', borderRadius: 5, height: 30, width: 80, textAlign:'center', padding: 5, fontWeight:'bold'}}>CANCEL</Text>
    </View>
  </View>
}
function askForDelete(id) {
  setModal(true);
  setItemId(id)
}

function cancelDelete() {
  setModal(false);
  setItemId('');
}

function modifyItem(item){
  props.navigation.navigate('modifyPost', item );
}

  let output = 
  <View>
    <Text>You don't have any posts yet</Text>
  </View>

  if(items.length > 0) {
    output = 
    <>
      {items.map(item => <Item key={item.id} 
                               id={item.id} 
                               price={item.askingPrice} 
                               title={item.title} 
                               location={item.location.city} 
                               source={item.imageNames[0]}
                               item ={item}
                               navigation={props.navigation}
                               delete={askForDelete}
                               modify={modifyItem}/>
      )}
    </>
  }


  return (
    <View>
      {output}
      {deleteOrNot}
    </View>
  )
}
