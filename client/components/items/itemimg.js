import React from 'react'
import { View, Image } from 'react-native'

export default function itemimg(props) {
  return (
    <View style={{flex: 2}}>
      <Image source={{uri: props.source}} style={{width: 100, height: 100}}></Image>
    </View>
  )
}
