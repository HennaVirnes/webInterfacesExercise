import React from 'react'
import { View, Text } from 'react-native'

export default function title(props) {
  return (
    <View style={{paddingTop: '25%', paddingBottom:20}}>
      <Text style={{fontSize:38, alignSelf:'center', fontWeight:'bold'}}>{props.title}</Text>
    </View>
  )
}
