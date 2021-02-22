import React from 'react'
import { View, Text } from 'react-native'

export default function logRegButton(props) {
  return (
    <View style={{width: 100, height: 50, backgroundColor: props.color, alignSelf:'center', borderRadius: 20, shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    
    elevation: 3,}}>
      <Text onPress={props.pressButton} style ={{alignSelf:'center', fontSize: 20, paddingTop: 10}}>{props.text}</Text>
    </View>
  )
}
