import React from 'react'
import { View, Text } from 'react-native'
import DropDownPicker from 'react-native-dropdown-picker';

export default function dropDown(props) {


  function test(item) {
    props.onChangeItem(item.value);
    props.searchItems();
    alert('we got this!');
  }

  return (
    <View>
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
