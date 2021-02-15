import React, {useState} from 'react'
import { View, TextInput } from 'react-native'

export default function formfield(props) {

  const [textField, setTextField] = useState('') ;
  
  return (
    <View style={{alignSelf:'center', borderColor:'lightgrey', borderWidth:1, borderRadius: 10, width: '75%', margin: 5}}>
      <TextInput 
        placeholder={props.placeholder} 
        onChangeText={setTextField} 
        value={textField} 
        maxLength={props.maxLength} 
        secureTextEntry={props.secure}
        style={{height: 40, padding: 5}} ></TextInput>
    </View>
  )
}
