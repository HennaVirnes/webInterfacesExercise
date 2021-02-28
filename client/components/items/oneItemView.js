import React from 'react'
import { View, Text, Image } from 'react-native'

export default function oneItemView(props) {

  return (
    <View>
      <Text style={{alignSelf:'center', fontSize: 35, fontWeight: 'bold', margin: 20}}>{props.route.params.title}</Text>
      <Image source={{uri: props.route.params.imageNames[0]}} style={{width: 200, height: 200, alignSelf:'center'}}></Image>

      <Text style={{alignSelf: 'center', width: '75%', margin: 10, minHeight: 75}}>{props.route.params.description}</Text>
      <View style={{alignSelf: 'center', width: '75%', flexDirection:'row', justifyContent:'space-between'}}>
        <Text style={{color:'grey'}}>{props.route.params.location.city}, {props.route.params.location.zipCode}</Text>
        <Text style={{fontWeight:'bold', fontSize:18}}>{props.route.params.askingPrice} €</Text>
      </View>
    </View>
  )
}
