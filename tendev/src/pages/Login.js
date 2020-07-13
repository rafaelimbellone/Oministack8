
import React, { useState, useEffect} from 'react';
import { StyleSheet, 
         Text,
         View,
         Image,
         TextInput,
         TouchableOpacity,
         KeyboardAvoidingView,
         Platform,
       } from 'react-native';

import logo from '../assets/logo.png';
import api from '../services/api';
//import AsyncStorege from '@react-native-community/async-storage';
export default function Login( { navigation } ) {
    const [user, setUser] = useState(''); 

   /*useEffect(() => {
         AsyncStorege.getItem('user').then(user => {
           if(user){
             navigation.navigate('Main', { user })
           }
         })
   }, [])
    */
    async function handleLogin(){
      // busca o usuario atraves do username.
      const response = await api.post('/dev', {username: user});
      //pega apenas o id do usuario
      const { _id } =  response.data;
      //await AsyncStorege.setItem('user', _id);
      // navega pra tela MAIN passa o id do usuario como parametro.
      navigation.navigate('Main', { user: _id });      
    }

    return (
        <KeyboardAvoidingView 
            behavior="padding"
            enabled={Platform.OS == "ios"}
              style={styles.container}
        >
           <Image source={logo} />
           <TextInput 
                    autoCapitalize='none'
                    autoCorrect= {false}
                    placeholder= "Digite seu Usuário no GitHub" 
                    placeholderTextColor="#999"
                    style={styles.input}
                    value={user}//pega o valor do textInput
                    onChangeText={setUser}// set o valor do textInput no user do "userState"
           />
           <TouchableOpacity onPress= {handleLogin} style={styles.button}>
               <Text style={styles.textButton}>Entrar</Text>
           </TouchableOpacity>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFF5EE',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 30,
    },
    input:{
      height: 46,
      alignSelf: 'stretch',
      backgroundColor:'#FFF',
      borderColor: '#ddd',
      borderRadius: 4,
      marginTop: 20,
      paddingHorizontal: 15,
    },
    button: {
       height: 46,
       alignSelf: 'stretch',
       backgroundColor: '#DF4722',
       borderRadius: 4,
       marginTop: 10,
       justifyContent: 'center',
       alignItems:'center',
    },
    textButton: {
      fontSize: 16,
      fontWeight:"bold",
      color: "#fff",
    },
  });
  