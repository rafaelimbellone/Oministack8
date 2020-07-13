import React, { useEffect, useState } from 'react';
import logo from '../assets/logo.svg';
import like from '../assets/like.svg';
import dislike from '../assets/dislike.svg';
import itsamatch from '../assets/itsamatch.png';
import "./Main.css";
import api from '../services/api';
import {Link} from 'react-router-dom';
import io from 'socket.io-client';

export default function MainRoutes({ match }){

    const [user, setUser]         = useState([]);
    const [matchDev, setMatchDev] = useState(null);

    // esse userEfect fazendo uma chamada api.
    useEffect(() => {
        async function loadUser(){
           const response = await api.get('/dev', {
               headers: {
                   user: match.params.id,
               }
            })
          setUser(response.data);
        }

        loadUser();
    }, [match.params.id]);
    //esse useEfect vai se connectar com o webSocket.
    useEffect(() => {
        //
        const socket = io('http://192.168.1.33:3333', {
            query:{ user: match.params.id }
        });
        socket.on('match', dev => {
            setMatchDev(dev);
        });
         
    }, [match.params.id]);
    
async function handlerDislike(id){
   await api.post(`/dev/${id}/dislikes`, null,{ 
                 headers: {user: match.params.id},
   })
   //assim q clicar no botao dislike atualiza a pagina com usuarios.
   setUser(user.filter(user => user._id !== id));
}

async function handlerLike(id){
    await api.post(`/dev/${id}/likes`, null,{ 
        headers: {user: match.params.id},
})
//assim q clicar no botao dislike atualiza a pagina com usuarios.
setUser(user.filter(user => user._id !== id));
}

    return (
       <div className="main-container">
          <Link to='/'>
           <img src={logo} alt="tindev"/>
          </Link>
          {user.length > 0 ? (
              <ul>
              {user.map(user => (
                  <li key={user._id}>
                  <img src={user.avatar} alt={user.name}/>
                  <footer>
              <strong>{user.name}</strong>
                      <p>{user.bio} </p>
                  </footer>
                  <div className="buttons">
                      <button type="button" onClick={() => (handlerDislike(user._id))}>
                          <img src={dislike} alt="Dislike" />                     
                      </button>
                      <button type="button" onClick={() => (handlerLike(user._id))}>
                          <img src={like} alt="Like" />                     
                      </button>
                  </div>
                  
                 </li>
              ))}
          </ul>
          ):(
              <div className="empty"> Acabou :( </div>
          )}
          
       {matchDev && (
           <div className="match-containe">
               <img src={itsamatch} alt="Its a match" />
               <img className="avatar" src={matchDev.avatar}/>
               <strong> {matchDev.name} </strong>
               <p> {matchDev.bio} </p>
               <button type="button" onClick={() => setMatchDev(null) }>Fechar</button>
           </div>
       )}

       </div>
    )
};