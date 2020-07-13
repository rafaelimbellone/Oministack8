
const {Schema, model} = require('mongoose');

// espelho do banco de dados.
const DevSchema = new Schema({
    name:{
        type: String,
        required: true,
    },
    user:{
        type: String,
        required: true,
    },
    bio: String,
    avatar:{
        type: String,
        required: true,
    },
    likes: [{
        //referenciando um relacionamento de likes com devs chave estrangeira
        type: Schema.Types.ObjectId, 
        ref: 'Dev',
    }],
    dislikes: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'Dev',
    }],
},{
    timestamps: true, //vai armazenar de forma automatica a data de criacao e alteracao. 
  }
);

module.exports = model('Dev', DevSchema);