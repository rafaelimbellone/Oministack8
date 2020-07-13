
const axios = require('axios');
const Dev   = require('../models/Dev');


module.exports = {
    // funcao busca pro filtro.
    async index(req, res){
        // buscar id do usuario logado
        const { user } = req.headers;
        //pegar todos os dados do usario logado
        const loggedDev = await Dev.findById(user);
        
        //filtra a busca com AND as 3 condicoes tem ser verdadeiras
        const users = await Dev.find({
        $and:[
            { _id:{ $ne: user } }, //nao busca o proprio usuario logado
            { _id:{ $nin: loggedDev.likes} },// nao busca o usuario q ja deu like
            { _id:{ $nin: loggedDev.dislikes} },// nao busca o usaurio q ja deu dislike.
        ],
        })
        return res.json(users);
    },

     // funcao busca todos os devs.
    async index2(req, res){
        const loggedDev = await Dev.find();
        return res.json(loggedDev);
    },

    //funcao de cricao de devs.
    async store(req, res){        
            const { username } = req.body;
            // busca no mongoose se usuario ja existe
            const userExist = await Dev.findOne({user: username});
            //se usuario ja existe ele retorna o usuario senao cria um novo
            if(userExist){
               return res.json(userExist);
            }       
            // pega os dados atraves da api do gihub
            const response = await axios.get(`https://api.github.com/users/${username}`);
            //dados retornados da api faz a desistruturacao (nome,bio e avatar).
            const {name, bio, avatar_url: avatar} = response.data;
            //cria os dados do dev.
            const dev =  await Dev.create({
                name,
                user: username,  
                bio,
                avatar
            })
            return res.json(dev);
    }    
};


