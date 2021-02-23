import React from 'react'
import { View, Text, ScrollView } from 'react-native'
import Item from './items/item' ;

export default function main(props) {

  const items= [
    {
      source: 'https://anna.fi/wp-content/uploads/s/f/ruokaohje/931589-red_velvet_kakku.jpg',
      price: '10',
      title: 'delicious cake mamma mia this is so good!',
      location: 'Raahe',
      id: 1
    },
    {
      source: 'https://i.insider.com/5484d9d1eab8ea3017b17e29?width=600&format=jpeg&auto=webp',
      price: '1000000',
      title: 'doggy',
      location: 'Hetta',
      id: 2
    }
  ]

  let output =
  <Text onPress={props.logOut}>to logout</Text>


  if (props.loggedIn == false) {
    output =
    <Text onPress={() => props.navigation.navigate('login')}>to login</Text>
  }

  return (
    <View style={{flex:1}}>
      <ScrollView>
        <Text>This is the main view</Text>
        {items.map(item => <Item key={item.id} price={item.price} title={item.title} location={item.location} source={item.source}/>)}
        {output}
      </ScrollView>
    </View>
  )
}
