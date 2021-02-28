import React from 'react'
import { View, Text } from 'react-native'

export default function warningtext(props) {
  return (
    <View style={{paddingLeft: 30}}>
      <Text style={{color:'red'}}>{props.text}</Text>
    </View>
  )
}
