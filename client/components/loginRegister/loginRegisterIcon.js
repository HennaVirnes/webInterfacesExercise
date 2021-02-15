import React from 'react'
import { View } from 'react-native'
import { Ionicons } from '@expo/vector-icons';

export default function registerIcon(props) {
  return (
    <View style={{borderColor:'grey', borderWidth:5, borderRadius: 100, width: 140, height: 140, alignSelf: 'center'}}>
        <Ionicons name={props.iconName} size={100} color='grey' style={{alignSelf: 'center', paddingTop: 8}} />
    </View>
  )
}
