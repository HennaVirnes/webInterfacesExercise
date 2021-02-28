import React from 'react'
import { View, Text } from 'react-native'
import Img from './itemimg'
import { Ionicons } from '@expo/vector-icons';


export default function item(props) {

  let canDelete ;
  let canModify ;
  if(props.delete) {
    canDelete = 
    <Text style={{color: 'red'}} onPress={() => {props.delete(props.id)}}>X</Text>

    canModify =
    <Ionicons onPress={() => {props.modify(props.item)}} name='pencil-outline' size={20} color='grey' style={{position:'absolute', right: '10%', marginTop:10}} />
  }

  return (
    <View style ={{padding: 10, marginBottom: 7, flexDirection:'row', borderRadius:10, justifyContent:'space-between', width: '90%', marginLeft: '5%', marginRight:'5%', backgroundColor:'#F9F9F9'}}>
      <Img source={props.source} ></Img>
      <View style={{flex: 4, justifyContent: 'space-between', paddingLeft:15}}>
        <Text onPress={() => props.navigation.navigate('one item', props.item)} style={{fontWeight:'bold', fontSize: 20}}>{props.title}</Text>
        <Text style={{color:'grey'}}>{props.location}</Text>
      </View>
      <Text style={{flex: 1, alignSelf:'center', fontSize: 20}}>{props.price} €</Text>
      {canModify}
      {canDelete}
    </View>
  )
}
