import React, { useEffect, useState } from 'react';
import { View,
         Text,
         Image,
         StyleSheet,
         SafeAreaView,
         TouchableOpacity,
       }from 'react-native';
import logo from '../assets/logo.png';
import like from '../assets/like.png'
import dislike from '../assets/dislike.png'
import itsamatch from '../assets/itsamatch.png';
import api from '../services/api';
import io from 'socket.io-client';

export default function Main({ navigation }){
        //pega o id do usuario logado
        const id = navigation.getParam('user');
        //cria o estado User recebe vazio.
        const [users, setUsers]    = useState([]);
        const [matchDev, setMatchDev] = useState(null);     

        // Chamada api lista os usuario em tela
        useEffect(() => {
                async function loadUser(){
                    const response = await api.get('/dev', {
                        headers: {
                            user: id,
                        }
                    })
                 //users recebe os dados dos usarios (metodo criado no controller com os filtros )
                 setUsers(response.data);
                }
          //chama a função acima.    
          loadUser();
        }, [id]);

        //esse useEfect vai se connectar com o webSocket.
        useEffect(() => {
            //
            const socket = io('http://192.168.1.33:3333', {
                query:{ user: id }
            });
            socket.on('match', dev => {
                setMatchDev(dev);
            });
            
        }, [id]);
            
        async function handlerDislike(){
           //pega o primeiro usuario do array e armazena em "user" e os outros usuario armazena em "rest"
           const [user, ...rest] = users;
           //grava no banco de dados os dislikes.
           await api.post(`/dev/${user._id}/dislikes`, null,{ 
                        headers: {user: id},
           })          
            // atualiza a pagina com o restantes dos usuarios.
            setUsers(rest);
        }
        
        async function handlerLike(){
            //pega o primeiro usuario do array e armazena em "user" e os outros usuario armazena em "rest"
            const [user, ...rest] = users;
            //grava no banco de dados os likes
            await api.post(`/dev/${user._id}/likes`, null,{ 
                            headers: {user: id},
            })
          // atualiza a pagina com o restantes dos usuarios.
          setUsers(rest);
        }

        //função criado quando clicar na logo voltar para a tela de login.
        function handleLogout(){
            navigation.navigate('Login');
        }

        return (
        <SafeAreaView style={Styles.container}> 
            <TouchableOpacity onPress={handleLogout}>
                <Image style={Styles.logo} source={logo}/>
            </TouchableOpacity>

            <View style={Styles.cardContainer}>
                { users.length == 0 
                    ? <Text style={Styles.empty}>Acabou :( </Text>
                    :(
                    users.map((user, index) => (       
                        <View key={user._id} style={ [Styles.card, { zIndex: users.length - index }]}>
                            <Image style={Styles.avatar} source= {{ uri: user.avatar }} />
                            <View style={Styles.footer} >
                                <Text style={Styles.name}> {user.name} </Text>
                                <Text style={Styles.bio} numberOfLines={3} > {user.bio}  </Text>
                            </View>
                        </View>        
                    ))
                )}
            </View>
            
            {users.length > 0 && (
                <View style={Styles.buttonsContainer}>
                    <TouchableOpacity style={Styles.button} onPress={handlerDislike}>
                        <Image source={dislike} />
                    </TouchableOpacity>
                    <TouchableOpacity style={Styles.button} onPress={handlerLike}>
                        <Image source={like} />
                    </TouchableOpacity>
                </View>
            )}

            {matchDev && (
                <View style={Styles.matchContainer}>
                    <Image style={Styles.matchImage} source={itsamatch} />
                    <Image style={Styles.matchAvatar} source= {{ uri: matchDev.avatar}}  />
                    <Text style={Styles.matchName}> {matchDev.name} </Text>
                    <Text style={Styles.matchBio}> {matchDev.bio} </Text>
                    <TouchableOpacity onPress={() => setMatchDev(null)}>
                    <Text style={Styles.closeMatch}>Fechar</Text>
                    </TouchableOpacity>
                </View>
            )}
        </SafeAreaView>
        )
    }

const Styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
        justifyContent:'space-between',

    },
    logo:{
      top: 20,
    },
    cardContainer:{
        flex:1,
        alignSelf:'stretch',
        justifyContent:'center',
        maxHeight: 500,        
    },
    empty:{
       alignSelf:'center',
       color:'#999',
       fontSize:24,
       fontWeight:'bold',
    },
    
    card: {
       borderWidth: 1,
       borderColor:'#DDD',
       borderRadius: 8,
       margin: 30,
       overflow: 'hidden',
       position:'absolute',
       top:0,
       left:0,
       right:0,
       bottom:0,
    },
    avatar:{
      flex: 1,
      height:300,
    },
    footer:{
       backgroundColor:'#FFF',
       paddingHorizontal:20,
       paddingVertical:15,
    },
    name:{
        fontSize:16,
        fontWeight:'bold',
        color:'#333',
    },
    bio:{
        fontSize:14,
        color:'#999',
        marginTop:5,
        lineHeight:18,
    },
    buttonsContainer:{
       flexDirection:'row',
       marginBottom:30,
    },
    button:{
       width:50,
       height:50,
       borderRadius:25,
       backgroundColor:'#FFF',
       alignItems:'center',
       justifyContent:'center',
       marginHorizontal:20,
       elevation:2,
    },
    
    matchContainer:{
        position:'absolute',
        right:0,
        left:0,
        top:0,
        bottom:0,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'rgba(0, 0, 0, 0.8)', 
        zIndex: 999,
     },
    matchImage: {
       height: 60,
       resizeMode: 'contain',
    },
    matchAvatar: {
      width: 160,
      height:160,
      borderRadius:80,
      borderWidth: 5,
      borderColor: '#FFF',
      marginVertical: 30,
    },
    matchName: {
       fontSize: 26,
       fontWeight:'bold',
       color:'#FFF',
    },
    matchBio: {
      marginTop:10,
      fontSize: 16,
      color: 'rgba(255,255,255,0.8)',
      lineHeight: 24,
      textAlign:'center',
      paddingHorizontal: 30,
    },
    
    closeMatch:{
      fontSize:16,
      color: 'rgba(255,255,255,0.8)',
      textAlign:'center',
      fontWeight:'bold',
    },
})