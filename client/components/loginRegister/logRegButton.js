import React from 'react'
import { View, Text } from 'react-native'

export default function logRegButton(props) {
  return (
    <View style={{width: 100, height: 50, backgroundColor: 'lightgrey', alignSelf:'center', borderRadius: 20}}>
      <Text style ={{alignSelf:'center', fontSize: 20, paddingTop: 10}}>{props.text}</Text>
    </View>
  )
}
