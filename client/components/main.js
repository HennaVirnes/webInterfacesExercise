import React, {useState} from 'react'
import { View, Text, ScrollView } from 'react-native'
import Item from './items/item' ;
import Search from './search/search' ;

export default function main(props) {

  const [itemsBySearch, setItems] = useState(null)

  // const items= [
  //   {
  //     source: 'https://anna.fi/wp-content/uploads/s/f/ruokaohje/931589-red_velvet_kakku.jpg',
  //     askingPrice: '10',
  //     title: 'delicious cake mamma mia this is so good!',
  //     location: 'Raahe',
  //     id: 1
  //   },
  //   {
  //     source: 'https://i.insider.com/5484d9d1eab8ea3017b17e29?width=600&format=jpeg&auto=webp',
  //     askingPrice: '1000000',
  //     title: 'doggy',
  //     location: 'Hetta',
  //     id: 2
  //   }
  // ]


  let items ;
  let outputEmptySearch ;

  if(itemsBySearch == null) {
    items = props.items ;
  }
  else {
    items = itemsBySearch ;
  }
  if(items.length == 0) {
    outputEmptySearch = 'No items with given search parameters' ;
  }

  function setItemsToSearchedItems(newItems) {
    setItems(newItems);
    items = newItems ;
  }

  let loginLogout =
  <>
    <Text style={{padding: 20}} onPress={props.logOut}>logout</Text>
    <Text style={{padding: 20}} onPress={() => props.navigation.navigate('new item')}>Create new item</Text>
  </>

  if (props.loggedIn == false) {
    loginLogout =
    <Text style={{padding: 20}} onPress={() => props.navigation.navigate('login')}>to login</Text>
  }

  return (
    <View style={{flex:1}}>
      <ScrollView>
        <Search setItems={setItemsToSearchedItems} categories={props.categories}></Search>
        <Text style={{alignSelf:'center'}}>All</Text>
        {items.map(item => <Item key={item.id} price={item.askingPrice} title={item.title} location={item.location.city} source={item.imageNames[0]}/>)}
        {loginLogout}
        <Text style={{alignSelf:'center', height: 500, fontSize: 20}}>{outputEmptySearch}</Text>
      </ScrollView>
    </View>
  )
}
