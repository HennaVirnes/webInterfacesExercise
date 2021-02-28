import React, {useState} from 'react'
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import {apiAddress} from './apiAddress' ;
import * as SecureStore from 'expo-secure-store';

const axios = require('axios');


export default function photosForNewItem(props) {

const [isSubmitting,setIsSubmitting]= useState(false)
const [accessToken, setAccessToken] = useState('')

async function getAccessToken() {
  let result = await SecureStore.getItemAsync('token');
  setAccessToken(result) ;
}

React.useEffect(() => {
  getAccessToken();
}, []);

openImagePickerAsync = async () => {
  let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (permissionResult.granted === false) {
    alert("Permission to access camera roll is required!");
    return;
  }

  let pickerResult = await ImagePicker.launchImageLibraryAsync();

  if(pickerResult.cancelled == true)
  {
    alert('Picking an image was cancelled');
    return;
  }

  const fileNameSplit = pickerResult.uri.split('/');
  const fileName = fileNameSplit[fileNameSplit.length - 1];

  let postForm = new FormData();
    postForm.append('photos', {
      uri: pickerResult.uri,
      name: fileName,
      type: 'image/jpeg'
    });
    setIsSubmitting(true);
    axios({
      method: 'put',
      url: apiAddress + 'items/'+ props.route.params.itemId +'/pictures',
      data: postForm,
      headers: { 'Content-Type': 'multipart/form-data', 'Authorization': `Bearer ${accessToken}` }
      })
      .then(response => {
          //handle success
          alert("Image upload completed");
          setIsSubmitting(false);
          props.navigation.navigate('main');
      })
      .catch(response => {
          //handle error
          alert("Image upload failed");
          setIsSubmitting(false) ;
      });
  }



  return (
    <View style={{width: '75%', alignSelf:'center', marginTop: '20%'}}>
      <Text style={{fontSize:30, textAlign:'center', paddingBottom: '10%'}}>Choose an image from your phone for the item:</Text>
    { isSubmitting ? <ActivityIndicator /> :
      <TouchableOpacity onPress={openImagePickerAsync} style={{ backgroundColor: '#DAF7A6', borderRadius:10, height: 75, width:150, alignSelf:'center'}}>
      <Text style={{textAlign:'center', paddingTop: 20, fontSize:20 }}>Choose photo</Text>
    </TouchableOpacity>
    }

  </View>
  )
}
