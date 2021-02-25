import React from 'react'
import { View, Text } from 'react-native'
import DropDownPicker from 'react-native-dropdown-picker';

export default function dropDown(props) {


  function test(item) {
    props.onChangeItem(item.value);
    if(props.searchItems) {
      props.searchItems();
    }
  }

  return (
    <View style={{width: '75%', alignSelf:'center'}}>
      <DropDownPicker items={props.items}
                      searchable={true}
                      searchablePlaceholder={props.placeHolder}
                      searchablePlaceholderTextColor='grey'
                      dropDownMaxHeight={400}
                      onChangeItem={item => test(item) }
      />
    </View>
  )
}
